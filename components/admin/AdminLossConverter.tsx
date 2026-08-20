'use client';

import React, { useState } from 'react';
import {
  TrendingDown,
  Utensils,
  Soup,
  Package,
  Droplets,
  Fuel,
  Coffee,
  GraduationCap,
  Smartphone,
  Bike,
  Building,
  Home,
  AlertOctagon,
  Sparkles,
  Info,
  DollarSign,
} from 'lucide-react';
import { formatIDR } from '@/lib/utils/currency';
import { calculateLossEquivalents } from '@/lib/utils/lossConverter';

interface AdminLossConverterProps {
  totalLost: number;
  totalWagered: number;
  netHouseProfit: number;
}

const EXTENDED_COMMODITIES = [
  {
    id: 'nasi_padang',
    name: 'Porsi Nasi Padang Rendang Komplit',
    category: 'food',
    unitPrice: 15_000,
    icon: Utensils,
    unitLabel: 'porsi',
    description: 'Makan siang bergizi lengkap dengan rendang daging, sayur nangka, dan sambal hijau.',
  },
  {
    id: 'mie_ayam',
    name: 'Mangkok Mie Ayam Bakso',
    category: 'food',
    unitPrice: 12_000,
    icon: Soup,
    unitLabel: 'mangkok',
    description: 'Santapan mie ayam lezat porsi kenyang untuk sarapan atau makan malam.',
  },
  {
    id: 'kopi_susu',
    name: 'Cup Es Kopi Susu Kekinian',
    category: 'food',
    unitPrice: 10_000,
    icon: Coffee,
    unitLabel: 'cup',
    description: 'Minuman kopi segar pelepas lelah teman belajar mahasiswa.',
  },
  {
    id: 'bensin_pertalite',
    name: 'Liter Bensin Pertalite',
    category: 'daily',
    unitPrice: 10_000,
    icon: Fuel,
    unitLabel: 'liter',
    description: 'Bahan bakar transportasi harian untuk perjalanan kuliah dan bekerja (~40 km/liter).',
  },
  {
    id: 'air_galon',
    name: 'Galon Air Mineral 19 Liter',
    category: 'daily',
    unitPrice: 20_000,
    icon: Droplets,
    unitLabel: 'galon',
    description: 'Kebutuhan air minum bersih dan sehat keluarga selama 1 minggu.',
  },
  {
    id: 'beras_5kg',
    name: 'Karung Beras Premium 5 Kg',
    category: 'daily',
    unitPrice: 75_000,
    icon: Package,
    unitLabel: 'karung',
    description: 'Kebutuhan pangan pokok keluarga selama 2 pekan.',
  },
  {
    id: 'kos_mahasiswa',
    name: 'Bulan Sewa Kamar Kos Mahasiswa',
    category: 'education',
    unitPrice: 650_000,
    icon: Home,
    unitLabel: 'bulan',
    description: 'Tempat tinggal aman dan nyaman untuk mahasiswa di sekitar kampus.',
  },
  {
    id: 'ukt_kuliah_uny',
    name: 'Semester UKT Kuliah UNY',
    category: 'education',
    unitPrice: 2_500_000,
    icon: GraduationCap,
    unitLabel: 'semester',
    description: 'Biaya 1 semester kuliah penuh di Universitas Negeri Yogyakarta (UNY).',
  },
  {
    id: 'smartphone_mid',
    name: 'Smartphone Android Produktivitas',
    category: 'tech',
    unitPrice: 3_500_000,
    icon: Smartphone,
    unitLabel: 'unit',
    description: 'Perangkat teknologi penting untuk belajar, berkarya, dan bekerja remote.',
  },
  {
    id: 'iphone_flagship',
    name: 'iPhone Flagship 256GB',
    category: 'tech',
    unitPrice: 18_000_000,
    icon: Smartphone,
    unitLabel: 'unit',
    description: 'Smartphone premium dengan kamera dan performa standar industri kreatif.',
  },
  {
    id: 'motor_vario',
    name: 'Unit Motor Honda Vario 160',
    category: 'asset',
    unitPrice: 25_000_000,
    icon: Bike,
    unitLabel: 'unit',
    description: 'Kendaraan bermotor baru untuk mobilitas keluarga dan mencari nafkah.',
  },
  {
    id: 'rumah_kpr_subsidi',
    name: 'Uang Muka Rumah KPR Subsidi',
    category: 'asset',
    unitPrice: 185_000_000,
    icon: Building,
    unitLabel: 'unit',
    description: 'Hunian tetap masa depan yang hilang akibat jeratan judi online.',
  },
];

