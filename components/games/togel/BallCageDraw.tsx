'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { synthEngine } from '@/lib/sound/synthEngine';

interface BallCageDrawProps {
  isDrawing: boolean;
  drawnDigits: (string | null)[]; // [AS, KOP, KEPALA, EKOR]
  currentDrawNumber: string | null;
  nearMissApplied?: boolean;
  nearMissDetails?: string;
  isWin?: boolean;
  totalPayout?: number;
}

const CAGE_LABELS = [
  { key: 'AS', title: 'AS (Ribuan)', color: 'from-amber-500 to-yellow-600', border: 'border-amber-400' },
  { key: 'KOP', title: 'KOP (Ratusan)', color: 'from-blue-500 to-indigo-600', border: 'border-blue-400' },
  { key: 'KEPALA', title: 'KEPALA (Puluhan)', color: 'from-emerald-500 to-teal-600', border: 'border-emerald-400' },
  { key: 'EKOR', title: 'EKOR (Satuan)', color: 'from-purple-500 to-pink-600', border: 'border-purple-400' },
];

export const BallCageDraw: React.FC<BallCageDrawProps> = ({
  isDrawing,
  drawnDigits,
  currentDrawNumber,
  nearMissApplied,
  nearMissDetails,
  isWin,
  totalPayout = 0,
}) => {
  const [activeCageIndex, setActiveCageIndex] = useState<number>(-1);

  useEffect(() => {
    if (isDrawing) {
      synthEngine.playLotteryTumble();
    }
  }, [isDrawing]);

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#05070B] border border-purple-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
              <span>LIVE DRAW 4D LOTTERY MACHINE</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PNEUMATIC CAGES
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              4 Tabung Transparan Mekanikal Berputar: AS - KOP - KEPALA - EKOR
            </p>
          </div>
        </div>

        {/* Live Draw State Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isDrawing
                ? 'bg-amber-400 animate-ping'
                : currentDrawNumber
                ? 'bg-emerald-400'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-xs font-semibold text-slate-300">
            {isDrawing ? 'SEDANG MENGUNDI BOLA...' : currentDrawNumber ? 'HASIL UNDIAN KELUAR' : 'STANDBY MENUNGGU TARUHAN'}
          </span>
        </div>
      </div>

      {/* 4 Mechanical Ball Cages Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-8">
        {CAGE_LABELS.map((cage, index) => {
          const revealedDigit = drawnDigits[index];
          const isRevealed = revealedDigit !== null;
          const isCurrentSpinning = isDrawing && !isRevealed;

          return (
            <div
              key={cage.key}
              className={`flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0A0F1D] border transition-all duration-300 ${
                isCurrentSpinning
                  ? `${cage.border} shadow-lg shadow-purple-500/20 scale-[1.02]`
                  : isRevealed
                  ? 'border-emerald-500/40 shadow-md shadow-emerald-500/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Cage Label */}
              <div className="text-center mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                  {cage.title}
                </span>
              </div>

              {/* Sphere Cage Container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-slate-900 via-slate-800/80 to-slate-950 border-2 border-slate-700/80 shadow-inner flex items-center justify-center overflow-hidden">
                {/* Cage Glass Highlight Reflection */}
                <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/20 blur-[1px] rotate-[-25deg]" />

                {/* Animated Tumbling Balls in Background when Drawing */}
                {isDrawing && !isRevealed && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-amber-400 animate-bounce absolute top-4 left-4 opacity-75 blur-[0.5px]" />
                    <div className="w-5 h-5 rounded-full bg-red-400 animate-pulse absolute bottom-4 right-4 opacity-75" />
                    <div className="w-7 h-7 rounded-full bg-blue-400 animate-spin absolute top-6 right-6 opacity-60" />
                    <div className="w-6 h-6 rounded-full bg-emerald-400 animate-ping absolute bottom-6 left-6 opacity-50" />
                  </div>
                )}

                {/* Chute Drop Result Ball */}
                {isRevealed ? (
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${cage.color} border-2 border-white/80 shadow-2xl flex items-center justify-center transform animate-in zoom-in-50 duration-500 scale-100 ring-4 ring-white/10`}
                  >
                    <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {revealedDigit}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-600">
                    {isDrawing ? (
                      <span className="text-xs font-mono font-bold text-amber-300 animate-pulse">
                        PUTAR...
                      </span>
                    ) : (
                      <span className="text-3xl font-bold font-mono text-slate-700">?</span>
                    )}
                  </div>
                )}
              </div>

              {/* Chute Tube Output */}
              <div className="w-10 h-3 bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700 rounded-b-md -mt-0.5" />

              {/* Position Sub-label */}
              <span className="text-xs font-semibold text-slate-300 mt-2 font-mono">
                {isRevealed ? `Digit: ${revealedDigit}` : 'Tabung ' + (index + 1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grand Result Bar */}
      {currentDrawNumber && !isDrawing && (
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-blue-950/40 border border-purple-500/40 text-center space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            HASIL RESMI UNDIAN 4D TOTO GELAP
          </div>
          <div className="flex items-center justify-center space-x-3">
            {currentDrawNumber.split('').map((digit, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-xl bg-gradient-to-b from-purple-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-lg border border-purple-300/40"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Near-Miss Alert Banner */}
          {nearMissApplied && nearMissDetails && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>ILUSI NEAR-MISS TERPICU:</strong> {nearMissDetails}
              </span>
            </div>
          )}

          {/* Win / Loss Status */}
          {isWin ? (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>SELAMAT! TIKET ANDA TEMBUS JACKPOT! TOTAL HADIAH: Rp {totalPayout.toLocaleString('id-ID')}</span>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-slate-900/60 text-slate-400 text-xs flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>Peluang 4D adalah 1 banding 10.000 (0.01%). Bandar menahan 69.9% house margin.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
