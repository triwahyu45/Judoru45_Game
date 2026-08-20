'use client';

import React from 'react';
import { X, Trophy, AlertTriangle, ShieldAlert, CheckCircle2, TrendingDown } from 'lucide-react';
import { UserSportsBet, MatchFixture } from '@/lib/math/sportsMath';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

interface SettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: MatchFixture;
  bet: UserSportsBet;
  finalScore: [number, number];
  isWin: boolean;
  payout: number;
  netProfit: number;
  isHeartbreakTriggered: boolean;
  heartbreakMessage?: string;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  isOpen,
  onClose,
  fixture,
  bet,
  finalScore,
  isWin,
  payout,
  netProfit,
  isHeartbreakTriggered,
  heartbreakMessage,
}) => {
  if (!isOpen) return null;

  const home = fixture.homeTeam;
  const away = fixture.awayTeam;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B111B] border border-blue-500/40 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isWin
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {isWin ? <CheckCircle2 className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Hasil Akhir &amp; Penyelesaian Taruhan</h2>
              <p className="text-xs text-slate-400">{fixture.stadium}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              synthEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Final Score Display */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#101A2E] to-[#080E1A] border border-slate-800 text-center space-y-3 shadow-inner">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            SKOR AKHIR (FULL TIME)
          </div>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-right">
              <div className="text-base font-bold text-white">{home.name}</div>
              <div className="text-xs text-slate-400 font-mono">Home</div>
            </div>

            <div className="px-5 py-2 rounded-2xl bg-[#05070B] border border-blue-500/40 text-3xl sm:text-4xl font-black font-mono text-white shadow-lg">
              {finalScore[0]} : {finalScore[1]}
            </div>

            <div className="text-left">
              <div className="text-base font-bold text-white">{away.name}</div>
              <div className="text-xs text-slate-400 font-mono">Away</div>
            </div>
          </div>
        </div>

        {/* Bet Outcome Summary Card */}
        <div className="p-4 rounded-2xl bg-[#080D17] border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Pilihan Taruhan Anda:</span>
            <span className="font-bold text-white">{bet.selectionLabel}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Nominal Taruhan:</span>
            <span className="font-mono text-slate-300">{formatIDR(bet.wagerAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Odds Multiplier:</span>
            <span className="font-mono text-amber-400">x{bet.odds.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800 text-sm">
            <span>Hasil Taruhan:</span>
            <span
              className={`font-mono font-black ${
                isWin ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isWin ? `MENANG (+${formatIDR(payout)})` : 'KALAH (HANGUS)'}
            </span>
          </div>
        </div>

        {/* Heartbreak Engine Alert */}
        {isHeartbreakTriggered && heartbreakMessage && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 space-y-1.5 text-xs text-red-200">
            <div className="flex items-center space-x-2 font-black text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>90+ MINUTE RIGGED HEARTBREAK ENGINE TERPICU!</span>
            </div>
            <p className="text-red-300/90 leading-relaxed">{heartbreakMessage}</p>
          </div>
        )}

        {/* Educational Sportsbook Vigorish Breakdown */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-blue-300 font-bold">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span>Edukasi Sportsbook: Margin Bandar (Vigorish / Overround)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Pada setiap pertandingan olahraga, bandar (bookmaker) selalu menyuntikkan margin keuntungan tersembunyi (vigorish 6% - 10%). Total probabilitas implisit dari odds selalu bernilai lebih dari 100% (misal 108%), sehingga secara matematis bandar selalu untung bagaimanapun hasil pertandingan berakhir.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              synthEngine.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg"
          >
            Lanjut Taruhan Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};
