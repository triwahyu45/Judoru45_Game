/**
 * Judoru45_Game - Central Probability & Rigged Algorithm Engine
 * 
 * Implements mathematical house-edge interceptors and behavioral profiles
 * simulating real-world online casino game mechanics.
 */

export type RiggedProfileType =
  | 'fair'
  | 'beginners_luck'
  | 'near_miss'
  | 'jackpot_drainer'
  | 'pure_scam';

export type ForcedOutcomeType = 'auto' | 'force_win' | 'force_loss';

export interface RiggedEngineConfig {
  globalRtp: number; // 0 to 100
  activeProfile: RiggedProfileType;
  forcedOutcome: ForcedOutcomeType;
  highBetThreshold: number; // e.g. Rp 100,000
  nearMissProbability: number; // 0.0 to 1.0 (default: 0.80)
  honeypotMaxWins?: number; // default: 3
  honeypotDrainRtp?: number; // default: 15%
  jackpotDrainerThresholdPercent?: number; // default: 0.20 (20% of balance)
}

export interface RiggedDecision {
  shouldWin: boolean;
  isRigged: boolean;
  riggedReason: string;
  isNearMiss: boolean;
  effectiveRtp: number;
  multiplierModifier: number; // multiplier scaling if win
  profileApplied: RiggedProfileType;
}

export interface SlotRiggedResult {
  isWin: boolean;
  multiplier: number;
  isNearMiss: boolean;
  scatterCount: number;
  triggerFreeSpins: boolean;
  riggedReason: string;
  isRigged: boolean;
}

export interface CrashRiggedResult {
  crashMultiplier: number;
  userCashedOut: boolean;
  payoutMultiplier: number;
  isNearMiss: boolean;
  riggedReason: string;
  isRigged: boolean;
}

export interface RouletteRiggedResult {
  winningNumber: number;
  winningColor: 'red' | 'black' | 'green';
  isWin: boolean;
  totalPayout: number;
  multiplier: number;
  isNearMiss: boolean;
  riggedReason: string;
  isRigged: boolean;
}

export interface DiceRiggedResult {
  rollValue: number; // 1 to 100 (or 2 to 12 for 2-dice sum)
  dice1: number;
  dice2: number;
  isWin: boolean;
  multiplier: number;
  isNearMiss: boolean;
  riggedReason: string;
  isRigged: boolean;
}

export interface TogelRiggedResult {
  drawNumbers: string; // 4-digit string, e.g. "4582"
  matchCount: number; // 0, 2, 3, or 4
  matchType: 'none' | '2d' | '3d' | '4d';
  isWin: boolean;
  multiplier: number;
  isNearMiss: boolean;
  riggedReason: string;
  isRigged: boolean;
}

export interface SportsRiggedResult {
  homeScore: number;
  awayScore: number;
  isWin: boolean;
  multiplier: number;
  isNearMiss: boolean;
  minuteOfDecidingGoal: number;
  riggedReason: string;
  isRigged: boolean;
}

/**
 * European Roulette standard wheel pocket layout (0-36)
 */
export const ROULETTE_WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const ROULETTE_RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
];

/**
 * Core Decision Interceptor: Evaluates whether a player should win or lose
 * based on the active profile, global RTP, forced outcome, balance ratio, and bet count.
 */
