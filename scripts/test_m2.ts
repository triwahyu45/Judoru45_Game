/**
 * Judoru45_Game - M2 Automated Verification Script
 * Comprehensive testing of Slot Olympus (6x5 cascade, scatter pays, multiplier orbs, free spins, rigged hooks)
 * and Crash Aviator (M(t) = e^0.06t, crash point distribution, instant cashout, rigged sniper).
 */

import {
  SLOT_SYMBOLS,
  GRID_COLS,
  GRID_ROWS,
  getPaytableMultiplier,
  getRandomMultiplierOrbValue,
  getOrbTierColor,
  pickRandomSymbol,
  createCell,
  countGridSymbols,
  evaluateOlympusSpin,
  isLossDisguisedAsWin,
  SymbolId,
} from '../lib/math/slotMath';

import {
  GROWTH_RATE_K,
  getMultiplierAtTime,
  getTimeToMultiplier,
  calculateCrashPoint,
  calculateCashOut,
} from '../lib/math/crashMath';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('====================================================');
console.log('   Judoru45 M2 Verification Suite (Games Pack A)    ');
console.log('====================================================');

// =========================================================================
// SECTION 1: Slot Olympus (Zeus Machine) Mathematical Verification
// =========================================================================
console.log('\n[1] Testing Slot Olympus Grid & Symbol Definitions...');
assert(GRID_COLS === 6, 'Grid columns must be exactly 6');
assert(GRID_ROWS === 5, 'Grid rows must be exactly 5');
assert(Object.keys(SLOT_SYMBOLS).length === 10, 'Must contain exactly 10 symbols (9 pay + 1 scatter)');

// Paytable Multiplier checks
console.log('\n[2] Testing Scatter Pays (8+ matching anywhere) Paytable Multipliers...');
// Crown (High tier): 8-9 -> 10x, 10-11 -> 25x, 12+ -> 50x
assert(getPaytableMultiplier('SYM_CROWN', 7) === 0, 'Crown < 8 matches must pay 0');
assert(getPaytableMultiplier('SYM_CROWN', 8) === 10.0, 'Crown 8 matches must pay 10.0x');
assert(getPaytableMultiplier('SYM_CROWN', 9) === 10.0, 'Crown 9 matches must pay 10.0x');
assert(getPaytableMultiplier('SYM_CROWN', 10) === 25.0, 'Crown 10 matches must pay 25.0x');
assert(getPaytableMultiplier('SYM_CROWN', 11) === 25.0, 'Crown 11 matches must pay 25.0x');
assert(getPaytableMultiplier('SYM_CROWN', 12) === 50.0, 'Crown 12 matches must pay 50.0x');
assert(getPaytableMultiplier('SYM_CROWN', 30) === 50.0, 'Crown 30 matches must pay 50.0x');

// Hourglass (High tier): 8-9 -> 2.5x, 10-11 -> 10.0x, 12+ -> 25.0x
assert(getPaytableMultiplier('SYM_HOURGLASS', 8) === 2.5, 'Hourglass 8 matches must pay 2.5x');
assert(getPaytableMultiplier('SYM_HOURGLASS', 10) === 10.0, 'Hourglass 10 matches must pay 10.0x');
assert(getPaytableMultiplier('SYM_HOURGLASS', 15) === 25.0, 'Hourglass 15 matches must pay 25.0x');

// Low Gems: Blue Gem 8-9 -> 0.25x, 10-11 -> 0.75x, 12+ -> 2.0x
assert(getPaytableMultiplier('SYM_GEM_BLUE', 8) === 0.25, 'Blue Gem 8 matches must pay 0.25x');
assert(getPaytableMultiplier('SYM_GEM_BLUE', 10) === 0.75, 'Blue Gem 10 matches must pay 0.75x');
assert(getPaytableMultiplier('SYM_GEM_BLUE', 12) === 2.0, 'Blue Gem 12 matches must pay 2.0x');

