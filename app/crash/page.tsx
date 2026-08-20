'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Bomb, ArrowLeft, Sliders, ShieldAlert, Rocket, Info } from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import synthEngine from '@/lib/sound/synthEngine';
import {
  calculateCrashPoint,
  getMultiplierAtTime,
  CrashPointResult,
} from '@/lib/math/crashMath';
import { RocketCanvas } from '@/components/games/crash/RocketCanvas';
import { CashoutControls } from '@/components/games/crash/CashoutControls';
import { RoundHistory } from '@/components/games/crash/RoundHistory';
import { CrashRiggedDisclosure } from '@/components/games/crash/CrashRiggedDisclosure';

export default function CrashPage() {
  const { balance, adminConfig, placeBet, settleBet } = useGame();

  const [betAmount, setBetAmount] = useState<number>(10_000);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);

  // Flight State
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [isCashedOut, setIsCashedOut] = useState<boolean>(false);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [crashResult, setCrashResult] = useState<CrashPointResult | null>(null);
  const [cashedOutMultiplier, setCashedOutMultiplier] = useState<number | undefined>(undefined);
  const [lastPayout, setLastPayout] = useState<number>(0);
  const [roundHistory, setRoundHistory] = useState<number[]>([1.45, 2.18, 1.05, 12.40, 1.88, 3.52, 1.02]);

  const flightStartRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const lastSoundTickRef = useRef<number>(0);
  const isCashedOutRef = useRef<boolean>(false);
  isCashedOutRef.current = isCashedOut;

  const isFlyingRef = useRef<boolean>(false);
  isFlyingRef.current = isFlying;

  // Launch Rocket Round
  const handleLaunch = useCallback(() => {
    if (isFlyingRef.current) return;

    // Deduct bet from GameContext
    const placed = placeBet('CRASH', betAmount, `Crash Rocket Launch (${formatIDR(betAmount)})`);
    if (!placed) return;

    // Calculate deterministic crash point
    const result = calculateCrashPoint({
      userBet: betAmount,
      autoCashout,
      rigMode: adminConfig.activeProfile,
      globalRtp: adminConfig.globalRtp,
      forcedOutcome: adminConfig.forcedOutcome,
      highBetThreshold: adminConfig.highBetThreshold,
    });

    setCrashResult(result);
    setIsFlying(true);
    setIsCrashed(false);
    setIsCashedOut(false);
    setCashedOutMultiplier(undefined);
    setCurrentMultiplier(1.0);
    setLastPayout(0);

    flightStartRef.current = performance.now();
    lastSoundTickRef.current = 0;
  }, [betAmount, autoCashout, adminConfig, placeBet]);

  // Cash Out handler (manual or auto)
  const handleCashOut = useCallback(() => {
    if (!isFlyingRef.current || isCashedOutRef.current) return;

    const elapsedSeconds = (performance.now() - flightStartRef.current) / 1000;
    const nowMult = getMultiplierAtTime(elapsedSeconds);

    if (crashResult && nowMult <= crashResult.crashMultiplier) {
      const winAmount = Math.round(betAmount * nowMult);
      setIsCashedOut(true);
      setCashedOutMultiplier(nowMult);
      setLastPayout(winAmount);

      settleBet({
        gameType: 'CRASH',
        gameTitle: 'Crash Aviator Rocket',
        betAmount,
        multiplier: nowMult,
        payout: winAmount,
        details: `Cash Out @ ${nowMult.toFixed(2)}x (Pemenang ${formatIDR(winAmount)})`,
        riggedApplied: crashResult.isRigged,
      });

      synthEngine.playWin(nowMult >= 5 ? 3 : 2);
    }
  }, [betAmount, crashResult, settleBet]);

  // Real-time Flight Multiplier Loop
  useEffect(() => {
    if (!isFlying || !crashResult) return;

    const tick = () => {
      const now = performance.now();
      const elapsedSeconds = (now - flightStartRef.current) / 1000;
      const currentMult = getMultiplierAtTime(elapsedSeconds);

      // Throttled thruster sound
      if (now - lastSoundTickRef.current > 120) {
        synthEngine.playRocket(currentMult);
        lastSoundTickRef.current = now;
      }

      // Check Auto Cash-Out
      if (
        autoCashout &&
        currentMult >= autoCashout &&
        !isCashedOutRef.current &&
        currentMult < crashResult.crashMultiplier
      ) {
        handleCashOut();
      }

      // Check Crash
      if (currentMult >= crashResult.crashMultiplier) {
        setCurrentMultiplier(crashResult.crashMultiplier);
        setIsFlying(false);
        setIsCrashed(true);

        synthEngine.playCrash();

        // If player didn't cash out before crash
        if (!isCashedOutRef.current) {
          settleBet({
            gameType: 'CRASH',
            gameTitle: 'Crash Aviator Rocket',
            betAmount,
            multiplier: 0,
            payout: 0,
            details: `Roket Meledak @ ${crashResult.crashMultiplier.toFixed(2)}x (Kalah ${formatIDR(betAmount)})`,
            riggedApplied: crashResult.isRigged,
          });
        }

        // Add to round history
        setRoundHistory((prev) => [crashResult.crashMultiplier, ...prev].slice(0, 20));
        return;
      }

      setCurrentMultiplier(currentMult);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isFlying, crashResult, autoCashout, handleCashOut, betAmount, settleBet]);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4">
      {/* Header & Balance */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B111D]/90 border border-cyan-500/30 p-3 sm:p-4 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Kembali ke Lobby"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bomb className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center space-x-1.5">
                <span>Crash Aviator Rocket</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                  Kurva Eksponensial M(t)=e^0.06t
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Simulasi roket terbang & pembongkaran manipulasi crash instan / high-bet sniper
              </p>
            </div>
          </div>
        </div>

        {/* Live Admin Config & Balance */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E2D44] text-[11px] font-bold text-slate-300 flex items-center space-x-1.5 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mode Edukasi Fiktif</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#050811] border border-cyan-500/40 text-right">
            <span className="text-[10px] text-slate-400 block leading-none">Saldo:</span>
            <span className="text-xs sm:text-sm font-black text-cyan-400 leading-tight">
              {formatIDR(balance)}
            </span>
          </div>
        </div>
      </div>

      {/* Round History Bar */}
      <RoundHistory history={roundHistory} />

      {/* Main Stage (Canvas Rocket Flight) */}
      <RocketCanvas
        multiplier={currentMultiplier}
        isFlying={isFlying}
        isCrashed={isCrashed}
        isCashedOut={isCashedOut}
        crashMultiplier={crashResult?.crashMultiplier || 1.0}
        cashedOutMultiplier={cashedOutMultiplier}
      />

      {/* Cashout and Bet Controls */}
      <CashoutControls
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        autoCashout={autoCashout}
        setAutoCashout={setAutoCashout}
        isFlying={isFlying}
        isCrashed={isCrashed}
        isCashedOut={isCashedOut}
        currentMultiplier={currentMultiplier}
        onLaunch={handleLaunch}
        onCashOut={handleCashOut}
        balance={balance}
        lastPayout={lastPayout}
        cashedOutMultiplier={cashedOutMultiplier}
      />

      {/* Educational Rigged Disclosure Box */}
      <CrashRiggedDisclosure
        isRigged={!!crashResult?.isRigged}
        rigType={crashResult?.rigType}
        note={
          crashResult?.educationalNote ||
          'Pada permainan Crash / Aviator komersial, titik ledak (crash point) telah ditentukan secara sepihak oleh server bandar saat taruhan dikirim, bukan berdasarkan keberuntungan murni. Bandar sering menggunakan algoritma High-Bet Sniper untuk meledakkan roket seketika jika ada pemain yang bertaruh besar.'
        }
      />
    </div>
  );
}
