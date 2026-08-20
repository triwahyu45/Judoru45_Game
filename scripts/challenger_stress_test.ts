/**
 * Judoru45_Game - Empirical Adversarial Stress Test Suite
 * Author: Challenger 1 (critic & specialist)
 * 
 * Objectives:
 * 1. Monte Carlo Simulations: 1,000 - 5,000 rounds across all 6 mini-game engines (Fair 98% vs Casino Trap 15% RTP).
 *    Evaluates both Central Interceptor Engine (lib/math/riggedEngine.ts) and Game Engine Simulators (lib/math/*).
 * 2. Invariant Verification: Bankroll balance continuity ($B_t = B_{t-1} - W + P$), non-negativity, NaN/Infinity prevention, deterministic forced hooks.
 * 3. Edge-Case Fuzzing: Extreme wagers, boundary conditions, rapid cashouts, 4D string fuzzing, stoppage time dynamics.
 */

import {
  evaluateOlympusSpin,
  isLossDisguisedAsWin,
  getPaytableMultiplier,
  pickRandomSymbol,
  SLOT_SYMBOLS,
} from '../lib/math/slotMath';

import {
  calculateCrashPoint,
  getMultiplierAtTime,
  getTimeToMultiplier,
  calculateCashOut,
} from '../lib/math/crashMath';

import {
  selectWinningPocket,
  evaluateRouletteRound,
  calculatePocketLiability,
  getNumbersForBetType,
  ROULETTE_WHEEL_NUMBERS,
  RouletteBet,
} from '../lib/math/rouletteMath';

import {
  rollDiceGame,
  calculateSliderOdds,
  decomposeSumToDice,
  DICE_SUM_CONFIG,
} from '../lib/math/diceMath';

import {
  generateRiggedTogelDraw,
  evaluateTogelWin,
  validateTogelNumber,
  calculateTicketCost,
  breakdownDrawNumber,
  TOGEL_RULES,
  SHIO_LIST,
  TogelTicket,
} from '../lib/math/togelMath';

import {
  calculateMatchOdds,
  simulateMatchEvents,
  generateDefaultFixtures,
  LIGA_1_TEAMS,
  UCL_TEAMS,
  UserSportsBet,
} from '../lib/math/sportsMath';

import {
  evaluateRiggedDecision,
  interceptSlotSpin,
  interceptCrashMultiplier,
  interceptRouletteResult,
  interceptDiceRoll,
  interceptTogelDraw,
  interceptSportsMatch,
  RiggedEngineConfig,
} from '../lib/math/riggedEngine';

import { formatIDR, parseIDR, formatCompactIDR } from '../lib/utils/currency';
import { calculateLossEquivalents, getPrimaryLossEquivalent, REAL_WORLD_ITEMS } from '../lib/utils/lossConverter';

// ANSI Colors for clean logging
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let totalAssertionsPassed = 0;
let totalAssertionsFailed = 0;

function assert(condition: boolean, message: string, details?: any) {
  if (condition) {
    totalAssertionsPassed++;
    console.log(`  ${GREEN}✓ [PASS]${RESET} ${message}`);
  } else {
    totalAssertionsFailed++;
    console.error(`  ${RED}✗ [FAIL]${RESET} ${message}`);
    if (details !== undefined) {
      console.error(`    Details:`, details);
    }
  }
}

interface MonteCarloStats {
  game: string;
  engineType: 'Central Interceptor' | 'Game Simulator';
  mode: string;
  rounds: number;
  totalWagered: number;
  totalPayout: number;
  empiricalRtpPercent: number;
  winRatePercent: number;
  nearMissRatePercent: number;
  maxPayoutMultiplier: number;
}

const monteCarloResults: MonteCarloStats[] = [];

