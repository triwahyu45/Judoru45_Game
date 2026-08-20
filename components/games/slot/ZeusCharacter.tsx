'use client';

import React, { useEffect, useState } from 'react';
import { Zap, Sparkles, AlertTriangle } from 'lucide-react';

interface ZeusCharacterProps {
  isStriking: boolean;
  totalMultiplier: number;
  freeSpinsRemaining: number;
  isNearMiss: boolean;
  isWastedOrbTease: boolean;
}

export const ZeusCharacter: React.FC<ZeusCharacterProps> = ({
  isStriking,
  totalMultiplier,
  freeSpinsRemaining,
  isNearMiss,
  isWastedOrbTease,
}) => {
  const [quote, setQuote] = useState<string>('Aku Dewa Olympus! Gandakan atau hanguskan!');

  useEffect(() => {
    if (isStriking) {
      const strikeQuotes = [
        '⚡ PETIR OLYMPUS MENYAMBAR!',
        '💥 TERIMALAH MULTIPLIER KEKUATANKU!',
        '⚡ PETIR DAHSYAT 500X!',
      ];
      setQuote(strikeQuotes[Math.floor(Math.random() * strikeQuotes.length)]);
    } else if (isNearMiss) {
      setQuote('👀 Hampir saja! Kurang 1 Scatter lagi untuk 15 Free Spins!');
    } else if (isWastedOrbTease) {
      setQuote('⚡ Multiplier besar turun tapi simbol tidak pecah! Uangmu tetap milik bandar!');
    } else if (freeSpinsRemaining > 0) {
      setQuote(`🔥 ZEUS BONUS ROUND! Sisa: ${freeSpinsRemaining} Putaran Gratis!`);
    } else {
      setQuote('Aku Dewa Olympus! Gandakan atau hanguskan!');
    }
  }, [isStriking, isNearMiss, isWastedOrbTease, freeSpinsRemaining]);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#181126] via-[#100A1C] to-[#08050E] border-2 border-amber-500/50 p-4 shadow-xl overflow-hidden flex flex-col items-center justify-between min-h-[360px]">
      {/* Lightning Flash Background */}
      {isStriking && (
        <div className="absolute inset-0 bg-yellow-400/20 animate-ping pointer-events-none z-10" />
      )}

      {/* Free Spins Glowing Banner */}
      {freeSpinsRemaining > 0 && (
        <div className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs py-1 px-2 rounded-lg text-center uppercase tracking-widest animate-pulse shadow-lg flex items-center justify-center space-x-1 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FREE SPINS: {freeSpinsRemaining}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Zeus Avatar & Animated Lightning Aura */}
      <div className="relative my-2 flex flex-col items-center">
        {/* Glowing Aura */}
        <div
          className={`absolute -inset-4 rounded-full filter blur-xl transition-all duration-300 ${
            isStriking
              ? 'bg-amber-400/50 scale-125'
              : freeSpinsRemaining > 0
              ? 'bg-purple-500/40 animate-pulse'
              : 'bg-amber-600/20'
          }`}
        />

        {/* Zeus Greek Avatar Artwork */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-amber-500/30 to-purple-900/60 border-2 border-amber-400/60 flex items-center justify-center shadow-2xl overflow-hidden group">
          {/* Animated Lightning Bolt Behind Head */}
          <Zap
            className={`w-24 h-24 absolute text-yellow-400/30 transition-transform duration-200 ${
              isStriking ? 'scale-150 rotate-12 text-yellow-300' : 'rotate-6'
            }`}
          />
          
          {/* Zeus Emoji/Portrait */}
          <div className="relative z-10 text-center">
            <span className="text-6xl sm:text-7xl filter drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">
              ⚡🧔‍♂️👑
            </span>
          </div>
        </div>

        {/* Total Accumulated Multiplier Badge */}
        {totalMultiplier > 0 && (
          <div className="mt-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm shadow-[0_0_15px_#F59E0B] flex items-center space-x-1 animate-bounce">
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>TOTAL MULTIPLIER: {totalMultiplier}x</span>
          </div>
        )}
      </div>

      {/* Zeus Voice / Status Box */}
      <div className="w-full mt-2 p-2.5 rounded-xl bg-[#0B0814]/90 border border-amber-500/30 text-center relative z-10">
        <p className="text-xs font-semibold text-amber-200 italic leading-snug">
          "{quote}"
        </p>

        {isNearMiss && (
          <div className="mt-1.5 flex items-center justify-center space-x-1 text-[10px] font-bold text-amber-400">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Near-Miss Hook Terdeteksi (3 of 4 Scatters)</span>
          </div>
        )}

        {isWastedOrbTease && (
          <div className="mt-1.5 flex items-center justify-center space-x-1 text-[10px] font-bold text-red-400">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Wasted Multiplier Hook (500x Nol Pecahan)</span>
          </div>
        )}
      </div>
    </div>
  );
};
