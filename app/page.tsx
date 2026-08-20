'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { calculateLossEquivalents, getPrimaryLossEquivalent } from '@/lib/utils/lossConverter';
import { FaucetModal } from '@/components/modals/FaucetModal';
import {
  ShieldAlert,
  Flame,
  Bomb,
  CircleDot,
  Dices,
  Ticket,
  Trophy,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Utensils,
  GraduationCap,
  Bike,
  Smartphone,
  Package,
  CheckCircle,
  HelpCircle,
  BarChart3,
  History,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const { balance, totalWagered, totalWon, totalLost, adminConfig, transactions } = useGame();
  const [isFaucetOpen, setIsFaucetOpen] = useState(false);

  const lossEquivalents = calculateLossEquivalents(totalLost);
  const primaryEquivalent = getPrimaryLossEquivalent(totalLost);
  const netLoss = Math.max(0, totalWagered - totalWon);

  const gameCards = [
    {
      id: 'slot',
      title: 'Slot Olympus (Zeus)',
      subtitle: 'Pragmatic Style Cascades & Multipliers',
      description: 'Simulasi slot 6x5 dengan sistem Scatter Pays 8+ simbol, tumble runtuh beruntun, dan pengali petir Zeus 2x s/d 500x.',
      badge: 'Scatter Pays & Multiplier Trap',
      href: '/slot',
      icon: Flame,
      color: 'from-amber-500/20 via-yellow-600/10 to-transparent',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      accentColor: 'text-amber-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]',
      stats: 'RTP Terbuka: ' + adminConfig.globalRtp + '%',
    },
    {
      id: 'crash',
      title: 'Crash / Aviator Rocket',
      subtitle: 'Real-time Ascending Multiplier Curve',
      description: 'Simulasi roket terbang eksponensial M(t)=e^(0.06t). Pemain harus cash out sebelum roket meledak seketika oleh algoritma bandar.',
      badge: 'Exponential Greedy Trap',
      href: '/crash',
      icon: Bomb,
      color: 'from-cyan-500/20 via-blue-600/10 to-transparent',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      accentColor: 'text-cyan-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      stats: 'Crash Rigged: Auto 1.01x - 1.20x',
    },
    {
      id: 'roulette',
      title: 'European Roulette 37 Pockets',
      subtitle: 'Interactive Betting Board & Wheel Physics',
      description: 'Roda roulette standar 37 angka (0-36). Dilengkapi papan taruhan warna Merah/Hitam, Ganjil/Genap, Lusin, dan angka tunggal.',
      badge: '37-Pocket House Edge (2.7%)',
      href: '/roulette',
      icon: CircleDot,
      color: 'from-emerald-500/20 via-teal-600/10 to-transparent',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      accentColor: 'text-emerald-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      stats: 'Kantong Nol (0) Hijau Bandar',
    },
    {
      id: 'dice',
      title: 'Dice Roll (Over/Under)',
      subtitle: 'Probability Slider & 3D Dice Tumbler',
      description: 'Simulasi lempar dadu dengan pengaturan target probabilitas (1-100) dan taruhan tebak jumlah mata dadu ganda (2-12).',
      badge: 'Near-Miss Illusion Engine',
      href: '/dice',
      icon: Dices,
      color: 'from-orange-500/20 via-amber-600/10 to-transparent',
      borderColor: 'border-orange-500/40 hover:border-orange-400',
      accentColor: 'text-orange-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]',
      stats: 'Near-Miss Rate: ' + Math.round(adminConfig.nearMissProbability * 100) + '%',
    },
    {
      id: 'togel',
      title: 'Togel 4D / 3D / 2D Lottery',
      subtitle: 'Live Bouncing Drum Draw Simulation',
      description: 'Simulasi lotre angka 4D legendaris dengan animasi live draw bola putar bertekanan udara dan perhitungan diskon/hadiah realistis.',
      badge: '1:10.000 Extreme Odds',
      href: '/togel',
      icon: Ticket,
      color: 'from-purple-500/20 via-pink-600/10 to-transparent',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      accentColor: 'text-purple-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
      stats: 'Bandar Liability Filter',
    },
    {
      id: 'sports',
      title: 'Tebak Skor Sepak Bola',
      subtitle: 'Sportsbook Odds & Live Match Simulator',
      description: 'Simulasi taruhan sepak bola Liga 1 & Liga Champions dengan odds desimal, live match event generator 90 menit, dan drama menit akhir.',
      badge: 'Bookmaker Margin (Vigorish)',
      href: '/sports',
      icon: Trophy,
      color: 'from-blue-500/20 via-indigo-600/10 to-transparent',
      borderColor: 'border-blue-500/40 hover:border-blue-400',
      accentColor: 'text-blue-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
      stats: 'Poisson Dynamic Events',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 1. HERO SECTION: Educational Anti-Gambling Warning & Status */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#0B111B] via-[#080D16] to-[#05070B] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Platform Simulasi Edukasi Anti-Judi Online</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Judi Online <span className="text-gold-gradient">Pasti Di-Setting Bandar.</span>
              <br />
              Buktikan Sendiri di Sini!
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Selamat datang di <strong className="text-white">Judoru45</strong>. Platform interaktif untuk membongkar dan menguji secara nyata 6 simulator permainan judi online terpopuler menggunakan <span className="text-amber-400 font-semibold">100% saldo virtual gratis</span> tanpa top-up. Kami membongkar rahasia algoritma dapur bandar secara transparan untuk menyadarkan masyarakat bahwa dalam judi online, pemain dipastikan akan selalu kalah.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/slot"
                className="px-6 py-3.5 rounded-xl btn-gold flex items-center space-x-2 text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition"
              >
                <Flame className="w-4 h-4 text-black" />
                <span>Mulai Simulasi Slot</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              <button
                type="button"
                onClick={() => setIsFaucetOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-[#0B111B] hover:bg-[#151E2E] border border-amber-500/30 text-amber-300 hover:text-white flex items-center space-x-2 text-sm font-semibold transition shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Klaim Saldo Faucet Gratis</span>
              </button>
            </div>
          </div>

          {/* Real-time System Transparency Card */}
          <div className="w-full lg:w-80 bg-[#070D18]/95 border border-[#1E2D44] rounded-2xl p-5 space-y-4 shadow-2xl flex-shrink-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500" />
            
            <div className="flex items-center justify-between border-b border-[#1E2D44] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Status Sistem Edukasi</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                AKTIF
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#0B111B] border border-[#1E2D44]/60">
                <span className="text-slate-400">Tipe Saldo:</span>
                <span className="font-bold text-emerald-400">100% Simulasi Fiktif</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#0B111B] border border-[#1E2D44]/60">
                <span className="text-slate-400">Saldo Virtualmu:</span>
                <span className="font-mono text-gold-gradient font-bold">{formatIDR(balance)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#0B111B] border border-[#1E2D44]/60">
                <span className="text-slate-400">Estimasi Uang Aman:</span>
                <span className="font-bold text-amber-300">{formatIDR(totalLost)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFaucetOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Isi Ulang Saldo Instan</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. THE 6 GAME SIMULATORS GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#1E2D44] pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <span>6 Simulator Game Judi Terpopuler</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Setiap permainan dilengkapi mesin probabilitas matematika riil & hook algoritma manipulasi bandar
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
            Semua Game Menggunakan Saldo Virtual Bersama
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameCards.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                href={game.href}
                className={`group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b ${game.color} bg-[#0B111B] border ${game.borderColor} p-6 transition-all duration-300 ${game.glowColor} hover:-translate-y-1.5 shadow-xl`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-[#05070B] border border-[#1E2D44] ${game.accentColor} group-hover:scale-110 transition shadow-md`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#05070B] border border-[#1E2D44] text-slate-300 group-hover:text-amber-300 transition">
                      {game.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                      {game.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {game.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300/80 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E2D44] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {game.stats}
                  </span>
                  <span className={`font-bold flex items-center space-x-1 ${game.accentColor} group-hover:translate-x-1 transition`}>
                    <span>Mainkan</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. REAL-WORLD LOSS STATISTICS & PSYCHOLOGICAL INSIGHTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Loss Converter Card (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1E2D44] bg-[#0B111B]/95 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E2D44] pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Konversi Kerugian Riil (Real-World Loss)</h3>
                <p className="text-xs text-slate-400">Berapa banyak barang berharga yang setara dengan kekalahan virtual Anda?</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Total Wagered:</span>
              <span className="text-xs font-bold text-slate-200">{formatIDR(totalWagered)}</span>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#05070B] border border-[#1E2D44]">
              <span className="text-[10px] text-slate-400 block">Total Pasang</span>
              <span className="text-sm font-bold text-slate-200">{formatIDR(totalWagered)}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#05070B] border border-[#1E2D44]">
              <span className="text-[10px] text-slate-400 block">Total Menang</span>
              <span className="text-sm font-bold text-emerald-400">{formatIDR(totalWon)}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#05070B] border border-[#1E2D44]">
              <span className="text-[10px] text-slate-400 block">Total Kalah</span>
              <span className="text-sm font-bold text-red-400">{formatIDR(totalLost)}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#05070B] border border-[#1E2D44]">
              <span className="text-[10px] text-slate-400 block">Kerugian Bersih</span>
              <span className={`text-sm font-bold ${netLoss > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                {formatIDR(netLoss)}
              </span>
            </div>
          </div>

          {/* Tangible Equivalent Grid */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Setara dengan Kebutuhan Riil di Dunia Nyata:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              <div className="p-3 rounded-xl bg-[#121B2A] border border-[#1E2D44] flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-amber-300">{lossEquivalents.find(i => i.id === 'nasi_padang')?.formattedCount || '0'}</div>
                  <div className="text-[11px] text-slate-400">Porsi Nasi Padang</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121B2A] border border-[#1E2D44] flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-cyan-300">{lossEquivalents.find(i => i.id === 'ukt_uny')?.formattedCount || '0'}</div>
                  <div className="text-[11px] text-slate-400">Bulan UKT Kuliah UNY</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121B2A] border border-[#1E2D44] flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-emerald-300">{lossEquivalents.find(i => i.id === 'iphone')?.formattedCount || '0'}</div>
                  <div className="text-[11px] text-slate-400">Unit iPhone Flagship</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121B2A] border border-[#1E2D44] flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-red-300">{lossEquivalents.find(i => i.id === 'motor_vario')?.formattedCount || '0'}</div>
                  <div className="text-[11px] text-slate-400">Unit Motor Honda Vario</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121B2A] border border-[#1E2D44] flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-yellow-300">{lossEquivalents.find(i => i.id === 'beras_5kg')?.formattedCount || '0'}</div>
                  <div className="text-[11px] text-slate-400">Karung Beras 5kg</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121B2A] border border-[#1E2D44] flex items-center justify-center text-center">
                <button
                  type="button"
                  onClick={() => setIsFaucetOpen(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                >
                  Isi Ulang Saldo Gratis &rarr;
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Educational Psychology Codex (1 Column) */}
        <div className="rounded-2xl border border-[#1E2D44] bg-[#0B111B]/95 p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Psikologi Jebakan Bandar</span>
            </div>
            <h4 className="text-base font-bold text-white leading-snug">
              Ilusi Kemenangan (Near-Miss Effect)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bandar judi secara sengaja merancang roda atau putaran agar sering berhenti tepat 1 angka di samping jackpot (Near-Miss). Otak manusia secara keliru mengartikannya sebagai <em>&quot;hampir menang&quot;</em>, padahal secara matematis Anda kalah 100%.
            </p>
            <div className="p-3 rounded-xl bg-[#05070B] border border-[#1E2D44] text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">Tahapan Jebakan Judi Online:</div>
              <div>1. <span className="text-emerald-400 font-medium">Honeypot:</span> Diberi menang awal agar kecanduan.</div>
              <div>2. <span className="text-amber-400 font-medium">Escalation:</span> Nilai taruhan dinaikkan karena serakah.</div>
              <div>3. <span className="text-red-400 font-medium">Total Drain:</span> Saldo dikuras habis oleh algoritma RTP rendah.</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[11px] text-amber-300 font-medium">
              💡 100% Simulasi Edukasi Tanpa Uang Nyata
            </span>
          </div>
        </div>

      </section>

      {/* Faucet Modal */}
      <FaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} />

    </div>
  );
}
