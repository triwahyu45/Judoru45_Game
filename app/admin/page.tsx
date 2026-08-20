'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sliders,
  ShieldAlert,
  ArrowLeft,
  Flame,
  AlertTriangle,
  RotateCcw,
  Zap,
  Lock,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Eye,
  Info,
  Brain,
  FileSpreadsheet,
  Coins,
  LogOut,
  Layers,
  Activity,
} from 'lucide-react';
import { useGame, RiggedProfile, ForcedOutcome } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { AdminPinGate } from '@/components/admin/AdminPinGate';
import { AdminRtpControl } from '@/components/admin/AdminRtpControl';
import { AdminProfileSwitcher } from '@/components/admin/AdminProfileSwitcher';
import { AdminLossConverter } from '@/components/admin/AdminLossConverter';
import { AdminPsychCodex } from '@/components/admin/AdminPsychCodex';
import { AdminAuditLedger } from '@/components/admin/AdminAuditLedger';
import { AdminQuickActions } from '@/components/admin/AdminQuickActions';
import { RiggedProfileType, ForcedOutcomeType } from '@/lib/math/riggedEngine';

export default function AdminPage() {
  const {
    adminConfig,
    updateAdminConfig,
    balance,
    stats,
    transactions,
    claimFaucet,
    resetAllData,
  } = useGame();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'loss' | 'psychology' | 'audit'>('controls');
  const [notification, setNotification] = useState<string | null>(null);

  // Check session storage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const isAuth = sessionStorage.getItem('judoru45_admin_authenticated');
        if (isAuth === 'true') {
          setIsAuthenticated(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUnlock = () => {
    setIsAuthenticated(true);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('judoru45_admin_authenticated', 'true');
      }
    } catch {
      // ignore
    }
    showToast('Akses Master Control Admin Diberikan!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('judoru45_admin_authenticated');
      }
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // If not authenticated, render PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B111B] border border-[#1E2D44] text-slate-300 hover:text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Lobby Utama</span>
          </Link>
        </div>
        <AdminPinGate onUnlock={handleUnlock} />
      </div>
    );
  }

  const houseNetProfit = Math.max(0, stats.totalWagered - stats.totalWon);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header & Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E2D44] pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#0B111B] border border-[#1E2D44] text-slate-300 hover:text-white transition"
              title="Kembali ke Lobby"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Panel Master Admin (Algoritma Bandar)
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Live Master Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat manipulasi parameter probabilitas untuk membuktikan rekayasa matematis di balik judi online.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Logout */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
            title="Kunci Kembali Panel Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kunci Panel</span>
          </button>
        </div>
      </div>

      {/* Live System Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">RTP Aktif</span>
          <div className="text-lg font-black font-mono text-purple-400">{adminConfig.globalRtp}%</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">House Edge</span>
          <div className="text-lg font-black font-mono text-red-400">{100 - adminConfig.globalRtp}%</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Saldo Pemain</span>
          <div className="text-lg font-black font-mono text-gold-gradient">{formatIDR(balance)}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Taruhan</span>
          <div className="text-lg font-black font-mono text-slate-200">{formatIDR(stats.totalWagered)}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Profit Bandar</span>
          <div className="text-lg font-black font-mono text-emerald-400">{formatIDR(houseNetProfit)}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Putaran Dimainkan</span>
          <div className="text-lg font-black font-mono text-cyan-400">{stats.roundsPlayed} Putaran</div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1E2D44] space-x-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('controls')}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'controls'
              ? 'border-purple-500 text-purple-300 bg-purple-950/20'
              : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Dashboard & Kontrol Algoritma</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('loss')}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'loss'
              ? 'border-amber-500 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Konverter Kerugian Riil</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('psychology')}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'psychology'
              ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Codex Manipulasi Psikologis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'audit'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Audit Ledger & Ekspor Data</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'controls' && (
        <div className="space-y-8">
          <AdminRtpControl
            globalRtp={adminConfig.globalRtp}
            activeProfile={adminConfig.activeProfile as RiggedProfileType}
            onChangeRtp={(val) => {
              updateAdminConfig({ globalRtp: val });
              showToast(`Global House RTP diubah ke ${val}%`);
            }}
            onApplyPreset={(rtp, profile, label) => {
              updateAdminConfig({ globalRtp: rtp, activeProfile: profile as RiggedProfile });
              showToast(`Preset diaktifkan: ${label}`);
            }}
          />

          <AdminProfileSwitcher
            activeProfile={adminConfig.activeProfile as RiggedProfileType}
            nearMissProbability={adminConfig.nearMissProbability}
            highBetThreshold={adminConfig.highBetThreshold}
            onChangeProfile={(prof) => {
              updateAdminConfig({ activeProfile: prof as RiggedProfile });
              showToast(`Profil Algoritma diubah ke: ${prof.toUpperCase()}`);
            }}
            onChangeNearMissProbability={(prob) => {
              updateAdminConfig({ nearMissProbability: prob });
              showToast(`Probabilitas Near-Miss diubah ke ${Math.round(prob * 100)}%`);
            }}
            onChangeHighBetThreshold={(threshold) => {
              updateAdminConfig({ highBetThreshold: threshold });
              showToast(`Ambang High Bet diubah ke ${formatIDR(threshold)}`);
            }}
          />

          <AdminQuickActions
            forcedOutcome={adminConfig.forcedOutcome as ForcedOutcomeType}
            stats={stats}
            onSetForcedOutcome={(outcome) => {
              updateAdminConfig({ forcedOutcome: outcome as ForcedOutcome });
            }}
            onClaimFaucet={claimFaucet}
            onResetAllData={resetAllData}
            onToast={showToast}
          />
        </div>
      )}

      {activeTab === 'loss' && (
        <AdminLossConverter
          totalLost={stats.totalLost}
          totalWagered={stats.totalWagered}
          netHouseProfit={houseNetProfit}
        />
      )}

      {activeTab === 'psychology' && <AdminPsychCodex />}

      {activeTab === 'audit' && <AdminAuditLedger transactions={transactions} />}

    </div>
  );
}
