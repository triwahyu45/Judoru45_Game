# E2E Test Infra: Judoru45_Game

## Test Philosophy
- Comprehensive, reproducible verification covering math algorithms, game engines, state management, procedural audio parameters, admin rigged profiles, and UI contracts.
- Automated runner located at `scripts/verify_all.ts` runnable directly with `npx tsx scripts/verify_all.ts` or `npm test`.
- All tests must pass cleanly with exit code 0.

## Feature Inventory Coverage Map
| # | Feature | Source | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Real-World) |
|---|---------|--------|:----------------:|:-----------------:|:----------------------:|:-------------------:|
| 1 | Fullstack Setup & Theme | PROJECT.md §1 | 5 tests | 5 tests | ✓ | ✓ |
| 2 | Sound Synth Engine | PROJECT.md §2 | 5 tests | 5 tests | ✓ | ✓ |
| 3 | State & Faucet Ledger | PROJECT.md §3 | 5 tests | 5 tests | ✓ | ✓ |
| 4 | Lobby & Game Hubs | PROJECT.md §4 | 5 tests | 5 tests | ✓ | ✓ |
| 5 | Slot Olympus Engine | PROJECT.md §5 | 5 tests | 5 tests | ✓ | ✓ |
| 6 | Crash Rocket Engine | PROJECT.md §6 | 5 tests | 5 tests | ✓ | ✓ |
| 7 | Roulette Table Engine | PROJECT.md §7 | 5 tests | 5 tests | ✓ | ✓ |
| 8 | Dice Roll Engine | PROJECT.md §8 | 5 tests | 5 tests | ✓ | ✓ |
| 9 | Togel 4D Engine | PROJECT.md §9 | 5 tests | 5 tests | ✓ | ✓ |
| 10 | Sportsbook Engine | PROJECT.md §10 | 5 tests | 5 tests | ✓ | ✓ |
| 11 | Admin Control Panel | PROJECT.md §11 | 5 tests | 5 tests | ✓ | ✓ |
| 12 | Rigged Profiles Engine | PROJECT.md §12 | 5 tests | 5 tests | ✓ | ✓ |
| 13 | Loss Analytics Converter | PROJECT.md §13 | 5 tests | 5 tests | ✓ | ✓ |
| 14 | Donation Modal System | PROJECT.md §14 | 5 tests | 5 tests | ✓ | ✓ |
| 15 | Crisis Helpline Hotlines | PROJECT.md §15 | 5 tests | 5 tests | ✓ | ✓ |

## Test Architecture
- **Runner**: Node.js + TypeScript execution (`tsx scripts/verify_all.ts`).
- **Pass/Fail Semantics**: Each tier executes distinct assertion suites. Any assertion failure throws an Error and halts with exit code 1. A clean run logs summary statistics and exits with exit code 0.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised |
|---|----------|-------------------|
| 1 | "New Gambler Honeypot": User registers, receives Rp 500k, plays Slot with Beginner's Luck, wins initial Rp 200k, then gets drained to Rp 0 over next 10 spins. | State, Slot, Admin Rigged Engine, Currency |
| 2 | "High Roller Crash Sniper": User bets Rp 500,000 on Crash with Auto-Cashout at 2.0x, rigged engine crashes rocket at 1.02x. | Crash, Math, Rigged Engine, Ledger |
| 3 | "Roulette Zero-Liability Sweep": User bets on Red (Rp 100k) and Odd (Rp 100k), magnetic steering rolls Black 22 (Even). | Roulette, Board Payouts, House Edge |
| 4 | "Dice 1-Point Heartbreak": User bets Roll Over 50, dice roll engine evaluates rigged near-miss and returns 49. | Dice, Slider Odds, Near-Miss Hook |
| 5 | "Togel 3-Digit Illusion": User bets 4D 4545, live draw delivers 4546 (near-miss) retaining 100% house pool. | Togel, Prize Pool, Ball Draw |
| 6 | "Sports 90+3 Minute VAR Penalty": User bets Under 2.5 Goals on a 1-1 match, match simulation engine triggers 93' penalty to end 2-1. | Sportsbook, Commentary, Odds Settlement |
| 7 | "Bankruptcy to Faucet to Donation": User loses all credits, reads Real-World Loss Converter (e.g. 50 Nasi Padang lost), triggers Faucet (+Rp 1M), and opens Anti-Gambling Donation Modal & Hotline. | Faucet, Loss Converter, Donation, Hotlines |
