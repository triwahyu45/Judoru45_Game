# Project: Judoru45_Game Anti-Gambling Educational Simulation Platform

## Overview
Judoru45_Game is a modern, interactive web application built with Next.js (App Router), React, TypeScript, and Tailwind CSS. It educates users on the predatory and rigged reality of online gambling ("Judi Online") by providing full interactive simulations of the 6 most popular gambling games with 100% virtual credits, a comprehensive Admin Master Control Panel to demonstrate house manipulation in real-time, educational loss analytics, and multi-channel donation and crisis helpline integrations.

## Architecture
- **Framework**: Next.js 14/15 App Router, React, TypeScript, Tailwind CSS, Lucide React, Canvas 2D API, Web Audio API.
- **Audio Subsystem**: 100% Procedural Web Audio Synthesizer (`lib/sound/synthEngine.ts`) generating sound effects programmatically (zero missing audio assets).
- **State Management**: Centralized `GameContext` with typed `localStorage` persistence managing virtual balance, transaction history, audio settings, and admin rigged algorithms.
- **Admin Control Engine**: Dynamic RTP (0%-100%), House Rigged Mode profiles (Beginner's Luck, Near-Miss Generator, Jackpot Drainer, Manual Overrides), Real-world loss converter, and psychological educational codex.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Fullstack Next.js Setup & Theme | Next.js App Router, Tailwind luxury casino theme, responsive layout, fonts | M1 | Survey E1 |
| 2 | Procedural Sound Synth Engine | 100% code-based Web Audio synthesizer for 10 casino sound effects | M1 | Survey E1 |
| 3 | Shared State & LocalStorage Ledger | Virtual balance, transaction log, faucet reload modal (+Rp 1M), audio toggle | M1 | Survey E1 |
| 4 | Interactive Main Game Lobby | 6 Game Hub cards, live balance bar, educational banner, quick stats | M1 | Survey E1 |
| 5 | Slot Machine (Olympus / Zeus) | 6x5 cascading reels, Scatter pays 8+, multiplier orbs 2x-500x, lightning FX | M2 | Survey E2 |
| 6 | Crash / Aviator Rocket | Real-time exponential curve $M(t)=e^{0.06t}$, Canvas rocket, instant cashout | M2 | Survey E2 |
| 7 | European Roulette Table | 37-pocket (0-36) rotating wheel physics, interactive betting board, outside/inside bets | M3 | Survey E2 |
| 8 | Dice Roll (Over/Under & Sum) | 3D rotating dice animation, Over/Under target slider, exact 2-dice sum betting | M3 | Survey E2 |
| 9 | Togel / 4D Lottery Simulator | 4D/3D/2D number picker, quick pick, live tumbling ball draw animation, Indonesian payouts | M4 | Survey E2 |
| 10 | Tebak Skor Bola (Sportsbook) | Liga 1 & UCL clubs, realistic odds, live 90-min fast-forward match simulation with commentary | M4 | Survey E2 |
| 11 | Admin Master Control Panel | `/admin` route & secret PIN `4545` trigger, global RTP slider (0%-100%) | M5 | Survey E3 |
| 12 | Rigged Engine Behavioral Profiles | Beginner's Luck, Near-Miss Generator, Jackpot Drainer, Manual Forced Win/Loss | M5 | Survey E3 |
| 13 | Educational Loss Analytics | Conversion of virtual loss to real items (Nasi Padang, UKT UNY, Motor Vario), Psychology Codex | M5 | Survey E3 |
| 14 | Multi-Channel Donation Modal | Saweria, Trakteer, QRIS, PayPal, Ko-fi, Crypto mockups & creator attribution | M6 | Survey E3 |
| 15 | Crisis Helpline & Disclaimers | Official Indonesian crisis hotlines (Kemenkominfo, Kemensos, Yayasan Pulih, SEJIWA 119) | M6 | Survey E3 |
| 16 | E2E Automated Test Suite | 4-Tier test runner (`scripts/verify_all.ts`) covering all games, admin, state & faucet | M7 | Survey E3 |
| 17 | Git Synchronization & Remote Push | Git repository setup and sync to remote `https://github.com/triwahyu45/Judoru45_Game` | M7 | Survey E3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Fullstack Foundation, Theme, Audio, Lobby UI & State Engine | Next.js, Tailwind, Sound Synth, GameContext, Navbar, Faucet, Lobby Cards | none | DONE |
| M2 | Mini-Games Pack A (Slot Olympus & Crash Aviator) | Slot Olympus 6x5 cascade + Crash Aviator Canvas curve + Rigged hooks | M1 | DONE |
| M3 | Mini-Games Pack B (Roulette & Dice Roll) | European Roulette 37-pocket + Dice Roll Over/Under & 3D dice + Rigged hooks | M1 | DONE |
| M4 | Mini-Games Pack C (Togel 4D & Sports Betting) | Togel 4D live ball draw + Tebak Skor Bola match simulation engine + Rigged hooks | M1 | DONE |
| M5 | Admin Master Control & Rigged Outcome Engine | `/admin` panel, PIN lock, RTP slider, 4 Rigged profiles, Loss converter, Psychology Codex | M1 | DONE |
| M6 | Donation Modal & Anti-Gambling Helpline Integration | Saweria/Trakteer/QRIS/PayPal modal, Emergency hotlines, Educational disclaimers | M1 | DONE |
| M7 | E2E Testing Suite, Adversarial Hardening & Git Sync | 4-Tier test runner, Tier 5 adversarial stress testing, Git init & remote push | M2, M3, M4, M5, M6 | DONE |

## Code Layout
```
Judoru45_Game/
├── app/
│   ├── layout.tsx              # Root layout with font, metadata, GameProvider
│   ├── page.tsx                # Game Lobby & Educational Dashboard
│   ├── globals.css             # Tailwind CSS & custom neon/glow animations
│   ├── slot/page.tsx           # Slot Olympus / Zeus Game Page
│   ├── crash/page.tsx          # Crash / Aviator Rocket Game Page
│   ├── roulette/page.tsx       # European Roulette Game Page
│   ├── dice/page.tsx           # Dice Roll Over/Under Game Page
│   ├── togel/page.tsx          # Togel / 4D Lottery Game Page
│   ├── sports/page.tsx         # Tebak Skor Bola Sportsbook Game Page
│   └── admin/page.tsx          # Admin Master Control Panel
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Top navigation with balance, faucet, audio, admin trigger
│   │   └── Footer.tsx          # Educational disclaimers, creator attribution, hotlines
│   ├── modals/
│   │   ├── FaucetModal.tsx     # Virtual credit reload modal (+Rp 1,000,000)
│   │   ├── DonationModal.tsx   # Saweria, Trakteer, QRIS, PayPal, Ko-fi modal
│   │   └── HelplineModal.tsx   # Indonesian gambling crisis hotlines & counseling info
│   ├── admin/
│   │   ├── RtpSlider.tsx       # Interactive RTP slider with real-time preset buttons
│   │   ├── RiggedToggles.tsx   # Beginner's Luck, Near-miss, Jackpot Drainer switches
│   │   ├── LossAnalytics.tsx   # Tangible loss converter (Nasi Padang, UKT, Motor)
│   │   └── PsychologyCodex.tsx # Educational cards explaining casino manipulation
│   └── games/
│       ├── slot/               # Slot components (ReelGrid, ZeusBanner, MultiplierOrb)
│       ├── crash/              # Crash components (RocketCanvas, MultiplierCurve, CashoutBtn)
│       ├── roulette/           # Roulette components (WheelCanvas, BettingBoard, History)
│       ├── dice/               # Dice components (Dice3D, TargetSlider, SumBetBoard)
│       ├── togel/              # Togel components (BallCageDraw, NumberPad, TicketList)
│       └── sports/             # Sportsbook components (MatchBoard, LivePitchRadar, Commentary)
├── lib/
│   ├── context/
│   │   └── GameContext.tsx     # Shared balance, transaction ledger, admin config state
│   ├── sound/
│   │   └── synthEngine.ts      # 100% Procedural Web Audio synthesizer (10 sound effects)
│   ├── math/
│   │   ├── slotMath.ts         # Cascading, scatter pays, multiplier aggregation
│   │   ├── crashMath.ts        # Continuous curve $M(t)=e^{0.06t}$, crash distribution
│   │   ├── rouletteMath.ts     # Payouts, wheel pocket geometry, magnetic steering
│   │   ├── diceMath.ts         # Probability calculation, sum payouts, near-miss
│   │   ├── togelMath.ts        # 4D/3D/2D combinations, Indonesian payouts, liability minimizer
│   │   ├── sportsMath.ts       # Odds calculation, Poisson match event generator
│   │   └── riggedEngine.ts     # Central house manipulation coordinator
│   └── utils/
│       ├── currency.ts         # Rupiah formatting (`Rp 500.000`)
│       └── lossConverter.ts    # Real-world item loss equivalents
├── scripts/
│   └── verify_all.ts           # 4-Tier Automated Verification Runner
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Interface Contracts
### `GameContext` State Interface
```typescript
export interface GameContextType {
  balance: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  transactions: Transaction[];
  audioEnabled: boolean;
  adminConfig: AdminConfig;
  setAudioEnabled: (enabled: boolean) => void;
  updateBalance: (amount: number, game: string, details?: any) => boolean;
  claimFaucet: () => void;
  resetAllData: () => void;
  updateAdminConfig: (config: Partial<AdminConfig>) => void;
}
```

### `AdminConfig` Interface
```typescript
export interface AdminConfig {
  globalRtp: number; // 0 to 100
  activeProfile: 'fair' | 'beginners_luck' | 'near_miss' | 'jackpot_drainer' | 'pure_scam';
  forcedOutcome: 'auto' | 'force_win' | 'force_loss';
  highBetThreshold: number; // e.g. Rp 100,000
  nearMissProbability: number; // 0 to 1
}
```
