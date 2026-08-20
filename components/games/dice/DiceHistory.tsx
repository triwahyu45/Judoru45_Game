'use client';

import React from 'react';
import { DiceRollResult } from '@/lib/math/diceMath';
import { formatIDR } from '@/lib/utils/currency';
import { History, AlertCircle, HeartCrack, CheckCircle, XCircle } from 'lucide-react';

interface DiceHistoryProps {
  history: DiceRollResult[];
  lastResult?: DiceRollResult | null;
}

export const DiceHistory: React.FC<DiceHistoryProps> = ({
  history,
  lastResult,
}) => {
  const nearMissCount = history.filter((r) => r.isNearMiss).length;

  return (
    <div className="w-full space-y-4">
      {/* 1. Rigged Educational Alert if last result was manipulated */}
      {lastResult?.riggedApplied && (
        <div className="p-4 rounded-3xl bg-purple-950/80 border border-purple-500/60 shadow-xl flex items-center gap-3 animate-fade-in text-xs text-purple-200">
          <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <span className="font-bold text-purple-300">Deteksi Manipulasi Rigged Bandar: </span>
            <span className="text-purple-200/90">{lastResult.riggedReason || 'Near-miss injection active'}</span>
          </div>
        </div>
      )}

      {/* 2. Roll History Feed & Stats */}
      <div className="p-4 rounded-3xl bg-[#080D15] border border-[#1E2D44] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            <History className="w-4 h-4 text-amber-400" />
            <span>Riwayat Lemparan Dadu (15 Terakhir)</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total Near-Miss:</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-600/50 text-rose-300 font-bold">
              {nearMissCount}x
            </span>
          </div>
        </div>

        {/* History Stream List */}
        <div className="flex gap-2 overflow-x-auto py-1">
          {history.length === 0 ? (
            <span className="text-xs text-slate-500 italic py-2">Belum ada putaran dadu</span>
          ) : (
            history.slice(0, 15).map((item, idx) => (
              <div
                key={`dice-hist-${idx}-${item.rolledValue}`}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-between min-w-[105px] border shrink-0 transition-all ${
                  item.isWin
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : item.isNearMiss
                    ? 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'bg-[#060A11] border-slate-800 text-slate-400'
                }`}
              >
                {/* Result Value */}
                <div className="flex items-center gap-1 font-mono font-black text-sm">
                  {item.isWin ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : item.isNearMiss ? (
                    <HeartCrack className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>{item.mode === 'SLIDER' ? item.rolledValue.toFixed(2) : item.rolledValue}</span>
                </div>

                {/* Target Subtitle */}
                <div className="text-[10px] text-slate-400 mt-1">
                  Target: {item.direction ? (item.direction === 'OVER' ? '>' : '<') : ''}
                  {item.target}
                </div>

                {/* Status Badge */}
                <div className="mt-1 text-[9px] font-bold uppercase">
                  {item.isWin ? (
                    <span className="text-emerald-400">+{formatIDR(item.payout)}</span>
                  ) : item.isNearMiss ? (
                    <span className="text-rose-400">Near-Miss!</span>
                  ) : (
                    <span className="text-slate-500">Kalah</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Educational Callout: The Near-Miss Trap */}
      <div className="p-3.5 rounded-2xl bg-[#07131F] border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-cyan-300">Edukasi Psikologi — Jebakan &quot;Near-Miss Effect&quot; (Hampir Menang):</span>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Penelitian neurosains membuktikan bahwa hasil dadu yang meleset hanya selisih 0.01 - 0.50 poin memicu pelepasan hormon dopamin di otak sebesar ketika pemain benar-benar menang. Bandar judi online sengaja memprogram algoritma agar sering memunculkan angka &quot;nyaris tembus&quot; untuk memanipulasi pemain agar terus melipatgandakan taruhan (loss chasing).
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiceHistory;
