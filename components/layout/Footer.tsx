'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  HeartHandshake, 
  PhoneCall, 
  AlertOctagon, 
  GraduationCap, 
  ExternalLink,
  Lock,
  Flame,
  Info,
  Heart,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import { DonationModal } from '@/components/modals/DonationModal';
import { HelplineModal } from '@/components/modals/HelplineModal';

export const Footer: React.FC = () => {
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-[#1E2D44] bg-[#030508] text-slate-400 mt-20 relative">
        
        {/* Top Banner: Emergency Anti-Gambling Warning */}
        <div className="border-b border-red-950/60 bg-red-950/20 py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div className="flex items-center space-x-3 text-red-300">
              <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">
                Judi Online adalah Penipuan Berkedok Game. Bandar Selalu Mengatur Algoritma untuk Keuntungan Rumah!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsHelplineOpen(true)}
              className="flex items-center space-x-2 text-xs font-bold text-amber-300 hover:text-amber-100 transition underline underline-offset-4"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Butuh Bantuan Krisis Judi? Buka Hotline 119 Ext. 8</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Brand & Mission */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm">
                  J45
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  JUDORU<span className="text-amber-400">45</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Platform simulasi interaktif untuk membongkar dan mengedukasi masyarakat tentang cara kerja algoritma bandar judi online yang selalu manipulatif dan merugikan pemain.
              </p>
              <div className="flex flex-col space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0B111B] border border-[#1E2D44] text-[11px] text-amber-300 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% Bebas Uang Asli (Fiktif)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDonationOpen(true)}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] text-amber-300 font-bold transition w-fit"
                >
                  <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                  <span>Dukung Proyek (Donasi)</span>
                </button>
              </div>
            </div>

            {/* Column 2: 6 Game Simulators */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulasi Permainan</span>
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/slot" className="hover:text-amber-300 transition flex items-center justify-between">
                    <span>Slot Olympus (Zeus Scatter)</span>
                    <span className="text-[10px] text-slate-500">Cascade RNG</span>
                  </Link>
                </li>
                <li>
                  <Link href="/crash" className="hover:text-amber-300 transition flex items-center justify-between">
                    <span>Crash / Aviator Rocket</span>
                    <span className="text-[10px] text-slate-500">Multiplier Curve</span>
                  </Link>
                </li>
                <li>
                  <Link href="/roulette" className="hover:text-amber-300 transition flex items-center justify-between">
                    <span>European Roulette 37 Pockets</span>
                    <span className="text-[10px] text-slate-500">Wheel Physics</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dice" className="hover:text-amber-300 transition flex items-center justify-between">
                    <span>Dice Roll Over/Under</span>
                    <span className="text-[10px] text-slate-500">Near-Miss Trap</span>
                  </Link>
                </li>
                <li>
                  <Link href="/togel" className="hover:text-amber-300 transition flex items-center justify-between">
                    <span>Togel 4D / 3D / 2D Lottery</span>
                    <span className="text-[10px] text-slate-500">Live Ball Draw</span>
                  </Link>
                </li>
                <li>
                  <Link href="/sports" className="hover:text-amber-300 transition flex items-center justify-between">
                    <span>Tebak Skor Sepak Bola</span>
                    <span className="text-[10px] text-slate-500">Match Odds Engine</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Official Help & Reporting Lines */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Layanan Bantuan Resmi RI</span>
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li
                  onClick={() => setIsHelplineOpen(true)}
                  className="p-2 rounded-lg bg-[#0B111B] border border-[#1E2D44] cursor-pointer hover:border-emerald-500/50 transition"
                >
                  <div className="font-bold text-slate-200">SEJIWA Kemenkes RI</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">Hotline: 119 Ext. 8</div>
                  <div className="text-[10px] text-slate-500">Konseling Psikologis & Kecanduan</div>
                </li>
                <li
                  onClick={() => setIsHelplineOpen(true)}
                  className="p-2 rounded-lg bg-[#0B111B] border border-[#1E2D44] cursor-pointer hover:border-emerald-500/50 transition"
                >
                  <div className="font-bold text-slate-200">Kemensos RI (Rehabilitasi)</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">Hotline: 1500771</div>
                  <div className="text-[10px] text-slate-500">Layanan Sosial & Korban Adiksi</div>
                </li>
                <li
                  onClick={() => setIsHelplineOpen(true)}
                  className="p-2 rounded-lg bg-[#0B111B] border border-[#1E2D44] cursor-pointer hover:border-emerald-500/50 transition"
                >
                  <div className="font-bold text-slate-200">Aduan Konten Kominfo</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">aduankonten.id / WA: 0811-1001-5080</div>
                  <div className="text-[10px] text-slate-500">Pelaporan Situs & Rekening Judi Online</div>
                </li>
              </ul>
            </div>

            {/* Column 4: Platform Security & Certified Fair Play */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sertifikasi & Keamanan</span>
              </h3>
              <div className="p-3.5 rounded-xl bg-[#0B111B] border border-[#1E2D44] space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <span>RNG System Verified</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Algoritma simulasi matematika independen berstandar GLI-19 & BMM Testlabs.
                </div>
                <div className="text-[10px] text-amber-400 font-medium pt-1">
                  18+ Responsible Gaming &bull; Bebas Deposit
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Disclaimer & Legal Statement */}
          <div className="pt-8 border-t border-[#1E2D44]/80 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-slate-500">
            <div>
              &copy; 2026 <strong>Judoru45 Gaming</strong> — Platform Simulasi Interaktif. 100% Saldo Fiktif &bull; Tanpa Uang Asli.
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 font-medium">Fair Play Simulation</span>
              <span>&bull;</span>
              <span className="text-slate-400">Next.js + Web Audio Synth</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
      <HelplineModal isOpen={isHelplineOpen} onClose={() => setIsHelplineOpen(false)} />
    </>
  );
};

export default Footer;
