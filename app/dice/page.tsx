'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, ShieldAlert, Dices } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

import {
  DiceGameMode,
  SliderDirection,
  DiceRollResult,
  rollDiceGame,
} from '@/lib/math/diceMath';

import Dice3D from '@/components/games/dice/Dice3D';
import DiceSlider from '@/components/games/dice/DiceSlider';
import DiceSumBoard from '@/components/games/dice/DiceSumBoard';
import DiceControls from '@/components/games/dice/DiceControls';
import DiceHistory from '@/components/games/dice/DiceHistory';

export default function DicePage() {
  const { balance, placeBet, settleBet, adminConfig, stats } = useGame();

  // Local State
  const [mode, setMode] = useState<DiceGameMode>('SLIDER');
  const [betAmount, setBetAmount] = useState<number>(10_000);
  const [sliderTarget, setSliderTarget] = useState<number>(50);
  const [sliderDirection, setSliderDirection] = useState<SliderDirection>('OVER');
  const [selectedSum, setSelectedSum] = useState<number>(7);

  // Rolling State
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [diceValues, setDiceValues] = useState<[number, number]>([3, 4]);
  const [rolledSliderValue, setRolledSliderValue] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<DiceRollResult | null>(null);
  const [history, setHistory] = useState<DiceRollResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-Roll State
  const [isAutoRolling, setIsAutoRolling] = useState<boolean>(false);
  const [autoRollCount, setAutoRollCount] = useState<number>(0);
  const autoRollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [roundsPlayedLocal, setRoundsPlayedLocal] = useState<number>(0);

  // Execute a Single Roll
  const handleRoll = useCallback(() => {
    if (isRolling) return;
    setErrorMessage(null);

    if (betAmount > balance) {
      setErrorMessage('Saldo simulasi tidak mencukupi untuk memasang taruhan ini.');
      setIsAutoRolling(false);
      return;
    }

    // Place bet in GameContext
    const betSuccess = placeBet(
      'dice',
      betAmount,
      `Dice Roll (${mode === 'SLIDER' ? `Slider ${sliderDirection} ${sliderTarget}` : `Sum ${selectedSum}`})`
    );

    if (!betSuccess) {
      setErrorMessage('Gagal memasang taruhan.');
      setIsAutoRolling(false);
      return;
    }

    setIsRolling(true);
    synthEngine.playDiceRoll();

    // Calculate outcome using Math & Rigged Engine
    const result = rollDiceGame({
      mode,
      betAmount,
      sliderTarget,
      sliderDirection,
      sumTarget: selectedSum,
      adminConfig,
      roundsPlayed: (stats?.roundsPlayed || 0) + roundsPlayedLocal,
    });

    // 400ms roll animation delay
    setTimeout(() => {
      setIsRolling(false);
      setDiceValues(result.diceValues);
      setRolledSliderValue(result.mode === 'SLIDER' ? result.rolledValue : null);
      setLastResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 25));
      setRoundsPlayedLocal((prev) => prev + 1);

      // Settle Bet with Ledger
      settleBet({
        gameType: 'dice',
        gameTitle: mode === 'SLIDER' ? 'Dice Roll (Over/Under)' : 'Dice Roll (2-Dice Sum)',
        betAmount: result.betAmount,
        multiplier: result.multiplier,
        payout: result.payout,
        details: `Hasil: ${result.mode === 'SLIDER' ? result.rolledValue.toFixed(2) : result.rolledValue} (Dice [${result.diceValues.join(',')}]) | ${
          result.isWin ? `Menang ${formatIDR(result.payout)}` : result.isNearMiss ? 'Near-Miss Kalah' : 'Kalah'
        }`,
        riggedApplied: result.riggedApplied,
      });

      // Confetti on win
      if (result.isWin) {
        confetti({
          particleCount: Math.min(80, Math.max(30, Math.floor(result.payout / 15000))),
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }, 450);
  }, [
    isRolling,
    betAmount,
    balance,
    placeBet,
    mode,
    sliderDirection,
    sliderTarget,
    selectedSum,
    adminConfig,
    stats?.roundsPlayed,
    roundsPlayedLocal,
    settleBet,
  ]);

  // Auto-Roll Lifecycle
  const startAutoRoll = useCallback(
    (rounds: number) => {
      if (betAmount > balance) {
        setErrorMessage('Saldo tidak cukup untuk Auto-Roll.');
        return;
      }
      setIsAutoRolling(true);
      setAutoRollCount(rounds);
    },
    [betAmount, balance]
  );

  const stopAutoRoll = useCallback(() => {
    setIsAutoRolling(false);
    setAutoRollCount(0);
    if (autoRollTimerRef.current) {
      clearTimeout(autoRollTimerRef.current);
      autoRollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isAutoRolling || autoRollCount <= 0 || isRolling) return;

    if (betAmount > balance) {
      stopAutoRoll();
      setErrorMessage('Auto-Roll dihentikan: Saldo tidak mencukupi.');
      return;
    }

    autoRollTimerRef.current = setTimeout(() => {
      handleRoll();
      setAutoRollCount((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsAutoRolling(false);
        }
        return next;
      });
    }, 850);

    return () => {
      if (autoRollTimerRef.current) {
        clearTimeout(autoRollTimerRef.current);
      }
    };
  }, [isAutoRolling, autoRollCount, isRolling, betAmount, balance, handleRoll, stopAutoRoll]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
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
              <span>Dice Roll Simulator</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-950 border border-orange-500/50 text-orange-400 font-bold">
                Continuous & 2-Dice
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Simulasi dadu 3D interaktif dengan analisis jebakan psikologis &quot;Near-Miss Effect&quot;.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right px-4 py-2 rounded-2xl bg-[#05070B] border border-[#1E2D44]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Saldo Simulasi</span>
            <div className="text-base font-black text-orange-400">{formatIDR(balance)}</div>
          </div>

          <Link
            href="/admin"
            className="p-2.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-300 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            title="Atur Rigged Engine Dice di Admin"
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Admin Mode</span>
          </Link>
        </div>
      </div>

      {/* Error / Alert Banner */}
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

      {/* 3D Dice Stage & Live LED Gauge */}
      <Dice3D
        diceValues={diceValues}
        isRolling={isRolling}
        mode={mode}
        rolledSliderValue={rolledSliderValue}
        targetSliderValue={sliderTarget}
        sliderDirection={sliderDirection}
        isWin={lastResult?.isWin}
        isNearMiss={lastResult?.isNearMiss}
      />

      {/* Game Mode Interactive Board */}
      {mode === 'SLIDER' ? (
        <DiceSlider
          target={sliderTarget}
          direction={sliderDirection}
          betAmount={betAmount}
          disabled={isRolling || isAutoRolling}
          onTargetChange={setSliderTarget}
          onToggleDirection={() =>
            setSliderDirection((prev) => (prev === 'OVER' ? 'UNDER' : 'OVER'))
          }
        />
      ) : (
        <DiceSumBoard
          selectedSum={selectedSum}
          betAmount={betAmount}
          disabled={isRolling || isAutoRolling}
          onSelectSum={setSelectedSum}
        />
      )}

      {/* Controls: Mode Switcher, Bet Amount, Roll & Auto-Roll */}
      <DiceControls
        mode={mode}
        betAmount={betAmount}
        balance={balance}
        isRolling={isRolling}
        isAutoRolling={isAutoRolling}
        autoRollCount={autoRollCount}
        onModeChange={setMode}
        onBetAmountChange={setBetAmount}
        onRoll={handleRoll}
        onStartAutoRoll={startAutoRoll}
        onStopAutoRoll={stopAutoRoll}
      />

      {/* History & Educational Near-Miss Breakdown */}
      <DiceHistory history={history} lastResult={lastResult} />
    </div>
  );
}
