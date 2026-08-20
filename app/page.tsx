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

import { RealityCheckModal } from '@/components/modals/RealityCheckModal';

export default function HomePage() {
  const { balance, totalWagered, totalWon, totalLost, adminConfig, transactions } = useGame();
  const [isFaucetOpen, setIsFaucetOpen] = useState(false);
  const [isRealityCheckOpen, setIsRealityCheckOpen] = useState(false);

  const lossEquivalents = calculateLossEquivalents(totalLost);
  const primaryEquivalent = getPrimaryLossEquivalent(totalLost);
  const netLoss = Math.max(0, totalWagered - totalWon);

  const gameCards = [
    {
      id: 'slot777',
      title: '🔴 SLOT KLASIK LUCKY 777 (TRIPLE SEVEN)',
      subtitle: '3-Reel Vegas Neon & Maxwin 777x Payout',
      description: 'Sensasi slot retro mesin Las Vegas asli! Kumpulkan 3 simbol Lucky 7 Merah untuk ledakan jackpot sensasional 777x lipat.',
      badge: '🔥 NEW REALEASE 777X',
      href: '/slot777',
      icon: Sparkles,
      color: 'from-red-500/20 via-amber-600/10 to-transparent',
      borderColor: 'border-red-500/40 hover:border-red-400',
      accentColor: 'text-red-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]',
      stats: '🔴 Maxwin: 777x Lipat',
    },
    {
      id: 'slot',
      title: '⚡ GATES OF ZEUS (SLOT GACOR X5000)',
      subtitle: 'Sensational Cascades & Petir Merah x500',
      description: 'Pecah petir merah perkalian 500x kakek Zeus! Fitur Free Spin beli otomatis pecah Sensational Maxwin tanpa ampun.',
      badge: '🔥 PALING GACOR HARI INI',
      href: '/slot',
      icon: Flame,
      color: 'from-amber-500/20 via-yellow-600/10 to-transparent',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      accentColor: 'text-amber-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]',
      stats: '⚡ RTP Live: 98.8% (Pasti Pecah)',
    },
    {
      id: 'crash',
      title: '🚀 AVIATOR ROCKET (CRASH MULTIPLIER)',
      subtitle: 'Terbang Tinggi Cuan Kilat Tanpa Batas',
      description: 'Terbang menembus angkasa, raih pengali cuan ratusan kali lipat! Cash out sebelum roket meledak melipatgandakan saldo.',
      badge: '🚀 CUAN KILAT X100',
      href: '/crash',
      icon: Bomb,
      color: 'from-cyan-500/20 via-blue-600/10 to-transparent',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      accentColor: 'text-cyan-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      stats: '🚀 Multiplier: s/d 1000x',
    },
    {
      id: 'roulette',
      title: '🎡 EUROPEAN VIP ROULETTE',
      subtitle: 'Meja Kasino Mewah Single Zero (37 Pockets)',
      description: 'Sensasi meja kasino Las Vegas asli! Pasang Merah/Hitam, Ganjil/Genap, & Angka Hoki untuk kemenangan instan 36x lipat.',
      badge: '💎 VIP LAS VEGAS',
      href: '/roulette',
      icon: CircleDot,
      color: 'from-emerald-500/20 via-teal-600/10 to-transparent',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      accentColor: 'text-emerald-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      stats: '🎡 Payout Angka: 36x Lipat',
    },
    {
      id: 'dice',
      title: '🎲 HIGH-ROLLER DICES (DOUBLE WIN)',
      subtitle: 'Goncang Dadu 3D Hoki Beruntun',
      description: 'Tebak angka Over/Under dan jumlah dadu ganda 2-12! Peluang menang instan dengan visual 3D dadu paling mulus.',
      badge: '🎲 HOKI BERUNTUN',
      href: '/dice',
      icon: Dices,
      color: 'from-orange-500/20 via-amber-600/10 to-transparent',
      borderColor: 'border-orange-500/40 hover:border-orange-400',
      accentColor: 'text-orange-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]',
      stats: '🎲 Multiplier: s/d 30x',
    },
    {
      id: 'togel',
      title: '🎟️ TOGEL 4D PASARAN RESMI TERBESAR',
      subtitle: 'Live Draw Bola Putar & Hadiah Diskon 66%',
      description: 'Pasang angka hoki 4D, 3D, 2D, Colok Bebas, & Shio! Hadiah jackpot 4D terbesar x3000 tanpa potongan sedikit pun.',
      badge: '🎟️ JACKPOT X3000',
      href: '/togel',
      icon: Ticket,
      color: 'from-purple-500/20 via-pink-600/10 to-transparent',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      accentColor: 'text-purple-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
      stats: '🎟️ Hadiah 4D: 3.000x Modal',
    },
    {
      id: 'sports',
      title: '⚽ VIRTUAL SPORTSBOOK & MIX PARLAY',
      subtitle: 'Bursa Taruhan Sepak Bola Liga 1 & Champions',
      description: 'Dukung klub favoritmu dengan odds terbaik! Live match engine 90 menit dengan update skor dan goal alert dramatis.',
      badge: '⚽ PARLAY CUAN BESAR',
      href: '/sports',
      icon: Trophy,
      color: 'from-blue-500/20 via-indigo-600/10 to-transparent',
      borderColor: 'border-blue-500/40 hover:border-blue-400',
      accentColor: 'text-blue-400',
      glowColor: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
      stats: '⚽ Odds Tertinggi Pasar',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* 1. HERO SECTION: High-Hype Authentic Casino Promo Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#0B111B] via-[#080D16] to-[#05070B] p-6 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 text-xs font-black uppercase tracking-wider animate-pulse shadow-md">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>🔥 SITUS VIP GACOR #1 RESMI TERPERCAYA 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              SENSATIONAL <span className="text-gold-gradient">MAXWIN X5000!</span>
              <br />
              <span className="text-2xl sm:text-4xl text-amber-300 font-extrabold mt-1 block">
                BONUS NEW MEMBER RP 100.000 VIRTUAL
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Selamat datang di arena permainan paling seru <strong className="text-amber-400">Judoru45</strong>! Nikmati 6 game paling gacor hari ini dengan <span className="text-emerald-400 font-bold">RTP Live 98.8%</span>. Petir kakek Zeus menggelegar, roket terbang tinggi tanpa batas, dan jackpot miliaran rupiah menanti Anda sekarang!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/slot"
                className="px-7 py-4 rounded-2xl btn-gold flex items-center space-x-2.5 text-sm font-black shadow-xl shadow-amber-500/25 hover:scale-105 transition"
              >
                <Flame className="w-5 h-5 text-black fill-black" />
                <span>GAS MAIN SEKARANG (AUTO MAXWIN)</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </Link>

              <button
                type="button"
                onClick={() => setIsFaucetOpen(true)}
                className="px-5 py-4 rounded-2xl bg-[#0B111B] hover:bg-[#151E2E] border border-amber-500/40 text-amber-300 hover:text-white flex items-center space-x-2 text-sm font-bold transition shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>🎁 Klaim Saldo Bonus Gratis</span>
              </button>
            </div>
          </div>

          {/* Real-time High-Hype Live RTP Widget */}
          <div className="w-full lg:w-80 bg-[#070D18]/95 border border-amber-500/40 rounded-3xl p-5 space-y-4 shadow-2xl flex-shrink-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 animate-pulse" />
            
            <div className="flex items-center justify-between border-b border-[#1E2D44] pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>🔥 LIVE RTP GACOR HARI INI</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                98.8%
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#0B111B] border border-[#1E2D44]">
                <span className="text-slate-300 font-semibold">⚡ Slot Olympus:</span>
                <span className="font-bold text-amber-400">98.8% (Sensational)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#0B111B] border border-[#1E2D44]">
                <span className="text-slate-300 font-semibold">🚀 Aviator Rocket:</span>
                <span className="font-bold text-cyan-400">97.6% (Cuan Cepat)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#0B111B] border border-[#1E2D44]">
                <span className="text-slate-300 font-semibold">🎡 Roulette VIP:</span>
                <span className="font-bold text-emerald-400">98.2% (Jackpot 36x)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-[#0B111B] border border-amber-500/30">
                <span className="text-slate-400">Saldo Akunmu:</span>
                <span className="font-mono text-gold-gradient font-black text-sm">{formatIDR(balance)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFaucetOpen(true)}
              className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black flex items-center justify-center space-x-1.5 shadow-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Ambil Saldo Gratis (+Rp 500.000)</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. THE 6 GAME SELECTION GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#1E2D44] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2.5">
              <span>🔥 6 Game Kasino VIP Paling Gacor</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pilih permainan hoki favoritmu, pasang taruhan virtual, dan nikmati sensasi jackpot maxwin!
            </p>
          </div>
          <span className="text-xs font-black text-amber-400 bg-amber-500/15 px-3.5 py-1.5 rounded-xl border border-amber-500/40">
            ⭐ 100% Saldo Virtual Bersama
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameCards.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.id}
                href={game.href}
                className={`group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b ${game.color} bg-[#0B111B] border ${game.borderColor} p-6 transition-all duration-300 ${game.glowColor} hover:-translate-y-1.5 shadow-xl`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl bg-[#05070B] border border-[#1E2D44] ${game.accentColor} group-hover:scale-110 transition shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#05070B] border border-amber-500/40 text-amber-300 group-hover:border-amber-400 transition shadow-sm">
                      {game.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition">
                      {game.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {game.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E2D44] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-amber-400/90 font-mono font-bold">
                    {game.stats}
                  </span>
                  <span className={`font-black flex items-center space-x-1 ${game.accentColor} group-hover:translate-x-1 transition`}>
                    <span>Mainkan</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. LIVE CASINO VIP RECENT BIG WINNERS & PROVIDER LOGOS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2D44] pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>🏆 Papan Pemenang Sensational Hari Ini</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar kemenangan jackpot virtual pemain secara real-time di seluruh arena
            </p>
          </div>
        </div>

        {/* Live Winners Ticker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { user: 'zeus_master88', game: 'Gates of Olympus', win: 'Rp 28.500.000', mult: '500x', time: 'Baru saja' },
            { user: 'aviator_king', game: 'Crash Rocket', win: 'Rp 14.200.000', mult: '71.5x', time: '1 mnt lalu' },
            { user: 'roulette_vip', game: 'European Roulette', win: 'Rp 9.000.000', mult: '36x', time: '2 mnt lalu' },
            { user: 'dadu_hoki99', game: 'High-Roller Dices', win: 'Rp 6.400.000', mult: '16x', time: '3 mnt lalu' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0B111B] border border-[#1E2D44] flex items-center justify-between shadow-lg">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-amber-300">@{item.user}</div>
                <div className="text-[10px] text-slate-400">{item.game}</div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">{item.mult} &bull; {item.time}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-white font-mono">{item.win}</div>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  MAXWIN
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Provider Badges */}
        <div className="p-4 rounded-2xl bg-[#070D18] border border-[#1E2D44] flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span className="text-amber-400/80">PRAGMATIC PLAY</span>
          <span className="text-cyan-400/80">SPRIBE AVIATOR</span>
          <span className="text-emerald-400/80">EVOLUTION GAMING</span>
          <span className="text-purple-400/80">PG SOFT</span>
          <span className="text-rose-400/80">MICROGAMING</span>
        </div>
      </section>

      {/* Faucet Modal */}
      <FaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} />

      {/* Reality Check Awakening Modal */}
      <RealityCheckModal isOpen={isRealityCheckOpen} onClose={() => setIsRealityCheckOpen(false)} />

    </div>
  );
}
