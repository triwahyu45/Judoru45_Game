/**
 * Judoru45_Game - Togel / 4D Lottery Simulator Mathematical Engine
 * Implements authentic Indonesian Togel mechanics, market standard discounts & payouts,
 * 10,000-combination liability minimization, and 3-out-of-4 near-miss illusion generator.
 */

export type TogelBetType =
  | '4D'
  | '3D'
  | '2D_BELAKANG'
  | '2D_DEPAN'
  | '2D_TENGAH'
  | 'COLOK_BEBAS'
  | 'COLOK_MACAU'
  | 'COLOK_NAGA'
  | 'SHIO';

export interface TogelRuleDef {
  type: TogelBetType;
  name: string;
  shortName: string;
  description: string;
  payoutMultiplier: number;
  discountPercent: number; // e.g. 66 means 66% discount (pay 34%)
  digitsNeeded: number;
  example: string;
  winProbabilityText: string;
  houseEdgePercent: number;
}

export const TOGEL_RULES: Record<TogelBetType, TogelRuleDef> = {
  '4D': {
    type: '4D',
    name: '4D (4 Digit Penuh)',
    shortName: '4D',
    description: 'Menebak tepat 4 angka (AS, KOP, KEPALA, EKOR)',
    payoutMultiplier: 3000,
    discountPercent: 66, // Bayar 34%
    digitsNeeded: 4,
    example: '8472',
    winProbabilityText: '1 : 10.000 (0.01%)',
    houseEdgePercent: 69.9,
  },
  '3D': {
    type: '3D',
    name: '3D (3 Digit Belakang)',
    shortName: '3D',
    description: 'Menebak tepat 3 angka terakhir (KOP, KEPALA, EKOR)',
    payoutMultiplier: 400,
    discountPercent: 59, // Bayar 41%
    digitsNeeded: 3,
    example: '472',
    winProbabilityText: '1 : 1.000 (0.10%)',
    houseEdgePercent: 59.0,
  },
  '2D_BELAKANG': {
    type: '2D_BELAKANG',
    name: '2D Belakang (2 Digit Terakhir)',
    shortName: '2D Belakang',
    description: 'Menebak tepat 2 angka terakhir (KEPALA, EKOR)',
    payoutMultiplier: 70,
    discountPercent: 29, // Bayar 71%
    digitsNeeded: 2,
    example: '72',
    winProbabilityText: '1 : 100 (1.00%)',
    houseEdgePercent: 29.0,
  },
  '2D_DEPAN': {
    type: '2D_DEPAN',
    name: '2D Depan (2 Digit Pertama)',
    shortName: '2D Depan',
    description: 'Menebak tepat 2 angka pertama (AS, KOP)',
    payoutMultiplier: 65,
    discountPercent: 29,
    digitsNeeded: 2,
    example: '84',
    winProbabilityText: '1 : 100 (1.00%)',
    houseEdgePercent: 34.0,
  },
  '2D_TENGAH': {
    type: '2D_TENGAH',
    name: '2D Tengah (2 Digit Tengah)',
    shortName: '2D Tengah',
    description: 'Menebak tepat 2 angka tengah (KOP, KEPALA)',
    payoutMultiplier: 65,
    discountPercent: 29,
    digitsNeeded: 2,
    example: '47',
    winProbabilityText: '1 : 100 (1.00%)',
    houseEdgePercent: 34.0,
  },
  'COLOK_BEBAS': {
    type: 'COLOK_BEBAS',
    name: 'Colok Bebas (1 Angka Bebas)',
    shortName: 'Colok Bebas',
    description: 'Menebak 1 angka yang muncul di posisi mana saja pada 4D',
    payoutMultiplier: 1.5,
    discountPercent: 6, // Bayar 94%
    digitsNeeded: 1,
    example: '7',
    winProbabilityText: '~34.39%',
    houseEdgePercent: 24.7,
  },
  'COLOK_MACAU': {
    type: 'COLOK_MACAU',
    name: 'Colok Macau / 2D Bebas',
    shortName: 'Colok Macau',
    description: 'Menebak 2 angka yang muncul di posisi mana saja pada 4D',
    payoutMultiplier: 6.5,
    discountPercent: 15,
    digitsNeeded: 2,
    example: '4, 7',
    winProbabilityText: '~7.02%',
    houseEdgePercent: 31.8,
  },
  'COLOK_NAGA': {
    type: 'COLOK_NAGA',
    name: 'Colok Naga / 3D Bebas',
    shortName: 'Colok Naga',
    description: 'Menebak 3 angka yang muncul di posisi mana saja pada 4D',
    payoutMultiplier: 25,
    discountPercent: 15,
    digitsNeeded: 3,
    example: '4, 7, 2',
    winProbabilityText: '~0.82%',
    houseEdgePercent: 42.2,
  },
  'SHIO': {
    type: 'SHIO',
    name: 'Shio (12 Zodiak Cina)',
    shortName: 'Shio',
    description: 'Menebak Shio dari 2 angka belakang (2D Belakang)',
    payoutMultiplier: 9.5,
    discountPercent: 10,
    digitsNeeded: 1,
    example: 'Naga / Tikus',
    winProbabilityText: '8.33% - 9.0%',
    houseEdgePercent: 23.5,
  },
};

