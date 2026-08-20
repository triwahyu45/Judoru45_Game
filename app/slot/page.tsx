'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Flame, ArrowLeft, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import synthEngine from '@/lib/sound/synthEngine';
import {
  SlotCell,
  evaluateOlympusSpin,
  GRID_COLS,
  GRID_ROWS,
  pickRandomSymbol,
  createCell,
} from '@/lib/math/slotMath';
import { ReelGrid } from '@/components/games/slot/ReelGrid';
import { ZeusCharacter } from '@/components/games/slot/ZeusCharacter';
import { BetControls } from '@/components/games/slot/BetControls';
import { WinSummaryOverlay } from '@/components/games/slot/WinSummaryOverlay';
import { PaytableModal } from '@/components/games/slot/PaytableModal';

export default function SlotPage() {
  const { balance, adminConfig, placeBet, settleBet } = useGame();

  // Initial Grid generation
  const [grid, setGrid] = useState<SlotCell[][]>(() => {
    const initial: SlotCell[][] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      const col: SlotCell[] = [];
      for (let r = 0; r < GRID_ROWS; r++) {
        col.push(createCell(c, r, pickRandomSymbol(false)));
      }
      initial.push(col);
    }
    return initial;
  });

  const [betAmount, setBetAmount] = useState<number>(10_000);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isTumbling, setIsTumbling] = useState<boolean>(false);
  const [winningCellIds, setWinningCellIds] = useState<Set<string>>(new Set());
  const [turboMode, setTurboMode] = useState<boolean>(false);
  const [autoSpinCount, setAutoSpinCount] = useState<number>(0);
  const [lastWin, setLastWin] = useState<number>(0);

  // Zeus Animation States
  const [isZeusStriking, setIsZeusStriking] = useState<boolean>(false);
  const [currentRoundMultiplier, setCurrentRoundMultiplier] = useState<number>(0);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState<number>(0);
  const [persistedFSMultiplier, setPersistedFSMultiplier] = useState<number>(0);
  const [isNearMiss, setIsNearMiss] = useState<boolean>(false);
  const [isWastedOrbTease, setIsWastedOrbTease] = useState<boolean>(false);

  // Modals
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [winOverlay, setWinOverlay] = useState<{
    isOpen: boolean;
    payout: number;
    betAmount: number;
    totalMultiplier: number;
    isLDW: boolean;
    freeSpinsAwarded: number;
  }>({
    isOpen: false,
    payout: 0,
    betAmount: 0,
    totalMultiplier: 0,
    isLDW: false,
    freeSpinsAwarded: 0,
  });

  const isSpinningRef = useRef<boolean>(false);
  isSpinningRef.current = isSpinning;

  const autoSpinRef = useRef<number>(0);
  autoSpinRef.current = autoSpinCount;

  // Execute a Single Spin
  const handleSpin = useCallback(async () => {
    if (isSpinningRef.current) return;
    const isFreeSpinRound = freeSpinsRemaining > 0;

    // Deduct bet if not free spin
    if (!isFreeSpinRound) {
      const placed = placeBet('SLOT', betAmount, `Slot Olympus Spin (${formatIDR(betAmount)})`);
      if (!placed) {
        setAutoSpinCount(0);
        return;
      }
    } else {
      setFreeSpinsRemaining((prev) => Math.max(0, prev - 1));
    }

    setIsSpinning(true);
    setIsNearMiss(false);
    setIsWastedOrbTease(false);
    setWinningCellIds(new Set());
    synthEngine.playSpin(1.0);

    // Evaluate the spin outcome mathematically
    const spinResult = evaluateOlympusSpin(
      betAmount,
      adminConfig.activeProfile,
      adminConfig.globalRtp,
      isFreeSpinRound,
      persistedFSMultiplier,
      {
        forcedOutcome: adminConfig.forcedOutcome,
        highBetThreshold: adminConfig.highBetThreshold,
        nearMissProbability: adminConfig.nearMissProbability,
      }
    );

    setIsNearMiss(spinResult.isNearMiss);
    setIsWastedOrbTease(spinResult.isWastedOrbTease);

    // Spin reel delay
    const initialSpinDelay = turboMode ? 100 : 400;
    await new Promise((res) => setTimeout(res, initialSpinDelay));

    // Show initial grid
    if (spinResult.steps.length > 0) {
      setGrid(spinResult.steps[0].grid);
    }
    setIsSpinning(false);

    // Tumble sequence playback
    const cascadeDelay = turboMode ? 200 : 550;
    let accumulatedMult = persistedFSMultiplier;

    for (let i = 0; i < spinResult.steps.length; i++) {
      const step = spinResult.steps[i];

      // Highlight winning matches
      if (step.winningMatches.length > 0) {
        setIsTumbling(true);
        const winIds = new Set<string>();
        step.winningMatches.forEach((m) => m.cellIds.forEach((id) => winIds.add(id)));
        setWinningCellIds(winIds);
        synthEngine.playWin(Math.min(3, 1 + step.winningMatches.length));

        await new Promise((res) => setTimeout(res, cascadeDelay));
      }

      // Check multiplier orbs
      if (step.multiplierOrbs.length > 0) {
        setIsZeusStriking(true);
        synthEngine.playJackpot();
        step.multiplierOrbs.forEach((orb) => {
          accumulatedMult += orb.multiplier;
        });
        setCurrentRoundMultiplier(accumulatedMult);
        if (isFreeSpinRound) {
          setPersistedFSMultiplier(accumulatedMult);
        }
        await new Promise((res) => setTimeout(res, turboMode ? 300 : 600));
        setIsZeusStriking(false);
      }

      // Drop new symbols
      setGrid(step.grid);
      setWinningCellIds(new Set());
      await new Promise((res) => setTimeout(res, cascadeDelay / 2));
    }

    setIsTumbling(false);
    setLastWin(spinResult.finalPayout);

    // Settle Bet in GameContext ledger
    settleBet({
      gameType: 'SLOT',
      gameTitle: 'Slot Olympus (Zeus)',
      betAmount: isFreeSpinRound ? 0 : betAmount,
      multiplier: betAmount > 0 ? spinResult.finalPayout / betAmount : 0,
      payout: spinResult.finalPayout,
      details: `Slot Olympus: Base ${formatIDR(spinResult.totalBaseWin)} x Mult ${
        spinResult.totalMultiplierApplied
      }x = ${formatIDR(spinResult.finalPayout)}`,
      riggedApplied: spinResult.isNearMiss || spinResult.isLossDisguisedAsWin || spinResult.isWastedOrbTease,
    });

    // Handle Free Spins Activation
    if (spinResult.freeSpinsTriggered) {
      setFreeSpinsRemaining((prev) => prev + spinResult.freeSpinsAwarded);
      synthEngine.playJackpot();
      setWinOverlay({
        isOpen: true,
        payout: spinResult.finalPayout,
        betAmount,
        totalMultiplier: spinResult.totalMultiplierApplied,
        isLDW: false,
        freeSpinsAwarded: spinResult.freeSpinsAwarded,
      });
    } else if (spinResult.finalPayout > 0) {
      // Big Win or LDW Overlay
      const isBig = spinResult.finalPayout >= betAmount * 3;
      if (isBig || spinResult.isLossDisguisedAsWin) {
        setWinOverlay({
          isOpen: true,
          payout: spinResult.finalPayout,
          betAmount,
          totalMultiplier: spinResult.totalMultiplierApplied,
          isLDW: spinResult.isLossDisguisedAsWin,
          freeSpinsAwarded: 0,
        });
      }
    }

    // Process Auto-Spin loop
    if (autoSpinRef.current > 0) {
      setAutoSpinCount((prev) => prev - 1);
    }
  }, [
    betAmount,
    freeSpinsRemaining,
    placeBet,
    settleBet,
    turboMode,
    adminConfig,
    persistedFSMultiplier,
  ]);

  // Auto-Spin Trigger Effect
  useEffect(() => {
    if (autoSpinCount > 0 && !isSpinning) {
      const timer = setTimeout(() => {
        handleSpin();
      }, turboMode ? 350 : 850);
      return () => clearTimeout(timer);
    }
  }, [autoSpinCount, isSpinning, handleSpin, turboMode]);

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B111D]/90 border border-amber-500/30 p-3 sm:p-4 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Kembali ke Lobby"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center space-x-1.5">
                <span>Slot Olympus (Gates of Zeus)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  Scatter Pays 6x5
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Simulasi edukasi algoritma slot online & visualisasi manipulasi bandar
              </p>
            </div>
          </div>
        </div>

        {/* Live Admin Config Badge & Balance */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E2D44] text-[11px] font-bold text-slate-300 flex items-center space-x-1.5 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Edukasi (Saldo Fiktif)</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#050811] border border-amber-500/40 text-right">
            <span className="text-[10px] text-slate-400 block leading-none">Saldo:</span>
            <span className="text-xs sm:text-sm font-black text-gold-gradient leading-tight">
              {formatIDR(balance)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Stage (Zeus Character & 6x5 Reel Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* Left Side: Zeus Character Column */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <ZeusCharacter
            isStriking={isZeusStriking}
            totalMultiplier={currentRoundMultiplier}
            freeSpinsRemaining={freeSpinsRemaining}
            isNearMiss={isNearMiss}
            isWastedOrbTease={isWastedOrbTease}
          />
        </div>

        {/* Right Side: 6x5 Reel Grid */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-3">
          <ReelGrid
            grid={grid}
            isSpinning={isSpinning}
            isTumbling={isTumbling}
            winningCellIds={winningCellIds}
            turboMode={turboMode}
          />

          {/* Bet and Spin Controls */}
          <BetControls
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            onSpin={handleSpin}
            isSpinning={isSpinning || isTumbling}
            autoSpinCount={autoSpinCount}
            startAutoSpin={(count) => setAutoSpinCount(count)}
            stopAutoSpin={() => setAutoSpinCount(0)}
            turboMode={turboMode}
            setTurboMode={setTurboMode}
            balance={balance}
            openPaytable={() => setShowPaytable(true)}
            lastWin={lastWin}
          />
        </div>
      </div>

      {/* Educational Rigged Disclosure Alert */}
      <div className="p-3.5 rounded-2xl bg-[#090D16] border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-200">
            Fakta Edukasi Slot Online:
          </p>
          <p className="leading-relaxed">
            Pada mesin slot komersial, fitur <span className="text-amber-300">Near-Miss (3 Scatter)</span> dan <span className="text-amber-300">Losses Disguised as Wins (LDW)</span> sengaja diprogram untuk menstimulasi hormon dopamin agar pemain merasa 'hampir menang' dan terus memutar saldo hingga habis.
          </p>
        </div>
      </div>

      {/* Modals */}
      <PaytableModal isOpen={showPaytable} onClose={() => setShowPaytable(false)} />
      <WinSummaryOverlay
        isOpen={winOverlay.isOpen}
        onClose={() => setWinOverlay((prev) => ({ ...prev, isOpen: false }))}
        payout={winOverlay.payout}
        betAmount={winOverlay.betAmount}
        totalMultiplier={winOverlay.totalMultiplier}
        isLDW={winOverlay.isLDW}
        freeSpinsAwarded={winOverlay.freeSpinsAwarded}
      />
    </div>
  );
}
