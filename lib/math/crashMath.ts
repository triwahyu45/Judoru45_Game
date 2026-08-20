/**
 * Judoru45_Game - Crash Aviator Rocket Mathematical Engine
 * Implements continuous exponential multiplier curve M(t) = 1.00 * e^(0.06 * t),
 * Fair vs Rigged crash point distributions, Preemptive Crash below target, High Bet Sniper,
 * and Latency-free instant Cash Out calculation.
 */

export const GROWTH_RATE_K = 0.06; // Growth exponent k = 0.06

export type CrashRigMode =
  | 'fair'
  | 'beginners_luck'
  | 'near_miss'
  | 'jackpot_drainer'
  | 'pure_scam';

export interface CrashRoundConfig {
  userBet: number;
  autoCashout: number | null; // e.g. 2.00x
  rigMode: CrashRigMode;
  globalRtp: number; // 0 to 100
  forcedOutcome?: 'auto' | 'force_win' | 'force_loss';
  highBetThreshold?: number; // e.g. 100,000 IDR
}

export interface CrashPointResult {
  crashMultiplier: number;
  crashTimeSeconds: number;
  isRigged: boolean;
  rigType?: 'INSTANT_CRASH' | 'HIGH_BET_SNIPER' | 'PREEMPTIVE_TEASER' | 'RTP_SUPPRESSION';
  educationalNote: string;
}

/**
 * Multiplier at elapsed flight time t (seconds)
 * M(t) = 1.00 * e^(0.06 * t)
 */
export function getMultiplierAtTime(tSeconds: number): number {
  if (tSeconds <= 0) return 1.00;
  const mult = Math.exp(GROWTH_RATE_K * tSeconds);
  return Math.round(mult * 100) / 100;
}

/**
 * Required flight time (seconds) to reach target multiplier M
 * t(M) = ln(M) / 0.06
 */
export function getTimeToMultiplier(targetMultiplier: number): number {
  if (targetMultiplier <= 1.0) return 0;
  return Math.log(targetMultiplier) / GROWTH_RATE_K;
}

/**
 * Calculates deterministic or probabilistic crash point based on house configuration
 */
export function calculateCrashPoint(config: CrashRoundConfig): CrashPointResult {
  const { userBet, autoCashout, rigMode, globalRtp, forcedOutcome, highBetThreshold = 100_000 } = config;
  const isHighBet = userBet >= highBetThreshold;

  // 1. Force Loss Override
  if (forcedOutcome === 'force_loss') {
    const crash = +(1.00 + Math.random() * 0.03).toFixed(2);
    return {
      crashMultiplier: crash,
      crashTimeSeconds: getTimeToMultiplier(crash),
      isRigged: true,
      rigType: 'INSTANT_CRASH',
      educationalNote: 'Admin Forced Loss: Roket meledak seketika (< 1.04x) sebelum refleks manusia.',
    };
  }

  // 2. Force Win Override (Rocket flies to at least 5x - 20x)
  if (forcedOutcome === 'force_win') {
    const targetWin = autoCashout ? Math.max(autoCashout + 1.5, 3.5) : +(5.0 + Math.random() * 15.0).toFixed(2);
    return {
      crashMultiplier: targetWin,
      crashTimeSeconds: getTimeToMultiplier(targetWin),
      isRigged: true,
      educationalNote: 'Admin Forced Win: Roket dijamin melampaui target pemain.',
    };
  }

  // 3. High Bet Sniper (Punish big wagers to prevent house insolvency)
  if ((rigMode !== 'fair' && isHighBet) || rigMode === 'jackpot_drainer') {
    const shouldSnipe = isHighBet ? Math.random() < 0.85 : Math.random() < 0.50;
    if (shouldSnipe) {
      const crash = +(1.01 + Math.random() * 0.12).toFixed(2); // 1.01x - 1.13x
      return {
        crashMultiplier: crash,
        crashTimeSeconds: getTimeToMultiplier(crash),
        isRigged: true,
        rigType: 'HIGH_BET_SNIPER',
        educationalNote: `High-Bet Sniper: Taruhan tinggi (${userBet.toLocaleString('id-ID')}) dihancurkan seketika pada ${crash}x.`,
      };
    }
  }

  // 4. Preemptive Teaser (Crash right below user's Auto-Cashout target)
  if (
    (rigMode === 'near_miss' || rigMode === 'pure_scam' || Math.random() < 0.65) &&
    autoCashout &&
    autoCashout >= 1.25 &&
    rigMode !== 'fair'
  ) {
    const margin = +(0.01 + Math.random() * 0.04).toFixed(2); // 0.01x - 0.05x below target
    const teaserCrash = +(autoCashout - margin).toFixed(2);
    if (teaserCrash >= 1.01) {
      return {
        crashMultiplier: teaserCrash,
        crashTimeSeconds: getTimeToMultiplier(teaserCrash),
        isRigged: true,
        rigType: 'PREEMPTIVE_TEASER',
        educationalNote: `Preemptive Teaser: Roket meledak di ${teaserCrash}x (tepat 0.01x-0.05x di bawah target ${autoCashout}x Anda).`,
      };
    }
  }

  // 5. Global RTP-scaled Crash Distribution
  // Natural house edge E = (100 - globalRtp)%
  const houseEdgeFraction = Math.max(0.01, Math.min(0.99, (100 - globalRtp) / 100));
  const u = Math.random();

  // Instant crash probability equal to house edge
  if (u < houseEdgeFraction) {
    const instantCrash = +(1.00 + Math.random() * 0.02).toFixed(2);
    return {
      crashMultiplier: instantCrash,
      crashTimeSeconds: getTimeToMultiplier(instantCrash),
      isRigged: globalRtp < 85,
      rigType: 'RTP_SUPPRESSION',
      educationalNote: `RTP Suppression (${globalRtp}%): Crash instan karena house edge bandar tinggi.`,
    };
  }

  // Fair Pareto curve calculation
  const calculatedCrash = (1 - houseEdgeFraction) / (1 - u);
  const clampedCrash = +Math.min(500.0, Math.max(1.01, calculatedCrash)).toFixed(2);

  return {
    crashMultiplier: clampedCrash,
    crashTimeSeconds: getTimeToMultiplier(clampedCrash),
    isRigged: false,
    educationalNote: `Distribusi Standar: Crash titik ${clampedCrash}x.`,
  };
}

/**
 * Calculates Cash Out Payout
 */
export function calculateCashOut(
  betAmount: number,
  cashOutMultiplier: number,
  crashPoint: number
): {
  isSuccess: boolean;
  multiplier: number;
  payout: number;
  netProfit: number;
} {
  if (cashOutMultiplier <= crashPoint) {
    const roundedMult = Math.round(cashOutMultiplier * 100) / 100;
    const payout = Math.round(betAmount * roundedMult);
    return {
      isSuccess: true,
      multiplier: roundedMult,
      payout,
      netProfit: payout - betAmount,
    };
  }

  return {
    isSuccess: false,
    multiplier: 0,
    payout: 0,
    netProfit: -betAmount,
  };
}
