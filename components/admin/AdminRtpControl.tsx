'use client';

import React from 'react';
import {
  Sliders,
  Zap,
  Info,
  TrendingDown,
  Percent,
  ShieldCheck,
  Flame,
  AlertOctagon,
} from 'lucide-react';
import { formatIDR } from '@/lib/utils/currency';
import { RiggedProfileType } from '@/lib/math/riggedEngine';

interface AdminRtpControlProps {
  globalRtp: number;
  activeProfile: RiggedProfileType;
  onChangeRtp: (rtp: number) => void;
  onApplyPreset: (rtp: number, profile: RiggedProfileType, label: string) => void;
}

export const AdminRtpControl: React.FC<AdminRtpControlProps> = ({
  globalRtp,
  activeProfile,
  onChangeRtp,
  onApplyPreset,
}) => {
  const houseEdge = Math.max(0, 100 - globalRtp);
  const expectedHouseProfitPerMillion = (houseEdge / 100) * 1_000_000;

  const presets = [
    {
      label: 'Fair Baseline (98% RTP)',
      rtp: 98,
      profile: 'fair' as RiggedProfileType,
      desc: 'Simulasi statistik kasino resmi tanpa manipulasi bandar.',
      color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30',
      badge: '98% RTP',
    },
    {
      label: 'Judol Default (35% RTP)',
      rtp: 35,
      profile: 'near_miss' as RiggedProfileType,
      desc: 'Standar algoritma judi online ilegal di Indonesia.',
      color: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/30',
      badge: '35% RTP',
    },
    {
      label: 'Casino Trap (15% RTP)',
      rtp: 15,
      profile: 'jackpot_drainer' as RiggedProfileType,
      desc: 'Penyedotan agresif saat pemain mulai menaikkan taruhan.',
      color: 'border-orange-500/40 text-orange-300 hover:bg-orange-950/30',
      badge: '15% RTP',
    },
    {
      label: 'Pure Scammer (0% RTP)',
      rtp: 0,
      profile: 'pure_scam' as RiggedProfileType,
      desc: 'Bandar menyedot 100% modal tanpa ada peluang menang.',
      color: 'border-red-500/40 text-red-300 hover:bg-red-950/30',
      badge: '0% RTP',
    },
    {
      label: 'Honeypot Pancingan (100% RTP)',
      rtp: 100,
      profile: 'beginners_luck' as RiggedProfileType,
      desc: 'Pemain baru diberi menang beruntun agar ketagihan dan depo besar.',
      color: 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/30',
      badge: '100% RTP',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Preset Scenario Buttons */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Preset Skenario Manipulasi Cepat</span>
          </h2>
          <span className="text-[11px] text-slate-400">1-Klik Simulasi Skenario Bandar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presets.map((p) => {
            const isSelected = globalRtp === p.rtp && activeProfile === p.profile;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onApplyPreset(p.rtp, p.profile, p.label)}
                className={`p-4 rounded-xl text-left border transition relative overflow-hidden ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-500'
                    : `bg-[#05070B] ${p.color}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{p.label}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                  {p.desc}
                </p>
                {isSelected && (
                  <div className="mt-2.5 flex items-center space-x-1 text-[10px] font-bold text-purple-300">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block mr-1" />
                    <span>PRESET AKTIF</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global RTP Slider & House Edge Formula */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Global Return to Player (RTP) Manipulator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Mengontrol persentase matematis pengembalian uang taruhan kepada pemain di semua 6 permainan.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">House Edge</span>
              <span className="text-xl font-mono font-black text-red-400">{houseEdge}%</span>
            </div>
            <div className="h-8 w-px bg-[#1E2D44]" />
            <div className="text-right">
              <span className="text-[10px] uppercase text-purple-300 block font-semibold">RTP Aktif</span>
              <span className="text-3xl font-mono font-black text-purple-400">{globalRtp}%</span>
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={globalRtp}
              onChange={(e) => onChangeRtp(Number(e.target.value))}
              className="w-full h-3.5 bg-slate-800 rounded-xl appearance-none cursor-pointer accent-purple-500 transition"
            />
          </div>

          {/* Quick markers */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span className="text-red-400 font-bold">0% (Pure Scam)</span>
            <span className="text-orange-400">15% (Casino Trap)</span>
            <span className="text-amber-400">35% (Judol Default)</span>
            <span className="text-emerald-400">98% (Fair Baseline)</span>
            <span className="text-cyan-400 font-bold">100% (Honeypot)</span>
          </div>
        </div>

        {/* Live Mathematical Telemetry Box */}
        <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2D44] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span>Simulasi Ekspektasi Matematika (Hukum Bilangan Besar / Law of Large Numbers):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#0B111B] border border-[#1E2D44] space-y-1">
              <span className="text-slate-400 text-[11px]">Keuntungan Pasti Bandar per Rp 1.000.000 Taruhan:</span>
              <div className="text-base font-bold font-mono text-red-400">
                {formatIDR(expectedHouseProfitPerMillion)} <span className="text-[11px] text-slate-400 font-normal">({houseEdge}%)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B111B] border border-[#1E2D44] space-y-1">
              <span className="text-slate-400 text-[11px]">Sisa Uang Rata-Rata yang Dikembalikan ke Pemain:</span>
              <div className="text-base font-bold font-mono text-emerald-400">
                {formatIDR((globalRtp / 100) * 1_000_000)} <span className="text-[11px] text-slate-400 font-normal">({globalRtp}%)</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            <strong>Fakta Ilmiah:</strong> Dalam judi online, tidak ada istilah &quot;lagi gacor&quot; atau &quot;jam hoki&quot;. Semua hasil diatur oleh persentase RTP dan House Edge. Semakin sering pemain memasang taruhan, semakin pasti 100% uangnya akan habis terkuras oleh bandar.
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminRtpControl;