export function evaluateRiggedDecision(
  betAmount: number,
  currentBalance: number,
  roundsPlayed: number,
  config: RiggedEngineConfig
): RiggedDecision {
  const {
    globalRtp,
    activeProfile,
    forcedOutcome,
    highBetThreshold = 100_000,
    nearMissProbability = 0.80,
    honeypotMaxWins = 3,
    honeypotDrainRtp = 15,
    jackpotDrainerThresholdPercent = 0.20,
  } = config;

  // 1. Check for manual forced overrides (Highest Priority)
  if (forcedOutcome === 'force_win') {
    return {
      shouldWin: true,
      isRigged: true,
      riggedReason: 'Manual Override: Admin memaksakan Kemenangan (Force Win).',
      isNearMiss: false,
      effectiveRtp: 100,
      multiplierModifier: 2.5 + Math.random() * 3.0,
      profileApplied: activeProfile,
    };
  }

  if (forcedOutcome === 'force_loss') {
    const isNearMiss = Math.random() < nearMissProbability;
    return {
      shouldWin: false,
      isRigged: true,
      riggedReason: 'Manual Override: Admin memaksakan Kekalahan (Force Loss).',
      isNearMiss,
      effectiveRtp: 0,
      multiplierModifier: 0,
      profileApplied: activeProfile,
    };
  }

  // 2. Pure Scam Profile (100% loss guaranteed)
  if (activeProfile === 'pure_scam' || globalRtp === 0) {
    const isNearMiss = Math.random() < nearMissProbability;
    return {
      shouldWin: false,
      isRigged: true,
      riggedReason: 'Pure Scammer Profile: 0% RTP. Bandar menyedot 100% taruhan tanpa toleransi menang.',
      isNearMiss,
      effectiveRtp: 0,
      multiplierModifier: 0,
      profileApplied: 'pure_scam',
    };
  }

  // 3. Jackpot Drainer Profile / High Bet Interceptor
  const isHighBetAbsolute = betAmount >= highBetThreshold;
  const isHighBetRatio = currentBalance > 0 && (betAmount / currentBalance) >= jackpotDrainerThresholdPercent;

  if (activeProfile === 'jackpot_drainer' || (isHighBetAbsolute && activeProfile !== 'fair') || (isHighBetRatio && activeProfile !== 'fair')) {
    if (isHighBetAbsolute || isHighBetRatio || activeProfile === 'jackpot_drainer') {
      const isNearMiss = Math.random() < nearMissProbability;
      return {
        shouldWin: false,
        isRigged: true,
        riggedReason: `Jackpot Drainer: Taruhan ${isHighBetRatio ? 'melebihi 20% saldo' : 'melebihi threshold Rp ' + highBetThreshold.toLocaleString('id-ID')}. Algoritma mengunci kekalahan instan.`,
        isNearMiss,
        effectiveRtp: 5,
        multiplierModifier: 0,
        profileApplied: 'jackpot_drainer',
      };
    }
  }

  // 4. Beginner's Luck / Honeypot Profile
  if (activeProfile === 'beginners_luck') {
    if (roundsPlayed < honeypotMaxWins) {
      // Guaranteed early dopamine win (150% - 300% RTP)
      return {
        shouldWin: true,
        isRigged: true,
        riggedReason: `Beginner's Luck (Honeypot): Putaran ke-${roundsPlayed + 1}/${honeypotMaxWins}. Bandar memberi kemenangan manipulatif untuk memicu kecanduan awal.`,
        isNearMiss: false,
        effectiveRtp: 180,
        multiplierModifier: 2.0 + Math.random() * 4.0,
        profileApplied: 'beginners_luck',
      };
    } else {
      // Aggressive drop to 15% RTP (90% loss rate)
      const roll = Math.random() * 100;
      const shouldWin = roll < honeypotDrainRtp;
      const isNearMiss = !shouldWin && Math.random() < nearMissProbability;

      return {
        shouldWin,
        isRigged: true,
        riggedReason: `Beginner's Luck Trap: Masa pancingan habis (RTP jatuh ke ${honeypotDrainRtp}%). Bandar mulai menguras modal pemain secara agresif.`,
        isNearMiss,
        effectiveRtp: honeypotDrainRtp,
        multiplierModifier: shouldWin ? 1.2 : 0,
        profileApplied: 'beginners_luck',
      };
    }
  }

  // 5. Near-Miss Generator Profile
  if (activeProfile === 'near_miss') {
    const roll = Math.random() * 100;
    const shouldWin = roll < globalRtp;
    const isNearMiss = !shouldWin && Math.random() < nearMissProbability;

    return {
      shouldWin,
      isRigged: true,
      riggedReason: shouldWin
        ? `Near-Miss Mode: Kemenangan wajar terdistribusi (RTP ${globalRtp}%).`
        : `Near-Miss Generator: Kekalahan dimodifikasi visualnya agar pemain merasa 'nyaris menang' untuk memicu dopamin striatum.`,
      isNearMiss,
      effectiveRtp: globalRtp,
      multiplierModifier: shouldWin ? 1.5 + Math.random() * 2.0 : 0,
      profileApplied: 'near_miss',
    };
  }

  // 6. Fair Profile (Standard statistical baseline)
  if (activeProfile === 'fair') {
    const fairRtp = Math.max(95, Math.min(98, globalRtp));
    const roll = Math.random() * 100;
    const shouldWin = roll < fairRtp;

    return {
      shouldWin,
      isRigged: false,
      riggedReason: `Fair Simulation: RNG probabilistik wajar berbasis RTP ${fairRtp}%. Tidak ada manipulasi bias bandar.`,
      isNearMiss: !shouldWin && Math.random() < 0.25, // Natural low near-miss
      effectiveRtp: fairRtp,
      multiplierModifier: shouldWin ? 1.0 + Math.random() * 3.0 : 0,
      profileApplied: 'fair',
    };
  }

  // Default fallback according to globalRtp
  const roll = Math.random() * 100;
  const shouldWin = roll < globalRtp;
  const isNearMiss = !shouldWin && Math.random() < nearMissProbability;

  return {
    shouldWin,
    isRigged: globalRtp < 90,
    riggedReason: `Dynamic RTP Interceptor (${globalRtp}%). House Edge: ${100 - globalRtp}%.`,
    isNearMiss,
    effectiveRtp: globalRtp,
    multiplierModifier: shouldWin ? 1.2 + Math.random() * 2.0 : 0,
    profileApplied: 'fair',
  };
}

