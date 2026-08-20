'use client';

import React from 'react';
import { SliderDirection } from '@/lib/math/diceMath';

interface Dice3DProps {
  diceValues: [number, number];
  isRolling: boolean;
  mode: 'SLIDER' | 'SUM';
  rolledSliderValue?: number | null;
  targetSliderValue?: number;
  sliderDirection?: SliderDirection;
  isWin?: boolean | null;
  isNearMiss?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({
  diceValues,
  isRolling,
  mode,
  rolledSliderValue,
  targetSliderValue = 50,
  sliderDirection = 'OVER',
  isWin,
  isNearMiss,
}) => {
  const [d1, d2] = diceValues;

  // Render Pips on a standard 6-sided die face
  const renderPips = (value: number) => {
    switch (value) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-rose-600 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner self-start" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner self-start" />
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner self-center" />
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-2 gap-2 place-items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full relative p-2">
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-1.5 gap-1 place-items-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-[#080D15] border border-[#1E2D44] shadow-2xl flex flex-col items-center justify-center gap-6">
      
      {/* Slider Mode Big Gauge Display */}
      {mode === 'SLIDER' && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 mb-1">
            Hasil Angka Dadu (0.00 - 100.00)
          </div>
          <div
            className={`text-5xl sm:text-6xl font-black tracking-tight transition-all duration-300 font-mono ${
              isRolling
                ? 'text-amber-400 animate-pulse'
                : isWin === true
                ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                : isNearMiss
                ? 'text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                : 'text-white'
            }`}
          >
            {isRolling
              ? (Math.random() * 100).toFixed(2)
              : rolledSliderValue !== undefined && rolledSliderValue !== null
              ? rolledSliderValue.toFixed(2)
              : '50.00'}
          </div>

          {/* Near Miss Badge */}
          {isNearMiss && !isRolling && (
            <div className="mt-2 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 font-bold text-xs flex items-center gap-1.5 animate-bounce shadow-lg">
              <span>💔 HAMPIR MENANG (NEAR-MISS)!</span>
            </div>
          )}
        </div>
      )}

      {/* 3D Dice Display Arena */}
      <div className="flex items-center justify-center gap-8 py-2">
        {/* Die 1 */}
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-slate-300 border-2 border-slate-400 shadow-[0_12px_24px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center transition-all transform duration-300 select-none ${
            isRolling ? 'animate-spin scale-110' : 'hover:scale-105'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {renderPips(isRolling ? Math.floor(Math.random() * 6) + 1 : d1)}
        </div>

        {/* Die 2 */}
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-slate-300 border-2 border-slate-400 shadow-[0_12px_24px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center transition-all transform duration-300 select-none ${
            isRolling ? 'animate-spin scale-110' : 'hover:scale-105'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {renderPips(isRolling ? Math.floor(Math.random() * 6) + 1 : d2)}
        </div>
      </div>

      {/* Sum Mode Total Display */}
      {mode === 'SUM' && (
        <div className="flex flex-col items-center">
          <div className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400">
            Total Jumlah Dadu
          </div>
          <div
            className={`text-3xl sm:text-4xl font-black ${
              isRolling ? 'text-amber-400' : isWin ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {isRolling ? '?' : d1 + d2}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dice3D;
