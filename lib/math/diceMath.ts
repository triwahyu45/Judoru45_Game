/**
 * Dice Roll Mathematical Engine & Rigged Near-Miss Algorithms
 * Modes: Over/Under Precision Slider (0.00 to 100.00) & Exact 2-Dice Sum (2 to 12)
 */

import { AdminConfig } from '../context/GameContext';

export type DiceGameMode = 'SLIDER' | 'SUM';
export type SliderDirection = 'OVER' | 'UNDER';

export interface DiceSumOdds {
  sum: number;
  ways: number;
  combinations: [number, number][];
  probability: number; // e.g. 0.1667 (16.67%)
  multiplier: number;  // 98% RTP house adjusted multiplier
}

export const DICE_SUM_CONFIG: Record<number, DiceSumOdds> = {
  2: { sum: 2, ways: 1, combinations: [[1, 1]], probability: 1 / 36, multiplier: 35.28 },
  3: { sum: 3, ways: 2, combinations: [[1, 2], [2, 1]], probability: 2 / 36, multiplier: 17.64 },
  4: { sum: 4, ways: 3, combinations: [[1, 3], [2, 2], [3, 1]], probability: 3 / 36, multiplier: 11.76 },
  5: { sum: 5, ways: 4, combinations: [[1, 4], [2, 3], [3, 2], [4, 1]], probability: 4 / 36, multiplier: 8.82 },
  6: { sum: 6, ways: 5, combinations: [[1, 5], [2, 4], [3, 3], [4, 2], [5, 1]], probability: 5 / 36, multiplier: 7.06 },
  7: { sum: 7, ways: 6, combinations: [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]], probability: 6 / 36, multiplier: 5.88 },
  8: { sum: 8, ways: 5, combinations: [[2, 6], [3, 5], [4, 4], [5, 3], [6, 2]], probability: 5 / 36, multiplier: 7.06 },
  9: { sum: 9, ways: 4, combinations: [[3, 6], [4, 5], [5, 4], [6, 3]], probability: 4 / 36, multiplier: 8.82 },
  10: { sum: 10, ways: 3, combinations: [[4, 6], [5, 5], [6, 4]], probability: 3 / 36, multiplier: 11.76 },
  11: { sum: 11, ways: 2, combinations: [[5, 6], [6, 5]], probability: 2 / 36, multiplier: 17.64 },
  12: { sum: 12, ways: 1, combinations: [[6, 6]], probability: 1 / 36, multiplier: 35.28 },
};

/**
 * Calculates Win Chance (%) and Payout Multiplier for Slider Mode
 * Standard House Edge = 1.0% (99.0% RTP)
 */
export function calculateSliderOdds(
  target: number,
  direction: SliderDirection,
  houseEdgeRate: number = 0.01
): { winChance: number; multiplier: number } {
  const clampedTarget = Math.max(1, Math.min(98, target));
  const rtp = (1 - houseEdgeRate) * 100; // e.g. 99.0%

  let winChance: number;
  if (direction === 'OVER') {
    winChance = 100.0 - clampedTarget;
  } else {
    winChance = clampedTarget;
  }

  // Multiplier = RTP / WinChance
  const multiplier = Number((rtp / winChance).toFixed(4));
  return {
    winChance: Number(winChance.toFixed(2)),
    multiplier,
  };
}

/**
 * Decomposes a target sum (2-12) into valid two 6-sided dice faces [d1, d2]
 */
export function decomposeSumToDice(targetSum: number): [number, number] {
  const clamped = Math.max(2, Math.min(12, Math.round(targetSum)));
  const comboList = DICE_SUM_CONFIG[clamped]?.combinations;
  if (comboList && comboList.length > 0) {
    const randomIndex = Math.floor(Math.random() * comboList.length);
    return comboList[randomIndex];
  }
  // Fallback
  const d1 = Math.min(6, Math.max(1, Math.floor(clamped / 2)));
  const d2 = clamped - d1;
  return [d1, d2];
}

