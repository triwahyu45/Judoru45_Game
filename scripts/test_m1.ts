/**
 * Judoru45_Game - M1 Automated Verification Script
 */

import { formatIDR, formatCompactIDR, parseIDR } from '../lib/utils/currency';
import { calculateLossEquivalents, getPrimaryLossEquivalent, REAL_WORLD_ITEMS } from '../lib/utils/lossConverter';
import { synthEngine } from '../lib/sound/synthEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('--- Judoru45 M1 Verification Suite ---');

// 1. Currency formatting assertions
console.log('\n[1] Testing Currency Utilities (IDR Formatter)...');
assert(formatIDR(500000) === 'Rp 500.000', 'formatIDR(500000) should be "Rp 500.000"');
assert(formatIDR(1250000) === 'Rp 1.250.000', 'formatIDR(1250000) should be "Rp 1.250.000"');
assert(formatIDR(0) === 'Rp 0', 'formatIDR(0) should be "Rp 0"');
assert(formatIDR(-150000) === '-Rp 150.000', 'formatIDR(-150000) should be "-Rp 150.000"');

assert(formatCompactIDR(1500000) === 'Rp 1,5 Jt', 'formatCompactIDR(1500000) should be "Rp 1,5 Jt"');
assert(formatCompactIDR(2500000000) === 'Rp 2,5 M', 'formatCompactIDR(2500000000) should be "Rp 2,5 M"');
assert(formatCompactIDR(50000) === 'Rp 50 Rb', 'formatCompactIDR(50000) should be "Rp 50 Rb"');

assert(parseIDR('Rp 500.000') === 500000, 'parseIDR("Rp 500.000") should be 500000');
assert(parseIDR('-Rp 150.000') === -150000, 'parseIDR("-Rp 150.000") should be -150000');

// 2. Real-world loss converter assertions
console.log('\n[2] Testing Loss Converter Utilities...');
const loss1 = calculateLossEquivalents(150000);
const nasiPadang = loss1.find(i => i.id === 'nasi_padang');
assert(nasiPadang !== undefined, 'Nasi Padang equivalent must exist in loss list');
assert(nasiPadang?.count === 10, 'Rp 150.000 loss should equal exactly 10 porsi Nasi Padang (@ Rp 15.000)');

const loss2 = calculateLossEquivalents(25000000);
const motor = loss2.find(i => i.id === 'motor_vario');
assert(motor !== undefined && motor.count === 1, 'Rp 25.000.000 loss should equal exactly 1 unit Motor Vario');

const primary1 = getPrimaryLossEquivalent(50000);
assert(primary1.id === 'nasi_padang', 'Small loss should prioritize Nasi Padang');

const primary2 = getPrimaryLossEquivalent(30000000);
assert(primary2.id === 'motor_vario', 'Large loss (30M) should prioritize Motor Vario');

// 3. Web Audio Synthesizer Node safety
console.log('\n[3] Testing Procedural Web Audio Synthesizer (SSR/Node Safety)...');
assert(typeof synthEngine.playCoin === 'function', 'synthEngine.playCoin exists');
assert(typeof synthEngine.playSpin === 'function', 'synthEngine.playSpin exists');
assert(typeof synthEngine.playWin === 'function', 'synthEngine.playWin exists');
assert(typeof synthEngine.playJackpot === 'function', 'synthEngine.playJackpot exists');
assert(typeof synthEngine.playRocket === 'function', 'synthEngine.playRocket exists');
assert(typeof synthEngine.playCrash === 'function', 'synthEngine.playCrash exists');
assert(typeof synthEngine.playRouletteBall === 'function', 'synthEngine.playRouletteBall exists');
assert(typeof synthEngine.playDiceRoll === 'function', 'synthEngine.playDiceRoll exists');
assert(typeof synthEngine.playLotteryTumble === 'function', 'synthEngine.playLotteryTumble exists');
assert(typeof synthEngine.playWhistle === 'function', 'synthEngine.playWhistle exists');
assert(typeof synthEngine.playGoal === 'function', 'synthEngine.playGoal exists');
assert(typeof synthEngine.playClick === 'function', 'synthEngine.playClick exists');

// Calling synth methods in Node should be completely safe and no-op without crashing
synthEngine.playCoin();
synthEngine.playSpin();
synthEngine.playWin();
synthEngine.playJackpot();
synthEngine.playRocket();
synthEngine.playCrash();
synthEngine.playRouletteBall();
synthEngine.playDiceRoll();
synthEngine.playLotteryTumble();
synthEngine.playWhistle();
synthEngine.playGoal();
synthEngine.playClick();
assert(true, 'All 12 procedural synth methods executed safely in non-DOM Node environment');

synthEngine.setMuted(true);
assert(synthEngine.getMuted() === true, 'Mute setting is maintained');
synthEngine.setMuted(false);
assert(synthEngine.getMuted() === false, 'Unmute setting is maintained');
synthEngine.setVolume(0.5);
assert(synthEngine.getVolume() === 0.5, 'Volume setting is maintained');

console.log('\n✨ ALL M1 VERIFICATION TESTS PASSED CLEANLY (Exit Code 0) ✨');
