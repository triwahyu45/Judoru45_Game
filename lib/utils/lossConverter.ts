/**
 * Real-World Loss Converter Utility
 * Converts virtual gambling losses into tangible daily goods & educational equivalents
 * to highlight the true economic impact of gambling addictions.
 */

export interface LossEquivalentItem {
  id: string;
  name: string;
  unitPrice: number;
  count: number;
  formattedCount: string;
  unitLabel: string;
  category: 'food' | 'education' | 'transport' | 'tech' | 'daily';
  icon: string; // lucide icon name or emoji
  description: string;
}

export const REAL_WORLD_ITEMS = [
  {
    id: 'nasi_padang',
    name: 'Porsi Nasi Padang Rendang',
    unitPrice: 15_000,
    unitLabel: 'porsi',
    category: 'food' as const,
    icon: 'Utensils',
    description: 'Makan siang bergizi & kenyang dengan rendang + telur',
  },
  {
    id: 'mie_ayam',
    name: 'Mangkok Mie Ayam Bakso',
    unitPrice: 12_000,
    unitLabel: 'mangkok',
    category: 'food' as const,
    icon: 'Soup',
    description: 'Santapan mie ayam lezat porsi kenyang',
  },
  {
    id: 'beras_5kg',
    name: 'Karung Beras Premium (5kg)',
    unitPrice: 75_000,
    unitLabel: 'karung',
    category: 'daily' as const,
    icon: 'Package',
    description: 'Kebutuhan pokok beras keluarga selama 2 minggu',
  },
  {
    id: 'air_galon',
    name: 'Galon Air Mineral 19L',
    unitPrice: 20_000,
    unitLabel: 'galon',
    category: 'daily' as const,
    icon: 'Droplets',
    description: 'Kebutuhan air minum bersih higienis',
  },
  {
    id: 'bensin_pertalite',
    name: 'Liter Bensin Pertalite',
    unitPrice: 10_000,
    unitLabel: 'liter',
    category: 'transport' as const,
    icon: 'Fuel',
    description: 'Bahan bakar perjalanan harian ~40 km',
  },
  {
    id: 'kopi_susu',
    name: 'Cup Es Kopi Susu Gula Aren',
    unitPrice: 10_000,
    unitLabel: 'cup',
    category: 'food' as const,
    icon: 'Coffee',
    description: 'Minuman kopi segar teman belajar',
  },
  {
    id: 'ukt_uny',
    name: 'Semester Kuliah UKT UNY',
    unitPrice: 2_500_000,
    unitLabel: 'semester',
    category: 'education' as const,
    icon: 'GraduationCap',
    description: 'Biaya 1 semester kuliah penuh di Universitas Negeri Yogyakarta',
  },
  {
    id: 'iphone',
    name: 'Unit iPhone Flagship',
    unitPrice: 18_000_000,
    unitLabel: 'unit',
    category: 'tech' as const,
    icon: 'Smartphone',
    description: 'Gadget smartphone flagship untuk produktivitas & karya',
  },
  {
    id: 'motor_vario',
    name: 'Unit Motor Honda Vario 160',
    unitPrice: 25_000_000,
    unitLabel: 'unit',
    category: 'transport' as const,
    icon: 'Bike',
    description: 'Kendaraan motor matic baru untuk mobilitas kerja & kuliah',
  },
];

/**
 * Calculates all tangible real-world equivalents for a given total virtual loss
 */
export function calculateLossEquivalents(totalLost: number): LossEquivalentItem[] {
  const loss = Math.max(0, totalLost);

  return REAL_WORLD_ITEMS.map((item) => {
    const rawCount = loss / item.unitPrice;
    let formattedCount: string;

    if (rawCount >= 100) {
      formattedCount = Math.floor(rawCount).toLocaleString('id-ID');
    } else if (rawCount >= 1) {
      formattedCount = rawCount.toFixed(1).replace('.0', '').replace('.', ',');
    } else if (rawCount > 0) {
      formattedCount = rawCount.toFixed(2).replace('.', ',');
    } else {
      formattedCount = '0';
    }

    return {
      ...item,
      count: rawCount,
      formattedCount,
    };
  });
}

/**
 * Returns the most impactful single equivalent item for hero / banner displays
 */
export function getPrimaryLossEquivalent(totalLost: number): LossEquivalentItem {
  const equivalents = calculateLossEquivalents(totalLost);
  
  if (totalLost >= 25_000_000) {
    return equivalents.find((i) => i.id === 'motor_vario') || equivalents[0];
  }
  if (totalLost >= 18_000_000) {
    return equivalents.find((i) => i.id === 'iphone') || equivalents[0];
  }
  if (totalLost >= 2_500_000) {
    return equivalents.find((i) => i.id === 'ukt_uny') || equivalents[0];
  }
  if (totalLost >= 75_000) {
    return equivalents.find((i) => i.id === 'beras_5kg') || equivalents[0];
  }
  return equivalents.find((i) => i.id === 'nasi_padang') || equivalents[0];
}