export const SHIO_LIST = [
  { id: 'tikus', name: 'Tikus', numbers: [1, 13, 25, 37, 49, 61, 73, 85, 97], icon: '🐀' },
  { id: 'kerbau', name: 'Kerbau', numbers: [2, 14, 26, 38, 50, 62, 74, 86, 98], icon: '🐂' },
  { id: 'harimau', name: 'Harimau', numbers: [3, 15, 27, 39, 51, 63, 75, 87, 99], icon: '🐅' },
  { id: 'kelinci', name: 'Kelinci', numbers: [4, 16, 28, 40, 52, 64, 76, 88, 0], icon: '🐇' },
  { id: 'naga', name: 'Naga', numbers: [5, 17, 29, 41, 53, 65, 77, 89], icon: '🐉' },
  { id: 'ular', name: 'Ular', numbers: [6, 18, 30, 42, 54, 66, 78, 90], icon: '🐍' },
  { id: 'kuda', name: 'Kuda', numbers: [7, 19, 31, 43, 55, 67, 79, 91], icon: '🐎' },
  { id: 'kambing', name: 'Kambing', numbers: [8, 20, 32, 44, 56, 68, 80, 92], icon: '🐐' },
  { id: 'monyet', name: 'Monyet', numbers: [9, 21, 33, 45, 57, 69, 81, 93], icon: '🐒' },
  { id: 'ayam', name: 'Ayam', numbers: [10, 22, 34, 46, 58, 70, 82, 94], icon: '🐓' },
  { id: 'anjing', name: 'Anjing', numbers: [11, 23, 35, 47, 59, 71, 83, 95], icon: '🐕' },
  { id: 'babi', name: 'Babi', numbers: [12, 24, 36, 48, 60, 72, 84, 96], icon: '🐖' },
];

export interface TogelTicket {
  id: string;
  type: TogelBetType;
  numbers: string; // e.g. "8472", "472", "72", "7", "4,7", "Naga"
  grossBet: number;
  discountPercent: number;
  discountAmount: number;
  netBet: number;
  potentialPayout: number;
  createdAt: number;
}

export interface DrawPositionBreakdown {
  as: string; // Ribuan (1st digit)
  kop: string; // Ratusan (2nd digit)
  kepala: string; // Puluhan (3rd digit)
  ekor: string; // Satuan (4th digit)
  shio: string; // Shio from 2D Belakang
}

export interface MarketHistoryItem {
  id: string;
  marketCode: 'SGP' | 'HK' | 'SDY' | 'MAC';
  marketName: string;
  period: string;
  date: string;
  drawNumber: string; // e.g. "8472"
  breakdown: DrawPositionBreakdown;
}

