'use client';

import React from 'react';
import { Trophy, Clock, Flame, ShieldAlert } from 'lucide-react';
import { SportsTeam } from '@/lib/math/sportsMath';

interface ScoreboardTickerProps {
  homeTeam: SportsTeam;
  awayTeam: SportsTeam;
  currentMinute: number;
  score: [number, number];
  isSimulating: boolean;
  isFinished: boolean;
  stadium: string;
}

export const ScoreboardTicker: React.FC<ScoreboardTickerProps> = ({
  homeTeam,
  awayTeam,
  currentMinute,
  score,
  isSimulating,
  isFinished,
  stadium,
}) => {
  const isExtraTime = currentMinute > 90;
  const extraMinutes = currentMinute - 90;

  const minuteDisplay = isFinished
    ? 'FT (90\')'
    : isExtraTime
    ? `90+${extraMinutes}'`
    : `${currentMinute}'`;

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#090D18] to-[#05070B] border border-blue-500/30 p-6 shadow-2xl space-y-4">
      {/* Stadium & Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-300">{stadium}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isSimulating
                ? 'bg-red-500 animate-ping'
                : isFinished
                ? 'bg-slate-500'
                : 'bg-emerald-400'
            }`}
          />
          <span className="font-mono font-bold text-slate-200 uppercase">
            {isFinished ? 'PERTANDINGAN SELESAI' : isSimulating ? 'LIVE SIMULASI' : 'STANDBY KICK-OFF'}
          </span>
        </div>
      </div>

      {/* Main Scoreboard Banner */}
      <div className="grid grid-cols-12 items-center gap-4 py-2">
        {/* Home Team */}
        <div className="col-span-4 sm:col-span-4 flex items-center justify-end space-x-3 text-right">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">{homeTeam.name}</h3>
            <span className="text-[11px] text-slate-400 font-mono">Kandang (HOME)</span>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-lg border border-white/20 shrink-0"
            style={{ backgroundColor: homeTeam.primaryColor }}
          >
            {homeTeam.shortName}
          </div>
        </div>

        {/* Live Score & Clock Center Box */}
        <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center">
          {/* Digital Score */}
          <div className="px-5 py-2 rounded-2xl bg-[#060910] border border-blue-500/40 shadow-inner flex items-center space-x-4">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {score[0]}
            </span>
            <span className="text-xl font-black text-slate-600">:</span>
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">
              {score[1]}
            </span>
          </div>

          {/* Animated Minute Clock */}
          <div className="mt-2 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span className={isExtraTime ? 'text-red-400 animate-pulse font-black' : ''}>
              {minuteDisplay}
            </span>
          </div>
        </div>

        {/* Away Team */}
        <div className="col-span-4 sm:col-span-4 flex items-center justify-start space-x-3 text-left">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-lg border border-white/20 shrink-0"
            style={{ backgroundColor: awayTeam.primaryColor }}
          >
            {awayTeam.shortName}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">{awayTeam.name}</h3>
            <span className="text-[11px] text-slate-400 font-mono">Tandang (AWAY)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
