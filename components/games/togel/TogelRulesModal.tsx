'use client';

import React from 'react';
import { X, ShieldAlert, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TOGEL_RULES, SHIO_LIST } from '@/lib/math/togelMath';
import { synthEngine } from '@/lib/sound/synthEngine';

interface TogelRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TogelRulesModal: React.FC<TogelRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B111B] border border-purple-500/40 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                Struktur Matematika &amp; Manipulasi Togel 4D
              </h2>
              <p className="text-xs text-slate-400">
                Transparansi Payout, Diskon Semu, &amp; House Edge Bandar Togel Online
              </p>
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

        {/* Educational Warning */}
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-red-300 font-bold">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Fakta Pahit: House Edge Terbesar di Dunia Perjudian (29% - 70%)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Berbeda dari kasino barat seperti Roulette (House edge 2.7%) atau Blackjack (0.5%), Togel di Indonesia memiliki margin keuntungan bandar yang sangat predatorik (29% hingga 69.9%). Diskon besar (hingga 66%) adalah trik psikologis untuk membuat pemain merasa &ldquo;hemat&rdquo;, padahal probabilitas menang 4D hanyalah 1 : 10.000 (0.01%).
          </p>
        </div>

        {/* Payout & Discount Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Tabel Pasaran, Diskon, dan Margin Bandar
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121A2A] text-slate-300 border-b border-slate-800 font-bold">
                <tr>
                  <th className="p-3">Tipe Pasaran</th>
                  <th className="p-3">Peluang Menang</th>
                  <th className="p-3">Diskon Pemain</th>
                  <th className="p-3">Hadiah (Payout)</th>
                  <th className="p-3">House Edge Bandar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {Object.values(TOGEL_RULES).map((r) => (
                  <tr key={r.type} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-white font-sans">{r.name}</td>
                    <td className="p-3 text-slate-400">{r.winProbabilityText}</td>
                    <td className="p-3 text-emerald-400 font-bold">-{r.discountPercent}%</td>
                    <td className="p-3 text-purple-300 font-bold">{r.payoutMultiplier}x</td>
                    <td className="p-3 text-red-400 font-bold">{r.houseEdgePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rigged Illusion Breakdown */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-purple-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-purple-400" />
            <span>Bagaimana Bandar Mengakali Undian (Algoritma Rigged)</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400">
            <li>
              <strong>Prize Pool Liability Minimizer:</strong> Sebelum angka dikeluarkan, server bandar menghitung total kewajiban bayar pada seluruh 10.000 kombinasi, lalu memilih nomor dengan total pembayaran terendah (sering kali Rp 0).
            </li>
            <li>
              <strong>3-out-of-4 Near-Miss Illusion:</strong> Bandar sengaja mengeluarkan 3 angka awal yang persis sama dengan tiket Anda (AS, KOP, KEPALA), namun memelesetkan angka terakhir (EKOR). Otak menginterpretasikannya sebagai &ldquo;hampir menang&rdquo;, merangsang dopamin untuk terus membeli tiket.
            </li>
          </ul>
        </div>

        {/* Close button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              synthEngine.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
