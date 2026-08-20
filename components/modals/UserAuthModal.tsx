'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  LogIn,
  Coins,
  AlertTriangle,
  Phone,
  CreditCard,
  Building,
  Sparkles,
  Gift,
} from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const BANK_OPTIONS = [
  'BCA (Bank Central Asia)',
  'Bank Mandiri',
  'BRI (Bank Rakyat Indonesia)',
  'BNI (Bank Negara Indonesia)',
  'CIMB Niaga',
  'Bank Danamon',
  'DANA (E-Wallet)',
  'GoPay (E-Wallet)',
  'OVO (E-Wallet)',
  'ShopeePay (E-Wallet)',
  'LinkAja (E-Wallet)',
];

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'register',
}) => {
  const router = useRouter();
  const { login, register, isLoggedIn } = useGame();
  // If user is not logged in and modal is open, it's a forced gate — cannot close
  const isForced = isOpen && !isLoggedIn;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState(BANK_OPTIONS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [referralCode, setReferralCode] = useState('GACOR45');
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

    if (!name.trim()) {
      setErrorMessage('Nama lengkap sesuai KTP / Rekening wajib diisi!');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Nomor WhatsApp / HP aktif wajib diisi!');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMessage('Nomor Rekening / No. E-Wallet wajib diisi!');
      return;
    }
    if (!username.trim() || username.trim().length < 3) {
      setErrorMessage('Username unik wajib diisi (minimal 3 karakter)!');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Kata sandi minimal 4 karakter!');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    const result = register({
      username: username.trim(),
      password,
      name: name.trim(),
      phone: phone.trim(),
      bankName,
      accountNumber: accountNumber.trim(),
    });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0B111B] border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.2)] relative overflow-hidden space-y-5 max-h-[92vh] flex flex-col">
        
        {/* Top Gold Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 animate-pulse" />

        {/* Close Button — hidden when forced gate (no account yet) */}
        {!isForced && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-[#05070B] border border-[#1E2D44] text-slate-400 hover:text-white transition z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Forced Gate Banner */}
        {isForced && (
          <div className="flex items-center justify-center space-x-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-bold flex-shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span>Wajib mendaftar / masuk untuk mengakses semua permainan & saldo bonus</span>
          </div>
        )}

        {/* Header & Tabs */}
        <div className="text-center space-y-2.5 flex-shrink-0 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center shadow-inner">
            {activeTab === 'login' ? <LogIn className="w-6 h-6" /> : <Gift className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeTab === 'login' ? 'Masuk Akun VIP' : 'Pendaftaran Anggota VIP Baru'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === 'login'
                ? 'Masukkan username & kata sandi akun Anda untuk lanjut bermain.'
                : 'Lengkapi data formulir resmi untuk langsung mengklaim Bonus Saldo Rp 100.000!'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#05070B] border border-[#1E2D44]">
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
              Daftar Akun Baru (+Rp 100K)
            </button>
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
              Sudah Punya Akun (Masuk)
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2 animate-fadeIn flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Nama Pengguna (Username) <span className="text-red-400">*</span>
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
                  Kata Sandi (Password) <span className="text-red-400">*</span>
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
                <span>Masuk ke Arena Permainan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* TAB 2: REALISTIC KYC REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Field 1: Nama Lengkap */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Nama Lengkap (Sesuai KTP / Rekening)</span>
                  <span className="text-[10px] text-red-400 font-bold">* Wajib</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hendrawan Wijaya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Field 2: No WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Nomor WhatsApp / HP Aktif</span>
                  <span className="text-[10px] text-red-400 font-bold">* Wajib</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Field 3 & 4: Bank & Nomor Rekening */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Nama Bank / E-Wallet</span>
                    <span className="text-[10px] text-red-400 font-bold">* Wajib</span>
                  </label>
                  <div className="relative">
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full py-2.5 px-3 pl-9 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-xs text-white outline-none transition"
                    >
                      {BANK_OPTIONS.map((b) => (
                        <option key={b} value={b} className="bg-[#0B111B] text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Nomor Rekening / E-Wallet</span>
                    <span className="text-[10px] text-red-400 font-bold">* Wajib</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 8829102938"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                    />
                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Field 5: Username */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Nama Pengguna (Username Unik)</span>
                  <span className="text-[10px] text-red-400 font-bold">* Wajib (Min. 3 Huruf)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: zeus_master99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-2.5 px-4 pl-10 rounded-xl bg-[#05070B] border border-[#1E2D44] focus:border-amber-500 text-sm text-white placeholder:text-slate-600 outline-none transition"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Field 6 & 7: Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Kata Sandi</span>
                    <span className="text-[10px] text-red-400 font-bold">* Wajib</span>
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

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Ulangi Sandi</span>
                    <span className="text-[10px] text-red-400 font-bold">* Wajib</span>
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
              </div>

              {/* Bonus New Member Badge */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2.5">
                <Coins className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
                <div className="leading-tight">
                  <div className="font-black text-white">🎁 BONUS INSTAN NEW MEMBER:</div>
                  <div>Saldo virtual <strong>Rp 100.000</strong> langsung dicairkan ke akunmu setelah mendaftar!</div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 hover:scale-102 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>DAFTAR SEKARANG &amp; KLAIM BONUS RP 100.000</span>
              </button>

            </form>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-center text-slate-500 flex-shrink-0">
          Data Anda disimpan aman secara lokal di browser &bull; 100% Saldo Virtual Fiktif
        </p>

      </div>
    </div>
  );
};
