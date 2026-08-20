'use client';

import React from 'react';
import { formatIDR, formatCompactIDR } from '@/lib/utils/currency';
import { RotateCcw, Trash2, Zap, Play } from 'lucide-react';
import { synthEngine } from '@/lib/sound/synthEngine';

interface RouletteControlsProps {
  selectedChip: number;
  totalWagered: number;
  balance: number;
  isSpinning: boolean;
  canSpin: boolean;
  onSelectChip: (amount: number) => void;
  onClearBets: () => void;
  onDoubleBets: () => void;
  onUndoLastBet: () => void;
  onSpin: () => void;
}

const CHIP_DENOMINATIONS = [
  { value: 1_000, label: '1K', bg: 'from-slate-100 to-slate-300', text: 'text-slate-900', border: 'border-slate-400' },
  { value: 5_000, label: '5K', bg: 'from-rose-500 to-red-700', text: 'text-white', border: 'border-red-300' },
  { value: 10_000, label: '10K', bg: 'from-blue-500 to-blue-700', text: 'text-white', border: 'border-blue-300' },
  { value: 50_000, label: '50K', bg: 'from-emerald-500 to-emerald-700', text: 'text-white', border: 'border-emerald-300' },
  { value: 100_000, label: '100K', bg: 'from-amber-400 to-yellow-600', text: 'text-slate-950', border: 'border-yellow-200' },
  { value: 500_000, label: '500K', bg: 'from-purple-600 to-indigo-900', text: 'text-white', border: 'border-purple-300' },
];

export const RouletteControls: React.FC<RouletteControlsProps> = ({
  selectedChip,
  totalWagered,
  balance,
  isSpinning,
  canSpin,
  onSelectChip,
  onClearBets,
  onDoubleBets,
  onUndoLastBet,
  onSpin,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#0B111B] border border-[#1E2D44] shadow-2xl">
      {/* 1. Chip Selector */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Koin:
        </span>
        {CHIP_DENOMINATIONS.map((chip) => {
          const isSelected = selectedChip === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              disabled={isSpinning}
              onClick={() => {
                synthEngine.playCoin();
                onSelectChip(chip.value);
              }}
              className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-xs transition-all shadow-md active:scale-90 disabled:opacity-40 bg-gradient-to-b ${chip.bg} ${chip.text} ${chip.border} border-2 ${
                isSelected
                  ? 'ring-4 ring-amber-400 scale-110 shadow-[0_0_16px_rgba(251,191,36,0.6)] z-10'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            >
              <span className="drop-shadow">{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Action Controls (Clear, Undo, 2x) & Total Wager */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isSpinning || totalWagered === 0}
          onClick={() => {
            synthEngine.playClick();
            onUndoLastBet();
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all disabled:opacity-30 active:scale-95"
          title="Batal taruhan terakhir"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        <button
          type="button"
          disabled={isSpinning || totalWagered === 0 || totalWagered * 2 > balance}
          onClick={() => {
            synthEngine.playCoin();
            onDoubleBets();
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 font-semibold text-xs transition-all disabled:opacity-30 active:scale-95"
          title="Gandakan semua taruhan (2x)"
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>2x</span>
        </button>

        <button
          type="button"
          disabled={isSpinning || totalWagered === 0}
          onClick={() => {
            synthEngine.playClick();
            onClearBets();
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/50 text-rose-200 font-semibold text-xs transition-all disabled:opacity-30 active:scale-95"
          title="Hapus semua taruhan"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Hapus</span>
        </button>
      </div>

      {/* 3. Total Wager Indicator & Spin Button */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Taruhan</div>
          <div className="text-sm font-extrabold text-amber-400">{formatIDR(totalWagered)}</div>
        </div>

        <button
          type="button"
          disabled={isSpinning || !canSpin}
          onClick={() => {
            synthEngine.playClick();
            onSpin();
          }}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 ${
            canSpin && !isSpinning
              ? 'btn-gold animate-pulse text-slate-950 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)]'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSpinning ? 'Memutar...' : 'Putar Roda'}</span>
        </button>
      </div>
    </div>
  );
};

export default RouletteControls;
