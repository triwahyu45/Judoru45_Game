/**
 * Judoru45_Game - Milestone 3 (M3) Verification Suite
 * Tests European Roulette Table math, inside/outside bets, magnetic house steering,
 * and Dice Roll Over/Under Slider, 2-Dice Sum, and Rigged 1-Point Near-Miss engines.
 */

import {
  ROULETTE_WHEEL_NUMBERS,
  RED_NUMBERS,
  BLACK_NUMBERS,
  getNumberColor,
  getNumbersForBetType,
  calculatePocketLiability,
  selectWinningPocket,
  evaluateRouletteRound,
  getPocketAngle,
  RouletteBet,
} from '../lib/math/rouletteMath';

import {
  calculateSliderOdds,
  decomposeSumToDice,
  rollDiceGame,
  DICE_SUM_CONFIG,
} from '../lib/math/diceMath';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('======================================================');
console.log('   Judoru45_Game - M3 Automated Verification Suite   ');
console.log('======================================================');

// ============================================================================
// PART 1: EUROPEAN ROULETTE TABLE MATHEMATICAL ENGINE
// ============================================================================
console.log('\n[SECTION 1] Testing European Roulette Geometry & Bet Coverage...');

assert(ROULETTE_WHEEL_NUMBERS.length === 37, 'European wheel must have exactly 37 pockets (0-36)');
assert(ROULETTE_WHEEL_NUMBERS[0] === 0, 'Pocket 0 is in the wheel layout');
assert(RED_NUMBERS.length === 18, 'There must be exactly 18 Red numbers');
assert(BLACK_NUMBERS.length === 18, 'There must be exactly 18 Black numbers');
assert(getNumberColor(0) === 'green', 'Pocket 0 color is green');
assert(getNumberColor(32) === 'red', 'Pocket 32 color is red');
assert(getNumberColor(15) === 'black', 'Pocket 15 color is black');

// Test bet coverage helpers
const redBets = getNumbersForBetType('RED');
assert(redBets.length === 18 && redBets.includes(1) && !redBets.includes(0), 'RED bet covers 18 numbers');
const evenBets = getNumbersForBetType('EVEN');
assert(evenBets.length === 18 && !evenBets.includes(0) && evenBets.includes(2), 'EVEN bet covers 18 non-zero numbers');
const col1Bets = getNumbersForBetType('COLUMN_1');
assert(col1Bets.length === 12 && col1Bets.includes(1) && col1Bets.includes(34), 'COLUMN_1 covers 12 numbers');
const doz1Bets = getNumbersForBetType('DOZEN_1');
assert(doz1Bets.length === 12 && doz1Bets.includes(1) && doz1Bets.includes(12), 'DOZEN_1 covers numbers 1-12');

console.log('\n[SECTION 2] Testing Roulette Payout Evaluations & Multi-Bet Engine...');

// Single straight-up bet on 7 (10,000 IDR) -> if 7 wins, payout is 10k * 36 = 360,000 IDR (net profit +350,000)
const bets1: RouletteBet[] = [
  { id: 'b1', type: 'STRAIGHT', label: 'Straight 7', numbers: [7], amount: 10000, payoutRatio: 35 },
];
const res1 = evaluateRouletteRound(bets1, 7);
assert(res1.isWin === true, 'Straight 7 wins when 7 lands');
assert(res1.totalPayout === 360000, 'Straight 7 payout with 35:1 is 360,000 IDR (35x profit + returned bet)');
assert(res1.netProfit === 350000, 'Straight 7 net profit is 350,000 IDR');

const res1Loss = evaluateRouletteRound(bets1, 8);
assert(res1Loss.isWin === false, 'Straight 7 loses when 8 lands');
assert(res1Loss.totalPayout === 0, 'Straight 7 losing payout is 0');
assert(res1Loss.netProfit === -10000, 'Straight 7 losing net profit is -10,000 IDR');

