'use client';

import React from 'react';
import { formatIDR, formatCompactIDR } from '@/lib/utils/currency';
import { Rocket, DollarSign, Plus, Minus, CheckCircle, Flame } from 'lucide-react';

interface CashoutControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  autoCashout: number | null;
  setAutoCashout: (val: number | null) => void;
  isFlying: boolean;
  isCrashed: boolean;
  isCashedOut: boolean;
  currentMultiplier: number;
  onLaunch: () => void;
  onCashOut: () => void;
  balance: number;
  lastPayout: number;
  cashedOutMultiplier?: number;
}

const BET_PRESETS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 500_000, 1_000_000];
const AUTO_PRESETS = [1.2, 1.5, 2.0, 3.0, 5.0, 10.0];

export const CashoutControls: React.FC<CashoutControlsProps> = ({
  betAmount,
  setBetAmount,
  autoCashout,
  setAutoCashout,
  isFlying,
  isCrashed,
  isCashedOut,
  currentMultiplier,
  onLaunch,
  onCashOut,
  balance,
  lastPayout,
  cashedOutMultiplier,
}) => {
  const canAfford = balance >= betAmount;
  const currentLivePayout = Math.round(betAmount * currentMultiplier);

  const handleStepBet = (delta: number) => {
    const next = Math.max(1_000, Math.min(1_000_000, betAmount + delta));
    setBetAmount(next);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#080D1A] border border-cyan-500/30 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Bet Presets */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Pilih Jumlah Taruhan:
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {BET_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setBetAmount(preset)}
              disabled={isFlying}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                betAmount === preset
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#06B6D4]'
                  : 'bg-[#1E293B] text-slate-300 hover:bg-[#334155] border border-slate-700 disabled:opacity-40'
              }`}
            >
              {formatCompactIDR(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Grid (Bet Stepper & Auto Cashout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Bet Stepper */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Nominal Taruhan:
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStepBet(-1_000)}
              disabled={isFlying || betAmount <= 1_000}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700 disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 py-2 px-3 rounded-xl bg-[#030712] border border-cyan-500/40 text-center">
              <span className="text-sm sm:text-base font-black text-cyan-300">
                {formatIDR(betAmount)}
              </span>
            </div>

            <button
              onClick={() => handleStepBet(1_000)}
              disabled={isFlying || betAmount >= 1_000_000}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto Cash-Out Selector */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <label className="font-bold text-slate-400 uppercase tracking-wider">
              Auto Cash-Out:
            </label>
            {autoCashout && (
              <button
                onClick={() => setAutoCashout(null)}
                disabled={isFlying}
                className="text-[10px] text-red-400 hover:underline"
              >
                Matikan Auto
              </button>
            )}
          </div>
          <div className="flex items-center space-x-1.5">
            {AUTO_PRESETS.map((mult) => (
              <button
                key={mult}
                onClick={() => setAutoCashout(autoCashout === mult ? null : mult)}
                disabled={isFlying}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                  autoCashout === mult
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10B981]'
                    : 'bg-[#1E293B] text-slate-300 hover:bg-[#334155] border border-slate-700 disabled:opacity-40'
                }`}
              >
                {mult.toFixed(1)}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Large Action Button */}
      <div>
        {isFlying && !isCrashed && !isCashedOut ? (
          <button
            onClick={onCashOut}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 hover:from-emerald-400 hover:to-green-300 text-slate-950 font-black text-lg uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(16,185,129,0.7)] animate-pulse active:scale-98 transition-all"
          >
            <DollarSign className="w-6 h-6 stroke-[3]" />
            <span>CASH OUT SEKARANG: {formatIDR(currentLivePayout)}</span>
          </button>
        ) : isFlying && isCashedOut ? (
          <div className="w-full py-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 font-black text-center text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>
              BERHASIL KLAIM {formatIDR(lastPayout)} (@ {cashedOutMultiplier?.toFixed(2)}x)
            </span>
          </div>
        ) : isCrashed ? (
          <button
            onClick={onLaunch}
            disabled={!canAfford}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black text-base uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-98 transition-all disabled:opacity-50"
          >
            <Rocket className="w-5 h-5 fill-slate-950" />
            <span>TERBANGKAN LAGI ({formatIDR(betAmount)})</span>
          </button>
        ) : (
          <button
            onClick={onLaunch}
            disabled={!canAfford}
            className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl ${
              !canAfford
                ? 'bg-red-950 border border-red-700 text-red-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 hover:from-cyan-400 hover:to-sky-300 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-98'
            }`}
          >
            {!canAfford ? (
              <span>SALDO TIDAK MENCUKUPI</span>
            ) : (
              <>
                <Rocket className="w-5 h-5 fill-slate-950" />
                <span>PASANG TARUHAN & TERBANGKAN ({formatIDR(betAmount)})</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
