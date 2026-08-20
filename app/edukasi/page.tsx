'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  ShieldAlert,
  ArrowLeft,
  Flame,
  AlertTriangle,
  Scale,
  TrendingDown,
  Lock,
  Sparkles,
  LifeBuoy,
  Phone,
  Coins,
  Utensils,
  GraduationCap,
  Bike,
  Smartphone,
  Package,
} from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { calculateLossEquivalents } from '@/lib/utils/lossConverter';
import { HelplineModal } from '@/components/modals/HelplineModal';

export default function EdukasiPage() {
  const { totalLost, totalWagered, totalWon, adminConfig } = useGame();
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const lossEquivalents = calculateLossEquivalents(totalLost);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2D44] pb-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-[#0B111B] border border-[#1E2D44] text-slate-400 hover:text-white transition shadow-sm"
            title="Kembali ke Arena"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black uppercase tracking-wider">
                FAKTA DI BALIK LAYAR
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Rahasia Dapur Algoritma Bandar Judi Online
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pembongkaran trik psikologis, ilusi kemenangan palsu, dan kepastian matematis mengapa pemain selalu bangkrut.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsHelplineOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 text-red-300 text-xs font-bold flex items-center space-x-2 transition shadow-md"
        >
          <LifeBuoy className="w-4 h-4 text-red-400" />
          <span>Hotline Bantuan 24 Jam</span>
        </button>
      </div>

      {/* 1. THREE DEADLY TRAPS OF ONLINE GAMBLING */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-white flex items-center space-x-2">
          <Brain className="w-5 h-5 text-amber-400" />
          <span>3 Jebakan Psikologis Utama Bandar</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0B111B] border border-amber-500/30 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              1
            </div>
            <h3 className="font-bold text-white text-base">Honeypot (Umpan Menang di Awal)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bandar sengaja menaikkan probabilitas menang di awal bagi pengguna baru agar otak melepaskan hormon dopamin. Pemain merasa <em>&quot;hari ini lagi hoki&quot;</em> dan terdorong untuk menaikkan nominal taruhan.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B111B] border border-red-500/30 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-black">
              2
            </div>
            <h3 className="font-bold text-white text-base">Near-Miss Effect (Ilusi Hampir Menang)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Putaran slot atau angka togel sengaja disetting agar meleset 1 simbol/angka dari jackpot. Otak manusia secara keliru menganggapnya sebagai <em>&quot;nyaris menang&quot;</em>, padahal secara matematika itu adalah kekalahan 100%.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B111B] border border-purple-500/30 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
              3
            </div>
            <h3 className="font-bold text-white text-base">Loss Disguised as Win (LDW)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pemain bertaruh Rp 50.000 dan mendapat &quot;menang&quot; Rp 15.000 dengan efek suara heboh dan animasi emas. Padahal secara riil, saldo berkurang Rp 35.000. Efek audio visual membuat pemain merasa menang padahal rugi.
            </p>
          </div>
        </div>
      </section>

      {/* 2. REAL-WORLD LOSS CALCULATOR SUMMARY */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0B111B] border border-[#1E2D44] space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E2D44] pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span>Konversi Nilai Kerugian Riil Simulasi Anda</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Berapa banyak barang berharga yang setara dengan total saldo virtual yang hilang selama eksperimen Anda?
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Virtual Loss</span>
            <div className="text-lg font-black font-mono text-red-400">{formatIDR(totalLost)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-1 text-center">
            <Utensils className="w-6 h-6 text-amber-400 mx-auto" />
            <div className="text-lg font-black text-amber-300 font-mono">
              {lossEquivalents.find((i) => i.id === 'nasi_padang')?.formattedCount || '0'}x
            </div>
            <div className="text-[11px] text-slate-400">Porsi Nasi Padang</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-1 text-center">
            <Package className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="text-lg font-black text-emerald-300 font-mono">
              {lossEquivalents.find((i) => i.id === 'beras_5kg')?.formattedCount || '0'}x
            </div>
            <div className="text-[11px] text-slate-400">Karung Beras 5kg</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-1 text-center">
            <GraduationCap className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="text-lg font-black text-cyan-300 font-mono">
              {lossEquivalents.find((i) => i.id === 'ukt_ptn')?.formattedCount || '0'}x
            </div>
            <div className="text-[11px] text-slate-400">Semester UKT Kuliah</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-1 text-center">
            <Bike className="w-6 h-6 text-purple-400 mx-auto" />
            <div className="text-lg font-black text-purple-300 font-mono">
              {lossEquivalents.find((i) => i.id === 'motor_vario')?.formattedCount || '0'}x
            </div>
            <div className="text-[11px] text-slate-400">Unit Motor Matic</div>
          </div>
        </div>
      </section>

      {/* 3. FINAL CONCLUSION MESSAGE */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-amber-950/20 to-[#0B111B] border border-amber-500/40 text-center space-y-3">
        <h3 className="text-lg font-black text-white">
          &quot;Satu-satunya Cara Pasti Menang Judi Online Adalah Tidak Pernah Memulainya.&quot;
        </h3>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Semoga platform simulasi ini membuka mata Anda dan orang-orang terdekat tentang kebohongan algoritma judi online. Jangan pernah pertaruhkan uang hasil jerih payah Anda untuk sistem yang memang dirancang untuk menghabiskannya.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl btn-gold text-black font-bold text-xs shadow-lg"
          >
            <span>Kembali ke Halaman Arena</span>
          </Link>
        </div>
      </div>

      {/* Helpline Modal */}
      <HelplineModal isOpen={isHelplineOpen} onClose={() => setIsHelplineOpen(false)} />

    </div>
  );
}
