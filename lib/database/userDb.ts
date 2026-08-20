'use client';

export interface UserTransaction {
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
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  password: string; // Plain/hash for client simulation
  balance: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  faucetClaims: number;
  roundsPlayed: number;
  riggedOverride: 'AUTO' | 'FORCE_WIN' | 'FORCE_LOSE' | 'NEAR_MISS';
  createdAt: string;
  lastLoginAt: string;
  transactions: UserTransaction[];
}

const USERS_STORAGE_KEY = 'judoru45_user_database_v1';
const CURRENT_USER_KEY = 'judoru45_active_session_v1';

// Initial dummy database seed (Contoh akun pemain untuk demonstrasi langsung)
const SEED_USERS: UserAccount[] = [
  {
    id: 'user_triwahyu_01',
    username: 'triwahyu',
    name: 'Tri Wahyu Handoyo',
    password: 'password123',
    balance: 500000,
    totalWagered: 150000,
    totalWon: 50000,
    totalLost: 100000,
    faucetClaims: 1,
    roundsPlayed: 15,
    riggedOverride: 'AUTO',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastLoginAt: new Date().toISOString(),
    transactions: [],
  },
  {
    id: 'user_korban_02',
    username: 'pemain_penasaran',
    name: 'Budi Santoso',
    password: 'password123',
    balance: 20000,
    totalWagered: 2500000,
    totalWon: 300000,
    totalLost: 2200000,
    faucetClaims: 4,
    roundsPlayed: 84,
    riggedOverride: 'FORCE_LOSE', // Diset Pasti Rungkad oleh Admin
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastLoginAt: new Date().toISOString(),
    transactions: [],
  },
];

export const userDb = {
  // Get all registered users from database
  getUsers(): UserAccount[] {
    if (typeof window === 'undefined') return SEED_USERS;
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_USERS;
    }
  },

  // Save users array to storage
  saveUsers(users: UserAccount[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to database:', e);
    }
  },

  // Get active logged in user
  getCurrentUser(): UserAccount | null {
    if (typeof window === 'undefined') return null;
    try {
      const session = localStorage.getItem(CURRENT_USER_KEY);
      if (!session) return null;
      const userSummary = JSON.parse(session);
      const allUsers = this.getUsers();
      return allUsers.find((u) => u.id === userSummary.id) || null;
    } catch {
      return null;
    }
  },

  // Register new player account
  register(username: string, password: string, name?: string): { success: boolean; message: string; user?: UserAccount } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser.length < 3) {
      return { success: false, message: 'Username minimal 3 karakter!' };
    }
    if (cleanPass.length < 4) {
      return { success: false, message: 'Kata sandi minimal 4 karakter!' };
    }

    const users = this.getUsers();
    if (users.some((u) => u.username.toLowerCase() === cleanUser)) {
      return { success: false, message: 'Username sudah digunakan oleh pemain lain!' };
    }

    const newUser: UserAccount = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
      username: cleanUser,
      name: name?.trim() || cleanUser,
      password: cleanPass,
      balance: 100000, // Saldo awal Rp 100.000 virtual
      totalWagered: 0,
      totalWon: 0,
      totalLost: 0,
      faucetClaims: 0,
      roundsPlayed: 0,
      riggedOverride: 'AUTO',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      transactions: [],
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, message: 'Pendaftaran berhasil! Selamat bermain.', user: newUser };
  },

  // Login player account
  login(username: string, password: string): { success: boolean; message: string; user?: UserAccount; isAdmin?: boolean } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check Secret Admin Trigger
    if (cleanPass === '060902' || cleanUser === 'admin' || cleanUser === 'admin45') {
      return { success: true, message: 'Akses Master Admin Diterima!', isAdmin: true };
    }

    const users = this.getUsers();
    const found = users.find((u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass);

    if (!found) {
      return { success: false, message: 'Username atau kata sandi salah!' };
    }

    found.lastLoginAt = new Date().toISOString();
    this.saveUsers(users);
    this.setCurrentUser(found);

    return { success: true, message: `Selamat datang kembali, ${found.name || found.username}!`, user: found };
  },

  // Set active session
  setCurrentUser(user: UserAccount | null) {
    if (typeof window === 'undefined') return;
    try {
      if (!user) {
        localStorage.removeItem(CURRENT_USER_KEY);
      } else {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: user.id, username: user.username }));
      }
    } catch (e) {
      console.error('Failed to set current session:', e);
    }
  },

  // Logout current user
  logout() {
    this.setCurrentUser(null);
  },

  // Update user stats after a bet / game round
  updateUserStats(
    userId: string,
    deltaBalance: number,
    betAmount: number,
    payout: number,
    transaction: UserTransaction
  ): UserAccount | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    user.balance = Math.max(0, user.balance + deltaBalance);
    user.totalWagered += betAmount;
    user.roundsPlayed += 1;

    if (payout > betAmount) {
      user.totalWon += payout - betAmount;
    } else if (payout < betAmount) {
      user.totalLost += betAmount - payout;
    }

    user.transactions = [transaction, ...user.transactions].slice(0, 50); // Keep last 50
    this.saveUsers(users);

    return user;
  },

  // Faucet claim for specific user
  claimUserFaucet(userId: string, amount: number = 500000): UserAccount | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    user.balance += amount;
    user.faucetClaims += 1;
    this.saveUsers(users);

    return user;
  },

  // Admin action: Change user rigged mode override
  adminSetUserRigged(userId: string, override: 'AUTO' | 'FORCE_WIN' | 'FORCE_LOSE' | 'NEAR_MISS') {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    user.riggedOverride = override;
    this.saveUsers(users);
    return true;
  },

  // Admin action: Reset or adjust user balance
  adminSetUserBalance(userId: string, newBalance: number) {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    user.balance = Math.max(0, newBalance);
    this.saveUsers(users);
    return true;
  },

  // Admin action: Delete user account
  adminDeleteUser(userId: string) {
    let users = this.getUsers();
    users = users.filter((u) => u.id !== userId);
    this.saveUsers(users);
    return true;
  },
};