// Multiple simultaneous bets
const multiBets: RouletteBet[] = [
  { id: 'm1', type: 'RED', label: 'Red', numbers: [...RED_NUMBERS], amount: 50000, payoutRatio: 1 },
  { id: 'm2', type: 'DOZEN_1', label: '1st Dozen', numbers: [...getNumbersForBetType('DOZEN_1')], amount: 30000, payoutRatio: 2 },
  { id: 'm3', type: 'STRAIGHT', label: 'Straight 1', numbers: [1], amount: 10000, payoutRatio: 35 },
];

// If 1 lands (Red, Dozen 1, Straight 1) -> ALL 3 WIN!
// RED pays: 50k * 2 = 100k
// DOZEN_1 pays: 30k * 3 = 90k
// STRAIGHT 1 pays: 10k * 36 = 360k
// Total Payout = 550,000 IDR, Total Bet = 90,000 IDR, Net Profit = 460,000 IDR
const resMultiWin = evaluateRouletteRound(multiBets, 1);
assert(resMultiWin.totalWagered === 90000, 'Multi-bet total wagered is 90,000 IDR');
assert(resMultiWin.totalPayout === 550000, 'Multi-bet all winning payout is 550,000 IDR');
assert(resMultiWin.netProfit === 460000, 'Multi-bet net profit is 460,000 IDR');

// If 0 lands (Green, no dozen, not 1) -> ALL 3 LOSE
const resMultiZero = evaluateRouletteRound(multiBets, 0);
assert(resMultiZero.totalPayout === 0, 'On 0, all normal outside/inside bets lose');
assert(resMultiZero.netProfit === -90000, 'Net loss is -90,000 IDR');

console.log('\n[SECTION 3] Testing Roulette Rigged Magnetic House Steering...');

// Rigged: Force Loss (Zero-Liability Steering)
const riggedLossPick = selectWinningPocket(multiBets, {
  globalRtp: 10,
  activeProfile: 'pure_scam',
  forcedOutcome: 'force_loss',
  highBetThreshold: 50000,
  nearMissProbability: 1.0,
});
assert(riggedLossPick.isRigged === true, 'Rigged indicator is true on force_loss');
const liabilityOfPick = calculatePocketLiability(multiBets, riggedLossPick.pocket);
assert(liabilityOfPick === 0, `Magnetic house steering selected 0-payout pocket (pocket ${riggedLossPick.pocket})`);

// Rigged: Force Win
const riggedWinPick = selectWinningPocket(multiBets, {
  globalRtp: 100,
  activeProfile: 'fair',
  forcedOutcome: 'force_win',
  highBetThreshold: 50000,
  nearMissProbability: 0,
});
assert(riggedWinPick.isRigged === true, 'Rigged indicator is true on force_win');
assert(riggedWinPick.pocket === 1, `Force win steered to maximum payout pocket 1 (was ${riggedWinPick.pocket})`);

// Pocket Angle
assert(getPocketAngle(0) === 0, 'Pocket 0 starts at angle 0');
assert(getPocketAngle(32) === (360 / 37), 'Pocket 32 is at 1 pocket step angle');

// ============================================================================
// PART 2: DICE ROLL OVER/UNDER & 2-DICE SUM ENGINE
// ============================================================================
console.log('\n[SECTION 4] Testing Dice Roll Slider Odds & Probability...');

// Slider: Roll Over 50 -> winChance = 50.0%, multiplier = 99.0 / 50 = 1.98x
const odds50Over = calculateSliderOdds(50, 'OVER');
assert(odds50Over.winChance === 50, 'Roll Over 50 win chance is 50%');
assert(odds50Over.multiplier === 1.98, 'Roll Over 50 multiplier is 1.98x');

// Slider: Roll Under 20 -> winChance = 20.0%, multiplier = 99.0 / 20 = 4.95x
const odds20Under = calculateSliderOdds(20, 'UNDER');
assert(odds20Under.winChance === 20, 'Roll Under 20 win chance is 20%');
assert(odds20Under.multiplier === 4.95, 'Roll Under 20 multiplier is 4.95x');

