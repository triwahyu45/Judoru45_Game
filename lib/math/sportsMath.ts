/**
 * Judoru45_Game - Tebak Skor Sepak Bola (Sportsbook Simulation Engine)
 * Implements Poisson goal distribution, market odds calculation with bookmaker vigorish,
 * 90-minute fast-forward match runner, dynamic Indonesian commentary, and
 * the devastating 90+ Minute Rigged Heartbreak Engine.
 */

export type SportsLeague = 'LIGA_1' | 'CHAMPIONS_LEAGUE';

export type SportsBetMarket =
  | '1X2' // Full Time Result (1: Home, X: Draw, 2: Away)
  | 'OVER_UNDER_2_5' // Total Goals Over 2.5 or Under 2.5
  | 'BTTS' // Both Teams To Score (Yes / No)
  | 'EXACT_SCORE'; // Correct Score (e.g. 1-0, 2-1, 0-0, etc.)

export interface SportsTeam {
  id: string;
  name: string;
  shortName: string;
  league: SportsLeague;
  attackRating: number; // 60 to 95
  defenseRating: number; // 60 to 95
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  city: string;
  form: ('W' | 'D' | 'L')[];
}

export interface MatchOdds {
  homeWin: number; // 1
  draw: number; // X
  awayWin: number; // 2
  over25: number;
  under25: number;
  bttsYes: number;
  bttsNo: number;
  exactScores: Record<string, number>; // e.g. "1-0": 6.5, "2-1": 8.0
}

export interface MatchFixture {
  id: string;
  league: SportsLeague;
  leagueName: string;
  homeTeam: SportsTeam;
  awayTeam: SportsTeam;
  matchDate: string;
  stadium: string;
  odds: MatchOdds;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  finalScore?: [number, number];
}

export type MatchEventType =
  | 'KICKOFF'
  | 'POSSESSION'
  | 'ATTACK'
  | 'DANGEROUS_ATTACK'
  | 'CORNER'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'VAR_CHECK'
  | 'PENALTY'
  | 'GOAL'
  | 'HALFTIME'
  | 'FULLTIME';

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  team: 'HOME' | 'AWAY' | 'NEUTRAL';
  score: [number, number];
  pitchX: number; // 0 to 100% of pitch length (0: Home Goal, 100: Away Goal)
  pitchY: number; // 0 to 100% of pitch width
  textIndonesian: string;
  isHeartbreakEvent?: boolean;
}

export interface UserSportsBet {
  matchId: string;
  market: SportsBetMarket;
  selection: string; // 'HOME' | 'DRAW' | 'AWAY' | 'OVER' | 'UNDER' | 'BTTS_YES' | 'BTTS_NO' | '1-0' | '2-1' | etc.
  selectionLabel: string;
  odds: number;
  wagerAmount: number;
  potentialPayout: number;
}

export const LIGA_1_TEAMS: SportsTeam[] = [
  {
    id: 'persija',
    name: 'Persija Jakarta',
    shortName: 'PSJ',
    league: 'LIGA_1',
    attackRating: 82,
    defenseRating: 80,
    primaryColor: '#DC2626', // Red
    secondaryColor: '#F59E0B',
    stadium: 'Gelora Bung Karno (GBK)',
    city: 'Jakarta',
    form: ['W', 'W', 'D', 'W', 'L'],
  },
  {
    id: 'persib',
    name: 'Persib Bandung',
    shortName: 'PSB',
    league: 'LIGA_1',
    attackRating: 84,
    defenseRating: 81,
    primaryColor: '#2563EB', // Blue
    secondaryColor: '#FFFFFF',
    stadium: 'Gelora Bandung Lautan Api',
    city: 'Bandung',
    form: ['W', 'D', 'W', 'W', 'W'],
  },
  {
    id: 'persebaya',
    name: 'Persebaya Surabaya',
    shortName: 'SBY',
    league: 'LIGA_1',
    attackRating: 79,
    defenseRating: 77,
    primaryColor: '#16A34A', // Green
    secondaryColor: '#FFFFFF',
    stadium: 'Gelora Bung Tomo',
    city: 'Surabaya',
    form: ['D', 'W', 'L', 'W', 'D'],
  },
  {
    id: 'bali_utd',
    name: 'Bali United FC',
    shortName: 'BLU',
    league: 'LIGA_1',
    attackRating: 81,
    defenseRating: 79,
    primaryColor: '#EF4444', // Red
    secondaryColor: '#000000',
    stadium: 'Kapten I Wayan Dipta',
    city: 'Gianyar',
    form: ['W', 'L', 'W', 'D', 'W'],
  },
  {
    id: 'arema',
    name: 'Arema FC',
    shortName: 'ARM',
    league: 'LIGA_1',
    attackRating: 78,
    defenseRating: 76,
    primaryColor: '#1E40AF', // Dark Blue
    secondaryColor: '#DC2626',
    stadium: 'Kanjuruhan / Supriyadi',
    city: 'Malang',
    form: ['L', 'D', 'W', 'L', 'D'],
  },
  {
    id: 'psm',
    name: 'PSM Makassar',
    shortName: 'PSM',
    league: 'LIGA_1',
    attackRating: 80,
    defenseRating: 80,
    primaryColor: '#991B1B', // Maroon
    secondaryColor: '#FFFFFF',
    stadium: 'Gelora B.J. Habibie',
    city: 'Makassar',
    form: ['D', 'W', 'W', 'L', 'D'],
  },
];

