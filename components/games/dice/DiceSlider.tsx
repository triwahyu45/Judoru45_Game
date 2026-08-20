'use client';

import React from 'react';
import { SliderDirection, calculateSliderOdds } from '@/lib/math/diceMath';
import { ArrowLeftRight, TrendingUp, TrendingDown, Percent, Coins } from 'lucide-react';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

interface DiceSliderProps {
  target: number;
  direction: SliderDirection;
  betAmount: number;
  disabled: boolean;
  onTargetChange: (value: number) => void;
  onToggleDirection: () => void;
}

export const DiceSlider: React.FC<DiceSliderProps> = ({
  target,
  direction,
  betAmount,
  disabled,
  onTargetChange,
  onToggleDirection,
}) => {
  const { winChance, multiplier } = calculateSliderOdds(target, direction);
  const potentialPayout = Math.floor(betAmount * multiplier);
  const potentialProfit = potentialPayout - betAmount;

  // Preset Buttons
  const presets = [25, 50, 75, 90];

  return (
    <div className="w-full p-6 rounded-3xl bg-[#0B111B] border border-[#1E2D44] shadow-xl space-y-6">
      {/* 1. Header & Roll Direction Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-400">Mode Taruhan:</span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              synthEngine.playClick();
              onToggleDirection();
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 border ${
              direction === 'OVER'
                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-indigo-950 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{direction === 'OVER' ? 'ROLL OVER (Lebih Dari)' : 'ROLL UNDER (Kurang Dari)'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Preset:</span>
          {presets.map((val) => (
            <button
              key={val}
              type="button"
              disabled={disabled}
              onClick={() => {
                synthEngine.playClick();
                onTargetChange(val);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                target === val
                  ? 'bg-amber-500 border-amber-400 text-black shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Precision Dual-Color Slider Bar */}
      <div className="space-y-3">
        <div className="relative w-full h-8 flex items-center">
          {/* Background Visual Zones (Green Winning vs Red Losing) */}
          <div className="absolute inset-0 w-full h-3.5 rounded-full overflow-hidden flex bg-slate-800 border border-slate-700 my-auto">
            {direction === 'OVER' ? (
              <>
                {/* Red Zone (0 to Target) */}
                <div
                  className="h-full bg-rose-600/80 transition-all"
                  style={{ width: `${target}%` }}
                />
                {/* Green Zone (Target to 100) */}
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-all"
                  style={{ width: `${100 - target}%` }}
                />
              </>
            ) : (
              <>
                {/* Green Zone (0 to Target) */}
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-all"
                  style={{ width: `${target}%` }}
                />
                {/* Red Zone (Target to 100) */}
                <div
                  className="h-full bg-rose-600/80 transition-all"
                  style={{ width: `${100 - target}%` }}
                />
              </>
            )}
          </div>

          {/* HTML5 Native Range Slider for Smooth Touch & Mouse Drag */}
          <input
            type="range"
            min="1"
            max="98"
            step="1"
            value={target}
            disabled={disabled}
            onChange={(e) => onTargetChange(Number(e.target.value))}
            className="relative z-10 w-full h-8 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {/* Custom Visual Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all flex flex-col items-center z-20"
            style={{ left: `calc(${target}% - 14px)` }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border-2 border-white shadow-[0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center text-[10px] font-black text-black">
              {target}
            </div>
          </div>
        </div>

        {/* Slider Axis Scale Ticks */}
        <div className="flex justify-between text-[11px] font-bold text-slate-500 px-1">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* 3. Live Mathematical Odds Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Target */}
        <div className="p-3.5 rounded-2xl bg-[#05070B] border border-[#1E2D44] flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">Target Angka</span>
          <span className="text-lg font-black text-white mt-1">
            {direction === 'OVER' ? `> ${target}.00` : `< ${target}.00`}
          </span>
        </div>

        {/* Win Chance */}
        <div className="p-3.5 rounded-2xl bg-[#05070B] border border-[#1E2D44] flex flex-col">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400">
            <Percent className="w-3 h-3" />
            <span>Peluang Menang</span>
          </div>
          <span className="text-lg font-black text-emerald-400 mt-1">{winChance.toFixed(2)}%</span>
        </div>

        {/* Multiplier */}
        <div className="p-3.5 rounded-2xl bg-[#05070B] border border-[#1E2D44] flex flex-col">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400">
            <TrendingUp className="w-3 h-3" />
            <span>Multiplier</span>
          </div>
          <span className="text-lg font-black text-amber-400 mt-1">{multiplier.toFixed(2)}x</span>
        </div>

        {/* Potential Payout */}
        <div className="p-3.5 rounded-2xl bg-[#05070B] border border-[#1E2D44] flex flex-col">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-cyan-400">
            <Coins className="w-3 h-3" />
            <span>Potensi Menang</span>
          </div>
          <span className="text-lg font-black text-cyan-400 mt-1 truncate">
            {formatIDR(potentialPayout)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiceSlider;