// 2-Dice Sum Combinations & Multipliers
assert(DICE_SUM_CONFIG[7].ways === 6, 'Sum 7 has 6 ways out of 36');
assert(DICE_SUM_CONFIG[7].multiplier === 5.88, 'Sum 7 multiplier is 5.88x');
assert(DICE_SUM_CONFIG[2].ways === 1 && DICE_SUM_CONFIG[2].multiplier === 35.28, 'Sum 2 multiplier is 35.28x');
assert(DICE_SUM_CONFIG[12].ways === 1 && DICE_SUM_CONFIG[12].multiplier === 35.28, 'Sum 12 multiplier is 35.28x');

// Dice Decomposition
const [d1, d2] = decomposeSumToDice(7);
assert(d1 + d2 === 7 && d1 >= 1 && d1 <= 6 && d2 >= 1 && d2 <= 6, 'Decompose 7 produces valid dice summing to 7');

console.log('\n[SECTION 5] Testing Dice Roll Execution & Rigged 1-Point Near-Miss...');

// Slider Mode: Force Loss with Near-Miss
const rollSliderRigged = rollDiceGame({
  mode: 'SLIDER',
  betAmount: 50000,
  sliderTarget: 50,
  sliderDirection: 'OVER',
  adminConfig: {
    globalRtp: 20,
    activeProfile: 'near_miss',
    forcedOutcome: 'force_loss',
    highBetThreshold: 100000,
    nearMissProbability: 1.0,
  },
});
assert(rollSliderRigged.isWin === false, 'Rigged force_loss slider roll results in loss');
assert(rollSliderRigged.rolledValue < 50, `Rigged Roll Over 50 landed below target (rolled ${rollSliderRigged.rolledValue})`);
assert(rollSliderRigged.isNearMiss === true, 'Near-miss flag is set');
assert(rollSliderRigged.payout === 0, 'Losing payout is 0');

// Slider Mode: Force Win
const rollSliderWin = rollDiceGame({
  mode: 'SLIDER',
  betAmount: 20000,
  sliderTarget: 50,
  sliderDirection: 'OVER',
  adminConfig: {
    globalRtp: 100,
    activeProfile: 'fair',
    forcedOutcome: 'force_win',
    highBetThreshold: 100000,
    nearMissProbability: 0,
  },
});
assert(rollSliderWin.isWin === true, 'Force win slider roll results in win');
assert(rollSliderWin.rolledValue > 50, `Force win Roll Over 50 rolled value > 50 (rolled ${rollSliderWin.rolledValue})`);
assert(rollSliderWin.payout === 20000 * 1.98, 'Winning payout is bet * multiplier');

// 2-Dice Sum Mode: Rigged 1-Point Off Near-Miss
const rollSumRigged = rollDiceGame({
  mode: 'SUM',
  betAmount: 25000,
  sumTarget: 7,
  adminConfig: {
    globalRtp: 10,
    activeProfile: 'near_miss',
    forcedOutcome: 'force_loss',
    highBetThreshold: 100000,
    nearMissProbability: 1.0,
  },
});
assert(rollSumRigged.isWin === false, 'Rigged sum roll results in loss');
assert(rollSumRigged.rolledValue === 6 || rollSumRigged.rolledValue === 8, `Rigged 1-Point Near-Miss for Sum 7 rolled ${rollSumRigged.rolledValue} (expected 6 or 8)`);
assert(rollSumRigged.isNearMiss === true, 'Near miss flag is set for 1-point difference');
assert(rollSumRigged.diceValues[0] + rollSumRigged.diceValues[1] === rollSumRigged.rolledValue, 'Dice face values match rolled sum');

console.log('\n✨ ALL M3 MATHEMATICAL & RIGGED TESTS PASSED PERFECTLY! ✨\n');
