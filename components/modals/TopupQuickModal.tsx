'use client';

import React from 'react';
import {
  Sparkles,
  Zap,
  CreditCard,
  X,
  AlertCircle,
  TrendingDown,
  Coins,
} from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';

interface TopupQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopupQuickModal: React.FC<TopupQuickModalProps> = ({ isOpen, onClose }) => {
  const { balance, claimFaucet, currentUser } = useGame();

  if (!isOpen) return null;

  const handleInstantTopup = (amount: number) => {
    claimFaucet(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0B111B] border border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] p-6 space-y-6 relative overflow-hidden">
        
        {/* Top Gold Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 animate-pulse" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2D44] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Isi Ulang Saldo Kilat</h3>
              <p className="text-xs text-slate-400">Pilih modal virtual tambahan gratis untuk lanjut main</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#05070B] border border-[#1E2D44] text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Status */}
        <div className="p-3.5 rounded-2xl bg-[#05070B] border border-[#1E2D44] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">Sisa Saldo Saat Ini:</span>
          <span className={`font-mono font-black text-sm ${balance <= 0 ? 'text-red-400' : 'text-amber-400'}`}>
            {formatIDR(balance)}
          </span>
        </div>

        {/* Instant Top-up Options */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-300">Pilih Nominal Top-Up Virtual:</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { amount: 100_000, label: 'Rp 100.000', note: 'Modal Santai' },
              { amount: 250_000, label: 'Rp 250.000', note: 'Modal Standar' },
              { amount: 500_000, label: 'Rp 500.000', note: 'Modal Populer' },
              { amount: 1_000_000, label: 'Rp 1.000.000', note: 'High Roller' },
            ].map((opt) => (
              <button
                key={opt.amount}
                type="button"
                onClick={() => handleInstantTopup(opt.amount)}
                className="p-3.5 rounded-2xl bg-[#05070B] border border-[#1E2D44] hover:border-amber-400 hover:bg-[#121B2A] text-left transition group space-y-1 shadow-md"
              >
                <div className="text-xs font-black text-white group-hover:text-amber-300 transition">
                  {opt.label}
                </div>
                <div className="text-[10px] text-amber-400/80 font-semibold">{opt.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-slate-300 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            100% Saldo Simulasi Fiktif Gratis tanpa memerlukan transfer uang nyata sedikit pun.
          </p>
        </div>

      </div>
    </div>
  );
};