// Zeus Scatter: 4 -> 3x, 5 -> 5x, 6+ -> 100x
assert(getPaytableMultiplier('SYM_SCATTER', 3) === 0, 'Scatter 3 matches must pay 0 base win');
assert(getPaytableMultiplier('SYM_SCATTER', 4) === 3.0, 'Scatter 4 matches must pay 3.0x');
assert(getPaytableMultiplier('SYM_SCATTER', 5) === 5.0, 'Scatter 5 matches must pay 5.0x');
assert(getPaytableMultiplier('SYM_SCATTER', 6) === 100.0, 'Scatter 6 matches must pay 100.0x');

console.log('\n[3] Testing Multiplier Orbs & Tier Color Styling...');
for (let i = 0; i < 20; i++) {
  const orb = getRandomMultiplierOrbValue();
  assert(
    [2, 3, 4, 5, 10, 15, 20, 25, 50, 100, 250, 500].includes(orb),
    `Generated orb ${orb}x must be a valid Olympus multiplier tier`
  );
}
assert(getOrbTierColor(2).border === '#10B981', '2x orb has Green tier styling');
assert(getOrbTierColor(15).border === '#38BDF8', '15x orb has Blue tier styling');
assert(getOrbTierColor(100).border === '#A855F7', '100x orb has Purple tier styling');
assert(getOrbTierColor(500).border === '#EF4444', '500x orb has Gold/Red legendary styling');

console.log('\n[4] Testing Cascading Spin Evaluation & Rigged Hooks...');
// Standard Spin evaluation
const testBet = 10_000;
const spinResult = evaluateOlympusSpin(testBet, 'fair', 96.5);
assert(spinResult.steps.length >= 1, 'Spin result must contain at least 1 cascade step');
assert(spinResult.initialGrid.length === 6, 'Initial grid columns must be 6');
assert(spinResult.initialGrid[0].length === 5, 'Initial grid rows must be 5');

// Forced Win evaluation
const forcedWinSpin = evaluateOlympusSpin(testBet, 'fair', 96.5, false, 0, { forcedOutcome: 'force_win' });
assert(forcedWinSpin.steps.length >= 1, 'Forced win evaluation must produce valid steps');

// Near-Miss 3 Scatters Tease Test
let foundNearMiss = false;
for (let i = 0; i < 30; i++) {
  const nmSpin = evaluateOlympusSpin(testBet, 'near_miss', 25.0, false, 0, {
    forcedOutcome: 'force_loss',
    nearMissProbability: 1.0,
  });
  if (nmSpin.isNearMiss) {
    foundNearMiss = true;
    assert(nmSpin.scatterCount === 3, 'Near miss spin must contain exactly 3 Scatters');
    assert(nmSpin.freeSpinsTriggered === false, 'Near miss must NOT trigger free spins (4 required)');
    break;
  }
}
assert(foundNearMiss, 'Near-Miss 3 Scatters hook must trigger under rigged profile');

// Losses Disguised as Wins (LDW) Utility Test
assert(isLossDisguisedAsWin(2_500, 10_000) === true, 'Bet 10k, Win 2.5k IS a Loss Disguised as Win');
assert(isLossDisguisedAsWin(0, 10_000) === false, 'Bet 10k, Win 0 is a pure loss, not LDW');
assert(isLossDisguisedAsWin(15_000, 10_000) === false, 'Bet 10k, Win 15k is a genuine win, not LDW');

// =========================================================================
// SECTION 2: Crash Aviator Rocket Mathematical Verification
// =========================================================================
console.log('\n[5] Testing Exponential Growth Curve M(t) = e^(0.06t)...');
assert(GROWTH_RATE_K === 0.06, 'Exponential growth constant k must be 0.06');
assert(getMultiplierAtTime(0) === 1.00, 'M(0) must equal exactly 1.00x');

// M(5.0s) = e^(0.06 * 5) = e^0.30 ≈ 1.34985 -> 1.35x
const m5 = getMultiplierAtTime(5.0);
assert(m5 >= 1.34 && m5 <= 1.36, `M(5.0s) should be ~1.35x (Actual: ${m5}x)`);