export const UCL_TEAMS: SportsTeam[] = [
  {
    id: 'real_madrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    league: 'CHAMPIONS_LEAGUE',
    attackRating: 94,
    defenseRating: 90,
    primaryColor: '#FFFFFF',
    secondaryColor: '#F59E0B',
    stadium: 'Santiago Bernabéu',
    city: 'Madrid',
    form: ['W', 'W', 'W', 'D', 'W'],
  },
  {
    id: 'man_city',
    name: 'Manchester City',
    shortName: 'MCI',
    league: 'CHAMPIONS_LEAGUE',
    attackRating: 95,
    defenseRating: 91,
    primaryColor: '#38BDF8', // Sky Blue
    secondaryColor: '#FFFFFF',
    stadium: 'Etihad Stadium',
    city: 'Manchester',
    form: ['W', 'W', 'D', 'W', 'W'],
  },
  {
    id: 'arsenal',
    name: 'Arsenal FC',
    shortName: 'ARS',
    league: 'CHAMPIONS_LEAGUE',
    attackRating: 91,
    defenseRating: 89,
    primaryColor: '#EF4444', // Red
    secondaryColor: '#FFFFFF',
    stadium: 'Emirates Stadium',
    city: 'London',
    form: ['W', 'D', 'W', 'W', 'L'],
  },
  {
    id: 'bayern',
    name: 'Bayern Munich',
    shortName: 'BAY',
    league: 'CHAMPIONS_LEAGUE',
    attackRating: 92,
    defenseRating: 88,
    primaryColor: '#DC2626',
    secondaryColor: '#1E3A8A',
    stadium: 'Allianz Arena',
    city: 'Munich',
    form: ['W', 'W', 'L', 'W', 'W'],
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'BAR',
    league: 'CHAMPIONS_LEAGUE',
    attackRating: 92,
    defenseRating: 87,
    primaryColor: '#7C2D12', // Blaugrana / Crimson
    secondaryColor: '#1E3A8A',
    stadium: 'Camp Nou / Montjuïc',
    city: 'Barcelona',
    form: ['W', 'W', 'W', 'W', 'D'],
  },
  {
    id: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    league: 'CHAMPIONS_LEAGUE',
    attackRating: 90,
    defenseRating: 87,
    primaryColor: '#1E293B',
    secondaryColor: '#EF4444',
    stadium: 'Parc des Princes',
    city: 'Paris',
    form: ['W', 'D', 'W', 'W', 'D'],
  },
];

/**
 * Poisson probability mass function P(X = k) = (lambda^k * e^-lambda) / k!
 */
function poissonPmf(k: number, lambda: number): number {
  if (k < 0) return 0;
  let factorial = 1;
  for (let i = 2; i <= k; i++) factorial *= i;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial;
}

/**
 * Calculates match probabilities and bookmaker odds with standard vigorish (8% margin)
 */
