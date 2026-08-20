'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ticket, BookOpen, Sliders, RefreshCw, Trophy, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';
import {
  TogelTicket,
  generateRiggedTogelDraw,
  evaluateTogelWin,
  breakdownDrawNumber,
} from '@/lib/math/togelMath';
import { BallCageDraw } from '@/components/games/togel/BallCageDraw';
import { NumberPad } from '@/components/games/togel/NumberPad';
import { TicketCart } from '@/components/games/togel/TicketCart';
import { MarketDrawHistory } from '@/components/games/togel/MarketDrawHistory';
import { TogelRulesModal } from '@/components/games/togel/TogelRulesModal';

export default function TogelPage() {
  const { balance, placeBet, settleBet, adminConfig } = useGame();

  const [tickets, setTickets] = useState<TogelTicket[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawnDigits, setDrawnDigits] = useState<(string | null)[]>([null, null, null, null]);
  const [currentDrawNumber, setCurrentDrawNumber] = useState<string | null>(null);
  const [lastRoundResults, setLastRoundResults] = useState<{
    winningNumber: string;
    totalNetBet: number;
    totalPayout: number;
    isWin: boolean;
    isRigged: boolean;
    riggedReason: string;
    nearMissApplied: boolean;
    nearMissDetails?: string;
    ticketOutcomes: {
      ticket: TogelTicket;
      isWin: boolean;
      payout: number;
      description: string;
    }[];
  } | null>(null);

  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Add ticket to cart
  const handleAddTicket = (ticket: TogelTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  // Remove single ticket
  const handleRemoveTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  // Clear all tickets
  const handleClearTickets = () => {
    setTickets([]);
  };

  // Start Live Draw Animation & Evaluation
  const handleStartDraw = useCallback(() => {
    if (tickets.length === 0 || isDrawing) return;

    const totalNetBet = tickets.reduce((sum, t) => sum + t.netBet, 0);
    if (balance < totalNetBet) {
      alert('Saldo virtual tidak cukup untuk memasang semua tiket!');
      return;
    }

    // 1. Deduct balance via placeBet
    const betPlaced = placeBet('TOGEL', totalNetBet, `Undian Togel (${tickets.length} Tiket)`);
    if (!betPlaced) return;

    setIsDrawing(true);
    setDrawnDigits([null, null, null, null]);
    setCurrentDrawNumber(null);
    setLastRoundResults(null);

    // 2. Generate result using mathematical rigged/fair engine
    const drawOutcome = generateRiggedTogelDraw(tickets, adminConfig.activeProfile, adminConfig);
    const winningNum = drawOutcome.winningNumber; // e.g. "8472"

    // 3. Staged Ball Reveal Sequence (AS -> KOP -> KEPALA -> EKOR)
    const asDigit = winningNum[0];
    const kopDigit = winningNum[1];
    const kepalaDigit = winningNum[2];
    const ekorDigit = winningNum[3];

    // AS Reveal (1.2s)
    setTimeout(() => {
      setDrawnDigits([asDigit, null, null, null]);
      synthEngine.playBallReveal();
    }, 1200);

    // KOP Reveal (2.4s)
    setTimeout(() => {
      setDrawnDigits([asDigit, kopDigit, null, null]);
      synthEngine.playBallReveal();
    }, 2400);

    // KEPALA Reveal (3.6s)
    setTimeout(() => {
      setDrawnDigits([asDigit, kopDigit, kepalaDigit, null]);
      synthEngine.playBallReveal();
    }, 3600);

    // EKOR Reveal (4.8s)
    setTimeout(() => {
      setDrawnDigits([asDigit, kopDigit, kepalaDigit, ekorDigit]);
      setCurrentDrawNumber(winningNum);
      synthEngine.playBallReveal();
    }, 4800);

    // 4. Final Settlement & Evaluation (5.8s)
    setTimeout(() => {
      let totalPayout = 0;
      const ticketOutcomes = tickets.map((ticket) => {
        const evalRes = evaluateTogelWin(ticket, winningNum);
        totalPayout += evalRes.payout;
        return {
          ticket,
          isWin: evalRes.isWin,
          payout: evalRes.payout,
          description: evalRes.matchDescription,
        };
      });

      const isWin = totalPayout > 0;

      // Settle in GameContext
      settleBet({
        gameType: 'TOGEL',
        gameTitle: 'Togel 4D Lottery',
        betAmount: totalNetBet,
        multiplier: totalNetBet > 0 ? +(totalPayout / totalNetBet).toFixed(2) : 0,
        payout: totalPayout,
        details: `Draw: ${winningNum} | ${isWin ? 'JACKPOT!' : 'Kalah'} | ${tickets.length} Tiket`,
        riggedApplied: drawOutcome.isRigged,
      });

      if (isWin) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas-confetti is not loaded in test env
        }
      }

      setLastRoundResults({
        winningNumber: winningNum,
        totalNetBet,
        totalPayout,
        isWin,
        isRigged: drawOutcome.isRigged,
        riggedReason: drawOutcome.riggedReason,
        nearMissApplied: drawOutcome.nearMissApplied,
        nearMissDetails: drawOutcome.nearMissDetails,
        ticketOutcomes,
      });

      setIsDrawing(false);
    }, 5800);
  }, [tickets, isDrawing, balance, placeBet, settleBet, adminConfig]);

  return (
    <div className="min-h-screen bg-[#05070B] text-white py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Navigation & Status Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-2.5 rounded-2xl bg-[#0B111B] border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lobby</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">TOGEL 4D LOTTERY SIMULATOR</h1>
              <p className="text-[11px] text-slate-400">Pasaran Indonesia 4D / 3D / 2D / Colok / Shio</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-purple-300 flex items-center space-x-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Matematika &amp; Payout</span>
          </button>
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700 text-xs font-semibold text-purple-200 flex items-center space-x-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Rigged</span>
          </Link>
        </div>
      </div>

      {/* Main Game Interface Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Top Mechanical Ball Cage Draw Machine */}
        <BallCageDraw
          isDrawing={isDrawing}
          drawnDigits={drawnDigits}
          currentDrawNumber={currentDrawNumber}
          nearMissApplied={lastRoundResults?.nearMissApplied}
          nearMissDetails={lastRoundResults?.nearMissDetails}
          isWin={lastRoundResults?.isWin}
          totalPayout={lastRoundResults?.totalPayout}
        />

        {/* 2. Interactive Betting Section (NumberPad + TicketCart) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <NumberPad onAddTicket={handleAddTicket} disabled={isDrawing} />
          </div>
          <div className="lg:col-span-5">
            <TicketCart
              tickets={tickets}
              onRemoveTicket={handleRemoveTicket}
              onClearTickets={handleClearTickets}
              onStartDraw={handleStartDraw}
              isDrawing={isDrawing}
              userBalance={balance}
            />
          </div>
        </div>

        {/* 3. Detailed Round Result Modal / Breakdown */}
        {lastRoundResults && !isDrawing && (
          <div className="rounded-3xl bg-[#0B111B] border border-purple-500/40 p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Hasil Pemeriksaan Tiket Anda</h3>
                  <p className="text-xs text-slate-400">
                    Undian Keluar: <span className="font-mono font-bold text-purple-300">{lastRoundResults.winningNumber}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Total Hadiah Dimenangkan</div>
                <div className="text-lg font-mono font-black text-emerald-400">
                  {formatIDR(lastRoundResults.totalPayout)}
                </div>
              </div>
            </div>

            {/* Individual Ticket Result List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lastRoundResults.ticketOutcomes.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-2 text-xs ${
                    item.isWin
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{item.ticket.type} ({item.ticket.numbers})</span>
                      {item.isWin && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          MENANG
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                  </div>
                  <div className="text-right font-mono font-bold">
                    {item.isWin ? (
                      <span className="text-emerald-400">+{formatIDR(item.payout)}</span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Educational Rigged Insight */}
            <div className="p-4 rounded-2xl bg-[#060910] border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-purple-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Analisis Algoritma Bandar:</span>
              </div>
              <p className="text-slate-400">
                {lastRoundResults.riggedReason}.{' '}
                {lastRoundResults.isWin
                  ? 'Kemenangan terjadi, namun secara jangka panjang (Law of Large Numbers), house edge 29%-70% akan menyedot habis modal pemain.'
                  : 'Peluang 4D adalah 0.01% (1 per 10.000). Bandar memanfaatkan ilusi diskon untuk menarik volume taruhan.'}
              </p>
            </div>
          </div>
        )}

        {/* 4. Historical Market Draw Feed */}
        <MarketDrawHistory />
      </div>

      {/* Rules & Educational Modal */}
      <TogelRulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
    </div>
  );
}
