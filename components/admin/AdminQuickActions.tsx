'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  RotateCcw,
  PlusCircle,
  Coins,
  TrendingUp,
  TrendingDown,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { ForcedOutcomeType } from '@/lib/math/riggedEngine';
import { formatIDR } from '@/lib/utils/currency';
import { UserStats } from '@/lib/context/GameContext';

interface AdminQuickActionsProps {
  forcedOutcome: ForcedOutcomeType;
  stats: UserStats;
  onSetForcedOutcome: (outcome: ForcedOutcomeType) => void;
  onClaimFaucet: (amount: number) => void;
  onResetAllData: () => void;
  onToast: (message: string) => void;
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  forcedOutcome,
  stats,
  onSetForcedOutcome,
  onClaimFaucet,
  onResetAllData,
  onToast,
}) => {
  const [customAmount, setCustomAmount] = useState<string>('5000000');

  const houseNetProfit = Math.max(0, stats.totalWagered - stats.totalWon);
  const houseWinRate = stats.roundsPlayed > 0
    ? Math.round(((stats.roundsPlayed - (stats.totalWon > 0 ? (stats.totalWon / Math.max(1, stats.totalWagered) * stats.roundsPlayed) : 0)) / stats.roundsPlayed) * 100)
    : 0;

  const handleCustomInject = () => {
    const num = parseInt(customAmount.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      onClaimFaucet(num);
      onToast(`Injeksi Saldo kustom ${formatIDR(num)} berhasil!`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Manual Forced Next Outcome */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Lock className="w-4 h-4 text-red-400" />
              <span>Paksa Hasil Putaran Berikutnya (Forced Next Outcome)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Mengunci hasil 1 putaran berikutnya secara absolut, kemudian otomatis kembali ke mode normal.
            </p>
          </div>

          {forcedOutcome !== 'auto' && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              TERKUNCI: {forcedOutcome.toUpperCase()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Auto */}
          <button
            type="button"
            onClick={() => {
              onSetForcedOutcome('auto');
              onToast('Mode hasil dikembalikan ke: Otomatis (Ikuti Profil/RTP)');
            }}
            className={`p-3.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
              forcedOutcome === 'auto'
                ? 'bg-slate-800 border-slate-500 text-white shadow-md ring-1 ring-slate-400'
                : 'bg-[#05070B] border-[#1E2D44] text-slate-400 hover:text-white hover:bg-[#121B2A]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Otomatis (Ikuti Profil/RTP)</span>
          </button>

          {/* Force Win */}
          <button
            type="button"
            onClick={() => {
              onSetForcedOutcome('force_win');
              onToast('1 Putaran Berikutnya DIKUNCI: PASTI MENANG!');
            }}
            className={`p-3.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
              forcedOutcome === 'force_win'
                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                : 'bg-[#05070B] border-emerald-900/40 text-emerald-400 hover:bg-emerald-950/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Paksa Menang (Force Win)</span>
          </button>

          {/* Force Loss */}
          <button
            type="button"
            onClick={() => {
              onSetForcedOutcome('force_loss');
              onToast('1 Putaran Berikutnya DIKUNCI: PASTI KALAH (WIPEOUT)!');
            }}
            className={`p-3.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
              forcedOutcome === 'force_loss'
                ? 'bg-red-950/60 border-red-400 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-1 ring-red-400'
                : 'bg-[#05070B] border-red-900/40 text-red-400 hover:bg-red-950/30'
            }`}
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>Paksa Kalah (Force Loss)</span>
          </button>

        </div>
      </div>

      {/* 2. Balance Injection & Faucet Overrides */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Injeksi Saldo Simulasi Fiktif</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClaimFaucet(1_000_000);
              onToast('Injeksi +Rp 1.000.000 sukses!');
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition"
          >
            + Rp 1.000.000
          </button>

          <button
            type="button"
            onClick={() => {
              onClaimFaucet(10_000_000);
              onToast('Injeksi +Rp 10.000.000 sukses!');
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition"
          >
            + Rp 10.000.000
          </button>

          <button
            type="button"
            onClick={() => {
              onClaimFaucet(100_000_000);
              onToast('Injeksi +Rp 100.000.000 sukses!');
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition"
          >
            + Rp 100.000.000
          </button>

          <button
            type="button"
            onClick={() => {
              onClaimFaucet(500_000);
              onToast('Injeksi +Rp 500.000 sukses!');
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold transition"
          >
            + Rp 500.000
          </button>
        </div>

        {/* Custom Injection */}
        <div className="pt-2 flex gap-2">
          <input
            type="number"
            placeholder="Nominal kustom IDR..."
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 py-2 px-3 rounded-xl bg-[#05070B] border border-[#1E2D44] text-xs text-white outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="button"
            onClick={handleCustomInject}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs hover:brightness-110 transition"
          >
            Injeksi Kustom
          </button>
        </div>
      </div>

      {/* 3. System Reset Controls */}
      <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-4">
        <h2 className="text-sm font-bold text-red-300 uppercase tracking-wider flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>Zona Bahaya & Reset Sistem Total</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Mereset seluruh saldo ke Rp 500.000, menghapus seluruh riwayat putaran transaksi, dan mengembalikan algoritma ke setelan awal.
          </p>

          <button
            type="button"
            onClick={() => {
              if (confirm('Yakin ingin mereset seluruh data simulasi, saldo, dan riwayat transaksi ke nilai awal?')) {
                onResetAllData();
                onToast('Seluruh data simulasi berhasil direset total!');
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-red-600/30 transition whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Total Semua Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminQuickActions;
