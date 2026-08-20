'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md p-8 rounded-3xl bg-[#0B111B] border border-red-500/40">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Terjadi Kesalahan Sistem</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error.message || 'Terjadi gangguan internal pada server simulasi.'}
        </p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
          >
            <span>Lobby</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