/**
 * Validates user number input for a given Togel bet type
 */
export function validateTogelNumber(
  type: TogelBetType,
  input: string
): { isValid: boolean; error?: string; formatted: string } {
  const clean = input.trim().toUpperCase();

  if (!clean) {
    return { isValid: false, error: 'Nomor tidak boleh kosong', formatted: '' };
  }

  if (type === '4D') {
    if (!/^\d{4}$/.test(clean)) {
      return { isValid: false, error: '4D harus berupa 4 digit angka (contoh: 8472)', formatted: clean };
    }
    return { isValid: true, formatted: clean };
  }

  if (type === '3D') {
    if (!/^\d{3}$/.test(clean)) {
      return { isValid: false, error: '3D harus berupa 3 digit angka (contoh: 472)', formatted: clean };
    }
    return { isValid: true, formatted: clean };
  }

  if (type === '2D_BELAKANG' || type === '2D_DEPAN' || type === '2D_TENGAH') {
    if (!/^\d{2}$/.test(clean)) {
      return { isValid: false, error: '2D harus berupa 2 digit angka (contoh: 72)', formatted: clean };
    }
    return { isValid: true, formatted: clean };
  }

  if (type === 'COLOK_BEBAS') {
    if (!/^\d{1}$/.test(clean)) {
      return { isValid: false, error: 'Colok Bebas harus 1 digit angka (0-9)', formatted: clean };
    }
    return { isValid: true, formatted: clean };
  }

  if (type === 'COLOK_MACAU') {
    const digits = clean.replace(/\D/g, '');
    if (digits.length !== 2) {
      return { isValid: false, error: 'Colok Macau harus 2 digit angka (contoh: 4, 7)', formatted: clean };
    }
    const d1 = digits[0];
    const d2 = digits[1];
    if (d1 === d2) {
      return { isValid: false, error: 'Colok Macau harus 2 angka berbeda', formatted: clean };
    }
    return { isValid: true, formatted: `${d1}, ${d2}` };
  }

  if (type === 'COLOK_NAGA') {
    const digits = clean.replace(/\D/g, '');
    if (digits.length !== 3) {
      return { isValid: false, error: 'Colok Naga harus 3 digit angka (contoh: 4, 7, 2)', formatted: clean };
    }
    const set = new Set(digits.split(''));
    if (set.size < 3) {
      return { isValid: false, error: 'Colok Naga harus 3 angka berbeda', formatted: clean };
    }
    return { isValid: true, formatted: `${digits[0]}, ${digits[1]}, ${digits[2]}` };
  }

  if (type === 'SHIO') {
    const found = SHIO_LIST.find((s) => s.name.toUpperCase() === clean || s.id.toUpperCase() === clean);
    if (!found) {
      return { isValid: false, error: 'Pilih nama Shio yang valid (contoh: Naga, Tikus, Harimau)', formatted: clean };
    }
    return { isValid: true, formatted: found.name };
  }

  return { isValid: false, error: 'Tipe taruhan tidak dikenali', formatted: clean };
}

/**
 * Calculates net cost and potential payout based on Indonesian market discounts
 */
export function calculateTicketCost(
  type: TogelBetType,
  grossAmount: number
): {
  grossAmount: number;
  discountPercent: number;
  discountAmount: number;
  netAmount: number;
  potentialPayout: number;
} {
  const rule = TOGEL_RULES[type] || TOGEL_RULES['4D'];
  const discountPercent = rule.discountPercent;
  const discountAmount = Math.round((grossAmount * discountPercent) / 100);
  const netAmount = Math.max(1, grossAmount - discountAmount);
  const potentialPayout = Math.round(grossAmount * rule.payoutMultiplier);

  return {
    grossAmount,
    discountPercent,
    discountAmount,
    netAmount,
    potentialPayout,
  };
}

