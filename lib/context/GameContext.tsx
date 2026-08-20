'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import synthEngine from '@/lib/sound/synthEngine';

export type RiggedProfile =
  | 'fair'
  | 'beginners_luck'
  | 'near_miss'
  | 'jackpot_drainer'
  | 'pure_scam';

export type ForcedOutcome = 'auto' | 'force_win' | 'force_loss';

export interface AdminConfig {
  globalRtp: number; // 0 to 100 (Default: 35%)
  activeProfile: RiggedProfile;
  forcedOutcome: ForcedOutcome;
  highBetThreshold: number; // e.g. 100,000 IDR
  nearMissProbability: number; // 0.0 to 1.0 (Default: 0.75)
  honeypotCounter?: number;
  slotScatterBias?: number;
  crashRiggedThreshold?: number;
  rouletteZeroBias?: number;
  diceRiggedInvert?: boolean;
  togelMaxMatch?: 'none' | '2d' | '3d' | '4d';
  sportsBookmakerBias?: number;
}

export interface Transaction {
  id: string;
  timestamp: number;
  gameType: string;
  gameTitle: string;
  betAmount: number;
  multiplier: number;
  payout: number;
  netProfit: number;
  balanceAfter: number;
  isWin: boolean;
  details: string;
  riggedApplied?: boolean;
  houseEdgeRate?: number;
}

export interface UserStats {
  balance: number;
  totalDeposited: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  roundsPlayed: number;
  faucetClaims: number;
  highestWin: number;
  netProfit: number;
}

export interface SettleBetPayload {
  gameType: string;
  gameTitle: string;
  betAmount: number;
  multiplier: number;
  payout: number;
  details: string;
  riggedApplied?: boolean;
}

export interface GameContextType {
  // Core state
  balance: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  transactions: Transaction[];
  audioEnabled: boolean;
  adminConfig: AdminConfig;
  stats: UserStats;
  isMuted: boolean;
  masterVolume: number;
  isHydrated: boolean;

  // Actions & Mutators
  setAudioEnabled: (enabled: boolean) => void;
  toggleAudio: () => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  updateBalance: (amount: number, game: string, details?: string | Record<string, unknown>) => boolean;
  placeBet: (gameType: string, amount: number, details?: string) => boolean;
  settleBet: (payload: SettleBetPayload) => Transaction;
  claimFaucet: (amount?: number) => void;
  resetAllData: () => void;
  updateAdminConfig: (config: Partial<AdminConfig>) => void;
}

const DEFAULT_STATS: UserStats = {
  balance: 500_000,
  totalDeposited: 500_000,
  totalWagered: 0,
  totalWon: 0,
  totalLost: 0,
  roundsPlayed: 0,
  faucetClaims: 0,
  highestWin: 0,
  netProfit: 0,
};

const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  globalRtp: 35,
  activeProfile: 'beginners_luck',
  forcedOutcome: 'auto',
  highBetThreshold: 100_000,
  nearMissProbability: 0.75,
  honeypotCounter: 0,
  slotScatterBias: 0.12,
  crashRiggedThreshold: 1.15,
  rouletteZeroBias: 0.15,
  diceRiggedInvert: true,
  togelMaxMatch: '2d',
  sportsBookmakerBias: 0.65,
};

