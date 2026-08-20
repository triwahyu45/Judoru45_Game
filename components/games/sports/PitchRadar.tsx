'use client';

import React from 'react';
import { SportsTeam, MatchEventType } from '@/lib/math/sportsMath';

interface PitchRadarProps {
  homeTeam: SportsTeam;
  awayTeam: SportsTeam;
  ballX: number; // 0 to 100
  ballY: number; // 0 to 100
  activeEventType?: MatchEventType;
  activeTeam?: 'HOME' | 'AWAY' | 'NEUTRAL';
  isSimulating: boolean;
}

export const PitchRadar: React.FC<PitchRadarProps> = ({
  homeTeam,
  awayTeam,
  ballX,
  ballY,
  activeEventType,
  activeTeam,
  isSimulating,
}) => {
  const isGoal = activeEventType === 'GOAL';
  const isDangerous = activeEventType === 'DANGEROUS_ATTACK' || activeEventType === 'PENALTY';

  return (
    <div className="relative w-full rounded-3xl bg-[#091510] border border-emerald-500/30 p-4 md:p-6 shadow-2xl overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/40 text-xs">
        <div className="flex items-center space-x-2 font-bold text-emerald-300 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>RADAR TAKTIKAL 2D PITCH</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: homeTeam.primaryColor }} />
            <span className="text-slate-300 font-semibold">{homeTeam.shortName} (Menyerang ke Kanan &rarr;)</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: awayTeam.primaryColor }} />
            <span className="text-slate-300 font-semibold">(&larr; Menyerang ke Kiri) {awayTeam.shortName}</span>
          </span>
        </div>
      </div>

      {/* 2D Football Pitch SVG Canvas */}
      <div className="relative w-full aspect-[2/1] rounded-2xl bg-gradient-to-b from-[#0e2a1b] via-[#091d12] to-[#07170e] border-2 border-emerald-500/40 shadow-inner overflow-hidden flex items-center justify-center">
        {/* Grass Stripes Pattern */}
        <div className="absolute inset-0 grid grid-cols-8 opacity-20 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={i % 2 === 0 ? 'bg-emerald-900/40' : 'bg-emerald-800/10'} />
          ))}
        </div>

        {/* Pitch Tactical Markings (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full stroke-emerald-400/50 fill-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          strokeWidth="0.6"
        >
          {/* Pitch Outer Boundary */}
          <rect x="2" y="2" width="96" height="56" rx="1" />

          {/* Halfway Line & Center Circle */}
          <line x1="50" y1="2" x2="50" y2="58" />
          <circle cx="50" cy="30" r="8" />
          <circle cx="50" cy="30" r="0.8" className="fill-emerald-400/70" />

          {/* Left Penalty Box (Home Goal Area) */}
          <rect x="2" y="14" width="16" height="32" />
          <rect x="2" y="21" width="6" height="18" />
          <path d="M 18,24 A 6,6 0 0,1 18,36" />
          <circle cx="12" cy="30" r="0.6" className="fill-emerald-400/70" />
          {/* Left Goalpost */}
          <rect x="0" y="25" width="2" height="10" className="fill-white/40" />

          {/* Right Penalty Box (Away Goal Area) */}
          <rect x="82" y="14" width="16" height="32" />
          <rect x="92" y="21" width="6" height="18" />
          <path d="M 82,24 A 6,6 0 0,0 82,36" />
          <circle cx="88" cy="30" r="0.6" className="fill-emerald-400/70" />
          {/* Right Goalpost */}
          <rect x="98" y="25" width="2" height="10" className="fill-white/40" />

          {/* Corner Arcs */}
          <path d="M 2,5 A 3,3 0 0,0 5,2" />
          <path d="M 98,5 A 3,3 0 0,1 95,2" />
          <path d="M 2,55 A 3,3 0 0,1 5,58" />
          <path d="M 98,55 A 3,3 0 0,0 95,58" />
        </svg>

        {/* Goal Explosion Light Effect */}
        {isGoal && (
          <div className="absolute inset-0 bg-yellow-400/20 backdrop-blur-[1px] animate-pulse pointer-events-none flex items-center justify-center">
            <div className="text-3xl sm:text-5xl font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] animate-bounce font-mono">
              ⚽ GOOOLLLL!!
            </div>
          </div>
        )}

        {/* Animated Moving Ball Position Dot */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 flex items-center justify-center z-10"
          style={{ left: `${ballX}%`, top: `${ballY}%` }}
        >
          {/* Pulse Ripple if dangerous attack */}
          {isDangerous && (
            <div className="absolute w-10 h-10 rounded-full bg-red-500/50 animate-ping" />
          )}
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        </div>

        {/* Attack Vector Indicator */}
        {isSimulating && activeTeam && activeTeam !== 'NEUTRAL' && (
          <div
            className="absolute bottom-2 px-3 py-1 rounded-full bg-black/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center space-x-1"
          >
            <span>Serangan Aktif: {activeTeam === 'HOME' ? homeTeam.name : awayTeam.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
