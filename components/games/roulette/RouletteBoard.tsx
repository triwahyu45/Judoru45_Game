'use client';

import React from 'react';
import {
  RouletteBet,
  RouletteBetType,
  RED_NUMBERS,
  BLACK_NUMBERS,
  getNumberColor,
  getNumbersForBetType,
  BET_PAYOUT_RATIOS,
} from '@/lib/math/rouletteMath';
import { formatCompactIDR } from '@/lib/utils/currency';

interface RouletteBoardProps {
  bets: RouletteBet[];
  selectedChip: number;
  disabled: boolean;
  onPlaceBet: (type: RouletteBetType, label: string, numbers: number[]) => void;
  onClearBetSlot?: (betId: string) => void;
}

export const RouletteBoard: React.FC<RouletteBoardProps> = ({
  bets,
  selectedChip,
  disabled,
  onPlaceBet,
}) => {
  // Aggregate total bet placed on a specific bet key
  const getBetAmount = (type: RouletteBetType, numbers: number[]): number => {
    const sortedTarget = [...numbers].sort((a, b) => a - b).join(',');
    const matching = bets.filter((b) => {
      if (b.type !== type) return false;
      const sortedCurrent = [...b.numbers].sort((a, b) => a - b).join(',');
      return sortedCurrent === sortedTarget;
    });
    return matching.reduce((sum, b) => sum + b.amount, 0);
  };

  const handleFieldClick = (type: RouletteBetType, label: string, numbers: number[]) => {
    if (disabled || selectedChip <= 0) return;
    onPlaceBet(type, label, numbers);
  };

  // 3 Rows of 12 columns (Standard European Layout)
  // Row 1 (top): 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36
  // Row 2 (mid): 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35
  // Row 3 (bot): 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34
  const row1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  const row3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

  // Helper chip badge component
  const ChipBadge = ({ amount }: { amount: number }) => {
    if (amount <= 0) return null;
    return (
      <div className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center px-1.5 py-0.5 min-w-[22px] rounded-full bg-gradient-to-r from-amber-400 to-amber-600 border border-white text-[10px] font-black text-black shadow-lg animate-scale-up pointer-events-none">
        {formatCompactIDR(amount)}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto select-none rounded-3xl p-4 bg-[#0a382c] border-2 border-amber-500/40 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">
      {/* Board Container */}
      <div className="min-w-[620px] max-w-[840px] mx-auto flex flex-col gap-1.5 font-sans">
        
        {/* Main Grid: Zero + 1-36 Numbers + Column Bets */}
        <div className="grid grid-cols-[56px_repeat(12,1fr)_58px] gap-1.5">
          {/* Zero (0) spanning all 3 rows */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('STRAIGHT', '0', [0])}
            className="row-span-3 relative flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-2xl border-2 border-emerald-400/60 shadow-md transition-all disabled:opacity-50"
          >
            <span>0</span>
            <ChipBadge amount={getBetAmount('STRAIGHT', [0])} />
          </button>

          {/* Row 1 Numbers */}
          {row1.map((num) => {
            const color = getNumberColor(num);
            const amount = getBetAmount('STRAIGHT', [num]);
            return (
              <button
                key={`num-${num}`}
                type="button"
                disabled={disabled}
                onClick={() => handleFieldClick('STRAIGHT', `${num}`, [num])}
                className={`relative h-12 flex items-center justify-center rounded-lg font-black text-base transition-all border ${
                  color === 'red'
                    ? 'bg-rose-700 hover:bg-rose-600 border-rose-500 text-white shadow-[0_2px_8px_rgba(225,29,72,0.3)]'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                } active:scale-95 disabled:opacity-50`}
              >
                <span>{num}</span>
                <ChipBadge amount={amount} />
              </button>
            );
          })}

          {/* Column 3 (Top Row 2:1) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('COLUMN_3', '2 to 1 (Col 3)', getNumbersForBetType('COLUMN_3'))}
            className="relative h-12 flex items-center justify-center rounded-lg bg-emerald-900/90 hover:bg-emerald-800 border border-amber-400/50 text-amber-300 font-bold text-xs tracking-wider uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>2 to 1</span>
            <ChipBadge amount={getBetAmount('COLUMN_3', getNumbersForBetType('COLUMN_3'))} />
          </button>

          {/* Row 2 Numbers */}
          {row2.map((num) => {
            const color = getNumberColor(num);
            const amount = getBetAmount('STRAIGHT', [num]);
            return (
              <button
                key={`num-${num}`}
                type="button"
                disabled={disabled}
                onClick={() => handleFieldClick('STRAIGHT', `${num}`, [num])}
                className={`relative h-12 flex items-center justify-center rounded-lg font-black text-base transition-all border ${
                  color === 'red'
                    ? 'bg-rose-700 hover:bg-rose-600 border-rose-500 text-white shadow-[0_2px_8px_rgba(225,29,72,0.3)]'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                } active:scale-95 disabled:opacity-50`}
              >
                <span>{num}</span>
                <ChipBadge amount={amount} />
              </button>
            );
          })}

          {/* Column 2 (Middle Row 2:1) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('COLUMN_2', '2 to 1 (Col 2)', getNumbersForBetType('COLUMN_2'))}
            className="relative h-12 flex items-center justify-center rounded-lg bg-emerald-900/90 hover:bg-emerald-800 border border-amber-400/50 text-amber-300 font-bold text-xs tracking-wider uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>2 to 1</span>
            <ChipBadge amount={getBetAmount('COLUMN_2', getNumbersForBetType('COLUMN_2'))} />
          </button>

          {/* Row 3 Numbers */}
          {row3.map((num) => {
            const color = getNumberColor(num);
            const amount = getBetAmount('STRAIGHT', [num]);
            return (
              <button
                key={`num-${num}`}
                type="button"
                disabled={disabled}
                onClick={() => handleFieldClick('STRAIGHT', `${num}`, [num])}
                className={`relative h-12 flex items-center justify-center rounded-lg font-black text-base transition-all border ${
                  color === 'red'
                    ? 'bg-rose-700 hover:bg-rose-600 border-rose-500 text-white shadow-[0_2px_8px_rgba(225,29,72,0.3)]'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
                } active:scale-95 disabled:opacity-50`}
              >
                <span>{num}</span>
                <ChipBadge amount={amount} />
              </button>
            );
          })}

          {/* Column 1 (Bottom Row 2:1) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('COLUMN_1', '2 to 1 (Col 1)', getNumbersForBetType('COLUMN_1'))}
            className="relative h-12 flex items-center justify-center rounded-lg bg-emerald-900/90 hover:bg-emerald-800 border border-amber-400/50 text-amber-300 font-bold text-xs tracking-wider uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>2 to 1</span>
            <ChipBadge amount={getBetAmount('COLUMN_1', getNumbersForBetType('COLUMN_1'))} />
          </button>
        </div>

        {/* Middle Bar: Dozens (1st 12, 2nd 12, 3rd 12) */}
        <div className="grid grid-cols-[56px_repeat(3,1fr)_58px] gap-1.5">
          <div /> {/* Spacer for Zero */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('DOZEN_1', '1st 12 (1-12)', getNumbersForBetType('DOZEN_1'))}
            className="relative h-10 flex items-center justify-center rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-amber-400/40 text-amber-200 font-extrabold text-xs tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>1st 12</span>
            <ChipBadge amount={getBetAmount('DOZEN_1', getNumbersForBetType('DOZEN_1'))} />
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('DOZEN_2', '2nd 12 (13-24)', getNumbersForBetType('DOZEN_2'))}
            className="relative h-10 flex items-center justify-center rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-amber-400/40 text-amber-200 font-extrabold text-xs tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>2nd 12</span>
            <ChipBadge amount={getBetAmount('DOZEN_2', getNumbersForBetType('DOZEN_2'))} />
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('DOZEN_3', '3rd 12 (25-36)', getNumbersForBetType('DOZEN_3'))}
            className="relative h-10 flex items-center justify-center rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-amber-400/40 text-amber-200 font-extrabold text-xs tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>3rd 12</span>
            <ChipBadge amount={getBetAmount('DOZEN_3', getNumbersForBetType('DOZEN_3'))} />
          </button>
          <div /> {/* Spacer for Column */}
        </div>

        {/* Bottom Bar: Outside Bets (1-18, EVEN, RED, BLACK, ODD, 19-36) */}
        <div className="grid grid-cols-[56px_repeat(6,1fr)_58px] gap-1.5">
          <div /> {/* Spacer for Zero */}
          {/* Low (1-18) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('LOW', '1 to 18', getNumbersForBetType('LOW'))}
            className="relative h-11 flex items-center justify-center rounded-lg bg-[#07241B] hover:bg-[#0c382b] border border-amber-500/30 text-white font-bold text-xs uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>1 to 18</span>
            <ChipBadge amount={getBetAmount('LOW', getNumbersForBetType('LOW'))} />
          </button>

          {/* Even */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('EVEN', 'EVEN', getNumbersForBetType('EVEN'))}
            className="relative h-11 flex items-center justify-center rounded-lg bg-[#07241B] hover:bg-[#0c382b] border border-amber-500/30 text-white font-bold text-xs uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>EVEN</span>
            <ChipBadge amount={getBetAmount('EVEN', getNumbersForBetType('EVEN'))} />
          </button>

          {/* RED */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('RED', 'RED', getNumbersForBetType('RED'))}
            className="relative h-11 flex items-center justify-center rounded-lg bg-rose-700 hover:bg-rose-600 border border-rose-400 text-white font-extrabold text-sm uppercase transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_12px_rgba(225,29,72,0.3)]"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-white rotate-45 inline-block" />
              <span>RED</span>
            </span>
            <ChipBadge amount={getBetAmount('RED', getNumbersForBetType('RED'))} />
          </button>

          {/* BLACK */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('BLACK', 'BLACK', getNumbersForBetType('BLACK'))}
            className="relative h-11 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-600 text-white font-extrabold text-sm uppercase transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_12px_rgba(0,0,0,0.5)]"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-400 rotate-45 inline-block" />
              <span>BLACK</span>
            </span>
            <ChipBadge amount={getBetAmount('BLACK', getNumbersForBetType('BLACK'))} />
          </button>

          {/* Odd */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('ODD', 'ODD', getNumbersForBetType('ODD'))}
            className="relative h-11 flex items-center justify-center rounded-lg bg-[#07241B] hover:bg-[#0c382b] border border-amber-500/30 text-white font-bold text-xs uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>ODD</span>
            <ChipBadge amount={getBetAmount('ODD', getNumbersForBetType('ODD'))} />
          </button>

          {/* High (19-36) */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleFieldClick('HIGH', '19 to 36', getNumbersForBetType('HIGH'))}
            className="relative h-11 flex items-center justify-center rounded-lg bg-[#07241B] hover:bg-[#0c382b] border border-amber-500/30 text-white font-bold text-xs uppercase transition-all active:scale-95 disabled:opacity-50"
          >
            <span>19 to 36</span>
            <ChipBadge amount={getBetAmount('HIGH', getNumbersForBetType('HIGH'))} />
          </button>

          <div /> {/* Spacer for Column */}
        </div>

      </div>
    </div>
  );
};

export default RouletteBoard;
