'use client';

import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  Target,
  Flame,
  Skull,
  CheckCircle2,
  Info,
  Sliders,
  AlertTriangle,
  Brain,
} from 'lucide-react';
import { RiggedProfileType } from '@/lib/math/riggedEngine';
import { formatIDR } from '@/lib/utils/currency';

interface AdminProfileSwitcherProps {
  activeProfile: RiggedProfileType;
  nearMissProbability: number;
  highBetThreshold: number;
  onChangeProfile: (profile: RiggedProfileType) => void;
  onChangeNearMissProbability: (prob: number) => void;
  onChangeHighBetThreshold: (threshold: number) => void;
}

export const AdminProfileSwitcher: React.FC<AdminProfileSwitcherProps> = ({
  activeProfile,
  nearMissProbability,
  highBetThreshold,
  onChangeProfile,
  onChangeNearMissProbability,
  onChangeHighBetThreshold,
}) => {
  const profiles = [
    {
      id: 'beginners_luck' as RiggedProfileType,
      title: "Beginner's Luck (Honeypot / Pancingan)",
      icon: Sparkles,
      color: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/20',
      activeRing: 'ring-cyan-500 border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      shortDesc: 'Pemain baru diberi menang beruntun di 3 putaran awal (150%+ RTP), lalu seketika disedot dengan 15% RTP.',
      tacticRealWorld:
        'Situs judi online mendeteksi IP/akun baru dan sengaja melonggarkan algoritma agar pemain merasakan euforia kemenangan instan (dopamine rush). Setelah pemain yakin & mendepositkan uang lebih besar, algoritma beralih ke mode kuras modal.',
      psychologyConcept: 'Skinner Box & Variable Ratio Reinforcement (Pemberian reward awal untuk membentuk kebiasaan kompulsif).',
    },
    {
      id: 'near_miss' as RiggedProfileType,
      title: 'Near-Miss Generator (Ilusi Nyaris Menang)',
      icon: Target,
      color: 'border-amber-500/50 text-amber-300 bg-amber-950/20',
      activeRing: 'ring-amber-500 border-amber-400 bg-amber-950/40 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      shortDesc: '80% kekalahan dimanipulasi agar terlihat "nyaris menang" (kurang 1 scatter, beda 1 angka dadu, roket meledak sesaat sebelum target).',
      tacticRealWorld:
        'Penelitian neurosains membuktikan bahwa otak manusia merespons kondisi "nyaris menang" dengan lonjakan dopamin yang sama persis seperti saat menang sungguhan. Hal ini membuat pemain merasa dirinya "hampir berhasil" dan terus memasang taruhan.',
      psychologyConcept: 'Near-Miss Striatal Activation (Penipuan persepsi kognitif yang memicu kecanduan terus menerus).',
    },
    {
      id: 'jackpot_drainer' as RiggedProfileType,
      title: 'Jackpot Drainer (Penghukum Taruhan Besar)',
      icon: Flame,
      color: 'border-orange-500/50 text-orange-300 bg-orange-950/20',
      activeRing: 'ring-orange-500 border-orange-400 bg-orange-950/40 shadow-[0_0_25px_rgba(249,115,22,0.25)]',
      shortDesc: 'Jika taruhan melebihi 20% saldo atau batas nominal tinggi, algoritma otomatis mengunci 100% kekalahan instan.',
      tacticRealWorld:
        'Ketika pemain yang kalah panik dan mencoba "balas dendam" dengan mempertaruhkan seluruh sisa modal (all-in atau bet besar), algoritma bandar otomatis mencegat taruhan tersebut agar bandar tidak memiliki risiko membayar kemenangan besar.',
      psychologyConcept: 'Sunk Cost Trap & Loss Chasing Exploitation (Pemanfaatan kondisi emosional pemain yang sedang mengejar kekalahan).',
    },
    {
      id: 'pure_scam' as RiggedProfileType,
      title: 'Pure Scammer (0% RTP / Sedot Total)',
      icon: Skull,
      color: 'border-red-500/50 text-red-300 bg-red-950/20',
      activeRing: 'ring-red-500 border-red-400 bg-red-950/40 shadow-[0_0_25px_rgba(239,68,68,0.25)]',
      shortDesc: 'Pengambilalihan total oleh bandar: 100% taruhan dijamin kalah tanpa ada kemenangan satu kali pun.',
      tacticRealWorld:
        'Banyak situs judi online ilegal di Indonesia yang beroperasi murni sebagai penipuan phishing total. Uang yang masuk ke rekening bandar langsung disedot tanpa ada peluang penarikan kembali (withdraw mustahil).',
      psychologyConcept: 'Absolute House Takeover & Predatory Extortion.',
    },
    {
      id: 'fair' as RiggedProfileType,
      title: 'Fair Simulation (98% RTP Kasino Standar)',
      icon: ShieldAlert,
      color: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/20',
      activeRing: 'ring-emerald-500 border-emerald-400 bg-emerald-950/40 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      shortDesc: 'Simulasi statistik probabilistik jujur tanpa manipulasi bias bandar tambahan.',
      tacticRealWorld:
        'Digunakan sebagai tolok ukur edukasi matematis untuk menunjukkan bahwa bahkan dalam kasino berizin yang paling "jujur" sekalipun, House Edge 2% tetap akan menguras saldo pemain jika dimainkan berulang kali.',
      psychologyConcept: 'Statistical Variance & Mathematical House Inevitability.',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Profile Selector Cards */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>Profil Rekayasa Perilaku Pemain (Behavioral Engine)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Pilih pola algoritma manipulasi psikologis yang diterapkan di semua 6 permainan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => {
            const Icon = p.icon;
            const isSelected = activeProfile === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onChangeProfile(p.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? `${p.activeRing} ring-1`
                    : 'bg-[#05070B] border-[#1E2D44] hover:border-slate-600 hover:bg-[#101726]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${p.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-white">{p.title.split('(')[0]}</span>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        AKTIF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {p.shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E2D44]/80 text-[10px] space-y-1">
                  <div className="text-slate-300 font-semibold flex items-center space-x-1">
                    <Info className="w-3 h-3 text-cyan-400" />
                    <span>Taktik Bandar Asli:</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed italic">
                    &quot;{p.tacticRealWorld}&quot;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Behavioral Fine-Tuning Parameters */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>Pengaturan Parameter Manipulasi Halus</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Near-Miss Rate */}
          <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2D44] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Frekuensi Ilusi Near-Miss:</span>
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {Math.round(nearMissProbability * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(nearMissProbability * 100)}
              onChange={(e) => onChangeNearMissProbability(Number(e.target.value) / 100)}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Persentase kekalahan yang otomatis diubah tampilan grafisnya menjadi nyaris kena jackpot (misal: 3 dari 4 scatter slot, selisih 1 digit togel, roket meledak 0.02x sebelum cashout).
            </p>
          </div>

          {/* High Bet Threshold */}
          <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2D44] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Ambang Batas Taruhan Tinggi (High Bet):</span>
              </span>
              <span className="font-mono font-bold text-orange-400 text-sm">
                {formatIDR(highBetThreshold)}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="500000"
              step="10000"
              value={highBetThreshold}
              onChange={(e) => onChangeHighBetThreshold(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Jika pemain memasang taruhan sama atau lebih besar dari nominal ini, algoritma Jackpot Drainer otomatis mengaktifkan 100% kekalahan seketika.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminProfileSwitcher;
