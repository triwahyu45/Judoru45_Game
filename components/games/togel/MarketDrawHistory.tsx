'use client';

import React, { useState } from 'react';
import { History, Globe, Sparkles, BrainCircuit, ShieldAlert } from 'lucide-react';
import { MOCK_MARKET_HISTORIES, MarketHistoryItem } from '@/lib/math/togelMath';
import { synthEngine } from '@/lib/sound/synthEngine';

export const MarketDrawHistory: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<'ALL' | 'SGP' | 'HK' | 'SDY' | 'MAC'>('ALL');

  const filteredHistory = activeMarket === 'ALL'
    ? MOCK_MARKET_HISTORIES
    : MOCK_MARKET_HISTORIES.filter((item) => item.marketCode === activeMarket);

  return (
    <div className="rounded-3xl bg-[#0B111B] border border-slate-800 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Riwayat Pengeluaran Pasaran Togel (Live Feed)
            </h3>
            <p className="text-xs text-slate-400">
              Mock Pools: Singapore (SGP), Hongkong (HK), Sydney (SDY), Macau (MAC)
            </p>
          </div>
        </div>

        {/* Market Filter Chips */}
        <div className="flex flex-wrap gap-1.5">
          {(['ALL', 'SGP', 'HK', 'SDY', 'MAC'] as const).map((mkt) => (
            <button
              key={mkt}
              type="button"
              onClick={() => {
                setActiveMarket(mkt);
                synthEngine.playClick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                activeMarket === mkt
                  ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                  : 'bg-[#121A2A] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {mkt === 'ALL' ? 'Semua Pasaran' : mkt}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-gradient-to-b from-[#111A2E] to-[#0A0F1C] border border-slate-700/80 hover:border-purple-500/40 transition-all space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {item.marketCode}
                </span>
                <span className="text-xs font-bold text-slate-200">{item.marketName}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{item.period}</span>
            </div>

            {/* 4D Ball Digits */}
            <div className="flex items-center justify-center space-x-2 py-1">
              {item.drawNumber.split('').map((digit, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 border-2 border-white/40 shadow-md text-white font-black text-lg flex items-center justify-center font-mono"
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Positional Breakdown AS - KOP - KEPALA - EKOR */}
            <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-[#060910] border border-slate-800 text-center text-[10px]">
              <div>
                <div className="text-slate-500 font-bold">AS</div>
                <div className="text-amber-400 font-mono font-bold">{item.breakdown.as}</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold">KOP</div>
                <div className="text-blue-400 font-mono font-bold">{item.breakdown.kop}</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold">KEPALA</div>
                <div className="text-emerald-400 font-mono font-bold">{item.breakdown.kepala}</div>
              </div>
              <div>
                <div className="text-slate-500 font-bold">EKOR</div>
                <div className="text-purple-400 font-mono font-bold">{item.breakdown.ekor}</div>
              </div>
            </div>

            {/* Date and Shio */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>{item.date}</span>
              <span className="text-purple-300 font-semibold">Shio: {item.breakdown.shio}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Psychology Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs text-slate-300">
        <div className="flex items-center space-x-2 text-amber-300 font-bold">
          <BrainCircuit className="w-4 h-4" />
          <span>Edukasi Psikologi: The Gambler&apos;s Fallacy &amp; &ldquo;Buku Mimpi&rdquo;</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Banyak pemain percaya bahwa nomor togel memiliki pola (&ldquo;rumus paito&rdquo;, angka mimpi, atau angka yang &ldquo;sudah lama tidak keluar&rdquo;). Secara probabilitas murni, setiap putaran undian adalah <strong>independent random event</strong> dengan peluang 1 : 10.000 (0.01%). Bandar mendapatkan margin keuntungan bersih 29% - 70% di setiap putaran dari potongan harga semu.
        </p>
      </div>
    </div>
  );
};
