'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Unlock,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface AdminPinGateProps {
  onUnlock: () => void;
}

const PRIMARY_PIN = '060902';
const SECRET_KEY = 'admin45';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 30;

export const AdminPinGate: React.FC<AdminPinGateProps> = ({ onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const handleVerify = (input: string) => {
    if (lockoutRemaining > 0) return;

    const trimmed = input.trim();
    if (trimmed === PRIMARY_PIN || trimmed.toLowerCase() === SECRET_KEY) {
      setErrorMessage(null);
      onUnlock();
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);

      if (nextFail >= MAX_FAILED_ATTEMPTS) {
        setLockoutRemaining(LOCKOUT_DURATION_SECONDS);
        setErrorMessage(
          `Terlalu banyak percobaan gagal (${MAX_FAILED_ATTEMPTS}x). Terkunci selama ${LOCKOUT_DURATION_SECONDS} detik untuk keamanan.`
        );
      } else {
        setErrorMessage(
          `PIN atau Kunci Rahasia salah! Sisa kesempatan: ${MAX_FAILED_ATTEMPTS - nextFail}x.`
        );
      }
      setPinInput('');
    }
  };



  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0B111B] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.15)] space-y-6 relative overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-amber-400 to-cyan-400" />

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Autentikasi Master Control
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Akses terbatas panel kendali manipulasi algoritma bandar judi online.
          </p>
        </div>

        {/* Lockout or Error Alert */}
        {lockoutRemaining > 0 ? (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/60 text-red-300 text-xs space-y-2 animate-pulse">
            <div className="flex items-center space-x-2 font-bold">
              <Clock className="w-4 h-4 text-red-400" />
              <span>Sistem Terkunci (Anti-Brute Force)</span>
            </div>
            <p>Silakan tunggu <strong>{lockoutRemaining} detik</strong> sebelum mencoba lagi.</p>
          </div>
        ) : errorMessage ? (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {/* PIN Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(pinInput);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Masukkan PIN Master Otoritas:</span>
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={16}
                autoFocus
                disabled={lockoutRemaining > 0}
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-center font-mono text-xl tracking-[0.4em] text-white placeholder:text-slate-600 outline-none transition disabled:opacity-50"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={lockoutRemaining > 0 || pinInput.length === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Unlock className="w-4 h-4" />
            <span>Verifikasi & Masuk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminPinGate;
