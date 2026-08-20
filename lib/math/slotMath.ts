/**
 * Judoru45_Game - Slot Olympus (Zeus Pragmatic Style) Mathematical Engine
 * Implements 6x5 grid, Scatter Pays (8+ matching symbols anywhere), Cascading / Tumble mechanics,
 * Multiplier Orbs (2x - 500x), Free Spins / Zeus Bonus, and House Rigged Behavioral Hooks.
 */

export const GRID_COLS = 6;
export const GRID_ROWS = 5;

export type SymbolId =
  | 'SYM_CROWN'
  | 'SYM_HOURGLASS'
  | 'SYM_RING'
  | 'SYM_CHALICE'
  | 'SYM_GEM_RED'
  | 'SYM_GEM_PURPLE'
  | 'SYM_GEM_YELLOW'
  | 'SYM_GEM_GREEN'
  | 'SYM_GEM_BLUE'
  | 'SYM_SCATTER';

export interface SymbolDef {
  id: SymbolId;
  name: string;
  category: 'high' | 'mid' | 'low' | 'scatter';
  color: string;
  icon: string;
  baseWeightFair: number;
  baseWeightRigged: number;
  payout8to9: number;
  payout10to11: number;
  payout12Plus: number;
}

export const SLOT_SYMBOLS: Record<SymbolId, SymbolDef> = {
  SYM_CROWN: {
    id: 'SYM_CROWN',
    name: 'Mahkota Emas (Crown)',
    category: 'high',
    color: '#FFD700',
    icon: '👑',
    baseWeightFair: 4,
    baseWeightRigged: 1,
    payout8to9: 10.0,
    payout10to11: 25.0,
    payout12Plus: 50.0,
  },
  SYM_HOURGLASS: {
    id: 'SYM_HOURGLASS',
    name: 'Jam Pasir (Hourglass)',
    category: 'high',
    color: '#38BDF8',
    icon: '⏳',
    baseWeightFair: 6,
    baseWeightRigged: 2,
    payout8to9: 2.5,
    payout10to11: 10.0,
    payout12Plus: 25.0,
  },
  SYM_RING: {
    id: 'SYM_RING',
    name: 'Cincin Rubi (Ring)',
    category: 'mid',
    color: '#F43F5E',
    icon: '💍',
    baseWeightFair: 8,
    baseWeightRigged: 4,
    payout8to9: 2.0,
    payout10to11: 5.0,
    payout12Plus: 15.0,
  },
  SYM_CHALICE: {
    id: 'SYM_CHALICE',
    name: 'Cawan Emas (Chalice)',
    category: 'mid',
    color: '#EAB308',
    icon: '🏆',
    baseWeightFair: 10,
    baseWeightRigged: 6,
    payout8to9: 1.5,
    payout10to11: 2.0,
    payout12Plus: 12.0,
  },
  SYM_GEM_RED: {
    id: 'SYM_GEM_RED',
    name: 'Permata Merah (Red Gem)',
    category: 'low',
    color: '#EF4444',
    icon: '💎',
    baseWeightFair: 14,
    baseWeightRigged: 16,
    payout8to9: 1.0,
    payout10to11: 1.5,
    payout12Plus: 10.0,
  },
  SYM_GEM_PURPLE: {
    id: 'SYM_GEM_PURPLE',
    name: 'Permata Ungu (Purple Gem)',
    category: 'low',
    color: '#A855F7',
    icon: '🔮',
    baseWeightFair: 16,
    baseWeightRigged: 18,
    payout8to9: 0.8,
    payout10to11: 1.2,
    payout12Plus: 8.0,
  },
  SYM_GEM_YELLOW: {
    id: 'SYM_GEM_YELLOW',
    name: 'Permata Kuning (Yellow Gem)',
    category: 'low',
    color: '#FBBF24',
    icon: '🔶',
    baseWeightFair: 18,
    baseWeightRigged: 22,
    payout8to9: 0.5,
    payout10to11: 1.0,
    payout12Plus: 5.0,
  },
  SYM_GEM_GREEN: {
    id: 'SYM_GEM_GREEN',
    name: 'Permata Hijau (Green Gem)',
    category: 'low',
    color: '#10B981',
    icon: '🟢',
    baseWeightFair: 20,
    baseWeightRigged: 25,
    payout8to9: 0.4,
    payout10to11: 0.9,
    payout12Plus: 4.0,
  },
  SYM_GEM_BLUE: {
    id: 'SYM_GEM_BLUE',
    name: 'Permata Biru (Blue Gem)',
    category: 'low',
    color: '#3B82F6',
    icon: '🔷',
    baseWeightFair: 24,
    baseWeightRigged: 30,
    payout8to9: 0.25,
    payout10to11: 0.75,
    payout12Plus: 2.0,
  },
  SYM_SCATTER: {
    id: 'SYM_SCATTER',
    name: 'Zeus Scatter',
    category: 'scatter',
    color: '#F59E0B',
    icon: '⚡',
    baseWeightFair: 3,
    baseWeightRigged: 0.8,
    payout8to9: 3.0, // 4 scatters = 3x bet + 15 free spins
    payout10to11: 5.0, // 5 scatters = 5x bet + 15 free spins
    payout12Plus: 100.0, // 6 scatters = 100x bet + 15 free spins
  },
};

