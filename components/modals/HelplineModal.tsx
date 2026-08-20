'use client';

import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  HeartHandshake,
  MessageSquare,
  ExternalLink,
  LifeBuoy,
  FileText,
  Clock,
  Building,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface HelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelplineModal: React.FC<HelplineModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hotlines' | 'guide' | 'reporting'>('hotlines');

  if (!isOpen) return null;

  const hotlines = [
    {
      agency: 'Kemenkes RI',
      name: 'Layanan SEJIWA (Sehat Jiwa)',
      type: 'phone',
      contact: 'tel:119,8',
      displayContact: 'Hotline: 119 Ext. 8',
      hours: '24 Jam Online (Bebas Pulsa)',
      desc: 'Pertolongan pertama krisis psikologis, konseling kesehatan mental, dan pencegahan depresi berat akibat jeratan judi.',
      badge: 'Bebas Pulsa 24 Jam',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      agency: 'Kemensos RI',
      name: 'Pusat Krisis Sosial & Rehabilitasi',
      type: 'phone',
      contact: 'tel:1500771',
      displayContact: 'Hotline: 1500771',
      hours: 'Senin - Minggu 24 Jam',
      desc: 'Layanan rehabilitasi sosial bagi korban adiksi judi online dan bantuan pendampingan psikososial keluarga.',
      badge: 'Resmi Kemensos',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      agency: 'Yayasan Pulih',
      name: 'Konseling Pemulihan Mental & Kecanduan',
      type: 'whatsapp',
      contact: 'https://wa.me/628118436633?text=Halo%20Yayasan%20Pulih,%20saya%20membutuhkan%20bantuan%20konseling%20terkait%20pemulihan%20kecanduan%20judi.',
      displayContact: 'WhatsApp: 0811-8436-633',
      hours: 'Senin - Jumat 09:00 - 17:00 WIB',
      desc: 'Konseling psikologi profesional untuk melepaskan diri dari siklus adiksi judi online dan pemulihan trauma keluarga.',
      badge: 'Psikolog Profesional',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      agency: 'Satgas PASTI / OJK',
      name: 'Layanan Konseling Finansial OJK 157',
      type: 'phone',
      contact: 'tel:157',
      displayContact: 'Telepon: 157 / WA 081-157-157-157',
      hours: 'Senin - Jumat 08:00 - 17:00 WIB',
      desc: 'Pengaduan jeratan pinjol ilegal akibat judi online, restrukturisasi utang, dan pelaporan rekening penipuan.',
      badge: 'Finansial & Utang',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      agency: 'Kemenkominfo RI',
      name: 'Aduan Konten & Rekening Judi Online',
      type: 'whatsapp',
      contact: 'https://wa.me/6281110015080?text=Halo%20Kominfo,%20saya%20ingin%20melaporkan%20situs/rekening%20judi%20online.',
      displayContact: 'WhatsApp: 0811-1001-5080',
      hours: '24 Jam Pelaporan',
      desc: 'Kanal resmi pelaporan pemblokiran situs judi online, SMS blast judol, dan rekening bank penampung dana bandar.',
      badge: 'Blokir Situs',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#0B111B] border border-red-500/40 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1E2D44] flex items-center justify-between bg-red-950/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>Pusat Bantuan & Krisis Judi Online</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 uppercase">
                  Darurat 24 Jam
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Layanan konsultasi resmi, rehabilitasi psikologis, dan penanganan utang
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

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E2D44] bg-[#05070B] overflow-x-auto px-4 pt-2">
          {[
            { id: 'hotlines', label: 'Hotline Resmi RI', icon: PhoneCall },
            { id: 'guide', label: 'Panduan Pemulihan Mandiri', icon: HeartHandshake },
            { id: 'reporting', label: 'Lapor Situs & Rekening', icon: ShieldAlert },
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
                    ? 'border-red-500 text-red-300 bg-red-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* HOTLINES TAB */}
          {activeTab === 'hotlines' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-200 text-[11px] leading-relaxed">
                <strong>Pemberitahuan:</strong> Seluruh layanan hotline di bawah ini disediakan oleh lembaga pemerintah dan yayasan profesional berizin di Indonesia. Jangan ragu untuk menghubungi jika Anda atau keluarga terdekat mengalami krisis keuangan atau depresi.
              </div>

              {hotlines.map((h) => (
                <div
                  key={h.name}
                  className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] hover:border-slate-600 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{h.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${h.badgeColor}`}>
                          {h.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Instansi: <strong className="text-slate-300">{h.agency}</strong> &bull; {h.hours}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {h.desc}
                  </p>

                  <div className="pt-2 border-t border-[#1E2D44]/80 flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-300">
                      {h.displayContact}
                    </span>

                    <a
                      href={h.contact}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition"
                    >
                      {h.type === 'whatsapp' ? <MessageSquare className="w-3.5 h-3.5" /> : <PhoneCall className="w-3.5 h-3.5" />}
                      <span>Hubungi Sekarang</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GUIDE TAB */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                <div className="font-bold text-xs text-white">Protokol Pemulihan Darurat 3 Langkah:</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Lakukan langkah-langkah konkret ini segera untuk menghentikan pendarahan finansial dan psikologis:
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-bold text-xs">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-[11px]">1</div>
                  <span>Triage Finansial: Putus Akses Perbankan Segera</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pl-2 leading-relaxed">
                  <li>Serahkan seluruh kendali M-Banking dan kartu ATM kepada pasangan, orang tua, atau wali yang dipercaya.</li>
                  <li>Hapus seluruh aplikasi pinjol, e-wallet, dan riwayat browser judi dari ponsel Anda.</li>
                  <li>Ajukan pemblokiran mandiri (self-exclusion) pada rekening bank yang sering digunakan untuk deposit.</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">2</div>
                  <span>Teknik Mengatasi Hasrat Berjudi (Urge Surfing)</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pl-2 leading-relaxed">
                  <li>Gunakan aturan <strong>Tunda 15 Menit</strong>: Saat dorongan deposit muncul, segera tinggalkan ruangan dan lakukan aktivitas fisik (jalan kaki, wudhu, mandi air dingin).</li>
                  <li>Terapkan teknik grounding <strong>5-4-3-2-1</strong> untuk menenangkan amigdala otak yang sedang panik.</li>
                  <li>Jangan pernah menyendiri di kamar tertutup saat sedang cemas atau gelisah.</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px]">3</div>
                  <span>Jujur & Minta Bantuan Profesional</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-2">
                  Kecanduan judi bukanlah aib moralitas yang harus disembunyikan sendiri, melainkan gangguan disregulasi dopamin yang membutuhkan dukungan medis dan psikologis. Hubungi Hotline 119 Ext. 8 atau psikolog klinis.
                </p>
              </div>
            </div>
          )}

          {/* REPORTING TAB */}
          {activeTab === 'reporting' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-3">
                <div className="flex items-center space-x-2 text-white font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-blue-400" />
                  <span>Portal Aduan Konten Indonesia (Kominfo)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Laporkan situs, link phishing, dan iklan judi online di media sosial agar segera diblokir oleh Kementerian Komunikasi dan Digital RI.
                </p>
                <a
                  href="https://aduankonten.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Buka Website aduankonten.id</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#05070B] border border-[#1E2D44] space-y-3">
                <div className="flex items-center space-x-2 text-white font-bold text-xs">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Pelaporan Rekening Penampung Bandar (OJK / CekRekening)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Laporkan nomor rekening bank dan e-wallet penampung deposit judi online agar dibekukan secara permanen oleh PPATK dan pihak perbankan.
                </p>
                <a
                  href="https://cekrekening.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Buka Portal CekRekening.id</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default HelplineModal;
