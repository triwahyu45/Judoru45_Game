'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { 
  Coins, 
  Sparkles, 
  RotateCcw, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({ isOpen, onClose }) => {
  const { balance, claimFaucet, resetAllData } = useGame();
  const [selectedAmount, setSelectedAmount] = useState<number>(1_000_000);
  const [claimedAlert, setClaimedAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const faucetOptions = [
    { label: '+Rp 500.000', value: 500_000, desc: 'Starter Reload' },
    { label: '+Rp 1.000.000', value: 1_000_000, desc: 'Standard Faucet (Populer)', popular: true },
    { label: '+Rp 5.000.000', value: 5_000_000, desc: 'High Roller Simulation' },
    { label: '+Rp 10.000.000', value: 10_000_000, desc: 'Whale Experiment' },
  ];

  const handleClaim = () => {
    claimFaucet(selectedAmount);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#10B981', '#06B6D4', '#FEF08A'],
      });
    } catch {
      // safe fallback if confetti fails
    }
    setClaimedAlert(`Berhasil menambahkan ${formatIDR(selectedAmount)} ke saldo simulasi!`);
    setTimeout(() => {
      setClaimedAlert(null);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Yakin ingin mereset semua data, riwayat permainan, dan mengembalikan saldo ke Rp 500.000 default?')) {
      resetAllData();
      setClaimedAlert('Semua data simulasi telah di-reset ke nilai awal.');
      setTimeout(() => {
        setClaimedAlert(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0B111B] border border-[#1E2D44] rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2D44] bg-[#070D18]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Klaim Saldo Simulasi Gratis (Faucet)</h2>
              <p className="text-xs text-slate-400">Isi ulang kredit fiktif tanpa batas untuk pengujian</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Educational Warning Pill */}
        <div className="px-6 pt-5">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-300">Peringatan Integritas Edukasi:</span> Saldo ini{' '}
              <strong className="text-white">100% FIKTIF</strong>. Tidak ada uang riil yang disetor, dipertaruhkan, atau dapat dicairkan. Dilarang keras mempraktikkan perjudian di dunia nyata!
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center bg-[#05070B] p-3.5 rounded-xl border border-[#1E2D44]">
            <span className="text-sm text-slate-400">Saldo Virtual Saat Ini:</span>
            <span className="text-lg font-bold text-gold-gradient">{formatIDR(balance)}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pilih Jumlah Isi Ulang:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {faucetOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedAmount(opt.value)}
                  className={`relative p-3 rounded-xl text-left border transition-all ${
                    selectedAmount === opt.value
                      ? 'border-amber-400 bg-amber-500/20 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'border-[#1E2D44] bg-[#121B2A]/60 text-slate-300 hover:border-slate-600 hover:bg-[#121B2A]'
                  }`}
                >
                  {opt.popular && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500 text-black">
                      Disarankan
                    </span>
                  )}
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {claimedAlert && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{claimedAlert}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={handleClaim}
              className="w-full py-3.5 px-4 rounded-xl btn-gold flex items-center justify-center space-x-2 text-sm font-bold shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Klaim {formatIDR(selectedAmount)} Sekarang</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 hover:text-red-100 flex items-center justify-center space-x-2 text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Total Data & Saldo ke Awal</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-[#070D18] border-t border-[#1E2D44] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulasi Anti-Judi Judoru45</span>
          </span>
          <span>UNY — Tri Wahyu (2026)</span>
        </div>

      </div>
    </div>
  );
};

export default FaucetModal;