export interface SlotCell {
  id: string;
  symbol: SymbolId;
  col: number;
  row: number;
  isWinning?: boolean;
  multiplier?: number; // 2x to 500x orb
  isScatter?: boolean;
}

export interface WinningMatch {
  symbol: SymbolId;
  count: number;
  multiplier: number;
  winAmount: number;
  cellIds: string[];
}

export interface CascadeStep {
  stepIndex: number;
  grid: SlotCell[][]; // columns [0..5][0..4]
  winningMatches: WinningMatch[];
  multiplierOrbs: { cellId: string; multiplier: number; col: number; row: number }[];
  stepPayout: number; // Raw win from matches in this tumble step
  isFinalTumble: boolean;
}

export interface SlotSpinResult {
  initialGrid: SlotCell[][];
  steps: CascadeStep[];
  totalBaseWin: number;
  multiplierOrbsTotal: number;
  totalMultiplierApplied: number;
  finalPayout: number;
  scatterCount: number;
  freeSpinsTriggered: boolean;
  freeSpinsAwarded: number;
  isNearMiss: boolean;
  isLossDisguisedAsWin: boolean;
  isWastedOrbTease: boolean;
  riggedReason?: string;
}

export type SlotRigMode =
  | 'fair'
  | 'beginners_luck'
  | 'near_miss'
  | 'jackpot_drainer'
  | 'pure_scam';

/**
 * Get payout multiplier based on symbol and count
 */
export function getPaytableMultiplier(symbolId: SymbolId, count: number): number {
  const def = SLOT_SYMBOLS[symbolId];
  if (!def) return 0;

  if (symbolId === 'SYM_SCATTER') {
    if (count >= 6) return 100.0;
    if (count === 5) return 5.0;
    if (count === 4) return 3.0;
    return 0;
  }

  if (count >= 12) return def.payout12Plus;
  if (count >= 10) return def.payout10to11;
  if (count >= 8) return def.payout8to9;
  return 0;
}

/**
 * Returns random Multiplier Orb value (2x to 500x)
 */
export function getRandomMultiplierOrbValue(): number {
  const roll = Math.random();
  if (roll < 0.60) {
    // Green tier (2x, 3x, 4x, 5x)
    const values = [2, 3, 4, 5];
    return values[Math.floor(Math.random() * values.length)];
  } else if (roll < 0.88) {
    // Blue tier (10x, 15x, 20x, 25x)
    const values = [10, 15, 20, 25];
    return values[Math.floor(Math.random() * values.length)];
  } else if (roll < 0.98) {
    // Purple tier (50x, 100x)
    const values = [50, 100];
    return values[Math.floor(Math.random() * values.length)];
  } else {
    // Gold/Red legendary tier (250x, 500x)
    const values = [250, 500];
    return values[Math.floor(Math.random() * values.length)];
  }
}

/**
 * Get color theme for multiplier orb
 */
