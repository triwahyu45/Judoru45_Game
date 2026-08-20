import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '@/lib/context/GameContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlitchSecretButton } from '@/components/ui/GlitchSecretButton';
import { NewMemberBonusToast } from '@/components/ui/NewMemberBonusToast';

export const metadata: Metadata = {
  title: 'Judoru45 - Platform Simulasi Game & Kasino Online Terlengkap',
  description:
    'Judoru45 adalah platform simulasi kasino online interaktif dengan 6 permainan terpopuler: Slot Olympus, Crash Rocket, European Roulette, Dadu, Togel 4D, dan Sportsbook.',
  keywords: [
    'judoru45',
    'simulasi game kasino',
    'slot olympus demo',
    'crash aviator game',
    'roulette online',
    'togel 4d indonesia',
    'simulasi game',
  ],
  authors: [{ name: 'Judoru45 Gaming Entertainment' }],
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
          <GlitchSecretButton />
          <NewMemberBonusToast />
        </GameProvider>
      </body>
    </html>
  );
}