export interface DiceRollResult {
  mode: DiceGameMode;
  rolledValue: number; // Slider 0.00-100.00 or Sum 2-12
  diceValues: [number, number]; // [d1, d2] for visual representation
  target: number;
  direction?: SliderDirection;
  isWin: boolean;
  winChance: number;
  multiplier: number;
  betAmount: number;
  payout: number;
  netProfit: number;
  isNearMiss: boolean;
  nearMissDiff?: number;
  riggedApplied: boolean;
  riggedReason?: string;
}

/**
 * Evaluates a Dice Roll for both Slider and 2-Dice Sum modes
 * Incorporates Rigged 1-Point Off and Continuous Near-Miss Mechanics
 */
export function rollDiceGame(params: {
  mode: DiceGameMode;
  betAmount: number;
  sliderTarget?: number;
  sliderDirection?: SliderDirection;
  sumTarget?: number;
  adminConfig?: AdminConfig;
  roundsPlayed?: number;
}): DiceRollResult {
  const {
    mode,
    betAmount,
    sliderTarget = 50,
    sliderDirection = 'OVER',
    sumTarget = 7,
    adminConfig,
    roundsPlayed = 0,
  } = params;

  const cfg = adminConfig ?? {
    globalRtp: 35,
    activeProfile: 'fair',
    forcedOutcome: 'auto',
    highBetThreshold: 100_000,
    nearMissProbability: 0.75,
  };

  let rolledValue = 0;
  let diceValues: [number, number] = [1, 1];
  let isWin = false;
  let winChance = 0;
  let multiplier = 0;
  let isNearMiss = false;
  let nearMissDiff: number | undefined;
  let isRigged = false;
  let riggedReason: string | undefined;

  // Determine Odds depending on mode
  if (mode === 'SLIDER') {
    const odds = calculateSliderOdds(sliderTarget, sliderDirection);
    winChance = odds.winChance;
    multiplier = odds.multiplier;
  } else {
    const odds = DICE_SUM_CONFIG[sumTarget] ?? DICE_SUM_CONFIG[7];
    winChance = Number((odds.probability * 100).toFixed(2));
    multiplier = odds.multiplier;
  }

  // Evaluate Rigged Decision
  let shouldForceWin = cfg.forcedOutcome === 'force_win';
  let shouldForceLoss = cfg.forcedOutcome === 'force_loss';

  // High Bet Punishment
  if (!shouldForceWin && betAmount >= cfg.highBetThreshold && Math.random() < 0.85) {
    shouldForceLoss = true;
    isRigged = true;
    riggedReason = `High Bet Snipe (Bet ${betAmount} >= ${cfg.highBetThreshold}): Rigged near-miss triggered`;
  }

  // Beginner's Luck
  if (cfg.activeProfile === 'beginners_luck') {
    if (roundsPlayed < 2) {
      shouldForceWin = true;
      isRigged = true;
      riggedReason = `Beginner's Luck Honeypot (Round ${roundsPlayed + 1}/2 Win Induction)`;
    } else {
      shouldForceLoss = true;
      isRigged = true;
      riggedReason = `Beginner's Luck Phase 2 (Capital Extraction Draining)`;
    }
  }

  // Pure Scam or Jackpot Drainer
  if (cfg.activeProfile === 'pure_scam' || cfg.activeProfile === 'jackpot_drainer') {
    shouldForceLoss = true;
    isRigged = true;
    riggedReason = `Predatory Rigged Profile (${cfg.activeProfile}): Forced loss near-miss`;
  }

  // Near-Miss Profile
  const triggerNearMiss =
    cfg.activeProfile === 'near_miss' ||
    (!shouldForceWin && Math.random() < cfg.nearMissProbability);

  // -------------------------------------------------------------
  // Execution: SLIDER MODE
  // -------------------------------------------------------------
  if (mode === 'SLIDER') {
    if (shouldForceWin) {
      // Pick winning value comfortably inside winning zone
      if (sliderDirection === 'OVER') {
        const minVal = sliderTarget + 0.05;
        const maxVal = 99.5;
        rolledValue = +(minVal + Math.random() * Math.max(0.5, maxVal - minVal)).toFixed(2);
      } else {
        const minVal = 0.5;
        const maxVal = sliderTarget - 0.05;
        rolledValue = +(minVal + Math.random() * Math.max(0.5, maxVal - minVal)).toFixed(2);
      }
      isWin = true;
      isRigged = true;
    } else if (shouldForceLoss || triggerNearMiss) {
      // Near-Miss Rigged Roll: Miss by tiny heartbreaking margin (0.01 to 0.45)
      const offset = +(0.01 + Math.random() * 0.44).toFixed(2);
      if (sliderDirection === 'OVER') {
        // Must be just BELOW sliderTarget
        rolledValue = +(sliderTarget - offset).toFixed(2);
        if (rolledValue <= 0) rolledValue = 0.01;
      } else {
        // Must be just ABOVE sliderTarget
        rolledValue = +(sliderTarget + offset).toFixed(2);
        if (rolledValue >= 100) rolledValue = 99.99;
      }
      isWin = false;
      isNearMiss = true;
      nearMissDiff = offset;
      isRigged = true;
      if (!riggedReason) {
        riggedReason = `Slider Psychological Near-Miss: Landed within ${offset} points of win target`;
      }
    } else {
      // Fair Roll
      rolledValue = +(Math.random() * 100).toFixed(2);
      isWin = sliderDirection === 'OVER' ? rolledValue > sliderTarget : rolledValue < sliderTarget;
      if (!isWin) {
        const diff = Math.abs(rolledValue - sliderTarget);
        if (diff <= 1.5) {
          isNearMiss = true;
          nearMissDiff = +diff.toFixed(2);
        }
      }
    }

    // Map continuous slider 0-100 to visual 2-dice faces
    const approximateSum = Math.min(12, Math.max(2, Math.round((rolledValue / 100) * 10 + 2)));
    diceValues = decomposeSumToDice(approximateSum);
  }

  // -------------------------------------------------------------
  // Execution: 2-DICE SUM MODE
  // -------------------------------------------------------------
  else {
    if (shouldForceWin) {
      rolledValue = sumTarget;
      diceValues = decomposeSumToDice(sumTarget);
      isWin = true;
      isRigged = true;
    } else if (shouldForceLoss || triggerNearMiss) {
      // Rigged 1-Point Off Near-Miss
      const offset = Math.random() < 0.5 ? 1 : -1;
      let targetSum = sumTarget + offset;
      if (targetSum < 2) targetSum = 3;
      if (targetSum > 12) targetSum = 11;
      // If target was edge (e.g. 2), offset becomes +1 -> 3
      if (sumTarget === 2) targetSum = 3;
      if (sumTarget === 12) targetSum = 11;

      rolledValue = targetSum;
      diceValues = decomposeSumToDice(targetSum);
      isWin = false;
      isNearMiss = true;
      nearMissDiff = Math.abs(rolledValue - sumTarget);
      isRigged = true;
      if (!riggedReason) {
        riggedReason = `2-Dice 1-Point Off Near-Miss: Target was ${sumTarget}, rolled ${rolledValue}`;
      }
    } else {
      // Fair 2-Dice Roll
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      diceValues = [d1, d2];
      rolledValue = d1 + d2;
      isWin = rolledValue === sumTarget;
      if (!isWin && Math.abs(rolledValue - sumTarget) === 1) {
        isNearMiss = true;
        nearMissDiff = 1;
      }
    }
  }

  const payout = isWin ? Number((betAmount * multiplier).toFixed(0)) : 0;
  const netProfit = payout - betAmount;

  return {
    mode,
    rolledValue,
    diceValues,
    target: mode === 'SLIDER' ? sliderTarget : sumTarget,
    direction: mode === 'SLIDER' ? sliderDirection : undefined,
    isWin,
    winChance,
    multiplier,
    betAmount,
    payout,
    netProfit,
    isNearMiss,
    nearMissDiff,
    riggedApplied: isRigged,
    riggedReason,
  };
}
