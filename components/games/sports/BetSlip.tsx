'use client';

import React from 'react';
import { ShoppingBag, Play, Trash2, Zap, AlertCircle, TrendingUp } from 'lucide-react';
import { UserSportsBet, MatchFixture } from '@/lib/math/sportsMath';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

interface BetSlipProps {
  selectedBet: UserSportsBet | null;
  activeFixture: MatchFixture | null;
  onUpdateWager: (amount: number) => void;
  onClearBet: () => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
  userBalance: number;
  simSpeed: '1x' | '2x' | 'instant';
  onSpeedChange: (speed: '1x' | '2x' | 'instant') => void;
}

const PRESET_CHIPS = [10000, 25000, 50000, 100000, 250000, 500000];

export const BetSlip: React.FC<BetSlipProps> = ({
  selectedBet,
  activeFixture,
  onUpdateWager,
  onClearBet,
  onStartSimulation,
  isSimulating,
  userBalance,
  simSpeed,
  onSpeedChange,
}) => {
  const wager = selectedBet?.wagerAmount || 50000;
  const odds = selectedBet?.odds || 1.0;
  const potentialPayout = Math.round(wager * odds);
  const netProfit = potentialPayout - wager;

  const hasEnoughBalance = userBalance >= wager;

  return (
    <div className="rounded-3xl bg-[#0B111B] border border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Tiket Taruhan (Bet Slip)
              </h3>
              <p className="text-[11px] text-slate-400">
                {selectedBet ? '1 Taruhan Terpilih' : 'Belum Memilih Pasaran'}
              </p>
            </div>
          </div>

          {selectedBet && (
            <button
              type="button"
              disabled={isSimulating}
              onClick={() => {
                synthEngine.playClick();
                onClearBet();
              }}
              className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 font-semibold disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Selected Bet Details */}
        {!selectedBet || !activeFixture ? (
          <div className="py-12 px-4 rounded-2xl bg-[#070B12] border border-dashed border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-400">Tiket Masih Kosong</p>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Klik salah satu tombol odds (1X2 / Over Under / BTTS / Skor Tepat) pada papan pertandingan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bet Card */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-blue-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-300">
                  {activeFixture.homeTeam.shortName} vs {activeFixture.awayTeam.shortName}
                </span>
                <span className="text-[10px] text-slate-400">{activeFixture.leagueName}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-sm font-black text-white">{selectedBet.selectionLabel}</div>
                  <div className="text-[11px] text-slate-400">Pasaran: {selectedBet.market}</div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/50 text-amber-300 font-mono font-black text-base">
                  @{selectedBet.odds.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Wager Input & Quick Chips */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Nominal Taruhan Virtual</span>
                <span className="text-slate-400 font-mono">Min. Rp 10.000</span>
              </label>

              {/* Chips */}
              <div className="grid grid-cols-3 gap-1.5">
                {PRESET_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isSimulating}
                    onClick={() => {
                      onUpdateWager(chip);
                      synthEngine.playClick();
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      wager === chip
                        ? 'bg-blue-600 border-blue-400 text-white font-bold'
                        : 'bg-[#121A2A] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {formatIDR(chip)}
                  </button>
                ))}
              </div>

              {/* Number Input */}
              <input
                type="number"
                min="10000"
                step="5000"
                value={wager}
                disabled={isSimulating}
                onChange={(e) => onUpdateWager(Math.max(10000, parseInt(e.target.value) || 0))}
                className="w-full bg-[#070B12] border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Potential Payout Receipt */}
            <div className="p-3.5 rounded-2xl bg-[#070B12] border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Taruhan:</span>
                <span className="font-mono text-slate-300">{formatIDR(wager)}</span>
              </div>
              <div className="flex justify-between text-blue-300">
                <span>Total Multiplier Odds:</span>
                <span className="font-mono font-bold">x{odds.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                <span>Estimasi Payout:</span>
                <span className="font-mono text-amber-400">{formatIDR(potentialPayout)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold text-xs">
                <span>Estimasi Laba Bersih:</span>
                <span className="font-mono">+{formatIDR(netProfit)}</span>
              </div>
            </div>

            {/* Simulation Speed Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Kecepatan Simulasi Pertandingan:</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { speed: '1x' as const, label: '1x Cepat (15s)' },
                  { speed: '2x' as const, label: '2x Turbo (8s)' },
                  { speed: 'instant' as const, label: 'Instan' },
                ].map((s) => (
                  <button
                    key={s.speed}
                    type="button"
                    disabled={isSimulating}
                    onClick={() => {
                      onSpeedChange(s.speed);
                      synthEngine.playClick();
                    }}
                    className={`py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      simSpeed === s.speed
                        ? 'bg-purple-600 border-purple-400 text-white font-bold'
                        : 'bg-[#121A2A] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button & Balance Check */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        {selectedBet && !hasEnoughBalance && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Saldo virtual tidak cukup. Klaim Faucet di menu atas!</span>
          </div>
        )}

        <button
          type="button"
          disabled={!selectedBet || isSimulating || !hasEnoughBalance}
          onClick={onStartSimulation}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {isSimulating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>SIMULASI 90 MENIT BERJALAN...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>PASANG TARUHAN &amp; SIMULASI 90&apos;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
