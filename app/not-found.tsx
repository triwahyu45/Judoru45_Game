'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md p-8 rounded-3xl bg-[#0B111B] border border-[#1E2D44]">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Halaman yang Anda cari tidak tersedia. Jangan biarkan rasa penasaran menjebak Anda.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl btn-gold text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
          <span>Kembali ke Lobby</span>
        </Link>
      </div>
    </div>
  );
}
