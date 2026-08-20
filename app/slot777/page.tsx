'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Flame,
  ArrowLeft,
  Coins,
  Sparkles,
  RotateCw,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  Sliders,
  History,
  ShieldAlert,
  Play,
  Square,
  HelpCircle,
} from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import synthEngine from '@/lib/sound/synthEngine';

// Slot 777 Symbols definition
interface SlotSymbol {
  id: string;
  name: string;
  emoji: string;
  multiplier: number;
  color: string;
  bgGlow: string;
}

const SYMBOLS: SlotSymbol[] = [
  { id: '777_red', name: 'Triple 7 Merah (JACKPOT)', emoji: '7️⃣', multiplier: 777, color: 'text-red-500', bgGlow: 'shadow-[0_0_30px_rgba(239,68,68,0.8)] border-red-500 bg-red-950/40' },
  { id: '777_gold', name: 'Triple 7 Emas', emoji: '⭐', multiplier: 300, color: 'text-amber-400', bgGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.7)] border-amber-400 bg-amber-950/40' },
  { id: 'diamond', name: 'Berlian Biru', emoji: '💎', multiplier: 150, color: 'text-cyan-400', bgGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.6)] border-cyan-400 bg-cyan-950/40' },
  { id: 'bell', name: 'Lonceng Emas', emoji: '🔔', multiplier: 80, color: 'text-yellow-300', bgGlow: 'shadow-[0_0_15px_rgba(253,224,71,0.5)] border-yellow-400 bg-yellow-950/40' },
  { id: 'bar3', name: 'Triple BAR', emoji: '🎰', multiplier: 40, color: 'text-purple-400', bgGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)] border-purple-400 bg-purple-950/40' },
  { id: 'bar1', name: 'Single BAR', emoji: '🍫', multiplier: 20, color: 'text-blue-400', bgGlow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)] border-blue-400 bg-blue-950/40' },
  { id: 'cherry', name: 'Ceri Merah', emoji: '🍒', multiplier: 10, color: 'text-rose-400', bgGlow: 'shadow-[0_0_10px_rgba(244,63,94,0.4)] border-rose-400 bg-rose-950/40' },
];

const BET_PRESETS = [2_000, 5_000, 10_000, 25_000, 50_000, 100_000];

