'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Brain,
  TrendingDown,
  X,
  Play,
  Eye,
  Sliders,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  LifeBuoy,
} from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { calculateLossEquivalents } from '@/lib/utils/lossConverter';

interface GlitchExposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlitchExposeModal: React.FC<GlitchExposeModalProps> = ({ isOpen, onClose }) => {
  const { balance, totalLost, totalWagered, totalWon, adminConfig, updateAdminConfig, claimFaucet } = useGame();
  
  const [step, setStep] = useState<'decrypting' | 'exposed' | 'interactive'>('decrypting');
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [simulatedRtp, setSimulatedRtp] = useState(adminConfig.globalRtp || 15);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStep('decrypting');
      setDecryptProgress(0);
      setTerminalLogs([]);
      return;
    }

    // Cinematic Matrix Decryption Progress
    const logs = [
      '>> INITIATING MEMORY DUMP: wss://engine.judoru45.internal/ws',
      '>> BYPASSING RTP ENCRYPTION PROTOCOL [AES-256]... OK',
      '>> LOCATING HOUSE_EDGE_RIGGED_MAP (USER_SESSION_ID)... OK',
      '>> INTERCEPTING PSEUDO-RNG SEED GENERATOR... FOUND',
      '>> DECODING NEAR-MISS BIAS ENGINE: 82.4% ACTIVE',
      '>> INJECTING REVEAL SCRIPT... ACCESS GRANTED!',
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logs.length) {
        setTerminalLogs((prev) => [...prev, logs[currentLog]]);
        setDecryptProgress(Math.round(((currentLog + 1) / logs.length) * 100));
        currentLog++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => {
          setStep('exposed');
        }, 800);
      }
    }, 450);

    return () => clearInterval(logInterval);
  }, [isOpen]);

  if (!isOpen) return null;

  const lossEquivalents = calculateLossEquivalents(totalLost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
      
      {/* Background Cyber Red Glow */}
      <div className="absolute inset-0 bg-red-950/20 pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#070B12] border-2 border-red-500/80 rounded-3xl shadow-[0_0_80px_rgba(239,68,68,0.4)] overflow-hidden flex flex-col max-h-[92vh] relative z-10 animate-scaleUp">
        
        {/* Top Glitch Banner */}
        <div className="p-4 bg-gradient-to-r from-red-950 via-red-900 to-black border-b border-red-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 border border-red-500/50 flex items-center justify-center animate-pulse">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-red-400 font-mono tracking-widest flex items-center space-x-2">
                <span>[SYSTEM OVERRIDE]</span>
                <span className="px-1.5 py-0.2 rounded bg-red-500/30 text-white text-[9px]">DECRYPTED</span>
              </div>
              <h2 className="text-sm font-black text-white">RAHASIA DAPUR BANDAR TERBONGKAR!</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/50 border border-red-500/40 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* STEP 1: DECRYPTING MATRIX TERMINAL */}
          {step === 'decrypting' && (
            <div className="space-y-4 py-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/40 mx-auto flex items-center justify-center text-red-400 animate-spin">
                <Radio className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-mono font-bold text-red-400">
                  MEMBONGKAR LOG SERVER BANDAR... {decryptProgress}%
                </h3>
                <p className="text-xs text-slate-400">
                  Mendekripsi parameter probabilitas tersembunyi yang mengatur akun Anda
                </p>
              </div>

              {/* Terminal Logs Window */}
              <div className="p-4 rounded-2xl bg-black border border-red-500/30 text-left font-mono text-xs text-emerald-400 space-y-1 max-h-40 overflow-hidden shadow-inner">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: EVIDENCE EXPOSED */}
          {step === 'exposed' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/50 space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Kemenanganmu Bukan Karena &quot;Kurang Hoki&quot; — Tapi Diatur 100%!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kamu merasa hampir maxwin? Diberi menang di awal lalu dikuras sampai saldo minus/habis? Inilah algoritma bandar yang berjalan di akunmu:
                </p>
              </div>

              {/* 3 Rigged Pillars Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#05070B] border border-red-500/30 space-y-1.5">
                  <div className="text-amber-400 font-black flex items-center space-x-1">
                    <span>1. Winrate Diturunkan</span>
                  </div>
                  <div className="text-lg font-black text-red-400 font-mono">RTP: 15%</div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Dari 100 koin yang kamu pasang, bandar menyedot 85 koin secara otomatis ke kas mereka.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#05070B] border border-red-500/30 space-y-1.5">
                  <div className="text-amber-400 font-black flex items-center space-x-1">
                    <span>2. Ilusi Nyaris Menang</span>
                  </div>
                  <div className="text-lg font-black text-amber-300 font-mono">Near-Miss 75%</div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Putaran sengaja dihentikan 1 simbol dari jackpot untuk merangsang nafsu penasaran.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#05070B] border border-red-500/30 space-y-1.5">
                  <div className="text-amber-400 font-black flex items-center space-x-1">
                    <span>3. Perangkap Hutang</span>
                  </div>
                  <div className="text-lg font-black text-cyan-300 font-mono">Top-up Berulang</div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Memberi kemudahan pinjam/top-up modal agar pemain terus mengejar kekalahan (chasing losses).
                  </p>
                </div>
              </div>

              {/* Real World Impact */}
              <div className="p-4 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Total Kerugian Virtual Anda:</span>
                  <span className="text-red-400 font-black font-mono text-sm">{formatIDR(totalLost)}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Di dunia nyata, uang ini setara dengan: <strong className="text-amber-300">{lossEquivalents.find(i => i.id === 'nasi_padang')?.formattedCount || 0} porsi Nasi Padang</strong> atau <strong className="text-cyan-300">{lossEquivalents.find(i => i.id === 'ukt_ptn')?.formattedCount || 0} semester UKT Kuliah</strong>.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('interactive')}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Coba Jadi Bandar (Uji Winrate Sendiri)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-[#05070B] border border-[#1E2D44] hover:border-slate-500 text-slate-300 text-xs font-bold transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: INTERACTIVE HOUSE SIMULATOR */}
          {step === 'interactive' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#05070B] border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-white">🎛️ Simulator Kekuasaan Bandar</h4>
                    <p className="text-xs text-slate-400">Geser slider untuk melihat betapa mudahnya bandar mengatur menang/kalah:</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-sm">
                    {simulatedRtp}% RTP
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulatedRtp}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSimulatedRtp(val);
                      updateAdminConfig({ globalRtp: val });
                    }}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-red-400">0% (Pasti Rungkad)</span>
                    <span className="text-amber-400">35% (Standar Bandar)</span>
                    <span className="text-emerald-400">100% (Umpan Pancingan)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0B111B] border border-[#1E2D44] text-xs text-slate-300">
                  {simulatedRtp <= 20 && (
                    <p className="text-red-300">
                      🔴 <strong>Mode Penguras Saldo:</strong> Pemain dijamin rugi total dalam hitungan menit.
                    </p>
                  )}
                  {simulatedRtp > 20 && simulatedRtp <= 60 && (
                    <p className="text-amber-300">
                      🟡 <strong>Mode Normal Bandar:</strong> Pemain sesekali diberi menang kecil agar tidak kapok, namun saldo tetap tergerus secara perlahan.
                    </p>
                  )}
                  {simulatedRtp > 60 && (
                    <p className="text-emerald-300">
                      🟢 <strong>Mode Honeypot (Umpan):</strong> Pemain sering menang agar tergiur menaikkan nominal taruhan lebih besar sebelum akhirnya dikuras habis.
                    </p>
                  )}
                </div>
              </div>

              {/* Moral & Refill */}
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-center space-y-2">
                <h4 className="text-sm font-black text-white">
                  &quot;Dalam Judi Online, Kamu Tidak Bertanding Melawan Keberuntungan — Kamu Melawan Algoritma.&quot;
                </h4>
                <p className="text-xs text-slate-400">
                  Tutup browser, simpan uang aslimu, dan jangan biarkan algoritma bandar merusak masa depanmu.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    claimFaucet(1_000_000);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl btn-gold text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition"
                >
                  <span>Reset Saldo Virtual (+Rp 1.000.000) &amp; Lanjut Eksperimen</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-[#05070B] border border-[#1E2D44] text-slate-300 text-xs font-bold transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
