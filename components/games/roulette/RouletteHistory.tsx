'use client';

import React from 'react';
import { getNumberColor, PocketColor } from '@/lib/math/rouletteMath';
import { AlertCircle, Flame, Snowflake, History } from 'lucide-react';

interface RouletteHistoryProps {
  history: number[];
  lastWinningNumber: number | null;
  riggedApplied?: boolean;
  riggedReason?: string;
}

export const RouletteHistory: React.FC<RouletteHistoryProps> = ({
  history,
  lastWinningNumber,
  riggedApplied,
  riggedReason,
}) => {
  // Compute Hot & Cold numbers from history
  const frequencyMap = history.reduce<Record<number, number>>((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {});

  const sortedNumbers = Object.entries(frequencyMap)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sortedNumbers.slice(0, 3).map((item) => item.num);
  const coldNumbers = [0, 13, 29, 36].filter((n) => !history.includes(n)).slice(0, 3);

  const getPillBg = (color: PocketColor) => {
    if (color === 'green') return 'bg-emerald-600 border-emerald-400 text-white';
    if (color === 'red') return 'bg-rose-600 border-rose-400 text-white';
    return 'bg-slate-900 border-slate-700 text-slate-100';
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. Winning Number Spotlight Banner */}
      {lastWinningNumber !== null && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0B111B] via-[#121B2A] to-[#0B111B] border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-2xl ${
                getNumberColor(lastWinningNumber) === 'green'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/40'
                  : getNumberColor(lastWinningNumber) === 'red'
                  ? 'bg-rose-600 border-rose-400 text-white shadow-rose-500/40'
                  : 'bg-slate-900 border-slate-600 text-white shadow-slate-900/60'
              }`}
            >
              <span>{lastWinningNumber}</span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-amber-400">
                Angka Pemenang Terakhir
              </div>
              <div className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                <span className="capitalize">{getNumberColor(lastWinningNumber)}</span>
                {lastWinningNumber !== 0 && (
                  <>
                    <span>•</span>
                    <span>{lastWinningNumber % 2 === 0 ? 'GENAP' : 'GANJIL'}</span>
                    <span>•</span>
                    <span>{lastWinningNumber >= 19 ? 'TINGGI (19-36)' : 'RENDAH (1-18)'}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rigged Alert Indicator (if admin steered this spin) */}
          {riggedApplied && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/60 text-purple-200 text-xs flex items-center gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-bold text-purple-300">Deteksi Manipulasi Bandar: </span>
                <span className="text-[11px] text-purple-200/90">{riggedReason || 'RTP Suppression Active'}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. History Ribbon & Hot/Cold Numbers Bar */}
      <div className="p-3 rounded-2xl bg-[#080D15] border border-[#1E2D44] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Recent Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            <History className="w-3.5 h-3.5" />
            <span>Riwayat:</span>
          </div>
          {history.length === 0 ? (
            <span className="text-xs text-slate-500 italic">Belum ada putaran</span>
          ) : (
            history.slice(0, 12).map((num, i) => {
              const color = getNumberColor(num);
              return (
                <div
                  key={`hist-${i}-${num}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${getPillBg(
                    color
                  )} shrink-0 shadow-sm`}
                >
                  {num}
                </div>
              );
            })
          )}
        </div>

        {/* Hot & Cold Stats */}
        <div className="flex items-center gap-4 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-bold">Hot:</span>
            <span>{hotNumbers.length > 0 ? hotNumbers.join(', ') : '-'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
            <span className="font-bold">Cold:</span>
            <span>{coldNumbers.length > 0 ? coldNumbers.join(', ') : '-'}</span>
          </div>
        </div>
      </div>

      {/* 3. Educational Callout: Gambler's Fallacy */}
      <div className="p-3.5 rounded-2xl bg-[#07131F] border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-cyan-300">Edukasi Psikologi — The Gambler&apos;s Fallacy (Ilusi Monte Carlo):</span>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Melihat angka merah keluar 5 kali berturut-turut sering memicu keyakinan keliru bahwa hitam &quot;pasti segera keluar&quot;. Padahal setiap putaran adalah peristiwa independen dengan peluang tepat 18/37 (48.65%), dan angka 0 (hijau) selalu memberikan keuntungan matematis absolut 2.70% bagi bandar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouletteHistory;