export function getOrbTierColor(multiplier: number): {
  border: string;
  bg: string;
  glow: string;
  text: string;
} {
  if (multiplier >= 250) {
    return {
      border: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.3)',
      glow: '0 0 20px #EF4444, 0 0 40px #F59E0B',
      text: '#FEF08A',
    };
  } else if (multiplier >= 50) {
    return {
      border: '#A855F7',
      bg: 'rgba(168, 85, 247, 0.3)',
      glow: '0 0 16px #A855F7',
      text: '#F3E8FF',
    };
  } else if (multiplier >= 10) {
    return {
      border: '#38BDF8',
      bg: 'rgba(56, 189, 248, 0.3)',
      glow: '0 0 12px #38BDF8',
      text: '#E0F2FE',
    };
  } else {
    return {
      border: '#10B981',
      bg: 'rgba(16, 185, 129, 0.3)',
      glow: '0 0 8px #10B981',
      text: '#ECFDF5',
    };
  }
}

/**
 * Generate a single random symbol based on current mode & weights
 */
export function pickRandomSymbol(
  isRigged: boolean,
  allowScatter: boolean = true
): SymbolId {
  const symbols = Object.keys(SLOT_SYMBOLS) as SymbolId[];
  const weightedList: { id: SymbolId; weight: number }[] = [];

  for (const sym of symbols) {
    if (sym === 'SYM_SCATTER' && !allowScatter) continue;
    const def = SLOT_SYMBOLS[sym];
    const weight = isRigged ? def.baseWeightRigged : def.baseWeightFair;
    weightedList.push({ id: sym, weight });
  }

  const totalWeight = weightedList.reduce((acc, item) => acc + item.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const item of weightedList) {
    if (randomVal <= item.weight) {
      return item.id;
    }
    randomVal -= item.weight;
  }

  return 'SYM_GEM_BLUE';
}

/**
 * Creates a unique cell object
 */
let cellCounter = 0;
export function createCell(
  col: number,
  row: number,
  symbol: SymbolId,
  multiplier?: number
): SlotCell {
  cellCounter += 1;
  return {
    id: `cell_${col}_${row}_${Date.now()}_${cellCounter}`,
    symbol,
    col,
    row,
    isWinning: false,
    multiplier,
    isScatter: symbol === 'SYM_SCATTER',
  };
}

/**
 * Deep clone grid
 */
export function cloneGrid(grid: SlotCell[][]): SlotCell[][] {
  return grid.map((col) => col.map((cell) => ({ ...cell })));
}

/**
 * Count occurrences of each symbol on the grid
 */
export function countGridSymbols(grid: SlotCell[][]): Record<SymbolId, SlotCell[]> {
  const counts: Record<SymbolId, SlotCell[]> = {
    SYM_CROWN: [],
    SYM_HOURGLASS: [],
    SYM_RING: [],
    SYM_CHALICE: [],
    SYM_GEM_RED: [],
    SYM_GEM_PURPLE: [],
    SYM_GEM_YELLOW: [],
    SYM_GEM_GREEN: [],
    SYM_GEM_BLUE: [],
    SYM_SCATTER: [],
  };

  for (let c = 0; c < grid.length; c++) {
    for (let r = 0; r < grid[c].length; r++) {
      const cell = grid[c][r];
      if (counts[cell.symbol]) {
        counts[cell.symbol].push(cell);
      }
    }
  }

  return counts;
}

/**
 * Evaluates full Olympus Spin including Cascades, Multiplier Orbs, Free Spins and Rigged Hooks
 */