// M(10.0s) = e^(0.06 * 10) = e^0.60 ≈ 1.822 -> 1.82x
const m10 = getMultiplierAtTime(10.0);
assert(m10 >= 1.81 && m10 <= 1.83, `M(10.0s) should be ~1.82x (Actual: ${m10}x)`);

// M(20.0s) = e^(0.06 * 20) = e^1.20 ≈ 3.320 -> 3.32x
const m20 = getMultiplierAtTime(20.0);
assert(m20 >= 3.30 && m20 <= 3.34, `M(20.0s) should be ~3.32x (Actual: ${m20}x)`);

// M(50.0s) = e^(0.06 * 50) = e^3.0 ≈ 20.085 -> 20.09x
const m50 = getMultiplierAtTime(50.0);
assert(m50 >= 20.00 && m50 <= 20.15, `M(50.0s) should be ~20.09x (Actual: ${m50}x)`);

// Inverted Flight Time t(M) = ln(M)/0.06
console.log('\n[6] Testing Inverted Flight Time Function t(M)...');
const tTarget2 = getTimeToMultiplier(2.0);
assert(Math.abs(tTarget2 - Math.log(2.0) / 0.06) < 0.001, 't(2.0x) matches exact ln(2)/0.06');
assert(Math.abs(getMultiplierAtTime(tTarget2) - 2.0) <= 0.02, 'Roundtrip: M(t(2.0x)) ≈ 2.00x');

console.log('\n[7] Testing Fair vs Rigged Crash Point Distributions...');
// Forced Loss Test
const forcedLossCrash = calculateCrashPoint({
  userBet: 10_000,
  autoCashout: null,
  rigMode: 'fair',
  globalRtp: 96.5,
  forcedOutcome: 'force_loss',
});
assert(forcedLossCrash.isRigged === true, 'Forced loss must mark isRigged as true');
assert(forcedLossCrash.crashMultiplier >= 1.00 && forcedLossCrash.crashMultiplier <= 1.04, 'Forced loss must crash below 1.04x');

// High-Bet Sniper Test
const sniperCrash = calculateCrashPoint({
  userBet: 250_000, // Above high bet threshold (100k)
  autoCashout: null,
  rigMode: 'jackpot_drainer',
  globalRtp: 20.0,
  highBetThreshold: 100_000,
});
assert(sniperCrash.crashMultiplier <= 5.0, 'High-bet sniper suppresses high multiplier');

// Preemptive Teaser Test (Auto cashout target e.g. 2.00x)
let foundPreemptive = false;
for (let i = 0; i < 30; i++) {
  const teaser = calculateCrashPoint({
    userBet: 20_000,
    autoCashout: 2.00,
    rigMode: 'near_miss',
    globalRtp: 30.0,
  });
  if (teaser.rigType === 'PREEMPTIVE_TEASER') {
    foundPreemptive = true;
    assert(teaser.crashMultiplier < 2.00 && teaser.crashMultiplier >= 1.90, 'Preemptive teaser must crash right below 2.00x');
    break;
  }
}
assert(foundPreemptive, 'Preemptive Crash Teaser hook must trigger when user sets Auto-Cashout');

console.log('\n[8] Testing Instant Latency-Free Cash Out Calculations...');
const successfulCashOut = calculateCashOut(50_000, 2.45, 3.00);
assert(successfulCashOut.isSuccess === true, 'Cash out at 2.45x before 3.00x crash must succeed');
assert(successfulCashOut.payout === 122_500, 'Payout for 50k bet at 2.45x must equal exactly Rp 122.500');
assert(successfulCashOut.netProfit === 72_500, 'Net profit must be Rp 72.500');

const failedCashOut = calculateCashOut(50_000, 3.10, 3.00);
assert(failedCashOut.isSuccess === false, 'Cash out at 3.10x after 3.00x crash must fail');
assert(failedCashOut.payout === 0, 'Failed cash out payout must be 0');
assert(failedCashOut.netProfit === -50_000, 'Failed cash out net profit must be -50k');

console.log('\n====================================================');
console.log('   ✨ ALL M2 VERIFICATION TESTS PASSED (Exit 0) ✨  ');
console.log('====================================================');
