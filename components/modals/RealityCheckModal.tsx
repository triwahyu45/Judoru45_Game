'use client';

import React from 'react';
import {
  AlertOctagon,
  TrendingDown,
  X,
  Sparkles,
  LifeBuoy,
  ShieldAlert,
  ArrowRight,
  Brain,
  Scale,
} from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { calculateLossEquivalents } from '@/lib/utils/lossConverter';

interface RealityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealityCheckModal: React.FC<RealityCheckModalProps> = ({ isOpen, onClose }) => {
  const { totalLost, totalWagered, claimFaucet } = useGame();

  if (!isOpen) return null;

  const equivalents = calculateLossEquivalents(totalLost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0B111B] border-2 border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.3)] relative overflow-hidden space-y-6">
        
        {/* Top Warning Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-600 animate-pulse" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#05070B] border border-[#1E2D44] text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 mx-auto flex items-center justify-center shadow-lg animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40">
              🚨 REALITY CHECK &bull; FAKTA DI BALIK LAYAR
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Saldo Habis? Kamu Baru Saja <span className="text-red-400">Rungkad Total!</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Di web ini uangmu aman karena 100% virtual fiktif. Tapi bayangkan jika ini terjadi dengan uang aslimu di situs judi online sungguhan!
            </p>
          </div>
        </div>

        {/* Real Economic Loss Box */}
        <div className="p-4 rounded-2xl bg-[#05070B] border border-red-500/30 space-y-3">
          <div className="flex justify-between items-center border-b border-[#1E2D44] pb-2 text-xs">
            <span className="text-slate-400">Total Virtual Coins Terkuras:</span>
            <span className="font-mono font-bold text-red-400 text-sm">{formatIDR(totalLost)}</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Jika Ini Uang Nyata, Kerugianmu Setara Dengan:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {equivalents.slice(0, 4).map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-[#0B111B] border border-[#1E2D44] flex items-center justify-between">
                  <span className="text-slate-300 text-[11px] truncate max-w-[120px]">{item.name}</span>
                  <span className="font-black text-amber-300 font-mono">{item.formattedCount}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The House Algorithm Secret */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-300 font-bold">
            <Brain className="w-4 h-4 text-amber-400" />
            <span>Mengapa Bandar Selalu Menang?</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Semua janji manis <em>&quot;Pasti Cuan&quot;</em>, <em>&quot;Pola Gacor Petir&quot;</em>, dan <em>&quot;RTP 98%&quot;</em> hanyalah manipulasi psikologis (*Near-Miss & Addiction Trap*). Bandar memegang kendali penuh algoritma di balik layar untuk memastikan pemain akan selalu kalah dan bangkrut.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              claimFaucet(500_000);
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-xl btn-gold text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Isi Ulang Saldo Virtual Gratis (+Rp 500.000)</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#05070B] hover:bg-[#121B2A] border border-[#1E2D44] text-slate-300 text-xs font-semibold transition"
          >
            Tutup &amp; Lanjutkan Eksperimen
          </button>
        </div>

      </div>
    </div>
  );
};
