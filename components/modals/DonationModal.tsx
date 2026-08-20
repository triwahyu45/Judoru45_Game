'use client';

import React, { useState } from 'react';
import {
  X,
  Heart,
  CreditCard,
  Coins,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Coffee,
  Globe,
  Wallet,
  Zap,
} from 'lucide-react';
import { formatIDR } from '@/lib/utils/currency';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sociabuzz' | 'saweria' | 'trakteer' | 'paypal' | 'crypto'>('sociabuzz');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cendolCount, setCendolCount] = useState<number>(5);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#0B111B] border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1E2D44] flex items-center justify-between bg-[#070D18]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>Dukungan & Apresiasi Karya</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  100% Nirlaba
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Dukung pengembangan platform edukasi anti-judi online Judoru45
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex border-b border-[#1E2D44] bg-[#05070B] overflow-x-auto px-4 pt-2">
          {[
            { id: 'sociabuzz', label: 'SociaBuzz', icon: Zap },
            { id: 'saweria', label: 'Saweria', icon: Sparkles },
            { id: 'trakteer', label: 'Trakteer', icon: Coffee },
            { id: 'paypal', label: 'PayPal / Ko-fi', icon: Globe },
            { id: 'crypto', label: 'Kripto / Web3', icon: Wallet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* SAWERIA TAB */}
          {activeTab === 'saweria' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Saweria Indonesia</div>
                  <div className="text-[11px] text-amber-300">Dukungan instan via QRIS, GoPay, OVO, DANA, ShopeePay</div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40">
                  saweria.co/judoru45
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300">Pilihan Nominal Cepat:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Rp 10.000', note: '1 Porsi Nasi' },
                    { label: 'Rp 25.000', note: 'Kopi Semangat' },
                    { label: 'Rp 50.000', note: 'Sewa Server' },
                    { label: 'Rp 100.000', note: 'Advokasi Edukasi' },
                  ].map((p) => (
                    <a
                      key={p.label}
                      href="https://saweria.co/judoru45"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#05070B] border border-[#1E2D44] hover:border-amber-400 hover:bg-[#121B2A] transition text-center space-y-0.5"
                    >
                      <div className="font-bold text-white text-xs">{p.label}</div>
                      <div className="text-[10px] text-slate-400">{p.note}</div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://saweria.co/judoru45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl btn-gold text-black font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <span>Buka Portal Saweria</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://saweria.co/judoru45', 'saweria')}
                  className="py-3 px-4 rounded-xl bg-[#05070B] border border-[#1E2D44] hover:border-slate-500 text-slate-300 text-xs font-semibold flex items-center space-x-2 transition"
                >
                  {copiedKey === 'saweria' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'saweria' ? 'Tersalin!' : 'Salin Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TRAKTEER TAB */}
          {activeTab === 'trakteer' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-red-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Trakteer Cendol</div>
                  <div className="text-[11px] text-red-300">Traktir pengembang dengan segelas Cendol digital (@ Rp 5.000)</div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40">
                  trakteer.id/judoru45
                </span>
              </div>

              {/* Interactive Cendol Counter */}
              <div className="p-5 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-slate-300">
                  <Coffee className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm">Pilih Jumlah Cendol:</span>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setCendolCount(Math.max(1, cendolCount - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg"
                  >
                    -
                  </button>
                  <div className="text-3xl font-black font-mono text-amber-400 w-20">
                    {cendolCount} 🥤
                  </div>
                  <button
                    type="button"
                    onClick={() => setCendolCount(Math.min(50, cendolCount + 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Total Nilai Dukungan: <strong className="text-white text-sm">{formatIDR(cendolCount * 5000)}</strong>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`https://trakteer.id/judoru45`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20"
                >
                  <span>Traktir {cendolCount} Cendol Sekarang</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* SOCIABUZZ TAB */}
          {activeTab === 'sociabuzz' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white flex items-center space-x-2">
                    <span>SociaBuzz Tribe &amp; Tips</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Rekomendasi
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300/90 mt-0.5">
                    Mendukung QRIS, GoPay, OVO, DANA, ShopeePay, Virtual Account &amp; Kartu Kredit
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40">
                  sociabuzz.com/judoru45
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 text-xs">Pilihan Nominal Cepat:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Rp 10.000', note: 'Dukungan Kopi' },
                    { label: 'Rp 25.000', note: 'Apresiasi Karya' },
                    { label: 'Rp 50.000', note: 'Pemeliharaan Server' },
                    { label: 'Rp 100.000', note: 'Riset Edukasi' },
                  ].map((p) => (
                    <a
                      key={p.label}
                      href="https://sociabuzz.com/judoru45/tribe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#05070B] border border-[#1E2D44] hover:border-emerald-400 hover:bg-[#121B2A] transition text-center space-y-0.5"
                    >
                      <div className="font-bold text-white text-xs">{p.label}</div>
                      <div className="text-[10px] text-slate-400">{p.note}</div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#05070B] border border-[#1E2D44] text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-emerald-400">Metode Pembayaran Tersedia di SociaBuzz:</div>
                <p className="text-slate-400 leading-relaxed">
                  QRIS Semua Bank &amp; E-Wallet, GoPay, DANA, OVO, ShopeePay, LinkAja, Transfer Virtual Account BCA/Mandiri/BRI/BNI/Permata, serta Visa/Mastercard.
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://sociabuzz.com/judoru45/tribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition"
                >
                  <span>Buka Portal SociaBuzz</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://sociabuzz.com/judoru45/tribe', 'sociabuzz')}
                  className="py-3 px-4 rounded-xl bg-[#05070B] border border-[#1E2D44] hover:border-slate-500 text-slate-300 text-xs font-semibold flex items-center space-x-2 transition"
                >
                  {copiedKey === 'sociabuzz' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'sociabuzz' ? 'Tersalin!' : 'Salin Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* PAYPAL & KO-FI TAB */}
          {activeTab === 'paypal' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-blue-200 space-y-2">
                <div className="font-bold text-sm text-white">International Backers (USD / EUR)</div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  Bagi pendukung atau mitra internasional yang ingin berkontribusi dalam riset simulasi sistem game.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PayPal */}
                <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-3">
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>PayPal International</span>
                    <span className="text-[10px] text-blue-400 font-mono">paypal.me</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Dukungan fleksibel melalui kartu debit/kredit internasional atau saldo PayPal.
                  </p>
                  <a
                    href="https://paypal.me/judoru45"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <span>Kunjungi PayPal.me</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Ko-fi */}
                <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-3">
                  <div className="font-bold text-white text-sm flex items-center justify-between">
                    <span>Ko-fi Page</span>
                    <span className="text-[10px] text-amber-400 font-mono">ko-fi.com</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Beli segelas kopi virtual untuk mendukung operasional server Judoru45.
                  </p>
                  <a
                    href="https://ko-fi.com/judoru45"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <span>Kunjungi Ko-fi.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* CRYPTO TAB */}
          {activeTab === 'crypto' && (
            <div className="space-y-4">
              {[
                {
                  coin: 'Tether (USDT) - TRC20',
                  address: 'TXJudoru45OfficialWeb3Donation7890abc',
                  key: 'usdt',
                  network: 'TRON (TRC-20)',
                },
                {
                  coin: 'Bitcoin (BTC)',
                  address: 'bc1qjudoru45officialdonation2026xyz',
                  key: 'btc',
                  network: 'Bitcoin Mainnet (SegWit)',
                },
                {
                  coin: 'Ethereum (ETH)',
                  address: '0x4545Judoru45OfficialDonationEthAddress',
                  key: 'eth',
                  network: 'Ethereum (ERC-20)',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{item.coin}</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                      {item.network}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={item.address}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#0B111B] border border-[#1E2D44] text-[11px] font-mono text-slate-300 select-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.address, item.key)}
                      className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition"
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedKey === item.key ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Platform Mission & Educational Transparency */}
          <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Komitmen Transparansi Platform</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Platform simulasi independen yang dikembangkan untuk menyajikan realitas mekanisme algoritma kasino dan slot online secara transparan tanpa manipulasi deposit uang asli.
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Seluruh apresiasi donasi dialokasikan 100% untuk pemeliharaan server, domain, dan riset edukasi probabilitas matematika.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonationModal;
