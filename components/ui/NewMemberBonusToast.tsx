'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, Sparkles, X, Flame, ArrowRight } from 'lucide-react';
import { formatIDR } from '@/lib/utils/currency';
import { useGame } from '@/lib/context/GameContext';

export const NewMemberBonusToast: React.FC = () => {
  const { currentUser, balance } = useGame();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast if user has 0 rounds played and hasn't dismissed it yet
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('judoru45_bonus_toast_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('judoru45_bonus_toast_dismissed', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full animate-slideInRight">
      <div className="p-4 rounded-2xl bg-[#0B111B]/95 border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.4)] backdrop-blur-md relative overflow-hidden space-y-3">
        
        {/* Animated Gold Header Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg bg-[#05070B] border border-[#1E2D44] text-slate-400 hover:text-white transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0 animate-bounce">
            <Gift className="w-5 h-5" />
          </div>
          
          <div className="space-y-1">
            <div className="text-[10px] font-black text-amber-300 tracking-wider uppercase flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>BONUS NEW MEMBER CAIR!</span>
            </div>
            <h4 className="text-sm font-black text-white leading-tight">
              Saldo Gratis Rp 100.000 Aktif!
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Selamat datang! Saldo virtual Rp 100.000 sudah masuk ke akunmu dan bisa langsung dimainkan di semua game.
            </p>
          </div>
        </div>

        <div className="pt-1 flex gap-2">
          <Link
            href="/slot"
            onClick={handleDismiss}
            className="flex-1 py-2 px-3 rounded-xl btn-gold text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-md hover:scale-102 transition"
          >
            <Flame className="w-3.5 h-3.5 text-black fill-black" />
            <span>Gas Mainkan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-[#05070B] border border-[#1E2D44] text-slate-300 text-xs font-semibold hover:text-white transition"
          >
            Nanti Saja
          </button>
        </div>

      </div>
    </div>
  );
};