/**
 * Breaks down a 4D draw number into AS, KOP, KEPALA, EKOR and Shio
 */
export function breakdownDrawNumber(drawNumber: string): DrawPositionBreakdown {
  const padded = drawNumber.padStart(4, '0').slice(-4);
  const as = padded[0];
  const kop = padded[1];
  const kepala = padded[2];
  const ekor = padded[3];

  const twoDNum = parseInt(`${kepala}${ekor}`, 10);
  const matchedShio = SHIO_LIST.find((s) => s.numbers.includes(twoDNum))?.name || 'Tikus';

  return {
    as,
    kop,
    kepala,
    ekor,
    shio: matchedShio,
  };
}

/**
 * Evaluates whether a single ticket is a winner against the 4D draw outcome
 */
export function evaluateTogelWin(
  ticket: TogelTicket,
  drawNumber: string
): {
  isWin: boolean;
  matchCount: number;
  payout: number;
  matchDescription: string;
} {
  const padded = drawNumber.padStart(4, '0').slice(-4);
  const as = padded[0];
  const kop = padded[1];
  const kepala = padded[2];
  const ekor = padded[3];

  const rule = TOGEL_RULES[ticket.type];
  if (!rule) {
    return { isWin: false, matchCount: 0, payout: 0, matchDescription: 'Taruhan Tidak Dikenal' };
  }

  const grossBet = ticket.grossBet;

  switch (ticket.type) {
    case '4D': {
      if (ticket.numbers === padded) {
        const payout = grossBet * rule.payoutMultiplier;
        return { isWin: true, matchCount: 4, payout, matchDescription: `Tembus 4D Akurat: ${padded} (Hadiah ${rule.payoutMultiplier}x)` };
      }
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: `Meleset (Keluar: ${padded}, Pasang: ${ticket.numbers})` };
    }

    case '3D': {
      const drawn3D = `${kop}${kepala}${ekor}`;
      if (ticket.numbers === drawn3D) {
        const payout = grossBet * rule.payoutMultiplier;
        return { isWin: true, matchCount: 3, payout, matchDescription: `Tembus 3D Belakang: ${drawn3D} (Hadiah ${rule.payoutMultiplier}x)` };
      }
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: `Meleset (Keluar 3D: ${drawn3D}, Pasang: ${ticket.numbers})` };
    }

    case '2D_BELAKANG': {
      const drawn2D = `${kepala}${ekor}`;
      if (ticket.numbers === drawn2D) {
        const payout = grossBet * rule.payoutMultiplier;
        return { isWin: true, matchCount: 2, payout, matchDescription: `Tembus 2D Belakang: ${drawn2D} (Hadiah ${rule.payoutMultiplier}x)` };
      }
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: `Meleset (Keluar 2D: ${drawn2D}, Pasang: ${ticket.numbers})` };
    }

    case '2D_DEPAN': {
      const drawn2DDepan = `${as}${kop}`;
      if (ticket.numbers === drawn2DDepan) {
        const payout = grossBet * rule.payoutMultiplier;
        return { isWin: true, matchCount: 2, payout, matchDescription: `Tembus 2D Depan: ${drawn2DDepan} (Hadiah ${rule.payoutMultiplier}x)` };
      }
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: `Meleset (Keluar 2D Depan: ${drawn2DDepan}, Pasang: ${ticket.numbers})` };
    }

    case '2D_TENGAH': {
      const drawn2DTengah = `${kop}${kepala}`;
      if (ticket.numbers === drawn2DTengah) {
        const payout = grossBet * rule.payoutMultiplier;
        return { isWin: true, matchCount: 2, payout, matchDescription: `Tembus 2D Tengah: ${drawn2DTengah} (Hadiah ${rule.payoutMultiplier}x)` };
      }
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: `Meleset (Keluar 2D Tengah: ${drawn2DTengah}, Pasang: ${ticket.numbers})` };
    }

    case 'COLOK_BEBAS': {
      const targetDigit = ticket.numbers.trim();
      let occurrences = 0;
      for (const char of padded) {
        if (char === targetDigit) occurrences++;
      }
      if (occurrences > 0) {
        // Colok Bebas: multiplier doubles/triples if digit appears multiple times
        const multiplier = rule.payoutMultiplier * occurrences;
        const payout = grossBet * multiplier;
        return {
          isWin: true,
          matchCount: occurrences,
          payout,
          matchDescription: `Colok Bebas ${targetDigit} Muncul ${occurrences}x di ${padded} (Hadiah ${multiplier.toFixed(1)}x)`,
        };
      }
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: `Angka ${targetDigit} Tidak Muncul di ${padded}` };
    }

    case 'COLOK_MACAU': {
      const cleanDigits = ticket.numbers.replace(/\D/g, '').split('');
      const d1 = cleanDigits[0];
      const d2 = cleanDigits[1];
      const hasD1 = padded.includes(d1);
      const hasD2 = padded.includes(d2);
      if (hasD1 && hasD2) {
        const payout = grossBet * rule.payoutMultiplier;
        return {
          isWin: true,
          matchCount: 2,
          payout,
          matchDescription: `Colok Macau ${d1} & ${d2} Keduanya Muncul di ${padded} (Hadiah ${rule.payoutMultiplier}x)`,
        };
      }
      return { isWin: false, matchCount: (hasD1 ? 1 : 0) + (hasD2 ? 1 : 0), payout: 0, matchDescription: `Colok Macau Tidak Lengkap di ${padded}` };
    }

    case 'COLOK_NAGA': {
      const cleanDigits = ticket.numbers.replace(/\D/g, '').split('');
      const d1 = cleanDigits[0];
      const d2 = cleanDigits[1];
      const d3 = cleanDigits[2];
      const hasD1 = padded.includes(d1);
      const hasD2 = padded.includes(d2);
      const hasD3 = padded.includes(d3);
      if (hasD1 && hasD2 && hasD3) {
        const payout = grossBet * rule.payoutMultiplier;
        return {
          isWin: true,
          matchCount: 3,
          payout,
          matchDescription: `Colok Naga ${d1}, ${d2}, ${d3} Semuanya Muncul di ${padded} (Hadiah ${rule.payoutMultiplier}x)`,
        };
      }
      return { isWin: false, matchCount: (hasD1 ? 1 : 0) + (hasD2 ? 1 : 0) + (hasD3 ? 1 : 0), payout: 0, matchDescription: `Colok Naga Tidak Lengkap di ${padded}` };
    }

    case 'SHIO': {
      const twoD = parseInt(`${kepala}${ekor}`, 10);
      const shioObj = SHIO_LIST.find((s) => s.numbers.includes(twoD));
      const winningShio = shioObj ? shioObj.name : '';
      if (winningShio.toUpperCase() === ticket.numbers.toUpperCase()) {
        const payout = grossBet * rule.payoutMultiplier;
        return {
          isWin: true,
          matchCount: 1,
          payout,
          matchDescription: `Shio ${winningShio} Tembus (2D: ${twoD}) (Hadiah ${rule.payoutMultiplier}x)`,
        };
      }
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: `Shio Meleset (Keluar: ${winningShio} [${twoD}], Pasang: ${ticket.numbers})` };
    }

    default:
      return { isWin: false, matchCount: 0, payout: 0, matchDescription: 'Tipe taruhan tidak valid' };
  }
}