export const AdminLossConverter: React.FC<AdminLossConverterProps> = ({
  totalLost,
  totalWagered,
  netHouseProfit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const effectiveLoss = Math.max(0, totalLost);

  const categories = [
    { id: 'all', label: 'Semua Komoditas' },
    { id: 'food', label: 'Makanan & Minuman' },
    { id: 'daily', label: 'Kebutuhan Harian' },
    { id: 'education', label: 'Pendidikan & Kos' },
    { id: 'tech', label: 'Gadget & Tech' },
    { id: 'asset', label: 'Aset & Kendaraan' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? EXTENDED_COMMODITIES
    : EXTENDED_COMMODITIES.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Real-time Loss Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 via-[#0B111B] to-[#0B111B] border border-red-500/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Konverter Kerugian Riil (Tangible Loss Converter)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Mengubah angka kerugian fiktif di layar menjadi barang bernilai nyata dalam perekonomian Indonesia.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-[#05070B] p-3 rounded-xl border border-[#1E2D44]">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Akumulasi Kekalahan:</span>
              <span className="text-xl font-mono font-black text-red-400">{formatIDR(effectiveLoss)}</span>
            </div>
          </div>
        </div>

        {/* Psychological Insight Callout */}
        <div className="p-3.5 rounded-xl bg-[#05070B]/80 border border-amber-500/20 text-xs text-slate-300 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Fenomena Chips Detachment:</strong> Bandar judi online sengaja menggunakan saldo digital dan chips untuk mengaburkan persepsi nilai uang. Pemain tidak merasa kehilangan Rp 1.000.000 karena hanya melihat angka di layar ponsel, padahal nilai tersebut setara dengan 66 porsi makan siang atau 100 liter bensin.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-[#0B111B] text-slate-400 border border-[#1E2D44] hover:text-white hover:border-slate-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Commodity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const rawCount = effectiveLoss / item.unitPrice;
          const wholeUnits = Math.floor(rawCount);
          const progressPercent = Math.min(100, Math.round((rawCount % 1) * 100));

          let formattedUnits: string;
          if (rawCount >= 100) {
            formattedUnits = wholeUnits.toLocaleString('id-ID');
          } else if (rawCount >= 1) {
            formattedUnits = rawCount.toFixed(1).replace('.0', '').replace('.', ',');
          } else if (rawCount > 0) {
            formattedUnits = rawCount.toFixed(2).replace('.', ',');
          } else {
            formattedUnits = '0';
          }

          const hasUnits = wholeUnits > 0 || rawCount >= 0.01;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                hasUnits
                  ? 'bg-[#0B111B] border-amber-500/30 shadow-sm'
                  : 'bg-[#05070B] border-[#1E2D44] opacity-75'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-white leading-tight">{item.name}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-xl font-black font-mono text-amber-300">
                    {formattedUnits} <span className="text-xs font-normal text-slate-400">{item.unitLabel}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    @{formatIDR(item.unitPrice)}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  {item.description}
                </p>
              </div>

              {/* Progress to next unit */}
              <div className="pt-2 border-t border-[#1E2D44]/80 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Progres menuju unit berikutnya:</span>
                  <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AdminLossConverter;