export function calculateMatchOdds(homeTeam: SportsTeam, awayTeam: SportsTeam): MatchOdds {
  // Expected goals based on attack/defense ratings
  const lambdaH = 1.35 * Math.pow(homeTeam.attackRating / awayTeam.defenseRating, 1.3) * 1.12; // Home advantage
  const lambdaA = 1.15 * Math.pow(awayTeam.attackRating / homeTeam.defenseRating, 1.3);

  let pHome = 0;
  let pDraw = 0;
  let pAway = 0;
  let pOver25 = 0;
  let pUnder25 = 0;
  let pBttsYes = 0;
  const scoreProbMatrix: Record<string, number> = {};

  const MAX_GOALS = 6;

  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const prob = poissonPmf(h, lambdaH) * poissonPmf(a, lambdaA);
      const scoreKey = `${h}-${a}`;
      scoreProbMatrix[scoreKey] = prob;

      if (h > a) pHome += prob;
      else if (h === a) pDraw += prob;
      else pAway += prob;

      if (h + a > 2.5) pOver25 += prob;
      else pUnder25 += prob;

      if (h > 0 && a > 0) pBttsYes += prob;
    }
  }

  const pBttsNo = Math.max(0.01, 1 - pBttsYes);

  // Apply Bookmaker Vigorish (0.92 payout multiplier = 8% bookmaker edge)
  const VIG = 0.92;

  const toOdds = (p: number) => +(Math.max(1.1, VIG / Math.max(0.001, p))).toFixed(2);

  const exactScores: Record<string, number> = {
    '1-0': toOdds(scoreProbMatrix['1-0'] || 0.1),
    '2-0': toOdds(scoreProbMatrix['2-0'] || 0.08),
    '2-1': toOdds(scoreProbMatrix['2-1'] || 0.09),
    '3-0': toOdds(scoreProbMatrix['3-0'] || 0.05),
    '3-1': toOdds(scoreProbMatrix['3-1'] || 0.06),
    '0-0': toOdds(scoreProbMatrix['0-0'] || 0.08),
    '1-1': toOdds(scoreProbMatrix['1-1'] || 0.12),
    '2-2': toOdds(scoreProbMatrix['2-2'] || 0.05),
    '0-1': toOdds(scoreProbMatrix['0-1'] || 0.09),
    '0-2': toOdds(scoreProbMatrix['0-2'] || 0.06),
    '1-2': toOdds(scoreProbMatrix['1-2'] || 0.08),
    '1-3': toOdds(scoreProbMatrix['1-3'] || 0.04),
    '2-3': toOdds(scoreProbMatrix['2-3'] || 0.03),
  };

  return {
    homeWin: toOdds(pHome),
    draw: toOdds(pDraw),
    awayWin: toOdds(pAway),
    over25: toOdds(pOver25),
    under25: toOdds(pUnder25),
    bttsYes: toOdds(pBttsYes),
    bttsNo: toOdds(pBttsNo),
    exactScores,
  };
}

/**
 * Generates realistic match fixtures for Liga 1 and Champions League
 */
export function generateDefaultFixtures(): MatchFixture[] {
  return [
    {
      id: 'fix_liga1_1',
      league: 'LIGA_1',
      leagueName: 'BRI Liga 1 Indonesia',
      homeTeam: LIGA_1_TEAMS[0], // Persija
      awayTeam: LIGA_1_TEAMS[1], // Persib
      matchDate: 'Hari Ini, 19:30 WIB',
      stadium: 'Stadion Gelora Bung Karno, Jakarta',
      odds: calculateMatchOdds(LIGA_1_TEAMS[0], LIGA_1_TEAMS[1]),
      status: 'UPCOMING',
    },
    {
      id: 'fix_liga1_2',
      league: 'LIGA_1',
      leagueName: 'BRI Liga 1 Indonesia',
      homeTeam: LIGA_1_TEAMS[2], // Persebaya
      awayTeam: LIGA_1_TEAMS[3], // Bali United
      matchDate: 'Hari Ini, 15:30 WIB',
      stadium: 'Gelora Bung Tomo, Surabaya',
      odds: calculateMatchOdds(LIGA_1_TEAMS[2], LIGA_1_TEAMS[3]),
      status: 'UPCOMING',
    },
    {
      id: 'fix_ucl_1',
      league: 'CHAMPIONS_LEAGUE',
      leagueName: 'UEFA Champions League',
      homeTeam: UCL_TEAMS[0], // Real Madrid
      awayTeam: UCL_TEAMS[1], // Man City
      matchDate: 'Besok, 02:00 WIB',
      stadium: 'Santiago Bernabéu, Madrid',
      odds: calculateMatchOdds(UCL_TEAMS[0], UCL_TEAMS[1]),
      status: 'UPCOMING',
    },
    {
      id: 'fix_ucl_2',
      league: 'CHAMPIONS_LEAGUE',
      leagueName: 'UEFA Champions League',
      homeTeam: UCL_TEAMS[2], // Arsenal
      awayTeam: UCL_TEAMS[3], // Bayern
      matchDate: 'Besok, 02:00 WIB',
      stadium: 'Emirates Stadium, London',
      odds: calculateMatchOdds(UCL_TEAMS[2], UCL_TEAMS[3]),
      status: 'UPCOMING',
    },
  ];
}

