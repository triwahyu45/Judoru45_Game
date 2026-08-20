'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Sliders, ShieldAlert, Zap, Radio, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';
import {
  MatchFixture,
  UserSportsBet,
  MatchEvent,
  generateDefaultFixtures,
  simulateMatchEvents,
} from '@/lib/math/sportsMath';
import { ScoreboardTicker } from '@/components/games/sports/ScoreboardTicker';
import { PitchRadar } from '@/components/games/sports/PitchRadar';
import { CommentaryFeed } from '@/components/games/sports/CommentaryFeed';
import { MatchBoard } from '@/components/games/sports/MatchBoard';
import { BetSlip } from '@/components/games/sports/BetSlip';
import { SettlementModal } from '@/components/games/sports/SettlementModal';

export default function SportsPage() {
  const { balance, placeBet, settleBet, adminConfig } = useGame();

  const [fixtures, setFixtures] = useState<MatchFixture[]>([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>('');
  const [selectedBet, setSelectedBet] = useState<UserSportsBet | null>(null);

  // Live simulation states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentMinute, setCurrentMinute] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<[number, number]>([0, 0]);
  const [activeEvents, setActiveEvents] = useState<MatchEvent[]>([]);
  const [ballPos, setBallPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [activeEventType, setActiveEventType] = useState<MatchEvent['type'] | undefined>(undefined);
  const [activeTeam, setActiveTeam] = useState<'HOME' | 'AWAY' | 'NEUTRAL' | undefined>('NEUTRAL');

  const [simSpeed, setSimSpeed] = useState<'1x' | '2x' | 'instant'>('1x');

  // Settlement modal state
  const [showSettlementModal, setShowSettlementModal] = useState<boolean>(false);
  const [settlementData, setSettlementData] = useState<{
    fixture: MatchFixture;
    bet: UserSportsBet;
    finalScore: [number, number];
    isWin: boolean;
    payout: number;
    netProfit: number;
    isHeartbreakTriggered: boolean;
    heartbreakMessage?: string;
  } | null>(null);

  // Initialize fixtures
  useEffect(() => {
    const defaultFixes = generateDefaultFixtures();
    setFixtures(defaultFixes);
    if (defaultFixes.length > 0) {
      setSelectedFixtureId(defaultFixes[0].id);
    }
  }, []);

  const activeFixture = fixtures.find((f) => f.id === selectedFixtureId) || fixtures[0] || null;

  // Handle wager change in betslip
  const handleUpdateWager = (amount: number) => {
    if (!selectedBet) return;
    setSelectedBet((prev) =>
      prev
        ? {
            ...prev,
            wagerAmount: amount,
            potentialPayout: Math.round(amount * prev.odds),
          }
        : null
    );
  };

  const handleClearBet = () => {
    setSelectedBet(null);
  };

  // Start 90-Minute Fast-Forward Simulation
  const handleStartSimulation = useCallback(() => {
    if (!selectedBet || !activeFixture || isSimulating) return;

    if (balance < selectedBet.wagerAmount) {
      alert('Saldo virtual tidak cukup untuk memasang taruhan ini!');
      return;
    }

    // 1. Deduct balance
    const betPlaced = placeBet('SPORTS', selectedBet.wagerAmount, `Taruhan ${selectedBet.selectionLabel}`);
    if (!betPlaced) return;

    // 2. Generate simulated match timeline
    const simResult = simulateMatchEvents(
      activeFixture,
      selectedBet,
      adminConfig.activeProfile,
      adminConfig
    );

    setIsSimulating(true);
    setIsFinished(false);
    setCurrentMinute(0);
    setCurrentScore([0, 0]);
    setActiveEvents(simResult.events);
    setBallPos({ x: 50, y: 50 });
    setActiveEventType('KICKOFF');
    setActiveTeam('NEUTRAL');

    synthEngine.playWhistle();

    // Instant Mode execution
    if (simSpeed === 'instant') {
      setCurrentMinute(95);
      setCurrentScore(simResult.finalScore);
      setIsSimulating(false);
      setIsFinished(true);

      settleBet({
        gameType: 'SPORTS',
        gameTitle: 'Tebak Skor Bola',
        betAmount: selectedBet.wagerAmount,
        multiplier: selectedBet.odds,
        payout: simResult.payout,
        details: `${activeFixture.homeTeam.shortName} vs ${activeFixture.awayTeam.shortName} | Skor: ${simResult.finalScore[0]}-${simResult.finalScore[1]} | ${selectedBet.selectionLabel}`,
        riggedApplied: simResult.isHeartbreakTriggered,
      });

      if (simResult.isWin) {
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore in tests
        }
      }

      setSettlementData({
        fixture: activeFixture,
        bet: selectedBet,
        finalScore: simResult.finalScore,
        isWin: simResult.isWin,
        payout: simResult.payout,
        netProfit: simResult.netProfit,
        isHeartbreakTriggered: simResult.isHeartbreakTriggered,
        heartbreakMessage: simResult.heartbreakMessage,
      });

      setShowSettlementModal(true);
      return;
    }

    // Timed animation loop (1x = 350ms per step, 2x = 175ms per step)
    const stepIntervalMs = simSpeed === '2x' ? 175 : 350;
    let min = 0;

    const interval = setInterval(() => {
      min += Math.floor(Math.random() * 4) + 2; // jump 2 to 5 minutes each tick

      if (min >= 95) {
        min = 95;
        clearInterval(interval);

        setCurrentMinute(95);
        setCurrentScore(simResult.finalScore);
        setIsSimulating(false);
        setIsFinished(true);

        synthEngine.playWhistle();

        settleBet({
          gameType: 'SPORTS',
          gameTitle: 'Tebak Skor Bola',
          betAmount: selectedBet.wagerAmount,
          multiplier: selectedBet.odds,
          payout: simResult.payout,
          details: `${activeFixture.homeTeam.shortName} vs ${activeFixture.awayTeam.shortName} | Skor: ${simResult.finalScore[0]}-${simResult.finalScore[1]} | ${selectedBet.selectionLabel}`,
          riggedApplied: simResult.isHeartbreakTriggered,
        });

        if (simResult.isWin) {
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }

        setTimeout(() => {
          setSettlementData({
            fixture: activeFixture,
            bet: selectedBet,
            finalScore: simResult.finalScore,
            isWin: simResult.isWin,
            payout: simResult.payout,
            netProfit: simResult.netProfit,
            isHeartbreakTriggered: simResult.isHeartbreakTriggered,
            heartbreakMessage: simResult.heartbreakMessage,
          });
          setShowSettlementModal(true);
        }, 1200);

        return;
      }

      setCurrentMinute(min);

      // Find latest event up to this minute
      const latestEvt = [...simResult.events].reverse().find((e) => e.minute <= min);
      if (latestEvt) {
        setCurrentScore(latestEvt.score);
        setBallPos({ x: latestEvt.pitchX, y: latestEvt.pitchY });
        setActiveEventType(latestEvt.type);
        setActiveTeam(latestEvt.team);

        if (latestEvt.type === 'GOAL' && latestEvt.minute === min) {
          synthEngine.playGoal();
        }
      }
    }, stepIntervalMs);
  }, [
    selectedBet,
    activeFixture,
    isSimulating,
    balance,
    simSpeed,
    placeBet,
    settleBet,
    adminConfig,
  ]);

  return (
    <div className="min-h-screen bg-[#05070B] text-white py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Navigation & Status Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-[#0B111B] border border-slate-800 hover:border-blue-500/40 text-slate-400 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lobby</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                TEBAK SKOR BOLA SPORTSBOOK
              </h1>
              <p className="text-[11px] text-slate-400">
                Simulasi Odds Liga 1 &amp; UCL dengan 90&apos; Fast-Forward Match Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700 text-xs font-semibold text-purple-200 flex items-center space-x-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Sports Rigged</span>
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Scoreboard Banner & Match Center */}
        {activeFixture && (
          <ScoreboardTicker
            homeTeam={activeFixture.homeTeam}
            awayTeam={activeFixture.awayTeam}
            currentMinute={currentMinute}
            score={currentScore}
            isSimulating={isSimulating}
            isFinished={isFinished}
            stadium={activeFixture.stadium}
          />
        )}

        {/* 2. Visual Match Radar & Live Commentary Feed */}
        {activeFixture && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <PitchRadar
                homeTeam={activeFixture.homeTeam}
                awayTeam={activeFixture.awayTeam}
                ballX={ballPos.x}
                ballY={ballPos.y}
                activeEventType={activeEventType}
                activeTeam={activeTeam}
                isSimulating={isSimulating}
              />
            </div>
            <div className="lg:col-span-5">
              <CommentaryFeed events={activeEvents} currentMinute={currentMinute} />
            </div>
          </div>
        )}

        {/* 3. Betting Section: Match Fixtures Board + Bet Slip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <MatchBoard
              fixtures={fixtures}
              selectedBet={selectedBet}
              onSelectBet={setSelectedBet}
              selectedFixtureId={selectedFixtureId}
              onSelectFixture={(fix) => setSelectedFixtureId(fix.id)}
              disabled={isSimulating}
            />
          </div>
          <div className="lg:col-span-4">
            <BetSlip
              selectedBet={selectedBet}
              activeFixture={activeFixture}
              onUpdateWager={handleUpdateWager}
              onClearBet={handleClearBet}
              onStartSimulation={handleStartSimulation}
              isSimulating={isSimulating}
              userBalance={balance}
              simSpeed={simSpeed}
              onSpeedChange={setSimSpeed}
            />
          </div>
        </div>

        {/* 4. Educational Heartbreak & Margin Banner */}
        <div className="p-5 rounded-3xl bg-[#0B111B] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-sm font-bold text-blue-300">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <span>Bagaimana Sportsbook Mengeksploitasi Emosi Pemain (The Heartbreak Trap)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dalam taruhan olahraga online, fenomena kekalahan di menit-menit akhir (90+ injury time) adalah salah satu pemicu terbesar perilaku <em>tilt</em> dan <em>loss chasing</em>. Ketika taruhan yang hampir menang tiba-tiba kandas oleh penalti VAR atau gol menit 94, otak pemain mengalami lonjakan frustrasi akut yang mendorong mereka segera memasang taruhan berikutnya dengan nominal lebih besar.
          </p>
        </div>
      </div>

      {/* 5. Match Settlement Modal */}
      {settlementData && (
        <SettlementModal
          isOpen={showSettlementModal}
          onClose={() => setShowSettlementModal(false)}
          fixture={settlementData.fixture}
          bet={settlementData.bet}
          finalScore={settlementData.finalScore}
          isWin={settlementData.isWin}
          payout={settlementData.payout}
          netProfit={settlementData.netProfit}
          isHeartbreakTriggered={settlementData.isHeartbreakTriggered}
          heartbreakMessage={settlementData.heartbreakMessage}
        />
      )}
    </div>
  );
}