/**
 * Deterministic Rigged Lottery Engine:
 * - Prize Pool Liability Minimizer (Ensures house retains maximum pool)
 * - 3-out-of-4 Digit Near-Miss Generator (Psychological illusion hook)
 */
export function generateRiggedTogelDraw(
  activeTickets: TogelTicket[],
  rigMode: string = 'fair',
  adminConfig?: {
    forcedOutcome?: 'auto' | 'force_win' | 'force_loss';
    globalRtp?: number;
    nearMissProbability?: number;
    togelMaxMatch?: 'none' | '2d' | '3d' | '4d';
  }
): {
  winningNumber: string;
  isRigged: boolean;
  riggedReason: string;
  nearMissApplied: boolean;
  nearMissDetails?: string;
} {
  // 1. Check forced outcome overrides
  if (adminConfig?.forcedOutcome === 'force_win') {
    // If player has 4D ticket, make that exact 4D win
    const fourD = activeTickets.find((t) => t.type === '4D');
    if (fourD && /^\d{4}$/.test(fourD.numbers)) {
      return {
        winningNumber: fourD.numbers,
        isRigged: true,
        riggedReason: 'Admin Forced Win: 4D Jackpot Guaranteed',
        nearMissApplied: false,
      };
    }
    const threeD = activeTickets.find((t) => t.type === '3D');
    if (threeD && /^\d{3}$/.test(threeD.numbers)) {
      const randAs = Math.floor(Math.random() * 10).toString();
      return {
        winningNumber: `${randAs}${threeD.numbers}`,
        isRigged: true,
        riggedReason: 'Admin Forced Win: 3D Jackpot Guaranteed',
        nearMissApplied: false,
      };
    }
  }

  // 2. Near-Miss Illusion Hook (3-out-of-4 digits near miss)
  const isNearMissMode =
    rigMode === 'near_miss' ||
    (adminConfig?.nearMissProbability && Math.random() < adminConfig.nearMissProbability);

  if (isNearMissMode && activeTickets.length > 0) {
    const fourDTicket = activeTickets.find((t) => t.type === '4D' && /^\d{4}$/.test(t.numbers));
    if (fourDTicket) {
      const as = fourDTicket.numbers[0];
      const kop = fourDTicket.numbers[1];
      const kepala = fourDTicket.numbers[2];
      const ekorOriginal = parseInt(fourDTicket.numbers[3], 10);
      // Offset ekor by ±1 to create heartbreaking near-miss
      const offset = Math.random() < 0.5 ? 1 : 9;
      const ekorRigged = ((ekorOriginal + offset) % 10).toString();
      const nearMissNumber = `${as}${kop}${kepala}${ekorRigged}`;

      return {
        winningNumber: nearMissNumber,
        isRigged: true,
        riggedReason: 'Near-Miss Illusion: 3 dari 4 Digit (AS, KOP, KEPALA) Cocok Sempurna!',
        nearMissApplied: true,
        nearMissDetails: `Nomor Anda: ${fourDTicket.numbers} | Hasil Undian: ${nearMissNumber} (Hanya meleset di EKOR!)`,
      };
    }

    const threeDTicket = activeTickets.find((t) => t.type === '3D' && /^\d{3}$/.test(t.numbers));
    if (threeDTicket) {
      const randAs = Math.floor(Math.random() * 10).toString();
      const kop = threeDTicket.numbers[0];
      const kepala = threeDTicket.numbers[1];
      const ekorOriginal = parseInt(threeDTicket.numbers[2], 10);
      const ekorRigged = ((ekorOriginal + 1) % 10).toString();
      const nearMissNumber = `${randAs}${kop}${kepala}${ekorRigged}`;

      return {
        winningNumber: nearMissNumber,
        isRigged: true,
        riggedReason: 'Near-Miss Illusion: 2 dari 3 Digit Cocok!',
        nearMissApplied: true,
        nearMissDetails: `Nomor Anda: ${threeDTicket.numbers} | Hasil Undian: ${nearMissNumber.slice(1)} (Meleset 1 digit)`,
      };
    }
  }

  // 3. Forced Loss or Jackpot Drainer / Pure Scam / Zero Payout Lock
  if (
    adminConfig?.forcedOutcome === 'force_loss' ||
    rigMode === 'pure_scam' ||
    rigMode === 'jackpot_drainer' ||
    adminConfig?.togelMaxMatch === 'none'
  ) {
    if (activeTickets.length > 0) {
      // Find candidate numbers with 0 player payout
      const sampleAttempts = 200;
      for (let i = 0; i < sampleAttempts; i++) {
        const candidate = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        let totalWin = 0;
        for (const t of activeTickets) {
          const evalRes = evaluateTogelWin(t, candidate);
          totalWin += evalRes.payout;
        }
        if (totalWin === 0) {
          return {
            winningNumber: candidate,
            isRigged: true,
            riggedReason: 'Prize Pool Drainer: 100% Payout Suppressed to Rp 0',
            nearMissApplied: false,
          };
        }
      }
    }
  }

  // 4. Default Fair / Pseudo-Random Generation
  const fairNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return {
    winningNumber: fairNum,
    isRigged: false,
    riggedReason: 'Undian Standar Probabilitas Fair (1:10.000)',
    nearMissApplied: false,
  };
}

