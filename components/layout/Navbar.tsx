'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { FaucetModal } from '@/components/modals/FaucetModal';
import { DonationModal } from '@/components/modals/DonationModal';
import { HelplineModal } from '@/components/modals/HelplineModal';
import { UserAuthModal } from '@/components/modals/UserAuthModal';
import {
  ShieldAlert,
  Coins,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Menu,
  X,
  Layers,
  Flame,
  Bomb,
  CircleDot,
  Dices,
  Ticket,
  Trophy,
  Heart,
  LifeBuoy,
  User,
  LogOut,
  UserCheck,
  Brain,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    balance,
    audioEnabled,
    toggleAudio,
    currentUser,
    isLoggedIn,
    logout,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen,
    authModalTab,
  } = useGame();

  const [isFaucetOpen, setIsFaucetOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 5-Tap Secret Logo Gesture for Admin Trigger
  const logoTapCountRef = useRef(0);
  const logoTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoTap = () => {
    logoTapCountRef.current += 1;
    if (logoTapTimerRef.current) clearTimeout(logoTapTimerRef.current);

    if (logoTapCountRef.current >= 5) {
      logoTapCountRef.current = 0;
      router.push('/admin');
    } else {
      logoTapTimerRef.current = setTimeout(() => {
        logoTapCountRef.current = 0;
      }, 3000);
    }
  };

  // Keyboard Shortcut: Ctrl+Shift+A for Admin Trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const navLinks = [
    { href: '/', label: 'Lobby', icon: Layers },
    { href: '/slot', label: 'Slot', icon: Flame },
    { href: '/crash', label: 'Crash', icon: Bomb },
    { href: '/roulette', label: 'Roulette', icon: CircleDot },
    { href: '/dice', label: 'Dice', icon: Dices },
    { href: '/togel', label: 'Togel', icon: Ticket },
    { href: '/sports', label: 'Sports', icon: Trophy },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1E2D44] bg-[#05070B]/95 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Brand Logo with Generous Right Margin */}
            <div className="flex items-center flex-shrink-0">
              <div
                id="brand-logo"
                onClick={handleLogoTap}
                className="cursor-pointer select-none"
              >
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-700 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition flex-shrink-0">
                    <div className="w-full h-full bg-[#070B12] rounded-[14px] flex items-center justify-center">
                      <span className="font-black text-lg text-gold-gradient tracking-tight">J45</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center space-x-1.5 leading-none">
                      <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition">
                        JUDORU<span className="text-amber-400">45</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-300 border border-amber-500/50 shadow-sm">
                        VIP
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 hidden sm:inline-block">
                      OFFICIAL CASINO
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation Links (Separated by Clean Divider) */}
            <nav className="hidden xl:flex items-center space-x-1 pl-4 lg:pl-6 border-l border-[#1E2D44]/80 flex-shrink-1 overflow-hidden">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'text-slate-300 hover:text-white hover:bg-[#121B2A]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400/90" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Bar (Never Overflows) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              
              {/* Virtual Balance Display */}
              <div 
                onClick={() => setIsFaucetOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl bg-[#0B111B] border border-amber-500/30 hover:border-amber-400/60 transition cursor-pointer shadow-inner group flex-shrink-0"
                title="Klik untuk klaim bonus saldo gratis"
              >
                <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition flex-shrink-0">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-right leading-tight">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                    Saldo
                  </span>
                  <span className="text-xs sm:text-sm font-black text-gold-gradient tracking-tight">
                    {formatIDR(balance)}
                  </span>
                </div>
              </div>

              {/* Faucet Trigger Button */}
              <button
                type="button"
                onClick={() => setIsFaucetOpen(true)}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 sm:py-2 rounded-xl btn-gold text-xs font-black flex-shrink-0 shadow-md"
                title="Klaim Modal Saldo Gratis"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>+ Saldo</span>
              </button>

              {/* Donation Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDonationOpen(true)}
                className="flex items-center space-x-1 px-2 py-1.5 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-100 text-xs font-bold transition shadow-sm flex-shrink-0"
                title="Dukungan Apresiasi Donasi"
              >
                <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span className="hidden sm:inline">Donasi</span>
              </button>

              {/* Audio Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`p-1.5 sm:p-2 rounded-xl border transition flex-shrink-0 ${
                  audioEnabled
                    ? 'bg-[#0B111B] border-[#1E2D44] text-amber-400 hover:border-amber-400/50'
                    : 'bg-red-950/30 border-red-900/50 text-red-400'
                }`}
                title={audioEnabled ? 'Matikan Suara Web Audio' : 'Nyalakan Suara Web Audio'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Dynamic User Profile / Login Button */}
              {isLoggedIn && currentUser ? (
                <div className="flex items-center space-x-1.5 p-1 pl-2 pr-1.5 rounded-xl bg-[#0B111B] border border-amber-500/40 shadow-sm flex-shrink-0">
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <UserCheck className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 hidden md:inline max-w-[80px] truncate">
                      {currentUser.name || currentUser.username}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="p-1 rounded-lg hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition"
                    title="Keluar Akun"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center space-x-1 px-2.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black transition shadow-lg shadow-amber-500/20 flex-shrink-0"
                  title="Wajib Masuk / Daftar Akun untuk Bermain"
                >
                  <User className="w-3.5 h-3.5 text-black" />
                  <span className="hidden sm:inline">Masuk / Daftar</span>
                  <span className="sm:hidden">Masuk</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-1.5 sm:p-2 rounded-xl bg-[#0B111B] border border-[#1E2D44] text-slate-300 hover:text-white flex-shrink-0"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1E2D44] bg-[#070D18] px-4 py-3 space-y-2 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-300 bg-[#0B111B] border border-[#1E2D44] hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsHelplineOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-bold flex items-center justify-center space-x-1.5"
              >
                <LifeBuoy className="w-4 h-4 text-red-400" />
                <span>Bantuan Krisis</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDonationOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center space-x-1.5"
              >
                <Heart className="w-4 h-4 text-amber-400" />
                <span>Donasi Karya</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsFaucetOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl btn-gold flex items-center justify-center space-x-2 text-xs font-bold mt-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Isi Ulang Saldo Gratis (+Rp 500.000)</span>
            </button>
          </div>
        )}
      </header>

      {/* Modals */}
      <FaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} />
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
      <HelplineModal isOpen={isHelplineOpen} onClose={() => setIsHelplineOpen(false)} />
      <UserAuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} defaultTab={authModalTab} />
    </>
  );
};

export default Navbar;
