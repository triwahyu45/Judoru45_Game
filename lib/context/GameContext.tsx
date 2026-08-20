'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import synthEngine from '@/lib/sound/synthEngine';
import { userDb, UserAccount, UserTransaction } from '@/lib/database/userDb';

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

export type Transaction = UserTransaction;

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
  // Authentication & User DB state
  currentUser: UserAccount | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => { success: boolean; message: string; isAdmin?: boolean };
  register: (payload: { username: string; password: string; name: string; phone?: string; bankName?: string; accountNumber?: string }) => { success: boolean; message: string };
  logout: () => void;
  refreshUser: () => void;

  // Core Game state
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

const STORAGE_ADMIN_KEY = 'judoru45_admin_config_v1';

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const [adminConfig, setAdminConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);
  const [audioEnabled, setAudioEnabledState] = useState<boolean>(true);
  const [masterVolume, setMasterVolumeState] = useState<number>(0.75);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Refresh user data from storage
  const refreshUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      const user = userDb.getCurrentUser();
      setCurrentUserState(user);
    }
  }, []);

  // Hydration from LocalStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Clear old auto-guest sessions (pemain_vipXXX pattern) to force proper registration
        const CURRENT_USER_KEY = 'judoru45_active_session_v1';
        const session = localStorage.getItem(CURRENT_USER_KEY);
        if (session) {
          try {
            const parsed = JSON.parse(session);
            // If the stored session is an old auto-guest account, clear it
            if (parsed?.username && /^pemain_vip\d+$/.test(parsed.username)) {
              localStorage.removeItem(CURRENT_USER_KEY);
            }
          } catch { /* ignore */ }
        }

        // Load active user session from database
        const user = userDb.getCurrentUser();
        setCurrentUserState(user);

        // If no user is logged in, auto-open the registration modal
        if (!user) {
          setTimeout(() => {
            setAuthModalTab('register');
            setIsAuthModalOpen(true);
          }, 800);
        }

        // Load Admin Config
        const rawAdmin = localStorage.getItem(STORAGE_ADMIN_KEY);
        if (rawAdmin) {
          const parsed = JSON.parse(rawAdmin);
          if (parsed && typeof parsed.globalRtp === 'number') {
            setAdminConfig({ ...DEFAULT_ADMIN_CONFIG, ...parsed });
          }
        }
      }
    } catch (e) {
      console.warn('GameContext hydration note:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save Admin Config changes
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(adminConfig));
    } catch (e) {
      console.warn('Failed to save admin config:', e);
    }
  }, [adminConfig, isHydrated]);

  // Auth Helpers
  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback((username: string, password: string) => {
    const result = userDb.login(username, password);
    if (result.success && result.user) {
      setCurrentUserState(result.user);
      synthEngine.playWin(1);
    }
    return result;
  }, []);

  const register = useCallback((payload: { username: string; password: string; name: string; phone?: string; bankName?: string; accountNumber?: string }) => {
    const result = userDb.register(payload);
    if (result.success && result.user) {
      setCurrentUserState(result.user);
      synthEngine.playJackpot();
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    userDb.logout();
    setCurrentUserState(null);
    synthEngine.playCoin();
  }, []);

  // Audio Controls
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

  // Balance & Betting Engine
  const balance = currentUser?.balance || 0;
  const totalWagered = currentUser?.totalWagered || 0;
  const totalWon = currentUser?.totalWon || 0;
  const totalLost = currentUser?.totalLost || 0;
  const transactions = currentUser?.transactions || [];

  const stats = useMemo<UserStats>(() => {
    if (!currentUser) {
      return {
        balance: 0,
        totalDeposited: 0,
        totalWagered: 0,
        totalWon: 0,
        totalLost: 0,
        roundsPlayed: 0,
        faucetClaims: 0,
        highestWin: 0,
        netProfit: 0,
      };
    }
    return {
      balance: currentUser.balance,
      totalDeposited: 100_000 + currentUser.faucetClaims * 500_000,
      totalWagered: currentUser.totalWagered,
      totalWon: currentUser.totalWon,
      totalLost: currentUser.totalLost,
      roundsPlayed: currentUser.roundsPlayed,
      faucetClaims: currentUser.faucetClaims,
      highestWin: 0,
      netProfit: currentUser.totalWon - currentUser.totalWagered,
    };
  }, [currentUser]);

  // Place Bet (Requires Auth)
  const placeBet = useCallback(
    (gameType: string, amount: number, details: string = ''): boolean => {
      if (!currentUser) {
        // Force login prompt
        openAuthModal('login');
        return false;
      }

      if (amount <= 0 || currentUser.balance < amount) {
        return false;
      }

      // Deduct balance from user
      const updatedUser = userDb.updateUserStats(
        currentUser.id,
        -amount,
        amount,
        0,
        {
          id: `tx_${Date.now()}_bet`,
          timestamp: Date.now(),
          gameType,
          gameTitle: gameType,
          betAmount: amount,
          multiplier: 0,
          payout: 0,
          netProfit: -amount,
          balanceAfter: currentUser.balance - amount,
          isWin: false,
          details: details || `Taruhan ${gameType}`,
          riggedApplied: false,
        }
      );

      if (updatedUser) {
        setCurrentUserState({ ...updatedUser });
      }

      synthEngine.playCoin();
      return true;
    },
    [currentUser, openAuthModal]
  );

  // Settle Bet and add to user database
  const settleBet = useCallback(
    (payload: SettleBetPayload): Transaction => {
      const isWin = payload.payout > 0;
      const net = payload.payout - payload.betAmount;
      const currentBal = currentUser?.balance || 0;
      const newBalance = currentBal + payload.payout;

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
      };

      if (currentUser) {
        const updatedUser = userDb.updateUserStats(
          currentUser.id,
          payload.payout,
          0,
          payload.payout,
          tx
        );
        if (updatedUser) {
          setCurrentUserState({ ...updatedUser });
        }
      }

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
    [currentUser]
  );

  // Update balance helper
  const updateBalance = useCallback(
    (amount: number, game: string, details?: string | Record<string, unknown>): boolean => {
      if (!currentUser) {
        openAuthModal('login');
        return false;
      }
      if (amount < 0 && currentUser.balance < Math.abs(amount)) {
        return false;
      }

      const tx: Transaction = {
        id: `tx_${Date.now()}`,
        timestamp: Date.now(),
        gameType: game,
        gameTitle: game,
        betAmount: amount < 0 ? Math.abs(amount) : 0,
        multiplier: 1,
        payout: amount > 0 ? amount : 0,
        netProfit: amount,
        balanceAfter: currentUser.balance + amount,
        isWin: amount > 0,
        details: typeof details === 'string' ? details : 'Update saldo manual',
      };

      const updated = userDb.updateUserStats(
        currentUser.id,
        amount,
        amount < 0 ? Math.abs(amount) : 0,
        amount > 0 ? amount : 0,
        tx
      );
      if (updated) {
        setCurrentUserState({ ...updated });
      }
      return true;
    },
    [currentUser, openAuthModal]
  );

  // Claim Faucet (+500,000 IDR for active user)
  const claimFaucet = useCallback(
    (amount: number = 500_000) => {
      if (!currentUser) {
        openAuthModal('login');
        return;
      }
      const updated = userDb.claimUserFaucet(currentUser.id, amount);
      if (updated) {
        setCurrentUserState({ ...updated });
      }
      synthEngine.playWin(2);
    },
    [currentUser, openAuthModal]
  );

  // Reset all data
  const resetAllData = useCallback(() => {
    if (currentUser) {
      userDb.adminSetUserBalance(currentUser.id, 100_000);
      refreshUser();
    }
  }, [currentUser, refreshUser]);

  // Update Admin Rigged Configuration
  const updateAdminConfig = useCallback((config: Partial<AdminConfig>) => {
    setAdminConfig((prev) => ({
      ...prev,
      ...config,
    }));
  }, []);

  const value = useMemo<GameContextType>(
    () => ({
      currentUser,
      isLoggedIn: !!currentUser,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      refreshUser,

      balance,
      totalWagered,
      totalWon,
      totalLost,
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
      currentUser,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      refreshUser,
      balance,
      totalWagered,
      totalWon,
      totalLost,
      transactions,
      audioEnabled,
      adminConfig,
      stats,
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
