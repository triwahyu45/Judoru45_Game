'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  UserCheck,
} from 'lucide-react';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    // Secret Admin Trigger via Login Form
    if (
      trimmedPass === '060902' ||
      trimmedUser.toLowerCase() === 'admin' ||
      trimmedUser.toLowerCase() === 'admin45'
    ) {
      setSuccessMessage('Kunci Master Admin Diterima! Mengalihkan...');
      setTimeout(() => {
        onClose();
        router.push('/admin');
      }, 700);
      return;
    }

    // Standard User / Guest Login
    if (trimmedUser.length === 0) {
      setErrorMessage('Silakan masukkan nama atau ID pemain!');
      return;
    }

    setSuccessMessage(`Selamat datang, ${trimmedUser}! Akun simulasi aktif.`);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleGuestQuickLogin = () => {
    setSuccessMessage('Masuk sebagai Tamu Simulasi.');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0B111B] border border-[#1E2D44] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#05070B] border border-[#1E2D44] text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Masuk Akun Pemain
          </h2>
          <p className="text-xs text-slate-400">
            Akses akun simulasi dan simpan riwayat permainan virtualmu.
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Nama Pengguna / ID Pemain
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: player88"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm text-white placeholder:text-slate-600 outline-none transition"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Kata Sandi / PIN
            </label>
            <div className="relative">
              <input
                type="password"
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
            <span>Masuk Akun</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Guest Mode Divider */}
        <div className="pt-3 border-t border-[#1E2D44] text-center space-y-2.5">
          <button
            type="button"
            onClick={handleGuestQuickLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#121B2A] hover:bg-[#1A263B] border border-[#1E2D44] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Main Langsung Tanpa Akun (Tamu)</span>
          </button>
          <p className="text-[11px] text-slate-500">
            100% Saldo Simulasi Gratis &bull; Tidak Menggunakan Uang Asli
          </p>
        </div>

      </div>
    </div>
  );
};
