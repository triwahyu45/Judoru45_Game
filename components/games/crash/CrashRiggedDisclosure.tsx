'use client';

import React from 'react';
import { AlertOctagon, ShieldAlert, Sparkles } from 'lucide-react';

interface CrashRiggedDisclosureProps {
  isRigged: boolean;
  rigType?: string;
  note: string;
}

export const CrashRiggedDisclosure: React.FC<CrashRiggedDisclosureProps> = ({
  isRigged,
  rigType,
  note,
}) => {
  if (!note) return null;

  return (
    <div
      className={`p-3.5 rounded-2xl border flex items-start space-x-3 text-xs transition-all ${
        isRigged
          ? 'bg-red-950/40 border-red-500/40 text-red-200'
          : 'bg-[#090E1A] border-cyan-500/30 text-slate-300'
      }`}
    >
      {isRigged ? (
        <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      ) : (
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
      )}

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">
            {isRigged ? 'Peringatan Manipulasi Bandar (Rigged Hook Active):' : 'Fakta Matematika Crash:'}
          </span>
          {rigType && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-bold border border-red-500/50">
              {rigType}
            </span>
          )}
        </div>
        <p className="text-[11px] leading-relaxed text-slate-300">
          {note}
        </p>
      </div>
    </div>
  );
};
