/**
 * Judoru45_Game - M4 Automated Verification Test Script
 * Comprehensive verification of Togel 4D Lottery & Tebak Skor Bola Sportsbook
 */

import {
  TOGEL_RULES,
  validateTogelNumber,
  calculateTicketCost,
  breakdownDrawNumber,
  evaluateTogelWin,
  generateRiggedTogelDraw,
  generateQuickPick,
  TogelTicket,
} from '../lib/math/togelMath';

import {
  LIGA_1_TEAMS,
  UCL_TEAMS,
  calculateMatchOdds,
  generateDefaultFixtures,
  simulateMatchEvents,
  UserSportsBet,
} from '../lib/math/sportsMath';

import { synthEngine } from '../lib/sound/synthEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('=====================================================');
console.log('       JUDORU45 M4 AUTOMATED VERIFICATION SUITE       ');
console.log('  (Togel 4D Lottery & Tebak Skor Bola Sportsbook)   ');
console.log('=====================================================\n');

// -----------------------------------------------------------------------------
// 1. TOGEL MATHEMATICAL RULES & DISCOUNT VERIFICATION
// -----------------------------------------------------------------------------
console.log('[SECTION 1] Testing Togel Rules, Payouts & Market Discounts...');

assert(TOGEL_RULES['4D'].payoutMultiplier === 3000, '4D Payout Multiplier must be 3,000x');
assert(TOGEL_RULES['4D'].discountPercent === 66, '4D Discount must be 66% (pay 34%)');

assert(TOGEL_RULES['3D'].payoutMultiplier === 400, '3D Payout Multiplier must be 400x');
assert(TOGEL_RULES['3D'].discountPercent === 59, '3D Discount must be 59% (pay 41%)');

assert(TOGEL_RULES['2D_BELAKANG'].payoutMultiplier === 70, '2D Belakang Payout must be 70x');
assert(TOGEL_RULES['2D_BELAKANG'].discountPercent === 29, '2D Belakang Discount must be 29% (pay 71%)');

assert(TOGEL_RULES['COLOK_BEBAS'].payoutMultiplier === 1.5, 'Colok Bebas Payout must be 1.5x');
assert(TOGEL_RULES['COLOK_BEBAS'].discountPercent === 6, 'Colok Bebas Discount must be 6%');

assert(TOGEL_RULES['COLOK_MACAU'].payoutMultiplier === 6.5, 'Colok Macau Payout must be 6.5x');
assert(TOGEL_RULES['COLOK_NAGA'].payoutMultiplier === 25, 'Colok Naga Payout must be 25x');
assert(TOGEL_RULES['SHIO'].payoutMultiplier === 9.5, 'Shio Payout must be 9.5x');

// Test cost calculations
const cost4D = calculateTicketCost('4D', 10000);
assert(cost4D.grossAmount === 10000, 'Gross 4D amount is 10,000');
assert(cost4D.discountAmount === 6600, '4D 66% discount on 10,000 is 6,600');
assert(cost4D.netAmount === 3400, '4D net payable on 10,000 is 3,400');
assert(cost4D.potentialPayout === 30000000, '4D potential payout on 10,000 is 30,000,000');

const cost2D = calculateTicketCost('2D_BELAKANG', 50000);
assert(cost2D.discountAmount === 14500, '2D 29% discount on 50,000 is 14,500');
assert(cost2D.netAmount === 35500, '2D net payable on 50,000 is 35,500');
assert(cost2D.potentialPayout === 3500000, '2D potential payout on 50,000 is 3,500,000 (70x)');

// -----------------------------------------------------------------------------
// 2. TOGEL INPUT VALIDATION & QUICK PICK
// -----------------------------------------------------------------------------
console.log('\n[SECTION 2] Testing Togel Input Validation & Quick Pick...');

assert(validateTogelNumber('4D', '8472').isValid === true, '8472 is valid 4D');
assert(validateTogelNumber('4D', '847').isValid === false, '847 is invalid 4D');
assert(validateTogelNumber('4D', 'abcd').isValid === false, 'abcd is invalid 4D');

assert(validateTogelNumber('3D', '472').isValid === true, '472 is valid 3D');
assert(validateTogelNumber('2D_BELAKANG', '72').isValid === true, '72 is valid 2D');
assert(validateTogelNumber('COLOK_BEBAS', '7').isValid === true, '7 is valid Colok Bebas');
assert(validateTogelNumber('COLOK_MACAU', '47').isValid === true, '47 is valid Colok Macau');
assert(validateTogelNumber('COLOK_MACAU', '44').isValid === false, '44 is invalid Colok Macau (must be distinct digits)');
assert(validateTogelNumber('COLOK_NAGA', '472').isValid === true, '472 is valid Colok Naga');
assert(validateTogelNumber('SHIO', 'Naga').isValid === true, 'Naga is valid Shio');
assert(validateTogelNumber('SHIO', 'Gajah').isValid === false, 'Gajah is invalid Shio');

