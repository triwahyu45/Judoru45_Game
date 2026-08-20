'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, Info, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

import {
  RouletteBet,
  RouletteBetType,
  BET_PAYOUT_RATIOS,
  selectWinningPocket,
  evaluateRouletteRound,
  RouletteEvaluationResult,
} from '@/lib/math/rouletteMath';

import RouletteWheel from '@/components/games/roulette/RouletteWheel';
import RouletteBoard from '@/components/games/roulette/RouletteBoard';
import RouletteControls from '@/components/games/roulette/RouletteControls';
import RouletteHistory from '@/components/games/roulette/RouletteHistory';

export default function RoulettePage() {
  const { balance, placeBet, settleBet, adminConfig, stats } = useGame();

  // Local Game State
  const [selectedChip, setSelectedChip] = useState<number>(10_000);
  const [bets, setBets] = useState<RouletteBet[]>([]);
  const [betHistory, setBetHistory] = useState<RouletteBet[][]>([]); // For undo
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [targetPocket, setTargetPocket] = useState<number | null>(null);
  const [lastWinningNumber, setLastWinningNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([17, 32, 0, 11, 26, 4]);
  const [lastResult, setLastResult] = useState<RouletteEvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roundsPlayedLocal, setRoundsPlayedLocal] = useState<number>(0);

  // Total current wager on the table
  const totalWagered = bets.reduce((sum, b) => sum + b.amount, 0);

  // Place or increment a bet on the board
  const handlePlaceBet = useCallback(
    (type: RouletteBetType, label: string, numbers: number[]) => {
      if (isSpinning) return;
      setErrorMessage(null);

      // Check balance
      if (totalWagered + selectedChip > balance) {
        setErrorMessage('Saldo simulasi tidak mencukupi untuk menambah taruhan ini.');
        synthEngine.playClick();
        return;
      }

      setBetHistory((prev) => [...prev, [...bets]]);

      setBets((prevBets) => {
        const sortedTarget = [...numbers].sort((a, b) => a - b).join(',');
        const existingIndex = prevBets.findIndex(
          (b) => b.type === type && [...b.numbers].sort((a, b) => a - b).join(',') === sortedTarget
        );

        if (existingIndex >= 0) {
          // Increase existing bet
          const updated = [...prevBets];
          updated[existingIndex] = {
            ...updated[existingIndex],
            amount: updated[existingIndex].amount + selectedChip,
          };
          return updated;
        } else {
          // Add new bet
          const newBet: RouletteBet = {
            id: `bet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            type,
            label,
            numbers,
            amount: selectedChip,
            payoutRatio: BET_PAYOUT_RATIOS[type] ?? 1,
          };
          return [...prevBets, newBet];
        }
      });

      synthEngine.playCoin();
    },
    [isSpinning, totalWagered, selectedChip, balance, bets]
  );

  // Clear all bets
  const handleClearBets = useCallback(() => {
    if (isSpinning || bets.length === 0) return;
    setBetHistory((prev) => [...prev, [...bets]]);
    setBets([]);
    setErrorMessage(null);
  }, [isSpinning, bets]);

  // Double all bets (if balance allows)
  const handleDoubleBets = useCallback(() => {
    if (isSpinning || bets.length === 0) return;
    if (totalWagered * 2 > balance) {
      setErrorMessage('Saldo tidak cukup untuk menggandakan semua taruhan.');
      return;
    }
    setBetHistory((prev) => [...prev, [...bets]]);
    setBets((prev) =>
      prev.map((b) => ({
        ...b,
        amount: b.amount * 2,
      }))
    );
  }, [isSpinning, bets, totalWagered, balance]);

  // Undo last bet action
  const handleUndoLastBet = useCallback(() => {
    if (isSpinning || betHistory.length === 0) return;
    const previous = betHistory[betHistory.length - 1];
    setBets(previous || []);
    setBetHistory((prev) => prev.slice(0, prev.length - 1));
    setErrorMessage(null);
  }, [isSpinning, betHistory]);

  // Execute Spin
  const handleSpin = useCallback(() => {
    if (isSpinning || bets.length === 0) return;
    if (totalWagered > balance) {
      setErrorMessage('Saldo tidak mencukupi untuk melakukan putaran ini.');
      return;
    }

    // Deduct bet from game balance
    const betSuccess = placeBet(
      'roulette',
      totalWagered,
      `Roulette: ${bets.length} taruhan ditempatkan (Total: ${formatIDR(totalWagered)})`
    );

    if (!betSuccess) {
      setErrorMessage('Gagal memasang taruhan. Cek saldo Anda.');
      return;
    }

    setErrorMessage(null);
    setIsSpinning(true);
    setLastResult(null);

    // Compute winning pocket via Rigged Magnetic Steering or Fair Engine
    const decision = selectWinningPocket(bets, adminConfig, (stats?.roundsPlayed || 0) + roundsPlayedLocal);
    setTargetPocket(decision.pocket);

    // Prepare evaluation object
    const evalResult = evaluateRouletteRound(bets, decision.pocket, decision.isRigged, decision.reason);
    setLastResult(evalResult);
  }, [isSpinning, bets, totalWagered, balance, placeBet, adminConfig, stats?.roundsPlayed, roundsPlayedLocal]);

  // Wheel animation completed callback
  const handleSpinComplete = useCallback(() => {
    if (!lastResult || targetPocket === null) {
      setIsSpinning(false);
      return;
    }

    setIsSpinning(false);
    setLastWinningNumber(targetPocket);
    setHistory((prev) => [targetPocket, ...prev].slice(0, 20));
    setRoundsPlayedLocal((prev) => prev + 1);

    // Settle Bet with GameContext Ledger
    settleBet({
      gameType: 'roulette',
      gameTitle: 'European Roulette',
      betAmount: lastResult.totalWagered,
      multiplier: lastResult.totalWagered > 0 ? Number((lastResult.totalPayout / lastResult.totalWagered).toFixed(2)) : 0,
      payout: lastResult.totalPayout,
      details: `Angka: ${targetPocket} (${lastResult.color.toUpperCase()}) | ${
        lastResult.isWin ? `Menang ${formatIDR(lastResult.totalPayout)}` : 'Kalah'
      }`,
      riggedApplied: lastResult.riggedApplied,
    });

    // Trigger visual celebration if win
    if (lastResult.totalPayout > 0) {
      confetti({
        particleCount: Math.min(100, Math.max(35, Math.floor(lastResult.totalPayout / 20000))),
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Keep bets on board (or allow user to re-spin / modify)
  }, [lastResult, targetPocket, settleBet]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Balance Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#0B111B] border border-[#1E2D44] shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
            title="Kembali ke Lobby"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>European Roulette</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-bold">
                Single Zero (37 Pockets)
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Simulasi meja roulette Eropa berstandar kasino internasional dengan edukasi manipulasi bandar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right px-4 py-2 rounded-2xl bg-[#05070B] border border-[#1E2D44]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Saldo Simulasi</span>
            <div className="text-base font-black text-emerald-400">{formatIDR(balance)}</div>
          </div>

          <div className="px-3 py-2 rounded-2xl bg-[#0F172A] border border-[#1E2D44] text-xs font-bold text-slate-300 flex items-center gap-1.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Mode Edukasi Fiktif</span>
          </div>
        </div>
      </div>

      {/* Error / Notification Banner */}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs flex items-center justify-between animate-shake">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold text-rose-400 hover:text-rose-200 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Game Arena: Wheel on Left, Betting Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Animated Roulette Wheel */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <RouletteWheel
            isSpinning={isSpinning}
            targetPocket={targetPocket}
            onSpinComplete={handleSpinComplete}
          />
        </div>

        {/* Right: Betting Board & Controls */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <RouletteBoard
            bets={bets}
            selectedChip={selectedChip}
            disabled={isSpinning}
            onPlaceBet={handlePlaceBet}
          />

          <RouletteControls
            selectedChip={selectedChip}
            totalWagered={totalWagered}
            balance={balance}
            isSpinning={isSpinning}
            canSpin={bets.length > 0 && totalWagered <= balance}
            onSelectChip={setSelectedChip}
            onClearBets={handleClearBets}
            onDoubleBets={handleDoubleBets}
            onUndoLastBet={handleUndoLastBet}
            onSpin={handleSpin}
          />
        </div>
      </div>

      {/* History Ribbon, Spotlight Banner & Educational Content */}
      <RouletteHistory
        history={history}
        lastWinningNumber={lastWinningNumber}
        riggedApplied={lastResult?.riggedApplied}
        riggedReason={lastResult?.riggedReason}
      />
    </div>
  );
}
