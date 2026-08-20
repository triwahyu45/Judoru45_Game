'use client';

import React from 'react';
import { ShoppingCart, Trash2, Play, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { TogelTicket, TOGEL_RULES } from '@/lib/math/togelMath';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

interface TicketCartProps {
  tickets: TogelTicket[];
  onRemoveTicket: (id: string) => void;
  onClearTickets: () => void;
  onStartDraw: () => void;
  isDrawing: boolean;
  userBalance: number;
}

export const TicketCart: React.FC<TicketCartProps> = ({
  tickets,
  onRemoveTicket,
  onClearTickets,
  onStartDraw,
  isDrawing,
  userBalance,
}) => {
  const totalNet = tickets.reduce((sum, t) => sum + t.netBet, 0);
  const totalGross = tickets.reduce((sum, t) => sum + t.grossBet, 0);
  const totalDiscount = totalGross - totalNet;
  const maxPotentialPayout = tickets.reduce((sum, t) => sum + t.potentialPayout, 0);

  const hasEnoughBalance = userBalance >= totalNet;

  return (
    <div className="rounded-3xl bg-[#0B111B] border border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between">
      <div className="space-y-4">
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Keranjang Tiket Undian
              </h3>
              <p className="text-[11px] text-slate-400">{tickets.length} Tiket Terpasang</p>
            </div>
          </div>

          {tickets.length > 0 && (
            <button
              type="button"
              onClick={() => {
                synthEngine.playClick();
                onClearTickets();
              }}
              disabled={isDrawing}
              className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 font-semibold disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {/* Ticket List */}
        {tickets.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl bg-[#070B12] border border-dashed border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-400">Keranjang Masih Kosong</p>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Pilih tipe pasaran (4D/3D/2D/Colok/Shio) dan masukkan angka tebakan di panel kiri.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {tickets.map((t) => {
              const rule = TOGEL_RULES[t.type];
              return (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700/60 flex items-center justify-between gap-3 hover:border-purple-500/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        {rule?.shortName || t.type}
                      </span>
                      <span className="text-sm font-mono font-black text-white tracking-widest">
                        {t.numbers}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Bet: <span className="text-slate-300">{formatIDR(t.grossBet)}</span> (-{t.discountPercent}%) &rarr;{' '}
                      <span className="text-amber-400 font-semibold">{formatIDR(t.netBet)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">Potensi Win</div>
                      <div className="text-xs font-mono font-bold text-purple-300">
                        {formatIDR(t.potentialPayout)}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isDrawing}
                      onClick={() => {
                        synthEngine.playClick();
                        onRemoveTicket(t.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-50"
                      title="Hapus Tiket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Totals & Checkout Actions */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        {tickets.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#070B12] border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Taruhan Kotor:</span>
              <span className="font-mono text-slate-300">{formatIDR(totalGross)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Total Diskon Didapat:</span>
              <span className="font-mono font-semibold">-{formatIDR(totalDiscount)}</span>
            </div>
            <div className="flex justify-between text-white font-black text-sm pt-1 border-t border-slate-800">
              <span>Total Bayar Bersih:</span>
              <span className="font-mono text-amber-400">{formatIDR(totalNet)}</span>
            </div>
            <div className="flex justify-between text-purple-300 font-bold text-xs pt-1">
              <span>Maksimal Potensi Hadiah:</span>
              <span className="font-mono text-purple-400">{formatIDR(maxPotentialPayout)}</span>
            </div>
          </div>
        )}

        {/* Insufficient balance warning */}
        {tickets.length > 0 && !hasEnoughBalance && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Saldo virtual tidak cukup. Klaim Faucet di menu atas!</span>
          </div>
        )}

        {/* Start Draw Button */}
        <button
          type="button"
          disabled={tickets.length === 0 || isDrawing || !hasEnoughBalance}
          onClick={onStartDraw}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {isDrawing ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>MENGUNDI 4 TABUNG BOLA...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>PASANG TARUHAN & PUTAR UNDIAN</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