/**
 * Generate Quick Pick numbers for easy betting
 */
export function generateQuickPick(type: TogelBetType): string {
  switch (type) {
    case '4D':
      return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    case '3D':
      return Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    case '2D_BELAKANG':
    case '2D_DEPAN':
    case '2D_TENGAH':
      return Math.floor(Math.random() * 100).toString().padStart(2, '0');
    case 'COLOK_BEBAS':
      return Math.floor(Math.random() * 10).toString();
    case 'COLOK_MACAU': {
      const d1 = Math.floor(Math.random() * 10);
      let d2 = Math.floor(Math.random() * 10);
      while (d2 === d1) d2 = Math.floor(Math.random() * 10);
      return `${d1}, ${d2}`;
    }
    case 'COLOK_NAGA': {
      const digits = new Set<number>();
      while (digits.size < 3) {
        digits.add(Math.floor(Math.random() * 10));
      }
      return Array.from(digits).join(', ');
    }
    case 'SHIO': {
      const randShio = SHIO_LIST[Math.floor(Math.random() * SHIO_LIST.length)];
      return randShio.name;
    }
    default:
      return '1234';
  }
}

/**
 * Mock Indonesian Togel Market Histories
 */
export const MOCK_MARKET_HISTORIES: MarketHistoryItem[] = [
  {
    id: 'sgp_1',
    marketCode: 'SGP',
    marketName: 'Singapore Pools',
    period: 'SGP-2041',
    date: 'Hari Ini, 17:45 WIB',
    drawNumber: '7924',
    breakdown: breakdownDrawNumber('7924'),
  },
  {
    id: 'hk_1',
    marketCode: 'HK',
    marketName: 'Hongkong Lottery',
    period: 'HK-9182',
    date: 'Kemarin, 23:00 WIB',
    drawNumber: '3158',
    breakdown: breakdownDrawNumber('3158'),
  },
  {
    id: 'sdy_1',
    marketCode: 'SDY',
    marketName: 'Sydney Pools',
    period: 'SDY-4029',
    date: 'Kemarin, 14:00 WIB',
    drawNumber: '6803',
    breakdown: breakdownDrawNumber('6803'),
  },
  {
    id: 'mac_1',
    marketCode: 'MAC',
    marketName: 'Macau Toto 4D',
    period: 'MAC-1104',
    date: 'Kemarin, 19:00 WIB',
    drawNumber: '9241',
    breakdown: breakdownDrawNumber('9241'),
  },
  {
    id: 'sgp_2',
    marketCode: 'SGP',
    marketName: 'Singapore Pools',
    period: 'SGP-2040',
    date: '2 Hari Lalu, 17:45 WIB',
    drawNumber: '4819',
    breakdown: breakdownDrawNumber('4819'),
  },
  {
    id: 'hk_2',
    marketCode: 'HK',
    marketName: 'Hongkong Lottery',
    period: 'HK-9181',
    date: '2 Hari Lalu, 23:00 WIB',
    drawNumber: '0582',
    breakdown: breakdownDrawNumber('0582'),
  },
];
