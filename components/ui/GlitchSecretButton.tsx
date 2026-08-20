'use client';

import React, { useState } from 'react';
import { Eye, Terminal, Zap, ShieldAlert } from 'lucide-react';
import { useGame } from '@/lib/context/GameContext';
import { GlitchExposeModal } from '@/components/modals/GlitchExposeModal';

export const GlitchSecretButton: React.FC = () => {
  const { totalLost, totalWagered, currentUser, balance } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  // Mysterious button becomes visible once the user has played a bit or suffered losses/reloads
  const isEligible = totalWagered >= 50_000 || totalLost >= 30_000 || balance <= 10_000 || (currentUser && currentUser.faucetClaims >= 1);

  if (!isEligible) return null;

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 animate-bounce">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative px-4 py-3 rounded-2xl bg-[#070B12] border-2 border-red-500/80 hover:border-red-400 text-white font-mono text-xs font-black flex items-center space-x-2.5 shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-105 transition duration-300"
        >
          {/* Pulsing indicator dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute -top-1 -right-1" />
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -top-1 -right-1" />

          <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5" />
          </div>

          <div className="text-left leading-none">
            <div className="text-[9px] text-red-400 font-extrabold tracking-widest uppercase">
              [SYSTEM GLITCH]
            </div>
            <div className="text-xs font-black text-white group-hover:text-red-300 transition">
              👁️ RETAS RAHASIA BANDAR
            </div>
          </div>
        </button>
      </div>

      {/* Expose Matrix Modal */}
      <GlitchExposeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