export default function Slot777Page() {
  const {
    balance,
    placeBet,
    settleBet,
    adminConfig,
    currentUser,
    openAuthModal,
  } = useGame();

  const [betAmount, setBetAmount] = useState<number>(10_000);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [reels, setReels] = useState<[SlotSymbol, SlotSymbol, SlotSymbol]>([
    SYMBOLS[0],
    SYMBOLS[0],
    SYMBOLS[0],
  ]);
  const [lastWin, setLastWin] = useState<{ amount: number; multiplier: number; symbol?: SlotSymbol } | null>(null);
  const [leverPulled, setLeverPulled] = useState<boolean>(false);
  const [showPaytable, setShowPaytable] = useState<boolean>(false);

  // Determine Rigged Outcome
  const determineSpinOutcome = useCallback((): { outcome: 'WIN' | 'NEAR_MISS' | 'LOSE'; winningSymbol?: SlotSymbol } => {
    // Check per-user override first
    if (currentUser?.riggedOverride === 'FORCE_WIN') {
      const topSymbol = Math.random() < 0.3 ? SYMBOLS[0] : SYMBOLS[Math.floor(Math.random() * 3)];
      return { outcome: 'WIN', winningSymbol: topSymbol };
    }
    if (currentUser?.riggedOverride === 'FORCE_LOSE') {
      return { outcome: Math.random() < 0.8 ? 'NEAR_MISS' : 'LOSE' };
    }
    if (currentUser?.riggedOverride === 'NEAR_MISS') {
      return { outcome: 'NEAR_MISS' };
    }

    // Global RTP Logic
    const rtp = adminConfig.globalRtp / 100;
    const roll = Math.random();

    if (roll < rtp * 0.4) {
      // Clean Win
      const chosen = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      return { outcome: 'WIN', winningSymbol: chosen };
    }

    // Near-Miss Illusion
    if (Math.random() < adminConfig.nearMissProbability) {
      return { outcome: 'NEAR_MISS' };
    }

    return { outcome: 'LOSE' };
  }, [adminConfig, currentUser]);

  // Execute Spin
  const spin = useCallback(() => {
    if (isSpinning) return;

    if (!currentUser) {
      openAuthModal('register');
      return;
    }

    if (balance < betAmount) {
      setAutoSpin(false);
      return;
    }

    // Deduct bet
    const success = placeBet('slot777', betAmount, `Putaran Slot 777 (Taruhan ${formatIDR(betAmount)})`);
    if (!success) {
      setAutoSpin(false);
      return;
    }

    setIsSpinning(true);
    setLeverPulled(true);
    setLastWin(null);
    synthEngine.playSpin();

    setTimeout(() => setLeverPulled(false), 400);

    const { outcome, winningSymbol } = determineSpinOutcome();

    // Reel spinning interval animation
    let count = 0;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      count++;
      if (count > 15) {
        clearInterval(interval);

        // Final result calculation
        let finalReels: [SlotSymbol, SlotSymbol, SlotSymbol];

        if (outcome === 'WIN' && winningSymbol) {
          finalReels = [winningSymbol, winningSymbol, winningSymbol];
        } else if (outcome === 'NEAR_MISS') {
          const matchSym = SYMBOLS[Math.floor(Math.random() * 3)]; // e.g. 777 or Gold
          const missSym = SYMBOLS[SYMBOLS.length - 1]; // Cherry or other
          finalReels = [matchSym, matchSym, missSym]; // 2 Match, 1 Miss!
        } else {
          finalReels = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          ];
          // Ensure they don't accidentally match 3
          if (finalReels[0].id === finalReels[1].id && finalReels[1].id === finalReels[2].id) {
            finalReels[2] = SYMBOLS[(SYMBOLS.indexOf(finalReels[2]) + 1) % SYMBOLS.length];
          }
        }

        setReels(finalReels);
        setIsSpinning(false);

        // Payout evaluation
        if (finalReels[0].id === finalReels[1].id && finalReels[1].id === finalReels[2].id) {
          const mult = finalReels[0].multiplier;
          const payout = betAmount * mult;

          setLastWin({
            amount: payout,
            multiplier: mult,
            symbol: finalReels[0],
          });

          settleBet({
            gameType: 'slot777',
            gameTitle: 'Slot Klasik 777',
            betAmount,
            multiplier: mult,
            payout,
            details: `JACKPOT 3x ${finalReels[0].name} (Pengali ${mult}x)`,
            riggedApplied: true,
          });

          if (mult >= 100) {
            synthEngine.playJackpot();
          } else {
            synthEngine.playWin(mult);
          }
        } else {
          settleBet({
            gameType: 'slot777',
            gameTitle: 'Slot Klasik 777',
            betAmount,
            multiplier: 0,
            payout: 0,
            details: `Kekalahan Putaran Slot 777`,
            riggedApplied: outcome === 'NEAR_MISS',
          });
        }
      }
    }, 80);
  }, [isSpinning, currentUser, balance, betAmount, openAuthModal, placeBet, determineSpinOutcome, settleBet]);

  // Auto Spin loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (autoSpin && !isSpinning) {
      timeout = setTimeout(() => {
        if (balance >= betAmount) {
          spin();
        } else {
          setAutoSpin(false);
        }
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [autoSpin, isSpinning, balance, betAmount, spin]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2D44] pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] text-slate-400 hover:text-white transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                VEGAS NEON 3-REEL
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                SLOT KLASIK LUCKY 777
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              3 Gulungan Retro Las Vegas dengan Maxwin Jackpot 777x Taruhan!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowPaytable(!showPaytable)}
            className="px-3 py-2 rounded-xl bg-[#0B111B] border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center space-x-1.5 hover:border-amber-400 transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Tabel Hadiah</span>
          </button>
        </div>
      </div>

      {/* Main 777 Slot Machine Cabinet */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#151D2A] via-[#0A101A] to-[#05070B] border-4 border-amber-500/60 shadow-[0_0_80px_rgba(245,158,11,0.25)] space-y-8 overflow-hidden">
        
        {/* Top Vegas Marquee */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black uppercase tracking-widest animate-pulse">
            <span>🔴 TRIPLE SEVEN MAXWIN 777X 🔴</span>
          </div>
          <div className="text-2xl sm:text-4xl font-black text-gold-gradient tracking-tight drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            LUCKY 777 CASINO
          </div>
        </div>

        {/* 3 Physical Reels Container */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 p-4 sm:p-8 rounded-3xl bg-[#05070B] border-2 border-amber-500/50 shadow-inner">
          {reels.map((sym, index) => (
            <div
              key={index}
              className={`h-36 sm:h-48 rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-200 border-2 ${sym.bgGlow} ${
                isSpinning ? 'animate-pulse blur-[1px]' : 'scale-100'
              }`}
            >
              <div className="text-5xl sm:text-7xl drop-shadow-md select-none transform group-hover:scale-110 transition">
                {sym.emoji}
              </div>
              <div className={`text-[10px] sm:text-xs font-black tracking-wider uppercase mt-2 font-mono ${sym.color}`}>
                {sym.name.split(' ')[0]}
              </div>
              <div className="text-[9px] text-amber-300 font-bold font-mono">
                {sym.multiplier}x
              </div>
            </div>
          ))}
        </div>

        {/* Big Win Banner Display */}
        {lastWin && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black text-center font-black animate-bounce shadow-2xl space-y-1">
            <div className="text-xs uppercase tracking-widest font-mono">🎉 SENSATIONAL JACKPOT 777 WIN! 🎉</div>
            <div className="text-2xl sm:text-3xl font-mono">{formatIDR(lastWin.amount)} ({lastWin.multiplier}x)</div>
          </div>
        )}

        {/* Betting Controls & Spin Buttons */}
        <div className="space-y-4 pt-2">
          
          {/* Bet Presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pilih Nilai Taruhan Virtual:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BET_PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBetAmount(amt)}
                  disabled={isSpinning}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition font-mono ${
                    betAmount === amt
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105'
                      : 'bg-[#0B111B] border border-[#1E2D44] text-slate-300 hover:border-amber-400'
                  }`}
                >
                  {formatIDR(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={spin}
              disabled={isSpinning}
              className={`flex-1 py-4 px-6 rounded-2xl text-base font-black flex items-center justify-center space-x-2 transition shadow-xl ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'btn-gold text-black hover:scale-102 shadow-amber-500/30'
              }`}
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'MEMUTAR GULUNGAN...' : `PUTAR 777 (${formatIDR(betAmount)})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoSpin(!autoSpin)}
              className={`py-4 px-6 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 transition border ${
                autoSpin
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-[#0B111B] border-amber-500/40 text-amber-300 hover:bg-[#121B2A]'
              }`}
            >
              {autoSpin ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{autoSpin ? 'STOP AUTO' : 'AUTO SPIN'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Paytable Modal / Dropdown */}
      {showPaytable && (
        <div className="p-6 rounded-3xl bg-[#0B111B] border border-amber-500/40 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1E2D44] pb-3">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Tabel Pengali Payout 3-Reel Lucky 777</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowPaytable(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Tutup &times;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SYMBOLS.map((sym) => (
              <div key={sym.id} className="p-3 rounded-2xl bg-[#05070B] border border-[#1E2D44] flex items-center space-x-3">
                <div className="text-3xl">{sym.emoji}</div>
                <div>
                  <div className="text-xs font-bold text-white">{sym.name}</div>
                  <div className="text-xs font-black text-amber-400 font-mono">3 Simbol = {sym.multiplier}x</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