/**
 * =========================================================================
 * 1. SLOT OLYMPUS INTERCEPTOR
 * =========================================================================
 * Intercepts 6x5 reel cascade, scatter pays (8+ matching), and multiplier orbs.
 */
export function interceptSlotSpin(
  betAmount: number,
  balance: number,
  roundsPlayed: number,
  config: RiggedEngineConfig
): SlotRiggedResult {
  const decision = evaluateRiggedDecision(betAmount, balance, roundsPlayed, config);

  if (decision.shouldWin) {
    // Win calculation
    const baseMultiplier = decision.multiplierModifier > 0 ? decision.multiplierModifier : (1.5 + Math.random() * 4.0);
    const hasFreeSpins = Math.random() < 0.20 || decision.profileApplied === 'beginners_luck';
    const scatterCount = hasFreeSpins ? 4 : (Math.random() < 0.3 ? 3 : 2);

    return {
      isWin: true,
      multiplier: Number(baseMultiplier.toFixed(2)),
      isNearMiss: false,
      scatterCount,
      triggerFreeSpins: hasFreeSpins,
      riggedReason: decision.riggedReason,
      isRigged: decision.isRigged,
    };
  } else {
    // Loss calculation
    const isNearMiss = decision.isNearMiss;
    // In slot, near-miss = exactly 3 scatters when 4 are required for free spins!
    const scatterCount = isNearMiss ? 3 : Math.floor(Math.random() * 2);

    return {
      isWin: false,
      multiplier: 0,
      isNearMiss,
      scatterCount,
      triggerFreeSpins: false,
      riggedReason: isNearMiss
        ? `Slot Near-Miss Trap: Bandar memunculkan tepat 3 Scatter (kurang 1 untuk Jackpot Free Spins) untuk menipu persepsi pemain.`
        : decision.riggedReason,
      isRigged: decision.isRigged,
    };
  }
}

/**
 * =========================================================================
 * 2. CRASH / AVIATOR ROCKET INTERCEPTOR
 * =========================================================================
 * Intercepts exponential rocket curve.
 */
export function interceptCrashMultiplier(
  targetCashout: number,
  betAmount: number,
  balance: number,
  roundsPlayed: number,
  config: RiggedEngineConfig
): CrashRiggedResult {
  const decision = evaluateRiggedDecision(betAmount, balance, roundsPlayed, config);

  if (decision.shouldWin) {
    // Rocket survives well past user target
    const extra = 0.5 + Math.random() * 5.0;
    const crashMultiplier = Number((Math.max(1.2, targetCashout) + extra).toFixed(2));

    return {
      crashMultiplier,
      userCashedOut: true,
      payoutMultiplier: targetCashout > 1 ? targetCashout : 1.5,
      isNearMiss: false,
      riggedReason: decision.riggedReason,
      isRigged: decision.isRigged,
    };
  } else {
    // Loss outcome
    let crashMultiplier: number;

    if (decision.isNearMiss && targetCashout > 1.05) {
      // Explode right before user cashout (e.g. user set 2.00x -> crash at 1.98x)
      const diff = Math.min(0.08, (targetCashout - 1.0) * 0.1);
      crashMultiplier = Number(Math.max(1.01, targetCashout - (0.01 + Math.random() * diff)).toFixed(2));
    } else if (decision.profileApplied === 'jackpot_drainer' || decision.profileApplied === 'pure_scam') {
      // Instant instant-pop at 1.00x - 1.02x
      crashMultiplier = Number((1.00 + Math.random() * 0.02).toFixed(2));
    } else {
      // Normal early crash
      crashMultiplier = Number((1.05 + Math.random() * Math.max(0.1, (targetCashout - 1.1))).toFixed(2));
    }

    return {
      crashMultiplier,
      userCashedOut: false,
      payoutMultiplier: 0,
      isNearMiss: decision.isNearMiss,
      riggedReason: decision.isNearMiss
        ? `Crash Near-Miss Trap: Roket meledak di ${crashMultiplier}x (tepat sebelum target ${targetCashout}x).`
        : decision.riggedReason,
      isRigged: decision.isRigged,
    };
  }
}