const STORAGE_KEY = 'judoru45_game_v1_state';

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);
  const [audioEnabled, setAudioEnabledState] = useState<boolean>(true);
  const [masterVolume, setMasterVolumeState] = useState<number>(0.75);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydration from LocalStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.stats && typeof parsed.stats.balance === 'number') {
            setStats(parsed.stats);
          }
          if (Array.isArray(parsed.transactions)) {
            setTransactions(parsed.transactions);
          }
          if (parsed.adminConfig && typeof parsed.adminConfig.globalRtp === 'number') {
            setAdminConfig({ ...DEFAULT_ADMIN_CONFIG, ...parsed.adminConfig });
          }
          if (typeof parsed.audioEnabled === 'boolean') {
            setAudioEnabledState(parsed.audioEnabled);
            synthEngine.setMuted(!parsed.audioEnabled);
          }
          if (typeof parsed.masterVolume === 'number') {
            setMasterVolumeState(parsed.masterVolume);
            synthEngine.setVolume(parsed.masterVolume);
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage hydration note:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stats,
          transactions,
          adminConfig,
          audioEnabled,
          masterVolume,
        })
      );
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [stats, transactions, adminConfig, audioEnabled, masterVolume, isHydrated]);

  // Set audio enabled
  const setAudioEnabled = useCallback((enabled: boolean) => {
    setAudioEnabledState(enabled);
    synthEngine.setMuted(!enabled);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabledState((prev) => {
      const next = !prev;
      synthEngine.setMuted(!next);
      return next;
    });
  }, []);

  const toggleMute = toggleAudio;

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setMasterVolumeState(clamped);
    synthEngine.setVolume(clamped);
  }, []);

  // Update balance helper (direct addition/subtraction)
  const updateBalance = useCallback(
    (amount: number, game: string, details?: string | Record<string, unknown>): boolean => {
      if (amount < 0 && stats.balance < Math.abs(amount)) {
        return false; // Insufficient balance
      }

      setStats((prev) => {
        const newBalance = Math.max(0, prev.balance + amount);
        const isDeduction = amount < 0;
        const absAmount = Math.abs(amount);

        return {
          ...prev,
          balance: newBalance,
          totalWagered: isDeduction ? prev.totalWagered + absAmount : prev.totalWagered,
          totalWon: !isDeduction ? prev.totalWon + amount : prev.totalWon,
          totalLost: isDeduction ? prev.totalLost : prev.totalLost,
          netProfit: (!isDeduction ? prev.totalWon + amount : prev.totalWon) - 
                     (isDeduction ? prev.totalWagered + absAmount : prev.totalWagered),
        };
      });

      if (amount < 0) {
        synthEngine.playCoin();
      } else if (amount > 0) {
        synthEngine.playWin(1);
      }

      return true;
    },
    [stats.balance]
  );

  // Place Bet
  const placeBet = useCallback(
    (gameType: string, amount: number, details: string = ''): boolean => {
      if (amount <= 0 || stats.balance < amount) {
        return false;
      }

      setStats((prev) => ({
        ...prev,
        balance: prev.balance - amount,
        totalWagered: prev.totalWagered + amount,
        roundsPlayed: prev.roundsPlayed + 1,
        netProfit: prev.totalWon - (prev.totalWagered + amount),
      }));

      synthEngine.playCoin();
      return true;
    },
    [stats.balance]
  );

  // Settle Bet and add to ledger
  const settleBet = useCallback(
    (payload: SettleBetPayload): Transaction => {
      const isWin = payload.payout > 0;
      const net = payload.payout - payload.betAmount;
      const newBalance = stats.balance + payload.payout;

      const tx: Transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        timestamp: Date.now(),
        gameType: payload.gameType,
        gameTitle: payload.gameTitle,
        betAmount: payload.betAmount,
        multiplier: payload.multiplier,
        payout: payload.payout,
        netProfit: net,
        balanceAfter: newBalance,
        isWin,
        details: payload.details,
        riggedApplied: !!payload.riggedApplied,
        houseEdgeRate: 1 - adminConfig.globalRtp / 100,
      };

      setStats((prev) => ({
        ...prev,
        balance: newBalance,
        totalWon: prev.totalWon + payload.payout,
        totalLost: prev.totalLost + (isWin ? 0 : payload.betAmount),
        highestWin: Math.max(prev.highestWin, payload.payout),
        netProfit: prev.totalWon + payload.payout - prev.totalWagered,
      }));

      setTransactions((prev) => [tx, ...prev].slice(0, 150));

      // Audio feedback
      if (isWin) {
        if (payload.multiplier >= 10) {
          synthEngine.playJackpot();
        } else {
          synthEngine.playWin(payload.multiplier);
        }
      }

      return tx;
    },
    [stats.balance, adminConfig.globalRtp]
  );

  // Claim Faucet (+1,000,000 IDR default)
  const claimFaucet = useCallback((amount: number = 1_000_000) => {
    setStats((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      totalDeposited: prev.totalDeposited + amount,
      faucetClaims: prev.faucetClaims + 1,
    }));
    synthEngine.playWin(2);
  }, []);

  // Reset all state to defaults
  const resetAllData = useCallback(() => {
    setStats(DEFAULT_STATS);
    setTransactions([]);
    setAdminConfig(DEFAULT_ADMIN_CONFIG);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    synthEngine.playCoin();
  }, []);

  // Update Admin Rigged Configuration
  const updateAdminConfig = useCallback((config: Partial<AdminConfig>) => {
    setAdminConfig((prev) => ({
      ...prev,
      ...config,
    }));
  }, []);

  const value = useMemo<GameContextType>(
    () => ({
      balance: stats.balance,
      totalWagered: stats.totalWagered,
      totalWon: stats.totalWon,
      totalLost: stats.totalLost,
      transactions,
      audioEnabled,
      adminConfig,
      stats,
      isMuted: !audioEnabled,
      masterVolume,
      isHydrated,
      setAudioEnabled,
      toggleAudio,
      toggleMute,
      setVolume,
      updateBalance,
      placeBet,
      settleBet,
      claimFaucet,
      resetAllData,
      updateAdminConfig,
    }),
    [
      stats,
      transactions,
      audioEnabled,
      adminConfig,
      masterVolume,
      isHydrated,
      setAudioEnabled,
      toggleAudio,
      toggleMute,
      setVolume,
      updateBalance,
      placeBet,
      settleBet,
      claimFaucet,
      resetAllData,
      updateAdminConfig,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
