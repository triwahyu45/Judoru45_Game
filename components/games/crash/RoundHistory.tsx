'use client';

import React from 'react';

interface RoundHistoryProps {
  history: number[];
}

export const RoundHistory: React.FC<RoundHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 overflow-x-auto py-1 px-1 scrollbar-none">
      <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
        Riwayat Putaran:
      </span>
      <div className="flex items-center space-x-1.5 shrink-0">
        {history.slice(0, 15).map((mult, idx) => {
          let badgeClass = 'bg-red-950/80 text-red-400 border-red-500/40';
          if (mult >= 10.0) {
            badgeClass = 'bg-amber-950/90 text-yellow-300 border-yellow-400/60 shadow-[0_0_8px_#F59E0B] font-black';
          } else if (mult >= 2.0) {
            badgeClass = 'bg-purple-950/80 text-purple-300 border-purple-500/50';
          } else if (mult >= 1.2) {
            badgeClass = 'bg-sky-950/80 text-sky-300 border-sky-500/40';
          }

          return (
            <span
              key={`hist-${idx}-${mult}`}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${badgeClass}`}
            >
              {mult.toFixed(2)}x
            </span>
          );
        })}
      </div>
    </div>
  );
};
