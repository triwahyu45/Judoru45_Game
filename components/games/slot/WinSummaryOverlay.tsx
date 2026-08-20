'use client';

import React from 'react';
import { formatIDR } from '@/lib/utils/currency';
import { Trophy, AlertCircle, Sparkles, X } from 'lucide-react';

interface WinSummaryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  payout: number;
  betAmount: number;
  totalMultiplier: number;
  isLDW: boolean;
  freeSpinsAwarded: number;
}

export const WinSummaryOverlay: React.FC<WinSummaryOverlayProps> = ({
  isOpen,
  onClose,
  payout,
  betAmount,
  totalMultiplier,
  isLDW,
  freeSpinsAwarded,
}) => {
  if (!isOpen) return null;

  const winRatio = betAmount > 0 ? payout / betAmount : 0;
  let title = 'MENANG!';
  let headerColor = 'from-amber-400 to-yellow-500';

  if (freeSpinsAwarded > 0) {
    title = '🔥 15 FREE SPINS ZEUS BONUS! 🔥';
    headerColor = 'from-purple-400 via-amber-400 to-yellow-300';
  } else if (winRatio >= 25) {
    title = '⚡ SENSATIONAL JACKPOT! ⚡';
    headerColor = 'from-yellow-300 via-amber-400 to-orange-500';
  } else if (winRatio >= 10) {
    title = '🏆 MEGA WIN! 🏆';
    headerColor = 'from-amber-400 to-yellow-400';
  } else if (winRatio >= 2) {
    title = '✨ BIG WIN! ✨';
    headerColor = 'from-emerald-400 to-cyan-400';
  } else if (isLDW) {
    title = '🎉 MENANG?! (Loss Disguised as Win)';
    headerColor = 'from-rose-400 to-amber-500';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#141B2D] via-[#0C111E] to-[#060911] border-2 border-amber-500/60 p-6 shadow-[0_0_60px_rgba(245,158,11,0.3)] text-center space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon with glowing pulse */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_30px_#F59E0B] animate-bounce">
          {freeSpinsAwarded > 0 ? (
            <Sparkles className="w-10 h-10" />
          ) : (
            <Trophy className="w-10 h-10" />
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-2xl sm:text-3xl font-black uppercase tracking-wider bg-gradient-to-r ${headerColor} bg-clip-text text-transparent`}
        >
          {title}
        </h2>

        {/* Payout Numbers */}
        <div className="p-4 rounded-2xl bg-[#080C14] border border-amber-500/30 space-y-2">
          <p className="text-xs text-slate-400">Total Kemenangan:</p>
          <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
            {formatIDR(payout)}
          </p>
          {totalMultiplier > 1 && (
            <p className="text-xs font-semibold text-emerald-400">
              Multiplier Petir Diterapkan: <span className="font-bold">{totalMultiplier}x</span>
            </p>
          )}
        </div>

        {/* Educational Warning for Losses Disguised as Wins (LDW) */}
        {isLDW && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-left space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-red-400">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Edukasi Psikologis: Losses Disguised as Wins</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Anda memasang taruhan <span className="font-bold text-white">{formatIDR(betAmount)}</span> namun hanya mendapatkan kembali <span className="font-bold text-amber-400">{formatIDR(payout)}</span>. Anda sebenarnya <span className="text-red-400 font-bold">RUGI {formatIDR(betAmount - payout)}</span>, namun efek visual & suara kasino merayakannya seolah Anda menang untuk memicu dopamin dan ilusi kemenangan!
            </p>
          </div>
        )}

        {/* Free Spins Alert */}
        {freeSpinsAwarded > 0 && (
          <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-200 font-semibold">
            ⚡ 4 Zeus Scatter terpicu! 15 Putaran Gratis siap dimainkan! Multiplier petir akan terakumulasi sepanjang ronde bonus.
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95"
        >
          Lanjut Bermain
        </button>
      </div>
    </div>
  );
};