/**
 * =========================================================================
 * 3. EUROPEAN ROULETTE INTERCEPTOR
 * =========================================================================
 * Intercepts 37-pocket wheel and betting options (Red/Black, Odd/Even, Numbers).
 */
export function interceptRouletteResult(
  bets: Array<{ type: string; value: string | number; amount: number }>,
  balance: number,
  roundsPlayed: number,
  config: RiggedEngineConfig
): RouletteRiggedResult {
  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);
  const decision = evaluateRiggedDecision(totalBet, balance, roundsPlayed, config);

  if (decision.shouldWin) {
    // Choose a winning number matching the primary bet if possible
    let winningNumber = Math.floor(Math.random() * 37);

    const primaryBet = bets[0];
    if (primaryBet) {
      if (primaryBet.type === 'straight' && typeof primaryBet.value === 'number') {
        winningNumber = primaryBet.value;
      } else if (primaryBet.type === 'color') {
        const isRed = primaryBet.value === 'red';
        const colorPool = isRed ? ROULETTE_RED_NUMBERS : ROULETTE_WHEEL_ORDER.filter(n => n !== 0 && !ROULETTE_RED_NUMBERS.includes(n));
        winningNumber = colorPool[Math.floor(Math.random() * colorPool.length)];
      } else if (primaryBet.type === 'parity') {
        const isEven = primaryBet.value === 'even';
        const parityPool = ROULETTE_WHEEL_ORDER.filter(n => n !== 0 && (n % 2 === 0) === isEven);
        winningNumber = parityPool[Math.floor(Math.random() * parityPool.length)];
      }
    }

    const isRed = ROULETTE_RED_NUMBERS.includes(winningNumber);
    const color = winningNumber === 0 ? 'green' : isRed ? 'red' : 'black';

    // Calculate payout
    let totalPayout = 0;
    bets.forEach(b => {
      if (b.type === 'straight' && Number(b.value) === winningNumber) {
        totalPayout += b.amount * 36;
      } else if (b.type === 'color' && b.value === color) {
        totalPayout += b.amount * 2;
      } else if (b.type === 'parity' && winningNumber !== 0 && ((winningNumber % 2 === 0 && b.value === 'even') || (winningNumber % 2 !== 0 && b.value === 'odd'))) {
        totalPayout += b.amount * 2;
      }
    });

    if (totalPayout === 0) {
      totalPayout = totalBet * 2; // Guarantee win payout
    }

    return {
      winningNumber,
      winningColor: color,
      isWin: true,
      totalPayout,
      multiplier: Number((totalPayout / Math.max(1, totalBet)).toFixed(2)),
      isNearMiss: false,
      riggedReason: decision.riggedReason,
      isRigged: decision.isRigged,
    };
  } else {
    // Loss outcome: pick a number that makes user lose (or adjacent pocket for near miss)
    let winningNumber = 0; // Default zero house edge trap

    const straightBet = bets.find(b => b.type === 'straight' && typeof b.value === 'number');

    if (decision.isNearMiss && straightBet) {
      // Find wheel index of straight bet, pick adjacent pocket!
      const targetNum = Number(straightBet.value);
      const wheelIdx = ROULETTE_WHEEL_ORDER.indexOf(targetNum);
      if (wheelIdx !== -1) {
        const neighborIdx = (wheelIdx + 1) % ROULETTE_WHEEL_ORDER.length;
        winningNumber = ROULETTE_WHEEL_ORDER[neighborIdx];
      }
    } else {
      // Pick a number that doesn't hit player bets
      const redBet = bets.some(b => b.type === 'color' && b.value === 'red');
      const blackBet = bets.some(b => b.type === 'color' && b.value === 'black');

      if (redBet && !blackBet) {
        // Pick black or 0
        const blackPool = [0, ...ROULETTE_WHEEL_ORDER.filter(n => n !== 0 && !ROULETTE_RED_NUMBERS.includes(n))];
        winningNumber = blackPool[Math.floor(Math.random() * blackPool.length)];
      } else if (blackBet && !redBet) {
        // Pick red or 0
        const redPool = [0, ...ROULETTE_RED_NUMBERS];
        winningNumber = redPool[Math.floor(Math.random() * redPool.length)];
      } else {
        winningNumber = 0; // Green zero house wipeout
      }
    }

    const isRed = ROULETTE_RED_NUMBERS.includes(winningNumber);
    const color = winningNumber === 0 ? 'green' : isRed ? 'red' : 'black';

    return {
      winningNumber,
      winningColor: color,
      isWin: false,
      totalPayout: 0,
      multiplier: 0,
      isNearMiss: decision.isNearMiss,
      riggedReason: decision.isNearMiss
        ? `Roulette Near-Miss Trap: Bola mendarat di angka tetangga wheel pocket (${winningNumber}) tepat di sebelah taruhan Anda.`
        : decision.riggedReason,
      isRigged: decision.isRigged,
    };
  }
}

