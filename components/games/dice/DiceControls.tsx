'use client';

import React from 'react';
import { DiceGameMode } from '@/lib/math/diceMath';
import { formatIDR } from '@/lib/utils/currency';
import { Dices, Sliders, Play, Square, Zap, RefreshCw } from 'lucide-react';
import { synthEngine } from '@/lib/sound/synthEngine';

interface DiceControlsProps {
  mode: DiceGameMode;
  betAmount: number;
  balance: number;
  isRolling: boolean;
  isAutoRolling: boolean;
  autoRollCount: number;
  onModeChange: (mode: DiceGameMode) => void;
  onBetAmountChange: (amount: number) => void;
  onRoll: () => void;
  onStartAutoRoll: (rounds: number) => void;
  onStopAutoRoll: () => void;
}

const BET_PRESETS = [1_000, 5_000, 10_000, 50_000, 100_000, 500_000];

export const DiceControls: React.FC<DiceControlsProps> = ({
  mode,
  betAmount,
  balance,
  isRolling,
  isAutoRolling,
  autoRollCount,
  onModeChange,
  onBetAmountChange,
  onRoll,
  onStartAutoRoll,
  onStopAutoRoll,
}) => {
  return (
    <div className="w-full p-6 rounded-3xl bg-[#0B111B] border border-[#1E2D44] shadow-2xl space-y-5">
      {/* 1. Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#05070B] border border-[#1E2D44]">
        <button
          type="button"
          disabled={isRolling || isAutoRolling}
          onClick={() => {
            synthEngine.playClick();
            onModeChange('SLIDER');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            mode === 'SLIDER'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Slider Over/Under</span>
        </button>

        <button
          type="button"
          disabled={isRolling || isAutoRolling}
          onClick={() => {
            synthEngine.playClick();
            onModeChange('SUM');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            mode === 'SUM'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>2-Dice Exact Sum (2-12)</span>
        </button>
      </div>

      {/* 2. Bet Amount Selector & Modifiers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Jumlah Taruhan:</span>
          <span className="text-amber-400 font-extrabold">{formatIDR(betAmount)}</span>
        </div>

        {/* Quick Chip Presets */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {BET_PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              disabled={isRolling || isAutoRolling}
              onClick={() => {
                synthEngine.playCoin();
                onBetAmountChange(amount);
              }}
              className={`py-2 px-1 rounded-xl font-extrabold text-xs border transition-all active:scale-95 ${
                betAmount === amount
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {formatIDR(amount)}
            </button>
          ))}
        </div>

        {/* Math Multipliers (1/2, 2x, Max) */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            disabled={isRolling || isAutoRolling || betAmount <= 1000}
            onClick={() => {
              synthEngine.playClick();
              onBetAmountChange(Math.max(1000, Math.floor(betAmount / 2)));
            }}
            className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all disabled:opacity-40"
          >
            ½ Bet
          </button>
          <button
            type="button"
            disabled={isRolling || isAutoRolling || betAmount * 2 > balance}
            onClick={() => {
              synthEngine.playClick();
              onBetAmountChange(Math.min(balance, betAmount * 2));
            }}
            className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all disabled:opacity-40"
          >
            2× Bet
          </button>
          <button
            type="button"
            disabled={isRolling || isAutoRolling || balance <= 0}
            onClick={() => {
              synthEngine.playClick();
              onBetAmountChange(Math.max(1000, balance));
            }}
            className="flex-1 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-bold transition-all disabled:opacity-40"
          >
            MAX
          </button>
        </div>
      </div>

      {/* 3. Action Roll & Auto-Roll Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Main Manual Roll Button */}
        <button
          type="button"
          disabled={isRolling || isAutoRolling || betAmount > balance}
          onClick={() => {
            synthEngine.playDiceRoll();
            onRoll();
          }}
          className={`sm:col-span-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 ${
            !isRolling && !isAutoRolling && betAmount <= balance
              ? 'btn-gold animate-pulse text-slate-950 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)]'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRolling ? 'Mengocok Dadu...' : 'Kocok Dadu'}</span>
        </button>

        {/* Auto-Roll Trigger / Stop Button */}
        {isAutoRolling ? (
          <button
            type="button"
            onClick={onStopAutoRoll}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 font-black text-xs uppercase tracking-wider text-white shadow-xl animate-pulse transition-all active:scale-95"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop Auto ({autoRollCount})</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isRolling || betAmount > balance}
            onClick={() => onStartAutoRoll(10)}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold text-xs uppercase tracking-wider text-slate-200 transition-all active:scale-95 disabled:opacity-40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Auto 10x</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DiceControls;
