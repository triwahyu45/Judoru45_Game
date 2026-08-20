'use client';

import React, { useState } from 'react';
import { Trophy, ChevronRight, Hash, CheckCircle2 } from 'lucide-react';
import {
  MatchFixture,
  SportsLeague,
  SportsBetMarket,
  UserSportsBet,
} from '@/lib/math/sportsMath';
import { synthEngine } from '@/lib/sound/synthEngine';

interface MatchBoardProps {
  fixtures: MatchFixture[];
  selectedBet: UserSportsBet | null;
  onSelectBet: (bet: UserSportsBet) => void;
  selectedFixtureId: string;
  onSelectFixture: (fixture: MatchFixture) => void;
  disabled?: boolean;
}

export const MatchBoard: React.FC<MatchBoardProps> = ({
  fixtures,
  selectedBet,
  onSelectBet,
  selectedFixtureId,
  onSelectFixture,
  disabled = false,
}) => {
  const [activeLeague, setActiveLeague] = useState<SportsLeague>('LIGA_1');
  const [exactScoreOpenFixtureId, setExactScoreOpenFixtureId] = useState<string | null>(null);

  const filteredFixtures = fixtures.filter((f) => f.league === activeLeague);

  const handleOddsClick = (
    fixture: MatchFixture,
    market: SportsBetMarket,
    selection: string,
    selectionLabel: string,
    odds: number
  ) => {
    if (disabled) return;
    synthEngine.playClick();
    onSelectFixture(fixture);

    const defaultWager = selectedBet?.wagerAmount || 50000;
    const bet: UserSportsBet = {
      matchId: fixture.id,
      market,
      selection,
      selectionLabel,
      odds,
      wagerAmount: defaultWager,
      potentialPayout: Math.round(defaultWager * odds),
    };
    onSelectBet(bet);
  };

  return (
    <div className="rounded-3xl bg-[#0B111B] border border-slate-800 p-6 space-y-6 shadow-xl">
      {/* Header & League Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Papan Pasaran &amp; Odds Pertandingan
            </h2>
            <p className="text-xs text-slate-400">Pilih liga dan pasang taruhan odds real-time</p>
          </div>
        </div>

        {/* League Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveLeague('LIGA_1');
              synthEngine.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeLeague === 'LIGA_1'
                ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                : 'bg-[#121A2A] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🇮🇩 BRI Liga 1
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveLeague('CHAMPIONS_LEAGUE');
              synthEngine.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeLeague === 'CHAMPIONS_LEAGUE'
                ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                : 'bg-[#121A2A] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Champions League
          </button>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredFixtures.map((fixture) => {
          const isSelectedFixture = selectedFixtureId === fixture.id;
          const home = fixture.homeTeam;
          const away = fixture.awayTeam;
          const odds = fixture.odds;

          return (
            <div
              key={fixture.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-4 ${
                isSelectedFixture
                  ? 'bg-[#10192D] border-blue-500/60 shadow-lg shadow-blue-500/10'
                  : 'bg-[#0E1524] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Fixture Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs">
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="font-semibold text-slate-300">{fixture.stadium}</span>
                  <span>•</span>
                  <span>{fixture.matchDate}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {fixture.leagueName}
                </span>
              </div>

              {/* Teams Presentation */}
              <div className="flex items-center justify-between gap-2 py-1">
                {/* Home */}
                <div className="flex items-center space-x-3 w-5/12">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs border border-white/20 shrink-0"
                    style={{ backgroundColor: home.primaryColor }}
                  >
                    {home.shortName}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{home.name}</h4>
                    <div className="flex space-x-1 mt-0.5">
                      {home.form.map((f, i) => (
                        <span
                          key={i}
                          className={`w-3.5 h-3.5 rounded text-[9px] font-bold flex items-center justify-center ${
                            f === 'W'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : f === 'D'
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-slate-600 font-bold text-sm">VS</span>

                {/* Away */}
                <div className="flex items-center justify-end space-x-3 w-5/12 text-right">
                  <div>
                    <h4 className="font-bold text-white text-sm">{away.name}</h4>
                    <div className="flex justify-end space-x-1 mt-0.5">
                      {away.form.map((f, i) => (
                        <span
                          key={i}
                          className={`w-3.5 h-3.5 rounded text-[9px] font-bold flex items-center justify-center ${
                            f === 'W'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : f === 'D'
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs border border-white/20 shrink-0"
                    style={{ backgroundColor: away.primaryColor }}
                  >
                    {away.shortName}
                  </div>
                </div>
              </div>

              {/* Betting Markets Grid */}
              <div className="space-y-2.5 pt-2">
                {/* 1. 1X2 Full Time Result */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: `1 (${home.shortName})`, sel: 'HOME', odds: odds.homeWin },
                    { label: 'X (Draw)', sel: 'DRAW', odds: odds.draw },
                    { label: `2 (${away.shortName})`, sel: 'AWAY', odds: odds.awayWin },
                  ].map((btn) => {
                    const isSelected =
                      selectedBet?.matchId === fixture.id &&
                      selectedBet?.market === '1X2' &&
                      selectedBet?.selection === btn.sel;

                    return (
                      <button
                        key={btn.sel}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          handleOddsClick(fixture, '1X2', btn.sel, `1X2: ${btn.label}`, btn.odds)
                        }
                        className={`p-2 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md'
                            : 'bg-[#090E1A] border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-[11px] text-slate-400">{btn.label}</div>
                        <div className="text-xs font-mono font-black text-amber-300">
                          {btn.odds.toFixed(2)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 2. Over / Under 2.5 & BTTS Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      market: 'OVER_UNDER_2_5' as SportsBetMarket,
                      label: 'Over 2.5 Gol',
                      sel: 'OVER',
                      odds: odds.over25,
                    },
                    {
                      market: 'OVER_UNDER_2_5' as SportsBetMarket,
                      label: 'Under 2.5 Gol',
                      sel: 'UNDER',
                      odds: odds.under25,
                    },
                    {
                      market: 'BTTS' as SportsBetMarket,
                      label: 'BTTS: Ya',
                      sel: 'BTTS_YES',
                      odds: odds.bttsYes,
                    },
                    {
                      market: 'BTTS' as SportsBetMarket,
                      label: 'BTTS: Tidak',
                      sel: 'BTTS_NO',
                      odds: odds.bttsNo,
                    },
                  ].map((btn) => {
                    const isSelected =
                      selectedBet?.matchId === fixture.id &&
                      selectedBet?.market === btn.market &&
                      selectedBet?.selection === btn.sel;

                    return (
                      <button
                        key={btn.sel}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          handleOddsClick(fixture, btn.market, btn.sel, btn.label, btn.odds)
                        }
                        className={`p-2 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md'
                            : 'bg-[#090E1A] border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-[11px] text-slate-400">{btn.label}</div>
                        <div className="text-xs font-mono font-black text-amber-300">
                          {btn.odds.toFixed(2)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 3. Tebak Skor Tepat (Correct Score Expandable) */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setExactScoreOpenFixtureId((prev) => (prev === fixture.id ? null : fixture.id));
                      synthEngine.playClick();
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-[#090E1A] hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-blue-300 flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center space-x-1.5">
                      <Hash className="w-3.5 h-3.5" />
                      <span>Pasaran Tebak Skor Tepat (Correct Score)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {exactScoreOpenFixtureId === fixture.id ? 'Tutup Pilihan ▲' : 'Buka Pilihan ▼'}
                    </span>
                  </button>

                  {exactScoreOpenFixtureId === fixture.id && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-3 rounded-xl bg-[#060910] border border-slate-800 mt-2 animate-in fade-in">
                      {Object.entries(odds.exactScores).map(([scoreStr, scOdds]) => {
                        const isSelected =
                          selectedBet?.matchId === fixture.id &&
                          selectedBet?.market === 'EXACT_SCORE' &&
                          selectedBet?.selection === scoreStr;

                        return (
                          <button
                            key={scoreStr}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                              handleOddsClick(
                                fixture,
                                'EXACT_SCORE',
                                scoreStr,
                                `Skor Tepat: ${scoreStr}`,
                                scOdds
                              )
                            }
                            className={`p-1.5 rounded-lg border text-center transition-all ${
                              isSelected
                                ? 'bg-blue-600 border-blue-400 text-white font-bold'
                                : 'bg-[#101726] border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div className="font-mono font-bold text-xs">{scoreStr}</div>
                            <div className="text-[10px] text-amber-400 font-mono">
                              {scOdds.toFixed(2)}x
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
