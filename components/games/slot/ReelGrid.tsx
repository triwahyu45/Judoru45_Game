'use client';

import React from 'react';
import { SLOT_SYMBOLS, SlotCell, getOrbTierColor } from '@/lib/math/slotMath';

interface ReelGridProps {
  grid: SlotCell[][];
  isSpinning: boolean;
  isTumbling: boolean;
  winningCellIds: Set<string>;
  turboMode: boolean;
}

export const ReelGrid: React.FC<ReelGridProps> = ({
  grid,
  isSpinning,
  isTumbling,
  winningCellIds,
  turboMode,
}) => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0B111D]/90 via-[#070B14]/95 to-[#04060A] border-2 border-amber-500/40 p-2 sm:p-3 md:p-4 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
      {/* Background Zeus Greek columns ornamentation */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Grid 6 columns x 5 rows */}
      <div className="grid grid-cols-6 gap-1 sm:gap-1.5 md:gap-2 relative z-10">
        {grid.map((col, colIdx) => (
          <div
            key={`col-${colIdx}`}
            className={`flex flex-col gap-1 sm:gap-1.5 md:gap-2 transition-transform duration-200 ${
              isSpinning
                ? 'animate-pulse translate-y-1'
                : isTumbling
                ? 'transition-all duration-300'
                : ''
            }`}
          >
            {col.map((cell, rowIdx) => {
              const symDef = SLOT_SYMBOLS[cell.symbol] || SLOT_SYMBOLS.SYM_GEM_BLUE;
              const isWinning = winningCellIds.has(cell.id) || cell.isWinning;
              const hasMultiplier = typeof cell.multiplier === 'number' && cell.multiplier > 0;
              const orbTheme = hasMultiplier ? getOrbTierColor(cell.multiplier!) : null;

              return (
                <div
                  key={cell.id || `cell-${colIdx}-${rowIdx}`}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 select-none transition-all duration-200 ${
                    isWinning
                      ? 'scale-105 ring-2 ring-amber-300 bg-amber-500/30 animate-pulse shadow-[0_0_20px_#F59E0B]'
                      : 'bg-[#111927]/80 hover:bg-[#162134]/90 border border-slate-800/80 shadow-md'
                  } ${isSpinning && !turboMode ? 'opacity-80 blur-[0.3px]' : ''}`}
                >
                  {/* Scatter Highlight Halo */}
                  {cell.symbol === 'SYM_SCATTER' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-300/10 animate-pulse pointer-events-none ring-1 ring-amber-400/50" />
                  )}

                  {/* Multiplier Orb Badge */}
                  {hasMultiplier && orbTheme && (
                    <div
                      className="absolute -top-1.5 -right-1.5 z-20 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-lg animate-bounce border"
                      style={{
                        backgroundColor: orbTheme.border,
                        color: '#000000',
                        boxShadow: orbTheme.glow,
                      }}
                    >
                      {cell.multiplier}x
                    </div>
                  )}

                  {/* Symbol Icon */}
                  <div
                    className={`text-2xl sm:text-3xl md:text-4xl transition-transform duration-200 ${
                      isWinning ? 'scale-125 rotate-3' : 'scale-100'
                    }`}
                  >
                    {symDef.icon}
                  </div>

                  {/* Small Symbol Name */}
                  <span
                    className="text-[9px] sm:text-[10px] font-bold truncate max-w-full text-center mt-0.5"
                    style={{ color: symDef.color }}
                  >
                    {symDef.name.split(' ')[0]}
                  </span>

                  {/* Winning Burst Overlay */}
                  {isWinning && (
                    <div className="absolute inset-0 rounded-xl bg-yellow-400/20 animate-ping pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
