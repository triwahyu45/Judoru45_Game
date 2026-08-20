/**
 * Judoru45_Game - Rigged Engine & Admin System Test Suite
 * 
 * Verifies mathematical integrity, behavioral profile invariants,
 * game outcome interceptors, and loss conversion models.
 */

import {
  evaluateRiggedDecision,
  interceptSlotSpin,
  interceptCrashMultiplier,
  interceptRouletteResult,
  interceptDiceRoll,
  interceptTogelDraw,
  interceptSportsMatch,
  RiggedEngineConfig,
  ROULETTE_WHEEL_ORDER,
  ROULETTE_RED_NUMBERS,
} from '../lib/math/riggedEngine';

import {
  calculateLossEquivalents,
  getPrimaryLossEquivalent,
  REAL_WORLD_ITEMS,
} from '../lib/utils/lossConverter';

import { formatIDR, parseIDR } from '../lib/utils/currency';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('====================================================');
console.log('   JUDORU45_GAME - M5 & M6 VERIFICATION SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// TIER 1: Rigged Engine Profiles & Decision Invariants
// ----------------------------------------------------
console.log('[Tier 1] Testing Rigged Engine Behavioral Profiles...');

// 1.1 Pure Scam Profile (0% RTP)
const pureScamConfig: RiggedEngineConfig = {
  globalRtp: 0,
  activeProfile: 'pure_scam',
  forcedOutcome: 'auto',
  highBetThreshold: 100_000,
  nearMissProbability: 0.8,
};

for (let i = 0; i < 20; i++) {
  const decision = evaluateRiggedDecision(10_000, 500_000, i, pureScamConfig);
  assert(!decision.shouldWin, `Pure Scam must NEVER yield a win (iteration ${i + 1})`);
  assert(decision.effectiveRtp === 0, 'Pure Scam effective RTP must be 0%');
  assert(decision.isRigged, 'Pure Scam must be flagged as rigged');
}

// 1.2 Beginner's Luck (Honeypot) Profile
const honeypotConfig: RiggedEngineConfig = {
  globalRtp: 35,
  activeProfile: 'beginners_luck',
  forcedOutcome: 'auto',
  highBetThreshold: 100_000,
  nearMissProbability: 0.8,
  honeypotMaxWins: 3,
  honeypotDrainRtp: 15,
};

// First 3 bets MUST be guaranteed wins
for (let round = 0; round < 3; round++) {
  const decision = evaluateRiggedDecision(10_000, 500_000, round, honeypotConfig);
  assert(decision.shouldWin, `Honeypot round ${round + 1} must be a guaranteed WIN`);
  assert(decision.effectiveRtp >= 150, `Honeypot round ${round + 1} must have 150%+ RTP`);
  assert(decision.multiplierModifier >= 2.0, `Honeypot round ${round + 1} multiplier must be >= 2.0x`);
}

// 1.3 Jackpot Drainer Profile (High Bet / Balance Ratio Trap)
const jackpotDrainerConfig: RiggedEngineConfig = {
  globalRtp: 35,
  activeProfile: 'jackpot_drainer',
  forcedOutcome: 'auto',
  highBetThreshold: 100_000,
  nearMissProbability: 0.8,
  jackpotDrainerThresholdPercent: 0.20,
};

// Normal bet with high threshold breach
const bigBetDecision = evaluateRiggedDecision(150_000, 1_000_000, 5, jackpotDrainerConfig);
assert(!bigBetDecision.shouldWin, 'High bet exceeding threshold must trigger immediate loss');
assert(bigBetDecision.profileApplied === 'jackpot_drainer', 'Profile applied must be jackpot_drainer');

// High balance ratio breach (> 20% balance)
const ratioBetDecision = evaluateRiggedDecision(40_000, 100_000, 5, jackpotDrainerConfig);
assert(!ratioBetDecision.shouldWin, 'Bet exceeding 20% of balance must trigger immediate loss');

// 1.4 Manual Forced Overrides
const forceWinConfig: RiggedEngineConfig = {
  globalRtp: 0,
  activeProfile: 'pure_scam', // Even under pure scam!
  forcedOutcome: 'force_win',
  highBetThreshold: 100_000,
  nearMissProbability: 0.8,
};
const forcedWinDecision = evaluateRiggedDecision(10_000, 500_000, 5, forceWinConfig);
assert(forcedWinDecision.shouldWin, 'force_win must override profile and guarantee win');
assert(forcedWinDecision.multiplierModifier > 0, 'force_win must provide positive multiplier');

const forceLossConfig: RiggedEngineConfig = {
  globalRtp: 100,
  activeProfile: 'fair', // Even under fair/100% RTP!
  forcedOutcome: 'force_loss',
  highBetThreshold: 100_000,
  nearMissProbability: 0.8,
};
const forcedLossDecision = evaluateRiggedDecision(10_000, 500_000, 0, forceLossConfig);
assert(!forcedLossDecision.shouldWin, 'force_loss must override profile and guarantee loss');

console.log('\n[Tier 2] Testing 6 Mini-Game Interceptors...');

// ----------------------------------------------------
// TIER 2: 6 Mini-Game Interceptors
// ----------------------------------------------------

// 2.1 Slot Olympus Interceptor
const slotWin = interceptSlotSpin(10_000, 500_000, 0, forceWinConfig);
assert(slotWin.isWin, 'Slot spin with force_win must produce win');
assert(slotWin.multiplier >= 1.5, 'Slot winning multiplier must be >= 1.5x');

const slotNearMiss = interceptSlotSpin(10_000, 500_000, 5, {
  ...pureScamConfig,
  nearMissProbability: 1.0, // Force near miss
});
assert(!slotNearMiss.isWin, 'Slot near-miss must be a loss');
assert(slotNearMiss.scatterCount === 3, 'Slot near-miss must output exactly 3 scatters (1 short of 4 for Free Spins)');

// 2.2 Crash / Aviator Rocket Interceptor
const crashWin = interceptCrashMultiplier(2.0, 10_000, 500_000, 0, forceWinConfig);
assert(crashWin.userCashedOut, 'Crash with force_win must allow successful cashout');
assert(crashWin.crashMultiplier > 2.0, 'Crash rocket multiplier must exceed target cashout');

const crashNearMiss = interceptCrashMultiplier(2.0, 10_000, 500_000, 5, {
  ...pureScamConfig,
  nearMissProbability: 1.0,
});
assert(!crashNearMiss.userCashedOut, 'Crash near-miss must result in explosion before cashout');
assert(crashNearMiss.crashMultiplier < 2.0 && crashNearMiss.crashMultiplier >= 1.90, `Crash near-miss must explode just before 2.0x (got ${crashNearMiss.crashMultiplier}x)`);

// 2.3 European Roulette Interceptor
const rouletteBets = [{ type: 'color', value: 'red', amount: 10_000 }];
const rouletteWin = interceptRouletteResult(rouletteBets, 500_000, 0, forceWinConfig);
assert(rouletteWin.isWin, 'Roulette with force_win must win');
assert(ROULETTE_RED_NUMBERS.includes(rouletteWin.winningNumber), 'Winning number must be a red pocket');

const rouletteStraightBets = [{ type: 'straight', value: 17, amount: 10_000 }];
const rouletteNearMiss = interceptRouletteResult(rouletteStraightBets, 500_000, 5, {
  ...pureScamConfig,
  nearMissProbability: 1.0,
});
assert(!rouletteNearMiss.isWin, 'Roulette straight bet near miss must lose');
const idx17 = ROULETTE_WHEEL_ORDER.indexOf(17);
const expectedNeighbor = ROULETTE_WHEEL_ORDER[(idx17 + 1) % ROULETTE_WHEEL_ORDER.length];
assert(rouletteNearMiss.winningNumber === expectedNeighbor, `Roulette near-miss must land on neighbor pocket ${expectedNeighbor}`);

// 2.4 Dice Roll (Over/Under) Interceptor
const diceWin = interceptDiceRoll(50, true, 10_000, 500_000, 0, forceWinConfig);
assert(diceWin.isWin, 'Dice Over 50 with force_win must win');
assert(diceWin.rollValue > 50, 'Dice roll value must be > 50');

const diceNearMiss = interceptDiceRoll(50, true, 10_000, 500_000, 5, {
  ...pureScamConfig,
  nearMissProbability: 1.0,
});
assert(!diceNearMiss.isWin, 'Dice Over 50 near miss must lose');
assert(diceNearMiss.rollValue === 49, `Dice Over 50 near miss must produce exactly 49 (got ${diceNearMiss.rollValue})`);

// 2.5 Togel 4D Lottery Interceptor
const togelWin = interceptTogelDraw('4582', '4d', 10_000, 500_000, 0, forceWinConfig);
assert(togelWin.isWin && togelWin.drawNumbers === '4582', 'Togel 4D with force_win must draw 4582');
assert(togelWin.multiplier === 3000, 'Togel 4D multiplier must be 3000x');

const togelNearMiss = interceptTogelDraw('4582', '4d', 10_000, 500_000, 5, {
  ...pureScamConfig,
  nearMissProbability: 1.0,
});
assert(!togelNearMiss.isWin, 'Togel near miss must be a loss');
assert(togelNearMiss.drawNumbers === '4583', `Togel near miss for 4582 must output 4583 (off by exactly 1 on last digit, got ${togelNearMiss.drawNumbers})`);

// 2.6 Sportsbook (Tebak Skor) Interceptor
const sportsWin = interceptSportsMatch('home', 1.85, 10_000, 500_000, 0, forceWinConfig);
assert(sportsWin.isWin, 'Sportsbook Home bet with force_win must win');
assert(sportsWin.homeScore > sportsWin.awayScore, 'Home score must exceed away score');

const sportsNearMiss = interceptSportsMatch('home', 1.85, 10_000, 500_000, 5, {
  ...pureScamConfig,
  nearMissProbability: 1.0,
});
assert(!sportsNearMiss.isWin, 'Sportsbook near miss must lose');
assert(sportsNearMiss.minuteOfDecidingGoal >= 90, `Sportsbook near miss must have deciding goal in 90+ min injury time (got ${sportsNearMiss.minuteOfDecidingGoal}')`);

console.log('\n[Tier 3] Testing Real-World Loss Converter Math...');

// ----------------------------------------------------
// TIER 3: Real-World Loss Converter Math
// ----------------------------------------------------
const losses = calculateLossEquivalents(50_000_000);
const padang = losses.find(i => i.id === 'nasi_padang');
assert(padang !== undefined, 'Nasi Padang equivalent exists');
assert(padang?.count === 50_000_000 / 15_000, 'Nasi Padang count calculation is exact');

const vario = losses.find(i => i.id === 'motor_vario');
assert(vario?.count === 2, 'Rp 50.000.000 equals exactly 2 motor Vario units');

const primaryHero = getPrimaryLossEquivalent(100_000_000);
assert(primaryHero.id === 'motor_vario', 'Massive loss prioritizes motor vario');

console.log('\n====================================================');
console.log('  ✨ ALL RIGGED ENGINE & M5/M6 TESTS PASSED (100%) ✨');
console.log('====================================================');