/**
 * =========================================================================
 * 4. DICE ROLL (OVER / UNDER) INTERCEPTOR
 * =========================================================================
 * Target slider (1-100) or Sum betting.
 */
export function interceptDiceRoll(
  targetNumber: number,
  isOver: boolean,
  betAmount: number,
  balance: number,
  roundsPlayed: number,
  config: RiggedEngineConfig
): DiceRiggedResult {
  const decision = evaluateRiggedDecision(betAmount, balance, roundsPlayed, config);

  if (decision.shouldWin) {
    let rollValue: number;
    if (isOver) {
      rollValue = Math.min(99, targetNumber + 1 + Math.floor(Math.random() * Math.max(1, 99 - targetNumber)));
    } else {
      rollValue = Math.max(1, targetNumber - 1 - Math.floor(Math.random() * Math.max(1, targetNumber - 1)));
    }

    // Convert rollValue into 2 dice
    const dice1 = Math.min(6, Math.max(1, Math.floor(rollValue / 16) + 1));
    const dice2 = Math.min(6, Math.max(1, Math.floor((rollValue % 16) / 3) + 1));

    const winProbability = isOver ? (100 - targetNumber) / 100 : targetNumber / 100;
    const multiplier = Number((0.98 / Math.max(0.01, winProbability)).toFixed(2));

    return {
      rollValue,
      dice1,
      dice2,
      isWin: true,
      multiplier,
      isNearMiss: false,
      riggedReason: decision.riggedReason,
      isRigged: decision.isRigged,
    };
  } else {
    // Loss outcome: roll value lands outside winning criteria
    let rollValue: number;

    if (decision.isNearMiss) {
      // EXACTLY 1 POINT OFF! (e.g. Over 50 -> lands on 49 or 50)
      rollValue = isOver ? targetNumber - 1 : targetNumber + 1;
      rollValue = Math.max(1, Math.min(99, rollValue));
    } else {
      // Standard loss value
      if (isOver) {
        rollValue = Math.max(1, Math.floor(Math.random() * targetNumber));
      } else {
        rollValue = Math.min(99, targetNumber + Math.floor(Math.random() * (100 - targetNumber)));
      }
    }

    const dice1 = Math.min(6, Math.max(1, Math.floor(rollValue / 16) + 1));
    const dice2 = Math.min(6, Math.max(1, Math.floor((rollValue % 16) / 3) + 1));

    return {
      rollValue,
      dice1,
      dice2,
      isWin: false,
      multiplier: 0,
      isNearMiss: decision.isNearMiss,
      riggedReason: decision.isNearMiss
        ? `Dice Near-Miss Trap: Dadu keluar angka ${rollValue} (selisih tepat 1 angka dari batas target ${targetNumber}).`
        : decision.riggedReason,
      isRigged: decision.isRigged,
    };
  }
}

/**
 * =========================================================================
 * 5. TOGEL 4D / LOTTERY INTERCEPTOR
 * =========================================================================
 * Intercepts 4D, 3D, 2D lottery draws and liabilities.
 */