// Quick pick generation
const qp4 = generateQuickPick('4D');
assert(/^\d{4}$/.test(qp4), `Quick pick 4D (${qp4}) has exact 4 digits`);
const qp3 = generateQuickPick('3D');
assert(/^\d{3}$/.test(qp3), `Quick pick 3D (${qp3}) has exact 3 digits`);

// -----------------------------------------------------------------------------
// 3. TOGEL WIN EVALUATION & POSITIONAL BREAKDOWN
// -----------------------------------------------------------------------------
console.log('\n[SECTION 3] Testing Togel Win Evaluation & Breakdown...');

const breakdown = breakdownDrawNumber('8472');
assert(breakdown.as === '8', 'AS is 8');
assert(breakdown.kop === '4', 'KOP is 4');
assert(breakdown.kepala === '7', 'KEPALA is 7');
assert(breakdown.ekor === '2', 'EKOR is 2');

const mockTicket4D: TogelTicket = {
  id: 't1',
  type: '4D',
  numbers: '8472',
  grossBet: 10000,
  discountPercent: 66,
  discountAmount: 6600,
  netBet: 3400,
  potentialPayout: 30000000,
  createdAt: Date.now(),
};

const win4D = evaluateTogelWin(mockTicket4D, '8472');
assert(win4D.isWin === true && win4D.payout === 30000000, '4D ticket 8472 wins 30,000,000 on draw 8472');

const lose4D = evaluateTogelWin(mockTicket4D, '8473');
assert(lose4D.isWin === false && lose4D.payout === 0, '4D ticket 8472 loses on draw 8473');

const mockTicket3D: TogelTicket = {
  ...mockTicket4D,
  type: '3D',
  numbers: '472',
  potentialPayout: 4000000,
};
const win3D = evaluateTogelWin(mockTicket3D, '9472');
assert(win3D.isWin === true && win3D.payout === 4000000, '3D ticket 472 wins 4,000,000 on draw 9472 (KOP-KEPALA-EKOR match)');

const mockColok: TogelTicket = {
  ...mockTicket4D,
  type: 'COLOK_BEBAS',
  numbers: '7',
  potentialPayout: 15000,
};
const winColok = evaluateTogelWin(mockColok, '8472');
assert(winColok.isWin === true && winColok.payout === 15000, 'Colok Bebas 7 wins 1.5x on draw 8472');

// -----------------------------------------------------------------------------
// 4. TOGEL RIGGED HOUSE ENGINE (NEAR-MISS & DRAINER)
// -----------------------------------------------------------------------------
console.log('\n[SECTION 4] Testing Togel Rigged Algorithms (3/4 Near-Miss & Drainer)...');

// Near-miss test
const nearMissResult = generateRiggedTogelDraw([mockTicket4D], 'near_miss', {
  nearMissProbability: 1.0,
});
assert(nearMissResult.isRigged === true, 'Near-miss result is flagged as rigged');
assert(nearMissResult.nearMissApplied === true, 'Near-miss applied flag is true');
assert(
  nearMissResult.winningNumber.startsWith('847'),
  `Near-miss winning number (${nearMissResult.winningNumber}) matches AS, KOP, KEPALA (847) from player bet 8472`
);
assert(
  nearMissResult.winningNumber !== '8472',
  `Near-miss winning number (${nearMissResult.winningNumber}) intentionally misses EKOR to avoid jackpot payout`
);

// Forced loss / Prize Pool Drainer
const drainerResult = generateRiggedTogelDraw([mockTicket4D, mockTicket3D], 'pure_scam', {
  forcedOutcome: 'force_loss',
});
assert(drainerResult.isRigged === true, 'Prize pool drainer is flagged as rigged');
const evalDrain4D = evaluateTogelWin(mockTicket4D, drainerResult.winningNumber);
const evalDrain3D = evaluateTogelWin(mockTicket3D, drainerResult.winningNumber);
assert(evalDrain4D.payout === 0 && evalDrain3D.payout === 0, 'Drainer guarantees 0 player payout');

// -----------------------------------------------------------------------------
// 5. SPORTSBOOK MATHEMATICAL ODDS ENGINE (POISSON & VIGORISH)
// -----------------------------------------------------------------------------
console.log('\n[SECTION 5] Testing Sportsbook Odds Calculation & Teams...');

assert(LIGA_1_TEAMS.length >= 6, 'Liga 1 teams defined (Persija, Persib, Persebaya, Bali Utd, Arema, PSM)');
assert(UCL_TEAMS.length >= 6, 'UCL teams defined (Real Madrid, Man City, Arsenal, Bayern, Barcelona, PSG)');