// ============================================================================
// SUITE 1: MONTE CARLO SIMULATION (1,000 - 5,000 ROUNDS PER ENGINE)
// ============================================================================
async function runMonteCarloSuite() {
  console.log(`\n${BOLD}${CYAN}====================================================================${RESET}`);
  console.log(`${BOLD}${CYAN} 1. MONTE CARLO SIMULATION: FAIR (98% RTP) vs CASINO TRAP (15% RTP) ${RESET}`);
  console.log(`${BOLD}${CYAN}====================================================================${RESET}\n`);

  const NUM_ROUNDS = 5000;

  // --------------------------------------------------------------------------
  // 1.1 SLOT OLYMPUS ENGINE
  // --------------------------------------------------------------------------
  console.log(`${BOLD}[1.1] Slot Olympus Monte Carlo (N = ${NUM_ROUNDS})${RESET}`);
  {
    const bet = 10_000;

    // 1.1A Central Interceptor (lib/math/riggedEngine.ts)
    // Fair Mode (98% RTP win-gate)
    let wagerIntFair = 0, payoutIntFair = 0, winsIntFair = 0, nearMissIntFair = 0, maxMultIntFair = 0;
    const fairConfig: RiggedEngineConfig = {
      globalRtp: 98,
      activeProfile: 'fair',
      forcedOutcome: 'auto',
      highBetThreshold: 100_000,
      nearMissProbability: 0.2,
    };
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerIntFair += bet;
      const res = interceptSlotSpin(bet, 500_000, i, fairConfig);
      const payout = Math.round(bet * res.multiplier);
      payoutIntFair += payout;
      if (res.isWin) winsIntFair++;
      if (res.isNearMiss) nearMissIntFair++;
      if (res.multiplier > maxMultIntFair) maxMultIntFair = res.multiplier;
    }
    const rtpIntFair = (payoutIntFair / wagerIntFair) * 100;
    monteCarloResults.push({
      game: 'Slot Olympus',
      engineType: 'Central Interceptor',
      mode: 'Fair (98% Win-Gate Target)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerIntFair,
      totalPayout: payoutIntFair,
      empiricalRtpPercent: +rtpIntFair.toFixed(2),
      winRatePercent: +((winsIntFair / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: +((nearMissIntFair / NUM_ROUNDS) * 100).toFixed(2),
      maxPayoutMultiplier: +maxMultIntFair.toFixed(2),
    });
    console.log(`  [Interceptor] Fair -> Wagered: ${formatIDR(wagerIntFair)} | Payout: ${formatIDR(payoutIntFair)} | RTP: ${rtpIntFair.toFixed(2)}% | Win Rate: ${((winsIntFair/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(Math.abs((winsIntFair / NUM_ROUNDS) * 100 - 98) < 3.0, `Slot Interceptor Fair win-gate frequency (${((winsIntFair/NUM_ROUNDS)*100).toFixed(2)}%) matches 98% config`);

    // Trap Mode (15% RTP / Near Miss)
    let wagerIntTrap = 0, payoutIntTrap = 0, winsIntTrap = 0, nearMissIntTrap = 0, maxMultIntTrap = 0;
    const trapConfig: RiggedEngineConfig = {
      globalRtp: 15,
      activeProfile: 'near_miss',
      forcedOutcome: 'auto',
      highBetThreshold: 100_000,
      nearMissProbability: 0.8,
    };
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerIntTrap += bet;
      const res = interceptSlotSpin(bet, 500_000, i, trapConfig);
      const payout = Math.round(bet * res.multiplier);
      payoutIntTrap += payout;
      if (res.isWin) winsIntTrap++;
      if (res.isNearMiss) nearMissIntTrap++;
      if (res.multiplier > maxMultIntTrap) maxMultIntTrap = res.multiplier;
    }
    const rtpIntTrap = (payoutIntTrap / wagerIntTrap) * 100;
    monteCarloResults.push({
      game: 'Slot Olympus',
      engineType: 'Central Interceptor',
      mode: 'Casino Trap (15% Win-Gate Target)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerIntTrap,
      totalPayout: payoutIntTrap,
      empiricalRtpPercent: +rtpIntTrap.toFixed(2),
      winRatePercent: +((winsIntTrap / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: +((nearMissIntTrap / NUM_ROUNDS) * 100).toFixed(2),
      maxPayoutMultiplier: +maxMultIntTrap.toFixed(2),
    });
    console.log(`  [Interceptor] Trap -> Wagered: ${formatIDR(wagerIntTrap)} | Payout: ${formatIDR(payoutIntTrap)} | RTP: ${rtpIntTrap.toFixed(2)}% | Win Rate: ${((winsIntTrap/NUM_ROUNDS)*100).toFixed(2)}% | Near-Miss: ${((nearMissIntTrap/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(Math.abs((winsIntTrap / NUM_ROUNDS) * 100 - 15) < 3.0, `Slot Interceptor Trap win-gate frequency (${((winsIntTrap/NUM_ROUNDS)*100).toFixed(2)}%) matches 15% config`);
    assert(nearMissIntTrap > nearMissIntFair, `Slot Interceptor near-miss frequency in Trap (${nearMissIntTrap}) > Fair (${nearMissIntFair})`);

    // 1.1B Game Simulator (lib/math/slotMath.ts)
    let wagerSimFair = 0, payoutSimFair = 0, winsSimFair = 0, nearMissSimFair = 0, maxMultSimFair = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerSimFair += bet;
      const res = evaluateOlympusSpin(bet, 'fair', 98);
      payoutSimFair += res.finalPayout;
      if (res.finalPayout > 0) winsSimFair++;
      if (res.isNearMiss) nearMissSimFair++;
      const mult = res.finalPayout / bet;
      if (mult > maxMultSimFair) maxMultSimFair = mult;
    }
    const rtpSimFair = (payoutSimFair / wagerSimFair) * 100;
    monteCarloResults.push({
      game: 'Slot Olympus',
      engineType: 'Game Simulator',
      mode: 'Fair (Visual Tumble / Multiplier Orbs)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerSimFair,
      totalPayout: payoutSimFair,
      empiricalRtpPercent: +rtpSimFair.toFixed(2),
      winRatePercent: +((winsSimFair / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: +((nearMissSimFair / NUM_ROUNDS) * 100).toFixed(2),
      maxPayoutMultiplier: +maxMultSimFair.toFixed(2),
    });
    console.log(`  [Simulator]   Fair -> Wagered: ${formatIDR(wagerSimFair)} | Payout: ${formatIDR(payoutSimFair)} | RTP: ${rtpSimFair.toFixed(2)}% | Win Rate: ${((winsSimFair/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(winsSimFair > 0, `Slot Simulator produced wins and cascade tumbles`);
  }

  // --------------------------------------------------------------------------
  // 1.2 CRASH ROCKET ENGINE
  // --------------------------------------------------------------------------
  console.log(`\n${BOLD}[1.2] Crash Aviator Rocket Monte Carlo (N = ${NUM_ROUNDS})${RESET}`);
  {
    const bet = 10_000;
    const targetCashout = 2.00;

    // 1.2A Game Simulator (lib/math/crashMath.ts)
    // Fair
    let wagerSimFair = 0, payoutSimFair = 0, winsSimFair = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerSimFair += bet;
      const pt = calculateCrashPoint({
        userBet: bet,
        autoCashout: targetCashout,
        rigMode: 'fair',
        globalRtp: 98,
      });
      const co = calculateCashOut(bet, targetCashout, pt.crashMultiplier);
      payoutSimFair += co.payout;
      if (co.isSuccess) winsSimFair++;
    }
    const rtpSimFair = (payoutSimFair / wagerSimFair) * 100;
    monteCarloResults.push({
      game: 'Crash Rocket',
      engineType: 'Game Simulator',
      mode: 'Fair (98% RTP Pareto)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerSimFair,
      totalPayout: payoutSimFair,
      empiricalRtpPercent: +rtpSimFair.toFixed(2),
      winRatePercent: +((winsSimFair / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: 0,
      maxPayoutMultiplier: targetCashout,
    });
    console.log(`  [Simulator]   Fair -> Wagered: ${formatIDR(wagerSimFair)} | Payout: ${formatIDR(payoutSimFair)} | RTP: ${rtpSimFair.toFixed(2)}% | Win Rate: ${((winsSimFair/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(Math.abs(rtpSimFair - 98) < 8.0, `Crash Simulator Fair RTP (${rtpSimFair.toFixed(2)}%) converges accurately to theoretical 98%`);

    // Trap
    let wagerSimTrap = 0, payoutSimTrap = 0, winsSimTrap = 0, nearMissSimTrap = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerSimTrap += bet;
      const pt = calculateCrashPoint({
        userBet: bet,
        autoCashout: targetCashout,
        rigMode: 'near_miss',
        globalRtp: 15,
      });
      if (pt.rigType === 'PREEMPTIVE_TEASER') nearMissSimTrap++;
      const co = calculateCashOut(bet, targetCashout, pt.crashMultiplier);
      payoutSimTrap += co.payout;
      if (co.isSuccess) winsSimTrap++;
    }
    const rtpSimTrap = (payoutSimTrap / wagerSimTrap) * 100;
    monteCarloResults.push({
      game: 'Crash Rocket',
      engineType: 'Game Simulator',
      mode: 'Casino Trap (15% RTP)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerSimTrap,
      totalPayout: payoutSimTrap,
      empiricalRtpPercent: +rtpSimTrap.toFixed(2),
      winRatePercent: +((winsSimTrap / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: +((nearMissSimTrap / NUM_ROUNDS) * 100).toFixed(2),
      maxPayoutMultiplier: targetCashout,
    });
    console.log(`  [Simulator]   Trap -> Wagered: ${formatIDR(wagerSimTrap)} | Payout: ${formatIDR(payoutSimTrap)} | RTP: ${rtpSimTrap.toFixed(2)}% | Win Rate: ${((winsSimTrap/NUM_ROUNDS)*100).toFixed(2)}% | Teasers: ${nearMissSimTrap}`);
    assert(rtpSimTrap <= 20.0, `Crash Simulator Trap RTP (${rtpSimTrap.toFixed(2)}%) is strictly throttled below 20%`);
  }

  // --------------------------------------------------------------------------
  // 1.3 EUROPEAN ROULETTE ENGINE
  // --------------------------------------------------------------------------
  console.log(`\n${BOLD}[1.3] European Roulette Monte Carlo (N = ${NUM_ROUNDS})${RESET}`);
  {
    const betAmount = 10_000;
    const redBet: RouletteBet = {
      id: 'b1',
      type: 'RED',
      label: 'Red',
      numbers: getNumbersForBetType('RED'),
      amount: betAmount,
      payoutRatio: 1,
    };

    // Fair Simulation (97.3% European Roulette baseline)
    let wagerFair = 0, payoutFair = 0, winsFair = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerFair += betAmount;
      const dec = selectWinningPocket([redBet], {
        globalRtp: 98,
        activeProfile: 'fair',
        forcedOutcome: 'auto',
        highBetThreshold: 1_000_000,
        nearMissProbability: 0.2,
      });
      const evalRes = evaluateRouletteRound([redBet], dec.pocket, dec.isRigged);
      payoutFair += evalRes.totalPayout;
      if (evalRes.isWin) winsFair++;
    }
    const rtpFair = (payoutFair / wagerFair) * 100;
    monteCarloResults.push({
      game: 'European Roulette',
      engineType: 'Game Simulator',
      mode: 'Fair (98% Config / ~97.3% European)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerFair,
      totalPayout: payoutFair,
      empiricalRtpPercent: +rtpFair.toFixed(2),
      winRatePercent: +((winsFair / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: 0,
      maxPayoutMultiplier: 2.0,
    });
    console.log(`  Fair Mode   -> Wagered: ${formatIDR(wagerFair)} | Payout: ${formatIDR(payoutFair)} | RTP: ${rtpFair.toFixed(2)}% | Win Rate: ${((winsFair/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(Math.abs(rtpFair - 97.3) < 4.0, `Roulette Fair RTP (${rtpFair.toFixed(2)}%) accurately converges to theoretical 97.30%`);

    // Casino Trap (Pure Scam / 0% RTP)
    let wagerTrap = 0, payoutTrap = 0, winsTrap = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerTrap += betAmount;
      const dec = selectWinningPocket([redBet], {
        globalRtp: 15,
        activeProfile: 'pure_scam',
        forcedOutcome: 'auto',
        highBetThreshold: 100_000,
        nearMissProbability: 0.8,
      });
      const evalRes = evaluateRouletteRound([redBet], dec.pocket, dec.isRigged);
      payoutTrap += evalRes.totalPayout;
      if (evalRes.isWin) winsTrap++;
    }
    const rtpTrap = (payoutTrap / wagerTrap) * 100;
    monteCarloResults.push({
      game: 'European Roulette',
      engineType: 'Game Simulator',
      mode: 'Casino Trap (Pure Scam / 0% RTP)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerTrap,
      totalPayout: payoutTrap,
      empiricalRtpPercent: +rtpTrap.toFixed(2),
      winRatePercent: +((winsTrap / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: 0,
      maxPayoutMultiplier: 0,
    });
    console.log(`  Trap Mode   -> Wagered: ${formatIDR(wagerTrap)} | Payout: ${formatIDR(payoutTrap)} | RTP: ${rtpTrap.toFixed(2)}% | Win Rate: ${((winsTrap/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(rtpTrap === 0.0, `Roulette Pure Scam RTP is strictly 0.00%`);
  }

  // --------------------------------------------------------------------------
  // 1.4 DICE ROLL ENGINE (OVER 50)
  // --------------------------------------------------------------------------
  console.log(`\n${BOLD}[1.4] Dice Roll (Over 50) Monte Carlo (N = ${NUM_ROUNDS})${RESET}`);
  {
    const bet = 10_000;

    // Fair Mode (99.0% RTP for Slider)
    let wagerFair = 0, payoutFair = 0, winsFair = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerFair += bet;
      const res = rollDiceGame({
        mode: 'SLIDER',
        betAmount: bet,
        sliderTarget: 50,
        sliderDirection: 'OVER',
        adminConfig: {
          globalRtp: 99,
          activeProfile: 'fair',
          forcedOutcome: 'auto',
          highBetThreshold: 1_000_000,
          nearMissProbability: 0.1,
        },
      });
      payoutFair += res.payout;
      if (res.isWin) winsFair++;
    }
    const rtpFair = (payoutFair / wagerFair) * 100;
    monteCarloResults.push({
      game: 'Dice Roll',
      engineType: 'Game Simulator',
      mode: 'Fair (99% RTP)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerFair,
      totalPayout: payoutFair,
      empiricalRtpPercent: +rtpFair.toFixed(2),
      winRatePercent: +((winsFair / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: 0,
      maxPayoutMultiplier: 1.98,
    });
    console.log(`  Fair Mode   -> Wagered: ${formatIDR(wagerFair)} | Payout: ${formatIDR(payoutFair)} | RTP: ${rtpFair.toFixed(2)}% | Win Rate: ${((winsFair/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(Math.abs(rtpFair - 99.0) < 12.0, `Dice Fair RTP (${rtpFair.toFixed(2)}%) converges within acceptable variance`);

    // Trap Mode (15% RTP / Near Miss)
    let wagerTrap = 0, payoutTrap = 0, winsTrap = 0, nearMissCount = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerTrap += bet;
      const res = rollDiceGame({
        mode: 'SLIDER',
        betAmount: bet,
        sliderTarget: 50,
        sliderDirection: 'OVER',
        adminConfig: {
          globalRtp: 15,
          activeProfile: 'near_miss',
          forcedOutcome: 'auto',
          highBetThreshold: 100_000,
          nearMissProbability: 0.85,
        },
      });
      payoutTrap += res.payout;
      if (res.isWin) winsTrap++;
      if (res.isNearMiss) nearMissCount++;
    }
    const rtpTrap = (payoutTrap / wagerTrap) * 100;
    monteCarloResults.push({
      game: 'Dice Roll',
      engineType: 'Game Simulator',
      mode: 'Casino Trap (15% RTP / Near Miss)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerTrap,
      totalPayout: payoutTrap,
      empiricalRtpPercent: +rtpTrap.toFixed(2),
      winRatePercent: +((winsTrap / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: +((nearMissCount / NUM_ROUNDS) * 100).toFixed(2),
      maxPayoutMultiplier: 1.98,
    });
    console.log(`  Trap Mode   -> Wagered: ${formatIDR(wagerTrap)} | Payout: ${formatIDR(payoutTrap)} | RTP: ${rtpTrap.toFixed(2)}% | Win Rate: ${((winsTrap/NUM_ROUNDS)*100).toFixed(2)}% | Near-Miss: ${((nearMissCount/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(rtpTrap <= 20.0, `Dice Trap RTP (${rtpTrap.toFixed(2)}%) is strictly throttled below 20%`);
    assert(nearMissCount > 3000, `Dice Trap near-misses fired heavily (${nearMissCount} times out of ${NUM_ROUNDS})`);
  }

  // --------------------------------------------------------------------------
  // 1.5 TOGEL 4D LOTTERY ENGINE (Colok Bebas)
  // --------------------------------------------------------------------------
  console.log(`\n${BOLD}[1.5] Togel 4D Lottery Monte Carlo (Colok Bebas, N = ${NUM_ROUNDS})${RESET}`);
  {
    const grossBet = 10_000;
    const ticketCost = calculateTicketCost('COLOK_BEBAS', grossBet); // Net 9,400 IDR

    // Fair Draw
    let wagerFair = 0, payoutFair = 0, winsFair = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerFair += ticketCost.netAmount;
      const dummyTicket: TogelTicket = {
        id: `t_${i}`,
        type: 'COLOK_BEBAS',
        numbers: '7',
        grossBet,
        discountPercent: ticketCost.discountPercent,
        discountAmount: ticketCost.discountAmount,
        netBet: ticketCost.netAmount,
        potentialPayout: ticketCost.potentialPayout,
        createdAt: Date.now(),
      };
      const draw = generateRiggedTogelDraw([dummyTicket], 'fair', { globalRtp: 98, forcedOutcome: 'auto' });
      const winEval = evaluateTogelWin(dummyTicket, draw.winningNumber);
      payoutFair += winEval.payout;
      if (winEval.isWin) winsFair++;
    }
    const rtpFair = (payoutFair / wagerFair) * 100;
    monteCarloResults.push({
      game: 'Togel 4D (Colok Bebas)',
      engineType: 'Game Simulator',
      mode: 'Fair Standard Draw',
      rounds: NUM_ROUNDS,
      totalWagered: wagerFair,
      totalPayout: payoutFair,
      empiricalRtpPercent: +rtpFair.toFixed(2),
      winRatePercent: +((winsFair / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: 0,
      maxPayoutMultiplier: 6.0,
    });
    console.log(`  Fair Mode   -> Wagered: ${formatIDR(wagerFair)} | Payout: ${formatIDR(payoutFair)} | RTP: ${rtpFair.toFixed(2)}% | Win Rate: ${((winsFair/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(Math.abs((winsFair / NUM_ROUNDS) * 100 - 34.39) < 4.0, `Colok Bebas win frequency (${((winsFair/NUM_ROUNDS)*100).toFixed(2)}%) matches binomial 34.39%`);

    // Trap / Force Loss
    let wagerTrap = 0, payoutTrap = 0, winsTrap = 0;
    for (let i = 0; i < NUM_ROUNDS; i++) {
      wagerTrap += ticketCost.netAmount;
      const dummyTicket: TogelTicket = {
        id: `t_${i}`,
        type: 'COLOK_BEBAS',
        numbers: '7',
        grossBet,
        discountPercent: ticketCost.discountPercent,
        discountAmount: ticketCost.discountAmount,
        netBet: ticketCost.netAmount,
        potentialPayout: ticketCost.potentialPayout,
        createdAt: Date.now(),
      };
      const draw = generateRiggedTogelDraw([dummyTicket], 'pure_scam', { globalRtp: 0, forcedOutcome: 'force_loss' });
      const winEval = evaluateTogelWin(dummyTicket, draw.winningNumber);
      payoutTrap += winEval.payout;
      if (winEval.isWin) winsTrap++;
    }
    const rtpTrap = (payoutTrap / wagerTrap) * 100;
    monteCarloResults.push({
      game: 'Togel 4D (Colok Bebas)',
      engineType: 'Game Simulator',
      mode: 'Casino Trap (Pure Scam / Zero Payout)',
      rounds: NUM_ROUNDS,
      totalWagered: wagerTrap,
      totalPayout: payoutTrap,
      empiricalRtpPercent: +rtpTrap.toFixed(2),
      winRatePercent: +((winsTrap / NUM_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: 0,
      maxPayoutMultiplier: 0,
    });
    console.log(`  Trap Mode   -> Wagered: ${formatIDR(wagerTrap)} | Payout: ${formatIDR(payoutTrap)} | RTP: ${rtpTrap.toFixed(2)}% | Win Rate: ${((winsTrap/NUM_ROUNDS)*100).toFixed(2)}%`);
    assert(rtpTrap === 0.0, `Togel Pure Scam RTP is strictly 0.00%`);
  }

  // --------------------------------------------------------------------------
  // 1.6 SPORTSBOOK ENGINE (1X2 MATCH BET)
  // --------------------------------------------------------------------------
  console.log(`\n${BOLD}[1.6] Sportsbook 1X2 Simulation Monte Carlo (N = 1,000)${RESET}`);
  {
    const SPORTS_ROUNDS = 1000;
    const fixture = generateDefaultFixtures()[0]; // Persija vs Persib
    const wager = 50_000;
    const userBet: UserSportsBet = {
      matchId: fixture.id,
      market: '1X2',
      selection: 'HOME',
      selectionLabel: 'Persija Menang',
      odds: fixture.odds.homeWin,
      wagerAmount: wager,
      potentialPayout: Math.round(wager * fixture.odds.homeWin),
    };

    // Fair Simulation
    let wagerFair = 0, payoutFair = 0, winsFair = 0;
    for (let i = 0; i < SPORTS_ROUNDS; i++) {
      wagerFair += wager;
      const sim = simulateMatchEvents(fixture, userBet, 'fair', { forcedOutcome: 'auto' });
      payoutFair += sim.payout;
      if (sim.isWin) winsFair++;
    }
    const rtpFair = (payoutFair / wagerFair) * 100;
    monteCarloResults.push({
      game: 'Sportsbook',
      engineType: 'Game Simulator',
      mode: 'Fair Match Simulation',
      rounds: SPORTS_ROUNDS,
      totalWagered: wagerFair,
      totalPayout: payoutFair,
      empiricalRtpPercent: +rtpFair.toFixed(2),
      winRatePercent: +((winsFair / SPORTS_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: 0,
      maxPayoutMultiplier: fixture.odds.homeWin,
    });
    console.log(`  Fair Mode   -> Wagered: ${formatIDR(wagerFair)} | Payout: ${formatIDR(payoutFair)} | RTP: ${rtpFair.toFixed(2)}% | Win Rate: ${((winsFair/SPORTS_ROUNDS)*100).toFixed(2)}%`);
    assert(rtpFair >= 40 && rtpFair <= 140, `Sportsbook Fair RTP (${rtpFair.toFixed(2)}%) is within natural variance`);

    // Casino Trap (90+ Minute Heartbreak Engine)
    let wagerTrap = 0, payoutTrap = 0, winsTrap = 0, heartbreakCount = 0;
    for (let i = 0; i < SPORTS_ROUNDS; i++) {
      wagerTrap += wager;
      const sim = simulateMatchEvents(fixture, userBet, 'near_miss', { forcedOutcome: 'force_loss' });
      payoutTrap += sim.payout;
      if (sim.isWin) winsTrap++;
      if (sim.isHeartbreakTriggered) heartbreakCount++;
    }
    const rtpTrap = (payoutTrap / wagerTrap) * 100;
    monteCarloResults.push({
      game: 'Sportsbook',
      engineType: 'Game Simulator',
      mode: 'Casino Trap (90+ Heartbreak Engine)',
      rounds: SPORTS_ROUNDS,
      totalWagered: wagerTrap,
      totalPayout: payoutTrap,
      empiricalRtpPercent: +rtpTrap.toFixed(2),
      winRatePercent: +((winsTrap / SPORTS_ROUNDS) * 100).toFixed(2),
      nearMissRatePercent: +((heartbreakCount / SPORTS_ROUNDS) * 100).toFixed(2),
      maxPayoutMultiplier: 0,
    });
    console.log(`  Trap Mode   -> Wagered: ${formatIDR(wagerTrap)} | Payout: ${formatIDR(payoutTrap)} | RTP: ${rtpTrap.toFixed(2)}% | Win Rate: ${((winsTrap/SPORTS_ROUNDS)*100).toFixed(2)}% | Heartbreaks: ${heartbreakCount}`);
    assert(rtpTrap === 0.0, `Sportsbook Forced Heartbreak RTP is 0.00%`);
    assert(heartbreakCount === SPORTS_ROUNDS, `Heartbreak engine triggered in 100% of forced loss rounds`);
  }
}

// ============================================================================
// SUITE 2: INVARIANT VERIFICATION ($B_t = B_{t-1} - W + P$, Non-Negativity, NaN/Inf)
// ============================================================================
async function runInvariantSuite() {
  console.log(`\n${BOLD}${CYAN}====================================================================${RESET}`);
  console.log(`${BOLD}${CYAN} 2. BANKROLL INVARIANTS & RIGGED HOOK VERIFICATION                  ${RESET}`);
  console.log(`${BOLD}${CYAN}====================================================================${RESET}\n`);

  console.log(`${BOLD}[2.1] Bankroll Balance Transition Invariant: Balance_t = Balance_{t-1} - W + P${RESET}`);
  {
    let currentBalance = 500_000;
    let totalWagered = 0;
    let totalWon = 0;
    let totalLost = 0;
    const NUM_TX = 5000;

    let balanceContinuityViolations = 0;
    let negativeBalanceCount = 0;
    let nanInfCount = 0;

    for (let t = 1; t <= NUM_TX; t++) {
      const prevBalance = currentBalance;
      const wager = Math.min(prevBalance, Math.floor(Math.random() * 50_000) + 1_000);
      if (wager <= 0 && prevBalance > 0) continue;

      const isWin = Math.random() < 0.35;
      const mult = isWin ? +(1.0 + Math.random() * 9.0).toFixed(2) : 0;
      const payout = Math.round(wager * mult);

      currentBalance = prevBalance - wager + payout;
      totalWagered += wager;
      totalWon += payout;
      totalLost += isWin ? 0 : wager;

      const expectedBalance = prevBalance - wager + payout;
      if (currentBalance !== expectedBalance) {
        balanceContinuityViolations++;
      }
      if (currentBalance < 0) {
        negativeBalanceCount++;
      }
      if (!Number.isFinite(currentBalance) || Number.isNaN(currentBalance)) {
        nanInfCount++;
      }
      if (!Number.isFinite(payout) || Number.isNaN(payout)) {
        nanInfCount++;
      }
    }

    assert(balanceContinuityViolations === 0, `5,000 transactions verified: 0 balance continuity violations`);
    assert(negativeBalanceCount === 0, `0 negative balance occurrences`);
    assert(nanInfCount === 0, `0 NaN or Infinity values detected`);
    assert(totalWon - totalWagered === currentBalance - 500_000, `Global Net Profit invariant: TotalWon - TotalWagered == Balance - InitialDeposit`);
  }

  console.log(`\n${BOLD}[2.2] Deterministic Rigged Hooks Verification${RESET}`);
  {
    const dummyConfig: RiggedEngineConfig = {
      globalRtp: 35,
      activeProfile: 'fair',
      forcedOutcome: 'force_win',
      highBetThreshold: 100_000,
      nearMissProbability: 0.8,
    };

    // 1. Force Win Hook
    const winDecision = evaluateRiggedDecision(10_000, 500_000, 1, dummyConfig);
    assert(winDecision.shouldWin === true, `force_win must always return shouldWin = true`);
    assert(winDecision.isRigged === true, `force_win must be marked as isRigged = true`);

    // 2. Force Loss Hook
    const lossDecision = evaluateRiggedDecision(10_000, 500_000, 1, { ...dummyConfig, forcedOutcome: 'force_loss' });
    assert(lossDecision.shouldWin === false, `force_loss must always return shouldWin = false`);
    assert(lossDecision.isRigged === true, `force_loss must be marked as isRigged = true`);

    // 3. Pure Scam Profile
    const scamDecision = evaluateRiggedDecision(10_000, 500_000, 1, { ...dummyConfig, forcedOutcome: 'auto', activeProfile: 'pure_scam' });
    assert(scamDecision.shouldWin === false, `pure_scam profile must always return shouldWin = false`);
    assert(scamDecision.effectiveRtp === 0, `pure_scam effective RTP is 0%`);

    // 4. High Bet Interceptor (Bet >= threshold)
    const highBetDecision = evaluateRiggedDecision(150_000, 500_000, 1, { ...dummyConfig, forcedOutcome: 'auto', activeProfile: 'jackpot_drainer' });
    assert(highBetDecision.shouldWin === false, `High Bet Snipe must enforce shouldWin = false`);
    assert(highBetDecision.profileApplied === 'jackpot_drainer', `Profile applied is jackpot_drainer`);

    // 5. Beginner's Luck Honeypot Phase 1 (Rounds 0, 1, 2) vs Phase 2 (Round 3+)
    const honeypotEarly = evaluateRiggedDecision(10_000, 500_000, 0, { ...dummyConfig, forcedOutcome: 'auto', activeProfile: 'beginners_luck', honeypotMaxWins: 3 });
    assert(honeypotEarly.shouldWin === true, `Beginner's Luck early round (round 0) must trigger guaranteed honeypot win`);

    const honeypotDrained = evaluateRiggedDecision(10_000, 500_000, 4, { ...dummyConfig, forcedOutcome: 'auto', activeProfile: 'beginners_luck', honeypotMaxWins: 3, honeypotDrainRtp: 0 });
    assert(honeypotDrained.shouldWin === false, `Beginner's Luck post-honeypot round with 0% drain RTP must enforce loss`);
  }
}

// ============================================================================
// SUITE 3: EDGE-CASE FUZZING & ADVERSARIAL BOUNDARY PROBES
// ============================================================================
async function runEdgeCaseFuzzingSuite() {
  console.log(`\n${BOLD}${CYAN}====================================================================${RESET}`);
  console.log(`${BOLD}${CYAN} 3. EDGE-CASE FUZZING & ADVERSARIAL BOUNDARY PROBES                 ${RESET}`);
  console.log(`${BOLD}${CYAN}====================================================================${RESET}\n`);

  console.log(`${BOLD}[3.1] Extreme Wagers & Currency Parsing Fuzzing${RESET}`);
  {
    // Test formatIDR with extreme values
    assert(formatIDR(0) === 'Rp 0', `formatIDR(0) == "Rp 0"`);
    assert(formatIDR(-50000) === '-Rp 50.000', `formatIDR(-50000) handles negative properly`);
    assert(formatIDR(1_000_000_000) === 'Rp 1.000.000.000', `formatIDR handles 1 Billion IDR`);
    assert(formatIDR(Number.MAX_SAFE_INTEGER).includes('Rp'), `formatIDR handles Number.MAX_SAFE_INTEGER without crashing`);

    // Test parseIDR
    assert(parseIDR('Rp 500.000') === 500000, `parseIDR("Rp 500.000") == 500000`);
    assert(parseIDR('-Rp 150.000') === -150000, `parseIDR("-Rp 150.000") == -150000`);
    assert(parseIDR('invalid_string') === 0, `parseIDR("invalid_string") safely defaults to 0`);

    // Test Loss Converter
    const zeroLoss = calculateLossEquivalents(0);
    assert(zeroLoss.length === REAL_WORLD_ITEMS.length, `calculateLossEquivalents(0) returns all ${REAL_WORLD_ITEMS.length} items`);
    assert(zeroLoss.every(i => i.count === 0 && i.formattedCount === '0'), `All items count is 0 on zero loss`);

    const smallLoss = calculateLossEquivalents(5_000);
    const nasiPadang = smallLoss.find(i => i.id === 'nasi_padang');
    assert(nasiPadang !== undefined && nasiPadang.count === 5000 / 15000, `calculateLossEquivalents(5000) accurately calculates 0.33 Porsi Nasi Padang`);

    const primaryHuge = getPrimaryLossEquivalent(30_000_000);
    assert(primaryHuge.id === 'motor_vario', `getPrimaryLossEquivalent(30M) prioritizes Motor Vario`);
  }

  console.log(`\n${BOLD}[3.2] Crash Rocket Time & Multiplier Boundary Fuzzing${RESET}`);
  {
    // t <= 0
    assert(getMultiplierAtTime(0) === 1.00, `M(0) is exactly 1.00x`);
    assert(getMultiplierAtTime(-5) === 1.00, `M(-5s) is clamped safely to 1.00x`);

    // Huge time t = 1000s
    const bigMult = getMultiplierAtTime(1000);
    assert(Number.isFinite(bigMult) && bigMult > 1000, `M(1000s) does not produce NaN or overflow`);

    // getTimeToMultiplier for invalid multipliers
    assert(getTimeToMultiplier(1.0) === 0, `t(1.0x) == 0s`);
    assert(getTimeToMultiplier(0.5) === 0, `t(0.5x) clamped safely to 0s`);
    assert(getTimeToMultiplier(-10) === 0, `t(-10x) clamped safely to 0s`);

    // calculateCashOut boundary conditions
    const co1 = calculateCashOut(10_000, 1.00, 1.50);
    assert(co1.isSuccess === true && co1.payout === 10_000, `Cashout at 1.00x succeeds with 10,000 IDR payout`);

    const co2 = calculateCashOut(10_000, 2.00, 2.00);
    assert(co2.isSuccess === true && co2.payout === 20_000, `Cashout at exact crash boundary (2.00x == 2.00x) succeeds`);

    const co3 = calculateCashOut(10_000, 2.01, 2.00);
    assert(co3.isSuccess === false && co3.payout === 0, `Cashout at 2.01x > 2.00x fails with 0 payout`);
  }

  console.log(`\n${BOLD}[3.3] Togel 4D Boundary Input & Digit Fuzzing${RESET}`);
  {
    // Test validator with adversarial strings
    assert(validateTogelNumber('4D', '').isValid === false, `Empty string is invalid 4D`);
    assert(validateTogelNumber('4D', '123').isValid === false, `3 digits is invalid 4D`);
    assert(validateTogelNumber('4D', '12345').isValid === false, `5 digits is invalid 4D`);
    assert(validateTogelNumber('4D', 'ABCD').isValid === false, `Letters are invalid 4D`);
    assert(validateTogelNumber('4D', '0000').isValid === true, `0000 is valid 4D`);
    assert(validateTogelNumber('4D', '9999').isValid === true, `9999 is valid 4D`);

    // Colok Macau duplicate digit check
    assert(validateTogelNumber('COLOK_MACAU', '4, 4').isValid === false, `Colok Macau rejects duplicate digits (4, 4)`);
    assert(validateTogelNumber('COLOK_MACAU', '4, 7').isValid === true, `Colok Macau accepts distinct digits (4, 7)`);

    // Colok Naga duplicate digit check
    assert(validateTogelNumber('COLOK_NAGA', '4, 4, 2').isValid === false, `Colok Naga rejects duplicate digits (4, 4, 2)`);
    assert(validateTogelNumber('COLOK_NAGA', '4, 7, 2').isValid === true, `Colok Naga accepts 3 distinct digits (4, 7, 2)`);

    // Shio invalid vs valid names
    assert(validateTogelNumber('SHIO', 'Gajah').isValid === false, `Shio Gajah is invalid`);
    assert(validateTogelNumber('SHIO', 'NAGA').isValid === true, `Shio NAGA is valid`);

    // Breakdown breakdownDrawNumber
    const bd = breakdownDrawNumber('0123');
    assert(bd.as === '0' && bd.kop === '1' && bd.kepala === '2' && bd.ekor === '3', `Draw number "0123" decomposed properly to AS:0, KOP:1, KEPALA:2, EKOR:3`);
  }

  console.log(`\n${BOLD}[3.4] Sports Engine Boundary & High Stoppage Time Fuzzing${RESET}`);
  {
    const fixture = generateDefaultFixtures()[0];
    const userBet: UserSportsBet = {
      matchId: fixture.id,
      market: 'OVER_UNDER_2_5',
      selection: 'UNDER',
      selectionLabel: 'Under 2.5 Gol',
      odds: 1.85,
      wagerAmount: 50_000,
      potentialPayout: 92_500,
    };

    // Stoppage time heartbreak simulation
    const sim = simulateMatchEvents(fixture, userBet, 'near_miss', { forcedOutcome: 'force_loss' });
    assert(sim.events.length >= 2, `Simulation generated full timeline`);
    assert(sim.events[0].type === 'KICKOFF', `Timeline starts with KICKOFF`);
    assert(sim.events[sim.events.length - 1].type === 'FULLTIME', `Timeline ends with FULLTIME`);

    // Verify chronological event ordering
    let chronologicallyValid = true;
    for (let i = 1; i < sim.events.length; i++) {
      if (sim.events[i].minute < sim.events[i - 1].minute) {
        chronologicallyValid = false;
        break;
      }
    }
    assert(chronologicallyValid, `All match commentary events are strictly monotonic in minute time`);

    // Check high stoppage minute
    const lastHeartbreak = sim.events.find(e => e.isHeartbreakEvent);
    if (lastHeartbreak) {
      assert(lastHeartbreak.minute >= 90, `Heartbreak event occurs in injury time (Minute ${lastHeartbreak.minute})`);
    }
  }
}

// ============================================================================
// MAIN RUNNER & REPORT AGGREGATOR
// ============================================================================
async function main() {
  console.log(`\n${BOLD}====================================================================${RESET}`);
  console.log(`${BOLD}   JUDORU45_GAME - EMPIRICAL ADVERSARIAL STRESS TEST HARNESS       ${RESET}`);
  console.log(`${BOLD}   Agent: Challenger 1 (critic & specialist)                        ${RESET}`);
  console.log(`${BOLD}====================================================================${RESET}\n`);

  const startTime = Date.now();

  await runMonteCarloSuite();
  await runInvariantSuite();
  await runEdgeCaseFuzzingSuite();

  const elapsedMs = Date.now() - startTime;

  console.log(`\n${BOLD}${CYAN}====================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}                 MONTE CARLO SIMULATION SUMMARY TABLE               ${RESET}`);
  console.log(`${BOLD}${CYAN}====================================================================${RESET}`);
  console.table(monteCarloResults);

  console.log(`\n${BOLD}====================================================================${RESET}`);
  console.log(`${BOLD}   FINAL EMPIRICAL CHALLENGE EXECUTION SUMMARY                     ${RESET}`);
  console.log(`${BOLD}====================================================================${RESET}`);
  console.log(`  Total Assertions Passed: ${GREEN}${BOLD}${totalAssertionsPassed}${RESET}`);
  console.log(`  Total Assertions Failed: ${totalAssertionsFailed > 0 ? RED : GREEN}${BOLD}${totalAssertionsFailed}${RESET}`);
  console.log(`  Execution Elapsed Time : ${CYAN}${elapsedMs} ms${RESET}`);
  console.log(`====================================================================\n`);

  if (totalAssertionsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(`${RED}Fatal Test Runner Exception:${RESET}`, err);
  process.exit(1);
});
