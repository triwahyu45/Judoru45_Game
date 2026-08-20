import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '@/lib/context/GameContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Judoru45 - Platform Simulasi Edukasi Anti Judi Online | Tri Wahyu UNY',
  description:
    'Judoru45 adalah platform simulasi edukatif interaktif untuk membuktikan bagaimana algoritma judi online disetting bandar. 100% bebas uang asli dengan kontrol manipulasi admin & visualisasi kerugian riil.',
  keywords: [
    'anti judi online',
    'simulasi judi online',
    'judoru45',
    'tri wahyu',
    'uny',
    'edukasi bahaya judol',
    'slot olympus simulator',
    'crash aviator simulator',
    'roulette simulator',
    'togel 4d simulator',
    'dice simulator',
  ],
  authors: [{ name: 'Tri Wahyu (NIM 22518241023) - Universitas Negeri Yogyakarta' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#05070B] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <GameProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </GameProvider>
      </body>
    </html>
  );
}
