'use client';

import React from 'react';
import { formatIDR, formatCompactIDR } from '@/lib/utils/currency';
import { Play, Square, Zap, HelpCircle, Plus, Minus, RotateCw } from 'lucide-react';

interface BetControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  onSpin: () => void;
  isSpinning: boolean;
  autoSpinCount: number;
  startAutoSpin: (spins: number) => void;
  stopAutoSpin: () => void;
  turboMode: boolean;
  setTurboMode: (enabled: boolean) => void;
  balance: number;
  openPaytable: () => void;
  lastWin: number;
}

const BET_PRESETS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 500_000, 1_000_000];

export const BetControls: React.FC<BetControlsProps> = ({
  betAmount,
  setBetAmount,
  onSpin,
  isSpinning,
  autoSpinCount,
  startAutoSpin,
  stopAutoSpin,
  turboMode,
  setTurboMode,
  balance,
  openPaytable,
  lastWin,
}) => {
  const canAfford = balance >= betAmount;

  const handleStepBet = (delta: number) => {
    const next = Math.max(1_000, Math.min(1_000_000, betAmount + delta));
    setBetAmount(next);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0F172A]/90 to-[#070C18]/95 border border-slate-800 p-3 sm:p-4 shadow-xl space-y-3">
      {/* Top Bar: Last Win & Paytable Trigger */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Kemenangan Terakhir:</span>
          <span className="font-bold text-amber-400 text-sm">
            {lastWin > 0 ? formatIDR(lastWin) : 'Rp 0'}
          </span>
        </div>
        <button
          onClick={openPaytable}
          className="flex items-center space-x-1 text-slate-400 hover:text-amber-300 font-semibold transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Tabel Bayaran</span>
        </button>
      </div>

      {/* Preset Bet Buttons */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        {BET_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setBetAmount(preset)}
            disabled={isSpinning}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              betAmount === preset
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_#F59E0B]'
                : 'bg-[#1E293B] text-slate-300 hover:bg-[#334155] border border-slate-700'
            }`}
          >
            {formatCompactIDR(preset)}
          </button>
        ))}
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Bet Stepper Input */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => handleStepBet(-1_000)}
            disabled={isSpinning || betAmount <= 1_000}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700 disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="px-4 py-2 rounded-xl bg-[#030712] border border-amber-500/40 text-center min-w-[140px]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Taruhan</p>
            <p className="text-sm sm:text-base font-black text-amber-400">{formatIDR(betAmount)}</p>
          </div>

          <button
            onClick={() => handleStepBet(1_000)}
            disabled={isSpinning || betAmount >= 1_000_000}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Turbo, Auto-Spin & Spin */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          {/* Turbo Toggle */}
          <button
            onClick={() => setTurboMode(!turboMode)}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all border ${
              turboMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Percepat animasi putaran slot"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Turbo</span>
          </button>

          {/* Auto-Spin Selector / Stop */}
          {autoSpinCount > 0 ? (
            <button
              onClick={stopAutoSpin}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>STOP ({autoSpinCount})</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled={isSpinning || !canAfford}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1 border border-slate-700 disabled:opacity-40"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Auto</span>
              </button>
              {/* Dropdown presets */}
              <div className="absolute bottom-full mb-1 left-0 hidden group-hover:flex flex-col bg-[#0B111D] border border-slate-700 rounded-xl p-1 shadow-2xl z-30 min-w-[70px]">
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => startAutoSpin(count)}
                    className="px-2 py-1 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg text-left font-bold"
                  >
                    {count}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Big Spin Button */}
          <button
            onClick={onSpin}
            disabled={isSpinning || !canAfford}
            className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl ${
              isSpinning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : !canAfford
                ? 'bg-red-950 border border-red-700 text-red-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95'
            }`}
          >
            {isSpinning ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin text-slate-400" />
                <span>MEMUTAR...</span>
              </>
            ) : !canAfford ? (
              <span>SALDO KURANG</span>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>PUTAR (SPIN)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
