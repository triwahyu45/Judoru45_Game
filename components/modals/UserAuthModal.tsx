'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
  Coins,
  AlertTriangle,
} from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const router = useRouter();
  const { login, register } = useGame();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = login(username, password);
    if (result.isAdmin) {
      setSuccessMessage('Kunci Master Admin Diterima! Mengalihkan ke Panel...');
      setTimeout(() => {
        onClose();
        router.push('/admin');
      }, 600);
      return;
    }

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    const result = register(username, password, name);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0B111B] border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden space-y-6">
        
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#05070B] border border-[#1E2D44] text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Tabs */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center shadow-inner">
            {activeTab === 'login' ? <LogIn className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeTab === 'login' ? 'Masuk Akun Pemain' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Wajib memiliki akun untuk memainkan 6 simulator judi dan menyimpan koin virtual.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#05070B] border border-[#1E2D44]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Buat Akun Baru
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nama Pengguna (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: player_sultan88"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full py-3 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-white placeholder:text-slate-600 outline-none transition"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-white placeholder:text-slate-600 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition"
            >
              <span>Masuk ke Permainan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Tab 2: Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nama Lengkap / Panggilan
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: Hendra Wijaya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Username Unik (Minimal 3 Huruf)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: zeus_hunter"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Kata Sandi (Minimal 4 Karakter)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center space-x-2">
              <Coins className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Dapatkan Bonus Awal <strong>Rp 100.000 Saldo Virtual Gratis</strong> saat mendaftar!</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar &amp; Terima Rp 100.000</span>
            </button>
          </form>
        )}

        {/* Footer Note */}
        <p className="text-[11px] text-center text-slate-500">
          100% Simulasi Edukasi &bull; Saldo Fiktif &bull; Tanpa Deposit Nyata
        </p>

      </div>
    </div>
  );
};