/**
 * Generates match simulation timeline with dynamic Indonesian commentary and
 * scripted 90+ Minute Rigged Heartbreak Engine
 */
export function simulateMatchEvents(
  fixture: MatchFixture,
  userBet: UserSportsBet | null,
  rigMode: string = 'fair',
  adminConfig?: {
    forcedOutcome?: 'auto' | 'force_win' | 'force_loss';
    sportsBookmakerBias?: number;
  }
): {
  events: MatchEvent[];
  finalScore: [number, number];
  isWin: boolean;
  payout: number;
  netProfit: number;
  isHeartbreakTriggered: boolean;
  heartbreakMessage?: string;
} {
  const home = fixture.homeTeam;
  const away = fixture.awayTeam;

  const shouldHeartbreak =
    rigMode === 'near_miss' ||
    rigMode === 'pure_scam' ||
    rigMode === 'jackpot_drainer' ||
    adminConfig?.forcedOutcome === 'force_loss' ||
    (adminConfig?.sportsBookmakerBias && Math.random() < adminConfig.sportsBookmakerBias);

  const forceWin = adminConfig?.forcedOutcome === 'force_win';

  const events: MatchEvent[] = [];
  let homeGoals = 0;
  let awayGoals = 0;
  let isHeartbreakTriggered = false;
  let heartbreakMessage: string | undefined;

  // 1. Kickoff
  events.push({
    minute: 1,
    type: 'KICKOFF',
    team: 'NEUTRAL',
    score: [0, 0],
    pitchX: 50,
    pitchY: 50,
    textIndonesian: `Peluit ditiup! Babak pertama dimulai di ${fixture.stadium}. Suasana stadion membara!`,
  });

  // Decide match storyline based on user's bet and rig condition
  if (userBet && shouldHeartbreak && !forceWin) {
    isHeartbreakTriggered = true;

    if (userBet.market === '1X2' && userBet.selection === 'HOME') {
      // Story: Home leads 1-0 until 90+3', then Away scores a heartbreaking penalty to make it 1-1 Draw!
      heartbreakMessage = '🚨 Heartbreak Engine: Tim Anda memimpin 1-0 hingga menit 90+3\', lalu kebobolan penalti VAR di injury time! Taruhan HANGUS.';
      
      events.push({ minute: 12, type: 'ATTACK', team: 'HOME', score: [0, 0], pitchX: 75, pitchY: 35, textIndonesian: `Serangan cepat ${home.name}! Umpan silang tajam ke kotak penalti.` });
      events.push({ minute: 28, type: 'YELLOW_CARD', team: 'AWAY', score: [0, 0], pitchX: 40, pitchY: 70, textIndonesian: `Kartu kuning untuk bek ${away.name} akibat tekel terlambat.` });
      events.push({ minute: 36, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOLLLL!! Tendangan melengkung spektakuler dari striker ${home.name}! Skor 1 - 0!` });
      homeGoals = 1;

      events.push({ minute: 45, type: 'HALFTIME', team: 'NEUTRAL', score: [1, 0], pitchX: 50, pitchY: 50, textIndonesian: `Turun minum. ${home.name} 1 - 0 ${away.name}. Posisi taruhan Home Win Anda sementara unggul.` });
      events.push({ minute: 58, type: 'DANGEROUS_ATTACK', team: 'AWAY', score: [1, 0], pitchX: 25, pitchY: 45, textIndonesian: `Penyelamatan gemilang kiper ${home.name}! Menepis tembakan jarak dekat.` });
      events.push({ minute: 74, type: 'CORNER', team: 'AWAY', score: [1, 0], pitchX: 5, pitchY: 10, textIndonesian: `Tendangan sudut untuk ${away.name}, sundulan tipis menyamping gawang.` });
      events.push({ minute: 88, type: 'POSSESSION', team: 'HOME', score: [1, 0], pitchX: 55, pitchY: 60, textIndonesian: `Menit 88: ${home.name} berusaha mengulur waktu di pojok lapangan... Kemenangan di depan mata!` });
      events.push({ minute: 90, type: 'VAR_CHECK', team: 'NEUTRAL', score: [1, 0], pitchX: 15, pitchY: 50, textIndonesian: `[90+1'] 📺 VAR CHECK! Wasit meninjau dugaan handsball di kotak penalti ${home.name}!` });
      events.push({ minute: 92, type: 'PENALTY', team: 'AWAY', score: [1, 0], pitchX: 12, pitchY: 50, textIndonesian: `[90+2'] PENALTI DIBERIKAN UNTUK ${away.name}! Keputusan kontroversial wasit di menit berdarah!` });
      events.push({
        minute: 93,
        type: 'GOAL',
        team: 'AWAY',
        score: [1, 1],
        pitchX: 5,
        pitchY: 50,
        textIndonesian: `[90+3'] 💔 GOOOL PENALTI! Eksekusi dingin menjebol gawang! Skor 1 - 1! Taruhan Home Win Kandas di detik akhir!`,
        isHeartbreakEvent: true,
      });
      awayGoals = 1;
    } else if (userBet.market === 'OVER_UNDER_2_5' && userBet.selection === 'UNDER') {
      // Story: 1-1 (2 goals) at min 89, then 90+4' corner header makes it 1-2 (3 goals / Over 2.5)
      heartbreakMessage = '🚨 Heartbreak Engine: Total gol aman 1-1 (Under 2.5) hingga menit 90+4\', lalu gol sundulan menit akhir membuat total gol jadi 3! Taruhan HANGUS.';

      events.push({ minute: 15, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 48, textIndonesian: `⚽ GOOOL! ${home.name} membuka keunggulan 1-0.` });
      homeGoals = 1;
      events.push({ minute: 42, type: 'GOAL', team: 'AWAY', score: [1, 1], pitchX: 5, pitchY: 52, textIndonesian: `⚽ GOOOL PENYEIMBANG! ${away.name} membalas lewat serangan balik cepat. Skor 1 - 1.` });
      awayGoals = 1;
      events.push({ minute: 45, type: 'HALFTIME', team: 'NEUTRAL', score: [1, 1], pitchX: 50, pitchY: 50, textIndonesian: `Babak pertama selesai: Skor 1 - 1 (Total 2 Gol - Masih zona aman Under 2.5).` });
      events.push({ minute: 65, type: 'DANGEROUS_ATTACK', team: 'HOME', score: [1, 1], pitchX: 80, pitchY: 40, textIndonesian: `Kedua tim bermain hati-hati dan memperlambat tempo permainan.` });
      events.push({ minute: 86, type: 'POSSESSION', team: 'NEUTRAL', score: [1, 1], pitchX: 50, pitchY: 50, textIndonesian: `Menit 86: Pertahanan rapat kedua tim, skor masih 1-1.` });
      events.push({ minute: 90, type: 'CORNER', team: 'AWAY', score: [1, 1], pitchX: 5, pitchY: 90, textIndonesian: `[90+2'] Tambahan waktu 4 menit. Tendangan sudut terakhir untuk ${away.name}...` });
      events.push({
        minute: 94,
        type: 'GOAL',
        team: 'AWAY',
        score: [1, 2],
        pitchX: 5,
        pitchY: 50,
        textIndonesian: `[90+4'] 💔 GOOOL DRAMATIS SUNDULAN TENDANGAN SUDUT! Skor 1 - 2! Total gol menjadi 3 (Over 2.5)! Taruhan Under Anda Hangus di detik pamungkas!`,
        isHeartbreakEvent: true,
      });
      awayGoals = 2;
    } else if (userBet.market === 'BTTS' && userBet.selection === 'BTTS_NO') {
      // Story: 1-0 clean sheet until 90+4' equalizer
      heartbreakMessage = '🚨 Heartbreak Engine: Clean sheet 1-0 bertahan hingga menit 90+4\', lalu gol penyama kedudukan menghancurkan taruhan BTTS No Anda!';

      events.push({ minute: 22, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL! ${home.name} memimpin 1-0.` });
      homeGoals = 1;
      events.push({ minute: 45, type: 'HALFTIME', team: 'NEUTRAL', score: [1, 0], pitchX: 50, pitchY: 50, textIndonesian: `Babak pertama tuntas 1-0. Pertahanan solid tanpa kebobolan.` });
      events.push({ minute: 70, type: 'DANGEROUS_ATTACK', team: 'AWAY', score: [1, 0], pitchX: 20, pitchY: 45, textIndonesian: `Tekanan bertubi-tubi dari ${away.name} masih mampu dipatahkan.` });
      events.push({
        minute: 94,
        type: 'GOAL',
        team: 'AWAY',
        score: [1, 1],
        pitchX: 5,
        pitchY: 50,
        textIndonesian: `[90+4'] 💔 GOOOL! Tembakan deflected berbelok arah masuk ke gawang! Skor 1-1! Kedua tim mencetak gol (BTTS Yes)! Taruhan BTTS No HANGUS!`,
        isHeartbreakEvent: true,
      });
      awayGoals = 1;
    } else {
      // Generic heartbreak outcome
      events.push({ minute: 18, type: 'ATTACK', team: 'HOME', score: [0, 0], pitchX: 70, pitchY: 30, textIndonesian: `Serangan terukur dari lini tengah.` });
      events.push({ minute: 33, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL! Gol pembuka diciptakan ${home.name}!` });
      homeGoals = 1;
      events.push({ minute: 45, type: 'HALFTIME', team: 'NEUTRAL', score: [1, 0], pitchX: 50, pitchY: 50, textIndonesian: `Turun minum: 1-0.` });
      events.push({ minute: 62, type: 'GOAL', team: 'AWAY', score: [1, 1], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOL! ${away.name} menyamakan skor 1-1.` });
      awayGoals = 1;
      events.push({
        minute: 93,
        type: 'GOAL',
        team: 'AWAY',
        score: [1, 2],
        pitchX: 5,
        pitchY: 50,
        textIndonesian: `[90+3'] 💔 GOOOL KEMENANGAN! ${away.name} membalikkan kedudukan menjadi 1-2! Taruhan Anda Meleset!`,
        isHeartbreakEvent: true,
      });
      awayGoals = 2;
    }
  } else if (forceWin && userBet) {
    // Guaranteed scripted win
    if (userBet.market === '1X2') {
      if (userBet.selection === 'HOME') {
        homeGoals = 2;
        awayGoals = 0;
        events.push({ minute: 20, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL! ${home.name} 1 - 0 ${away.name}.` });
        events.push({ minute: 75, type: 'GOAL', team: 'HOME', score: [2, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL KEDUA! ${home.name} mengunci skor 2 - 0!` });
      } else if (userBet.selection === 'AWAY') {
        homeGoals = 0;
        awayGoals = 2;
        events.push({ minute: 30, type: 'GOAL', team: 'AWAY', score: [0, 1], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOL! ${away.name} 1 - 0 ${home.name}.` });
        events.push({ minute: 80, type: 'GOAL', team: 'AWAY', score: [0, 2], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOL KEDUA! ${away.name} menggandakan keunggulan!` });
      } else {
        homeGoals = 1;
        awayGoals = 1;
        events.push({ minute: 25, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL! ${home.name} 1 - 0.` });
        events.push({ minute: 60, type: 'GOAL', team: 'AWAY', score: [1, 1], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOL! ${away.name} menyamakan skor 1 - 1.` });
      }
    } else if (userBet.market === 'OVER_UNDER_2_5') {
      if (userBet.selection === 'OVER') {
        homeGoals = 2;
        awayGoals = 1;
        events.push({ minute: 15, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL 1-0.` });
        events.push({ minute: 50, type: 'GOAL', team: 'AWAY', score: [1, 1], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOL 1-1.` });
        events.push({ minute: 78, type: 'GOAL', team: 'HOME', score: [2, 1], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL 2-1 (Over 2.5 Tercapai!).` });
      } else {
        homeGoals = 1;
        awayGoals = 0;
        events.push({ minute: 35, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL 1-0. Pertahanan solid hingga akhir.` });
      }
    } else {
      homeGoals = 2;
      awayGoals = 1;
      events.push({ minute: 20, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL 1-0.` });
      events.push({ minute: 55, type: 'GOAL', team: 'AWAY', score: [1, 1], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOL 1-1.` });
      events.push({ minute: 82, type: 'GOAL', team: 'HOME', score: [2, 1], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOL 2-1.` });
    }
  } else {
    // Fair probabilistic match simulation
    const randH = Math.floor(Math.random() * 3);
    const randA = Math.floor(Math.random() * 3);
    homeGoals = randH;
    awayGoals = randA;

    events.push({ minute: 14, type: 'ATTACK', team: 'HOME', score: [0, 0], pitchX: 70, pitchY: 40, textIndonesian: `Serangan pertama dibangun rapi oleh ${home.name}.` });
    if (homeGoals > 0) {
      events.push({ minute: 26, type: 'GOAL', team: 'HOME', score: [1, 0], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOLLLL!! ${home.name} mencetak gol pembuka!` });
    }
    events.push({ minute: 45, type: 'HALFTIME', team: 'NEUTRAL', score: [homeGoals > 0 ? 1 : 0, 0], pitchX: 50, pitchY: 50, textIndonesian: `Peluit turun minum dibunyikan wasit.` });
    if (awayGoals > 0) {
      events.push({ minute: 63, type: 'GOAL', team: 'AWAY', score: [homeGoals > 0 ? 1 : 0, 1], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOLLLL!! ${away.name} menyamakan kedudukan!` });
    }
    if (homeGoals > 1) {
      events.push({ minute: 79, type: 'GOAL', team: 'HOME', score: [2, awayGoals], pitchX: 95, pitchY: 50, textIndonesian: `⚽ GOOOLLLL KEDUA!! ${home.name} kembali unggul!` });
    }
    if (awayGoals > 1) {
      events.push({ minute: 87, type: 'GOAL', team: 'AWAY', score: [homeGoals, 2], pitchX: 5, pitchY: 50, textIndonesian: `⚽ GOOOLLLL!! Tembakan keras menjebol sudut gawang!` });
    }
  }

  // Fulltime Event
  events.push({
    minute: 95,
    type: 'FULLTIME',
    team: 'NEUTRAL',
    score: [homeGoals, awayGoals],
    pitchX: 50,
    pitchY: 50,
    textIndonesian: `🏁 Peluit panjang berbunyi! Pertandingan berakhir dengan skor akhir ${home.name} ${homeGoals} - ${awayGoals} ${away.name}.`,
  });

  // Sort events chronologically by minute
  events.sort((a, b) => a.minute - b.minute);

  // Evaluate user bet win/loss
  let isWin = false;
  let payout = 0;
  let netProfit = 0;

  if (userBet) {
    const totalGoals = homeGoals + awayGoals;

    if (userBet.market === '1X2') {
      if (userBet.selection === 'HOME' && homeGoals > awayGoals) isWin = true;
      else if (userBet.selection === 'DRAW' && homeGoals === awayGoals) isWin = true;
      else if (userBet.selection === 'AWAY' && homeGoals < awayGoals) isWin = true;
    } else if (userBet.market === 'OVER_UNDER_2_5') {
      if (userBet.selection === 'OVER' && totalGoals > 2.5) isWin = true;
      else if (userBet.selection === 'UNDER' && totalGoals < 2.5) isWin = true;
    } else if (userBet.market === 'BTTS') {
      if (userBet.selection === 'BTTS_YES' && homeGoals > 0 && awayGoals > 0) isWin = true;
      else if (userBet.selection === 'BTTS_NO' && (homeGoals === 0 || awayGoals === 0)) isWin = true;
    } else if (userBet.market === 'EXACT_SCORE') {
      const actualScore = `${homeGoals}-${awayGoals}`;
      if (userBet.selection === actualScore) isWin = true;
    }

    if (isWin) {
      payout = Math.round(userBet.wagerAmount * userBet.odds);
      netProfit = payout - userBet.wagerAmount;
    } else {
      payout = 0;
      netProfit = -userBet.wagerAmount;
    }
  }

  return {
    events,
    finalScore: [homeGoals, awayGoals],
    isWin,
    payout,
    netProfit,
    isHeartbreakTriggered,
    heartbreakMessage,
  };
}
