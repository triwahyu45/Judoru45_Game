'use client';

import React, { useState } from 'react';
import {
  Brain,
  Zap,
  Sparkles,
  AlertOctagon,
  Eye,
  RotateCcw,
  Target,
  Flame,
  Volume2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

interface CodexItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  mechanism: string;
  houseExploitation: string;
  realWorldExample: string;
  neuroscience: string;
  defenseTactic: string;
}

export const AdminPsychCodex: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('near_miss');

  const codexList: CodexItem[] = [
    {
      id: 'near_miss',
      title: '1. Efek Nyaris Menang (Near-Miss Effect)',
      subtitle: 'Pembajakan Jalur Dopamin Otak Melalui Kemenangan Semu',
      icon: Target,
      accentColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
      mechanism:
        'Kondisi di mana hasil permainan berhenti tepat 1 simbol atau 1 angka di samping kombinasi jackpot (misal: 3 dari 4 Scatter di Olympus Slot, atau selisih 1 angka di Dadu/Togel).',
      houseExploitation:
        'Bandar sengaja memanipulasi probabilitas reel visual agar simbol jackpot muncul 5x lebih sering di posisi "nyaris" daripada frekuensi acak murni. Hal ini membuat pemain percaya bahwa mereka "hampir menang" atau "sedang beruntung".',
      realWorldExample:
        'Pada game slot online, algoritma sengaja menampilkan 2 Scatter di reel 1 dan 2, lalu memperlambat putaran (tension spin) di reel 3, namun menjatuhkan scatter 1 kotak di atas payline.',
      neuroscience:
        'Studi fMRI (Functional Magnetic Resonance Imaging) membuktikan bahwa peristiwa "near-miss" mengaktifkan area ventral striatum dan insula anterior otak secara identik dengan kemenangan nyata, memicu desakan kompulsif untuk terus menekan tombol spin.',
      defenseTactic:
        'Sadarilah secara logis: "Nyaris menang" dalam sistem komputer hanyalah sebuah KEKALAHAN TOTAL 100%. Komputer tidak mengenal konsep hampir menang.',
    },
    {
      id: 'ldws',
      title: '2. Kerugian Berkedok Menang (Losses Disguised as Wins - LDWs)',
      subtitle: 'Manipulasi Sensorik Audio-Visual Saat Mengalami Kerugian Bersih',
      icon: Volume2,
      accentColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
      mechanism:
        'Pemain bertaruh Rp 50.000 dan mendapatkan payout Rp 15.000. Secara matematika keuangan, pemain mengalami KERUGIAN BERSIH Rp 35.000 (-70%).',
      houseExploitation:
        'Meskipun rugi bersih, game merayakannya dengan koin emas berhamburan, musik gembira tempo cepat, dan efek kilat seolah-olah pemain meraih kemenangan gemilang.',
      realWorldExample:
        'Di slot bertipe multi-payline, 95% dari "kemenangan" yang dirayakan oleh mesin sebenarnya adalah payout yang nilainya jauh lebih kecil daripada nilai taruhan per putaran.',
      neuroscience:
        'Kombinasi audio jingle ceria dan visual neon menstimulasi respon dopaminergik primer, sehingga memori otak mencatat putaran tersebut sebagai "menang", mengaburkan penurunan saldo sebenarnya.',
      defenseTactic:
        'Selalu hitung nilai Net Profit (Payout - Modal Taruhan). Jika payout lebih kecil dari bet, itu adalah KEKALAHAN telak, bukan kemenangan.',
    },
    {
      id: 'gamblers_fallacy',
      title: "3. Kesesatan Berpikir Penjudi (Gambler's Fallacy)",
      subtitle: 'Ilusi Bahwa Pola Acak Independen Memiliki Hutang Koreksi',
      icon: RotateCcw,
      accentColor: 'border-red-500/40 text-red-300 bg-red-500/10',
      mechanism:
        'Kepercayaan keliru bahwa jika suatu hasil telah terjadi berulang kali (misal: Roulette keluar Merah 6x berturut-turut), maka hasil Hitam menjadi "wajib / sudah saatnya keluar" pada putaran berikutnya.',
      houseExploitation:
        'Situs judi online sengaja menyediakan papan histori statistik ("Roadmap", "Pola Gacor", "Riwayat Angka") untuk memperkuat keyakinan palsu pemain dalam menebak pola yang sebenarnya 100% acak independen.',
      realWorldExample:
        'Peristiwa Kasino Monte Carlo 1913: Bola roulette keluar Hitam 26 kali berturut-turut. Para penjudi kehilangan jutaan Franc karena terus melipatgandakan taruhan di Merah, berasumsi Merah "pasti keluar".',
      neuroscience:
        'Otak manusia adalah mesin pencari pola evolusioner (pattern-seeking engine) yang secara alami menolak gagasan ketidakpastian acak murni, sehingga menciptakan ilusi kendali pola.',
      defenseTactic:
        'Pahami hukum probabilitas: Putaran ke-10 tidak memiliki ingatan terhadap putaran ke-1 sampai ke-9. Peluang selalu tetap sama pada setiap putaran.',
    },
    {
      id: 'variable_ratio',
      title: '4. Pengkondisian Skinner Box (Variable Ratio Reinforcement)',
      subtitle: 'Jadwal Hadiah Intermiten yang Membentuk Adiksi Tingkat Tinggi',
      icon: Sparkles,
      accentColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
      mechanism:
        'Sistem pemberian reward di mana hadiah diberikan setelah sejumlah respons acak yang tidak dapat diprediksi oleh subjek.',
      houseExploitation:
        'B.F. Skinner membuktikan bahwa merpati/tikus yang diberi makan secara acak intermiten akan menekan tuas secara kompulsif tanpa henti hingga kelaparan, jauh lebih adiktif daripada jadwal hadiah tetap.',
      realWorldExample:
        'Judi online dirancang agar pemain tidak pernah tahu putaran mana yang akan menghasilkan kemenangan kecil atau jackpot, menjaga otak dalam keadaan antisipasi dopamin konstan.',
      neuroscience:
        'Kadar dopamin tertinggi di otak dilepaskan BUKAN saat menerima hadiah, melainkan saat mengantisipasi ketidakpastian ("Mungkinkah putaran berikutnya yang menang?").',
      defenseTactic:
        'Putus siklus pemicu dengan berhenti total. Jangan pernah membiarkan diri masuk ke dalam putaran "satu spin lagi".',
    },
    {
      id: 'sunk_cost',
      title: '5. Jebakan Biaya Hangus & Pengejaran Kekalahan (Sunk Cost Fallacy)',
      subtitle: 'Eskalasi Komitmen Panik untuk Mengembalikan Uang yang Telah Hilang',
      icon: Flame,
      accentColor: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
      mechanism:
        'Kecenderungan psikologis untuk terus menaruh uang dan waktu lebih banyak karena merasa "sudah terlanjur rugi banyak dan sayang jika berhenti sekarang".',
      houseExploitation:
        'Bandar memanfaatkan rasa malu dan kepanikan finansial pemain dengan menyediakan tombol deposit instan via QRIS/E-Wallet agar pemain langsung "balas dendam" (chasing losses).',
      realWorldExample:
        'Pemain yang kalah Rp 2.000.000 meminjam dana pinjol Rp 5.000.000 untuk dipertaruhkan kembali dengan harapan modal awal kembali, yang berakhir pada kerugian total Rp 7.000.000.',
      neuroscience:
        'Amigdala (pusat rasa takut & panik) membajak fungsi prefrontal cortex (pusat nalar logis), membuat keputusan finansial menjadi impulsif dan irasional.',
      defenseTactic:
        'Anggap uang yang telah kalah sebagai biaya yang sudah musnah permanen (sunk cost). Menghentikan permainan sekarang adalah SATU-SATUNYA cara menghentikan kerugian bertambah.',
    },
    {
      id: 'illusion_control',
      title: '6. Ilusi Kendali Pribadi (Illusion of Control)',
      subtitle: 'Keyakinan Semu Bahwa Keterampilan Pemain Mempengaruhi Algoritma RNG',
      icon: Eye,
      accentColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
      mechanism:
        'Pemain meyakini bahwa tindakan pribadi seperti menekan tombol "Stop" manual pada slot, memilih nomor togel keberuntungan, atau waktu bermain jam tertentu dapat mempengaruhi hasil.',
      houseExploitation:
        'Game menyediakan tombol interaktif ("Stop Spin", "Turbo Spin", "Pilih Peti Bonus") yang sama sekali tidak mengubah angka RNG di server, hanya memberikan kepuasan manipulatif kepada pemain.',
      realWorldExample:
        'Menekan tombol "Stop" pada slot tidak mempengaruhi hasil karena angka hasil sudah ditentukan oleh server bandar pada milidetik pertama saat tombol Spin ditekan.',
      neuroscience:
        'Rasa agensi pribadi memberikan rasa aman palsu dan menurunkan persepsi risiko bahaya.',
      defenseTactic:
        'Ketahui fakta teknis: Seluruh hasil permainan slot, crash, roulette, dadu, dan togel ditentukan oleh RNG server secara instan. Tidak ada trik manual yang bisa mengubah hasil.',
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Codex Manipulasi Psikologis Bandar (Psychological Exploitation Codex)
            </h2>
            <p className="text-xs text-slate-400">
              Dekonstruksi ilmiah 6 celah kerentanan kognitif manusia yang dieksploitasi oleh industri judi online
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Cards */}
      <div className="space-y-4">
        {codexList.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition overflow-hidden ${
                isExpanded
                  ? 'bg-[#0B111B] border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                  : 'bg-[#05070B] border-[#1E2D44] hover:border-slate-600'
              }`}
            >
              {/* Card Header (Clickable) */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none space-x-4"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border ${item.accentColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-800/60 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-[#1E2D44]/80 space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    
                    {/* Mechanism */}
                    <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2D44] space-y-1.5">
                      <div className="text-slate-300 font-bold flex items-center space-x-1.5 text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Mekanisme Psikologis:</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        {item.mechanism}
                      </p>
                    </div>

                    {/* House Exploitation */}
                    <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2D44] space-y-1.5">
                      <div className="text-slate-300 font-bold flex items-center space-x-1.5 text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Eksploitasi oleh Bandar:</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        {item.houseExploitation}
                      </p>
                    </div>

                    {/* Real World Example */}
                    <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2D44] space-y-1.5">
                      <div className="text-slate-300 font-bold flex items-center space-x-1.5 text-xs">
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>Contoh di Lapangan:</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        {item.realWorldExample}
                      </p>
                    </div>

                    {/* Neuroscience */}
                    <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2D44] space-y-1.5">
                      <div className="text-slate-300 font-bold flex items-center space-x-1.5 text-xs">
                        <Brain className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Analisis Neurosains:</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        {item.neuroscience}
                      </p>
                    </div>

                  </div>

                  {/* Anti-Gambling Cognitive Defense */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Pertahanan Kognitif (Cara Menghindar):</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-200/90">
                      {item.defenseTactic}
                    </p>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AdminPsychCodex;