const persija = LIGA_1_TEAMS[0];
const persib = LIGA_1_TEAMS[1];
const odds = calculateMatchOdds(persija, persib);

assert(odds.homeWin > 1.0 && odds.homeWin < 10.0, `Home Win odds (${odds.homeWin}) within realistic bounds`);
assert(odds.draw > 1.0 && odds.draw < 10.0, `Draw odds (${odds.draw}) within realistic bounds`);
assert(odds.awayWin > 1.0 && odds.awayWin < 10.0, `Away Win odds (${odds.awayWin}) within realistic bounds`);
assert(odds.over25 > 1.0 && odds.under25 > 1.0, 'Over 2.5 and Under 2.5 odds exist');
assert(odds.bttsYes > 1.0 && odds.bttsNo > 1.0, 'BTTS Yes and No odds exist');
assert(Object.keys(odds.exactScores).length >= 10, 'Exact score odds matrix populated with 10+ combinations');

// Check bookmaker margin / vigorish
const impliedProbSum = 1 / odds.homeWin + 1 / odds.draw + 1 / odds.awayWin;
assert(
  impliedProbSum >= 1.04,
  `Bookmaker overround / vigorish margin verified: Sum of implied probabilities = ${(impliedProbSum * 100).toFixed(1)}% (> 100%)`
);

const fixtures = generateDefaultFixtures();
assert(fixtures.length >= 4, 'Default match fixtures generated for Liga 1 and UCL');

// -----------------------------------------------------------------------------
// 6. FAST-FORWARD MATCH RUNNER & 90+ HEARTBREAK ENGINE
// -----------------------------------------------------------------------------
console.log('\n[SECTION 6] Testing Match Simulation & 90+ Minute Heartbreak Engine...');

const mockBetHomeWin: UserSportsBet = {
  matchId: fixtures[0].id,
  market: '1X2',
  selection: 'HOME',
  selectionLabel: '1X2: 1 (Persija)',
  odds: fixtures[0].odds.homeWin,
  wagerAmount: 100000,
  potentialPayout: Math.round(100000 * fixtures[0].odds.homeWin),
};

// Test Heartbreak Engine
const heartbreakSim = simulateMatchEvents(fixtures[0], mockBetHomeWin, 'near_miss', {
  sportsBookmakerBias: 1.0,
});

assert(heartbreakSim.events.length >= 6, `Match timeline generated with ${heartbreakSim.events.length} chronological events`);
assert(heartbreakSim.events[0].type === 'KICKOFF', 'First event is KICKOFF');
assert(heartbreakSim.events[heartbreakSim.events.length - 1].type === 'FULLTIME', 'Last event is FULLTIME');
assert(heartbreakSim.isHeartbreakTriggered === true, 'Heartbreak engine triggered flag is true');
assert(heartbreakSim.isWin === false, 'User bet was converted to loss via late heartbreak');
assert(heartbreakSim.finalScore[0] === heartbreakSim.finalScore[1], `Score ended in Draw (${heartbreakSim.finalScore[0]}-${heartbreakSim.finalScore[1]}) cancelling Home Win bet`);

// Test Under 2.5 Heartbreak
const mockBetUnder: UserSportsBet = {
  matchId: fixtures[0].id,
  market: 'OVER_UNDER_2_5',
  selection: 'UNDER',
  selectionLabel: 'Under 2.5 Gol',
  odds: fixtures[0].odds.under25,
  wagerAmount: 50000,
  potentialPayout: Math.round(50000 * fixtures[0].odds.under25),
};

const underHeartbreak = simulateMatchEvents(fixtures[0], mockBetUnder, 'near_miss', {
  sportsBookmakerBias: 1.0,
});
assert(underHeartbreak.isHeartbreakTriggered === true, 'Under 2.5 heartbreak triggered');
const totalGoals = underHeartbreak.finalScore[0] + underHeartbreak.finalScore[1];
assert(totalGoals >= 3, `Late 90+ goal pushed total goals to ${totalGoals} (Over 2.5), destroying Under bet`);

// -----------------------------------------------------------------------------
// 7. WEB AUDIO SYNTHESIZER INTEGRATION (SSR/NODE SAFETY)
// -----------------------------------------------------------------------------
console.log('\n[SECTION 7] Testing Web Audio Synthesizer Node Safety...');

synthEngine.playLotteryTumble();
synthEngine.playBallReveal();
synthEngine.playWhistle();
synthEngine.playGoal();
synthEngine.playCoin();
synthEngine.playWin();
synthEngine.playJackpot();
assert(true, 'All M4 synth methods executed safely without DOM errors');

console.log('\n=====================================================');
console.log('  ✨ ALL M4 VERIFICATION TESTS PASSED CLEANLY (100%) ✨');
console.log('=====================================================\n');
