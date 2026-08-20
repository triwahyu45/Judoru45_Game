'use client';

import React from 'react';
import { DICE_SUM_CONFIG, DiceSumOdds } from '@/lib/math/diceMath';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

interface DiceSumBoardProps {
  selectedSum: number;
  betAmount: number;
  disabled: boolean;
  onSelectSum: (sum: number) => void;
}

export const DiceSumBoard: React.FC<DiceSumBoardProps> = ({
  selectedSum,
  betAmount,
  disabled,
  onSelectSum,
}) => {
  const sumList = Object.values(DICE_SUM_CONFIG);

  return (
    <div className="w-full p-6 rounded-3xl bg-[#0B111B] border border-[#1E2D44] shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Pilih Target Total 2 Dadu (2 - 12)
          </h3>
          <p className="text-xs text-slate-400">
            Setiap jumlah memiliki probabilitas kombinasi dan perkalian hadiah berbeda.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-500">Pilihan Aktif</span>
          <div className="text-sm font-black text-amber-400">
            SUM {selectedSum} ({DICE_SUM_CONFIG[selectedSum]?.multiplier}x)
          </div>
        </div>
      </div>

      {/* Grid of 11 Sum Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {sumList.map((item: DiceSumOdds) => {
          const isSelected = selectedSum === item.sum;
          const potentialWin = Math.floor(betAmount * item.multiplier);

          return (
            <button
              key={item.sum}
              type="button"
              disabled={disabled}
              onClick={() => {
                synthEngine.playClick();
                onSelectSum(item.sum);
              }}
              className={`relative p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all border active:scale-95 disabled:opacity-50 ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/80 scale-105 z-10'
                  : 'bg-[#060A11] hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              {/* Sum Number */}
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-lg text-white shadow-inner mb-1.5">
                {item.sum}
              </div>

              {/* Multiplier Badge */}
              <div className="text-xs font-black text-amber-400 mb-0.5">
                {item.multiplier}x
              </div>

              {/* Ways / Probability */}
              <div className="text-[10px] text-slate-400 font-medium">
                {item.ways}/36 ({(item.probability * 100).toFixed(1)}%)
              </div>

              {/* Potential Profit */}
              {isSelected && (
                <div className="mt-1 text-[9px] font-bold text-emerald-400 truncate max-w-full">
                  Menang: {formatIDR(potentialWin)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DiceSumBoard;