export function evaluateOlympusSpin(
  baseBet: number,
  rigMode: SlotRigMode = 'fair',
  globalRtp: number = 96.5,
  isFreeSpin: boolean = false,
  persistedMultiplier: number = 0,
  options?: {
    forcedOutcome?: 'auto' | 'force_win' | 'force_loss';
    highBetThreshold?: number;
    nearMissProbability?: number;
  }
): SlotSpinResult {
  const isRiggedMode = rigMode !== 'fair' || globalRtp < 75;
  const isHighBet = !!(options?.highBetThreshold && baseBet >= options.highBetThreshold);
  const forced = options?.forcedOutcome || 'auto';

  let isNearMiss = false;
  let isWastedOrbTease = false;
  let riggedReason = '';

  // Determine Near-Miss or Teaser conditions
  if (forced === 'force_loss' || (isRiggedMode && Math.random() < (options?.nearMissProbability ?? 0.75))) {
    if (Math.random() < 0.45 && !isFreeSpin) {
      isNearMiss = true;
      riggedReason = 'Near-Miss 3 Scatters Tease Injected (Reels 1, 2, 4)';
    } else if (Math.random() < 0.35) {
      isWastedOrbTease = true;
      riggedReason = 'Fake 500x Multiplier Orb with 0 Winning Matches';
    }
  }

  // Generate Initial 6x5 Grid (6 columns, 5 rows each)
  let currentGrid: SlotCell[][] = [];
  for (let c = 0; c < GRID_COLS; c++) {
    const col: SlotCell[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const sym = pickRandomSymbol(isRiggedMode || isHighBet);
      col.push(createCell(c, r, sym));
    }
    currentGrid.push(col);
  }

  // Handle Near-Miss 3 Scatters: force exactly 3 scatters on distinct columns (e.g. col 0, 1, 3)
  if (isNearMiss && !isFreeSpin) {
    // Remove existing scatters
    for (let c = 0; c < GRID_COLS; c++) {
      for (let r = 0; r < GRID_ROWS; r++) {
        if (currentGrid[c][r].symbol === 'SYM_SCATTER') {
          currentGrid[c][r] = createCell(c, r, 'SYM_GEM_BLUE');
        }
      }
    }
    // Place 3 Scatters on cols 0, 1, 3
    const scatterCols = [0, 1, 3];
    scatterCols.forEach((colIdx) => {
      const rowIdx = Math.floor(Math.random() * GRID_ROWS);
      currentGrid[colIdx][rowIdx] = createCell(colIdx, rowIdx, 'SYM_SCATTER');
    });
  }

  // Handle Wasted Orb Tease: spawn a 250x or 500x orb and guarantee near-hits (7 crowns, 7 hourglasses) with NO 8+ win
  if (isWastedOrbTease) {
    // Clear matches
    const nonWinningPalette: SymbolId[] = [
      'SYM_GEM_BLUE',
      'SYM_GEM_GREEN',
      'SYM_GEM_YELLOW',
      'SYM_GEM_PURPLE',
      'SYM_GEM_RED',
      'SYM_CHALICE',
    ];
    let fillIndex = 0;
    for (let c = 0; c < GRID_COLS; c++) {
      for (let r = 0; r < GRID_ROWS; r++) {
        currentGrid[c][r] = createCell(c, r, nonWinningPalette[fillIndex % nonWinningPalette.length]);
        fillIndex++;
      }
    }
    // Give 7 crowns (1 short of 8)
    for (let i = 0; i < 7; i++) {
      const c = i % GRID_COLS;
      const r = Math.floor(i / GRID_COLS);
      currentGrid[c][r] = createCell(c, r, 'SYM_CROWN');
    }
    // Place 500x Orb on col 4, row 2
    currentGrid[4][2] = createCell(4, 2, 'SYM_GEM_RED', 500);
  }

  // Check initial scatter count
  const initialCounts = countGridSymbols(currentGrid);
  const scatterCount = initialCounts.SYM_SCATTER.length;
  const freeSpinsTriggered = scatterCount >= 4;
  const freeSpinsAwarded = freeSpinsTriggered ? 15 : 0;

  // Chance of spawning Multiplier Orbs during spin (unless already teaser-spawned)
  if (!isWastedOrbTease) {
    const orbSpawnChance = isFreeSpin ? 0.35 : 0.15;
    if (Math.random() < orbSpawnChance || forced === 'force_win') {
      const orbCol = Math.floor(Math.random() * GRID_COLS);
      const orbRow = Math.floor(Math.random() * GRID_ROWS);
      const orbVal = getRandomMultiplierOrbValue();
      currentGrid[orbCol][orbRow].multiplier = orbVal;
    }
  }

  const steps: CascadeStep[] = [];
  let totalBaseWin = 0;
  let multiplierOrbsTotal = persistedMultiplier;
  let hasCascade = true;
  let cascadeIteration = 0;
  const MAX_CASCADES = 20;

  while (hasCascade && cascadeIteration < MAX_CASCADES) {
    cascadeIteration++;
    const counts = countGridSymbols(currentGrid);
    const winningMatches: WinningMatch[] = [];
    let stepWin = 0;

    // Evaluate 8+ matching symbols (excluding scatter for tumble win)
    for (const [symKey, cells] of Object.entries(counts)) {
      const sym = symKey as SymbolId;
      if (sym === 'SYM_SCATTER') continue;

      if (cells.length >= 8) {
        const mult = getPaytableMultiplier(sym, cells.length);
        const win = baseBet * mult;
        stepWin += win;
        winningMatches.push({
          symbol: sym,
          count: cells.length,
          multiplier: mult,
          winAmount: win,
          cellIds: cells.map((c) => c.id),
        });

        // Mark cells as winning
        cells.forEach((c) => {
          c.isWinning = true;
        });
      }
    }

    // Collect Multiplier Orbs in current step
    const stepOrbs: { cellId: string; multiplier: number; col: number; row: number }[] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      for (let r = 0; r < GRID_ROWS; r++) {
        const cell = currentGrid[c][r];
        if (cell.multiplier) {
          stepOrbs.push({
            cellId: cell.id,
            multiplier: cell.multiplier,
            col: c,
            row: r,
          });
          multiplierOrbsTotal += cell.multiplier;
        }
      }
    }

    // Add scatter base payout if step 1
    if (cascadeIteration === 1 && scatterCount >= 4) {
      const scatterMult = getPaytableMultiplier('SYM_SCATTER', scatterCount);
      const scatterWin = baseBet * scatterMult;
      stepWin += scatterWin;
      winningMatches.push({
        symbol: 'SYM_SCATTER',
        count: scatterCount,
        multiplier: scatterMult,
        winAmount: scatterWin,
        cellIds: initialCounts.SYM_SCATTER.map((c) => c.id),
      });
    }

    totalBaseWin += stepWin;

    steps.push({
      stepIndex: cascadeIteration,
      grid: cloneGrid(currentGrid),
      winningMatches,
      multiplierOrbs: stepOrbs,
      stepPayout: stepWin,
      isFinalTumble: winningMatches.length === 0,
    });

    if (winningMatches.length === 0) {
      hasCascade = false;
    } else {
      // Execute Cascade: Remove winning cells and drop from top
      const nextGrid: SlotCell[][] = [];

      for (let c = 0; c < GRID_COLS; c++) {
        // Collect non-winning cells in this column (preserving their order top to bottom)
        const keptCells = currentGrid[c].filter((cell) => !cell.isWinning);
        const missingCount = GRID_ROWS - keptCells.length;

        const newCol: SlotCell[] = [];
        // Generate new falling cells at the top
        for (let r = 0; r < missingCount; r++) {
          const sym = pickRandomSymbol(isRiggedMode || isHighBet, false); // No scatters on tumble refills
          // Small chance of dropping a multiplier orb during tumble
          const orb = Math.random() < 0.08 ? getRandomMultiplierOrbValue() : undefined;
          newCol.push(createCell(c, r, sym, orb));
        }

        // Re-index remaining kept cells below the new ones
        keptCells.forEach((cell, idx) => {
          cell.row = missingCount + idx;
          cell.isWinning = false;
          newCol.push(cell);
        });

        nextGrid.push(newCol);
      }

      currentGrid = nextGrid;
    }
  }

  // Calculate final payout with multiplier orbs
  const effectiveMultiplier = multiplierOrbsTotal > 0 ? multiplierOrbsTotal : 1;
  const finalPayout = totalBaseWin > 0 ? totalBaseWin * (multiplierOrbsTotal > 0 ? multiplierOrbsTotal : 1) : 0;

  // Losses Disguised as Wins (LDW): Win occurs, but finalPayout < baseBet
  const isLossDisguisedAsWin = finalPayout > 0 && finalPayout < baseBet;

  return {
    initialGrid: steps.length > 0 ? steps[0].grid : currentGrid,
    steps,
    totalBaseWin,
    multiplierOrbsTotal,
    totalMultiplierApplied: effectiveMultiplier,
    finalPayout: Math.round(finalPayout),
    scatterCount,
    freeSpinsTriggered,
    freeSpinsAwarded,
    isNearMiss,
    isLossDisguisedAsWin,
    isWastedOrbTease,
    riggedReason: riggedReason || (isLossDisguisedAsWin ? 'Loss Disguised as Win (LDW): Payout < Bet' : undefined),
  };
}

/**
 * Check if a round qualifies as a Loss Disguised as a Win
 */
export function isLossDisguisedAsWin(payout: number, wager: number): boolean {
  return payout > 0 && payout < wager;
}