export function interceptTogelDraw(
  userTicket: string, // e.g. "4582"
  ticketType: '2d' | '3d' | '4d',
  betAmount: number,
  balance: number,
  roundsPlayed: number,
  config: RiggedEngineConfig
): TogelRiggedResult {
  const decision = evaluateRiggedDecision(betAmount, balance, roundsPlayed, config);
  const cleanTicket = userTicket.padStart(4, '0').slice(-4);

  if (decision.shouldWin) {
    let drawNumbers = cleanTicket;
    let multiplier = 3000; // 4D standard payout

    if (ticketType === '2d') {
      // 2D win: last 2 digits match
      const prefix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      drawNumbers = prefix + cleanTicket.slice(2);
      multiplier = 70;
    } else if (ticketType === '3d') {
      // 3D win: last 3 digits match
      const prefix = Math.floor(Math.random() * 10).toString();
      drawNumbers = prefix + cleanTicket.slice(1);
      multiplier = 400;
    }

    return {
      drawNumbers,
      matchCount: ticketType === '4d' ? 4 : ticketType === '3d' ? 3 : 2,
      matchType: ticketType,
      isWin: true,
      multiplier,
      isNearMiss: false,
      riggedReason: decision.riggedReason,
      isRigged: decision.isRigged,
    };
  } else {
    // Loss outcome
    let drawNumbers: string;

    if (decision.isNearMiss) {
      // Near miss: 3 of 4 digits match, last digit is off by exactly 1!
      const lastDigit = parseInt(cleanTicket[3], 10);
      const alteredDigit = (lastDigit + 1) % 10;
      drawNumbers = cleanTicket.slice(0, 3) + alteredDigit.toString();
    } else {
      // Random non-matching 4D number
      let rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      if (rand === cleanTicket) {
        rand = ((parseInt(rand, 10) + 123) % 10000).toString().padStart(4, '0');
      }
      drawNumbers = rand;
    }

    return {
      drawNumbers,
      matchCount: decision.isNearMiss ? 3 : 0,
      matchType: 'none',
      isWin: false,
      multiplier: 0,
      isNearMiss: decision.isNearMiss,
      riggedReason: decision.isNearMiss
        ? `Togel Near-Miss Trap: Angka keluar ${drawNumbers} (hanya beda 1 angka terakhir dari tiket ${cleanTicket} Anda).`
        : decision.riggedReason,
      isRigged: decision.isRigged,
    };
  }
}

/**
 * =========================================================================
 * 6. TEBAK SKOR BOLA / SPORTSBOOK INTERCEPTOR
 * =========================================================================
 * Intercepts match simulation and late injury-time goal traps.
 */
export function interceptSportsMatch(
  userPick: 'home' | 'draw' | 'away',
  odds: number,
  betAmount: number,
  balance: number,
  roundsPlayed: number,
  config: RiggedEngineConfig
): SportsRiggedResult {
  const decision = evaluateRiggedDecision(betAmount, balance, roundsPlayed, config);

  if (decision.shouldWin) {
    let homeScore = 2;
    let awayScore = 1;

    if (userPick === 'home') {
      homeScore = 2 + Math.floor(Math.random() * 2);
      awayScore = Math.floor(Math.random() * 2);
    } else if (userPick === 'away') {
      homeScore = Math.floor(Math.random() * 2);
      awayScore = 2 + Math.floor(Math.random() * 2);
    } else {
      homeScore = 1;
      awayScore = 1;
    }

    return {
      homeScore,
      awayScore,
      isWin: true,
      multiplier: odds,
      isNearMiss: false,
      minuteOfDecidingGoal: 78,
      riggedReason: decision.riggedReason,
      isRigged: decision.isRigged,
    };
  } else {
    // Loss outcome
    let homeScore = 1;
    let awayScore = 1;
    let minuteOfDecidingGoal = 90 + Math.floor(Math.random() * 5); // 90+1 to 90+4

    if (decision.isNearMiss) {
      // In football betting, near-miss is leading until injury time (90+4') then opponent equalizes/scores!
      if (userPick === 'home') {
        homeScore = 1;
        awayScore = 2; // Opponent scored in 90+4'
      } else if (userPick === 'away') {
        homeScore = 2;
        awayScore = 1;
      } else {
        homeScore = 2;
        awayScore = 1;
      }
    } else {
      if (userPick === 'home') {
        homeScore = 0;
        awayScore = 3;
      } else if (userPick === 'away') {
        homeScore = 3;
        awayScore = 0;
      } else {
        homeScore = 2;
        awayScore = 0;
      }
      minuteOfDecidingGoal = 55;
    }

    return {
      homeScore,
      awayScore,
      isWin: false,
      multiplier: 0,
      isNearMiss: decision.isNearMiss,
      minuteOfDecidingGoal,
      riggedReason: decision.isNearMiss
        ? `Sportsbook Near-Miss Trap: Tim Anda unggul hingga menit ke-${minuteOfDecidingGoal}' sebelum gol musuh membuyarkan kemenangan.`
        : decision.riggedReason,
      isRigged: decision.isRigged,
    };
  }
}
