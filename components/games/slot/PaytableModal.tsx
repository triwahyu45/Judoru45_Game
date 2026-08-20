'use client';

import React from 'react';
import { SLOT_SYMBOLS } from '@/lib/math/slotMath';
import { X, Info, Zap } from 'lucide-react';

interface PaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#0B111D] border-2 border-amber-500/50 p-6 shadow-2xl overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡👑</span>
            <h2 className="text-xl font-black text-white">Tabel Bayaran & Aturan Slot Olympus</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mechanism Explanation */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-amber-300">
            <Info className="w-4 h-4" />
            <span>Mekanisme Scatter Pays (Pay Anywhere 8+)</span>
          </div>
          <p>
            Simbol membayar di mana saja pada grid 6x5 jika muncul minimal 8 simbol yang sama. Tidak memerlukan garis lurus (payline). Simbol menang akan pecah (cascade) dan simbol baru akan jatuh dari atas!
          </p>
        </div>

        {/* Multiplier Orbs Section */}
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-purple-300">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Bola Multiplier Petir Zeus (2x - 500x)</span>
          </div>
          <p>
            Petir Zeus dapat menjatuhkan bola pengali acak mulai dari 2x hingga 500x. Total pengali akan dikalikan dengan total kemenangan pecahan pada putaran tersebut.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
              <span className="font-bold text-emerald-400 block">Hijau</span>
              <span className="text-[11px] text-slate-300">2x, 3x, 4x, 5x</span>
            </div>
            <div className="p-2 rounded-xl bg-sky-950/60 border border-sky-500/40 text-center">
              <span className="font-bold text-sky-400 block">Biru</span>
              <span className="text-[11px] text-slate-300">10x, 15x, 20x, 25x</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-center">
              <span className="font-bold text-purple-400 block">Ungu</span>
              <span className="text-[11px] text-slate-300">50x, 100x</span>
            </div>
            <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-center">
              <span className="font-bold text-yellow-400 block">Emas / Merah</span>
              <span className="text-[11px] text-slate-300">250x, 500x</span>
            </div>
          </div>
        </div>

        {/* Symbols Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(SLOT_SYMBOLS).map((sym) => (
            <div
              key={sym.id}
              className="p-3 rounded-2xl bg-[#111927] border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{sym.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{sym.name}</h4>
                  <span className="text-[10px] text-slate-400 capitalize">{sym.category} Tier</span>
                </div>
              </div>

              <div className="text-right text-[11px] font-bold space-y-0.5" style={{ color: sym.color }}>
                {sym.id === 'SYM_SCATTER' ? (
                  <>
                    <p>4: 3x + 15 FS</p>
                    <p>5: 5x + 15 FS</p>
                    <p>6+: 100x + 15 FS</p>
                  </>
                ) : (
                  <>
                    <p>8-9: {sym.payout8to9}x</p>
                    <p>10-11: {sym.payout10to11}x</p>
                    <p>12+: {sym.payout12Plus}x</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
