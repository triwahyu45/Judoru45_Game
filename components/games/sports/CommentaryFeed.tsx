'use client';

import React, { useEffect, useRef } from 'react';
import { Radio, AlertTriangle, ShieldCheck, PlayCircle, Tv, Flame } from 'lucide-react';
import { MatchEvent } from '@/lib/math/sportsMath';

interface CommentaryFeedProps {
  events: MatchEvent[];
  currentMinute: number;
}

export const CommentaryFeed: React.FC<CommentaryFeedProps> = ({ events, currentMinute }) => {
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Filter events up to current minute
  const visibleEvents = events.filter((e) => e.minute <= currentMinute);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleEvents.length]);

  return (
    <div className="rounded-3xl bg-[#0B111B] border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2 text-white font-bold text-sm uppercase tracking-wider">
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>KOMENTAR LANGSUNG (LIVE TEXT FEED)</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {visibleEvents.length} Peristiwa Tercatat
        </span>
      </div>

      {/* Scrolling Feed Body */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
        {visibleEvents.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-medium">
            Menunggu peluit kick-off ditiup wasit...
          </div>
        ) : (
          visibleEvents.map((evt, idx) => {
            const isGoal = evt.type === 'GOAL';
            const isVar = evt.type === 'VAR_CHECK';
            const isPenalty = evt.type === 'PENALTY';
            const isHeartbreak = evt.isHeartbreakEvent;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all animate-in fade-in slide-in-from-bottom-2 ${
                  isHeartbreak
                    ? 'bg-red-950/60 border-red-500 text-red-200 shadow-lg shadow-red-500/20 ring-1 ring-red-400'
                    : isGoal
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 font-bold'
                    : isVar
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                    : isPenalty
                    ? 'bg-red-950/40 border-red-500/40 text-red-200'
                    : 'bg-[#101827] border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  {/* Minute Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] shrink-0 ${
                      isHeartbreak
                        ? 'bg-red-600 text-white'
                        : isGoal
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {evt.minute}&apos;
                  </span>

                  {/* Text Content */}
                  <div className="flex-1 leading-relaxed">
                    <span>{evt.textIndonesian}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
};
