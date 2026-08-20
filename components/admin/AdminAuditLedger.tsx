'use client';

import React, { useState, useMemo } from 'react';
import {
  Eye,
  Download,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  FileCode,
  ShieldAlert,
  Flame,
  Bomb,
  CircleDot,
  Dices,
  Ticket,
  Trophy,
  Layers,
} from 'lucide-react';
import { Transaction } from '@/lib/context/GameContext';
import { formatIDR } from '@/lib/utils/currency';

interface AdminAuditLedgerProps {
  transactions: Transaction[];
}

export const AdminAuditLedger: React.FC<AdminAuditLedgerProps> = ({ transactions }) => {
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all'); // all, win, loss
  const [selectedRigged, setSelectedRigged] = useState<string>('all'); // all, rigged, natural
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Game filter
      if (selectedGame !== 'all' && tx.gameType !== selectedGame) {
        return false;
      }
      // Status filter
      if (selectedStatus === 'win' && !tx.isWin) return false;
      if (selectedStatus === 'loss' && tx.isWin) return false;

      // Rigged filter
      if (selectedRigged === 'rigged' && !tx.riggedApplied) return false;
      if (selectedRigged === 'natural' && tx.riggedApplied) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.gameTitle.toLowerCase().includes(q);
        const matchesDetails = tx.details.toLowerCase().includes(q);
        const matchesId = tx.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDetails && !matchesId) return false;
      }

      return true;
    });
  }, [transactions, selectedGame, selectedStatus, selectedRigged, searchQuery]);

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredTransactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `judoru45_audit_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Timestamp (ISO)',
      'Game Type',
      'Game Title',
      'Bet Amount (IDR)',
      'Multiplier (x)',
      'Payout (IDR)',
      'Net Profit (IDR)',
      'Balance After (IDR)',
      'Result',
      'Rigged Applied',
      'Details',
    ];

    const rows = filteredTransactions.map((tx) => [
      `"${tx.id}"`,
      `"${new Date(tx.timestamp).toISOString()}"`,
      `"${tx.gameType}"`,
      `"${tx.gameTitle}"`,
      tx.betAmount,
      tx.multiplier,
      tx.payout,
      tx.netProfit,
      tx.balanceAfter,
      tx.isWin ? '"WIN"' : '"LOSS"',
      tx.riggedApplied ? '"YES"' : '"NO"',
      `"${(tx.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `judoru45_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Controls */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Live Transaction Audit Ledger ({filteredTransactions.length} dari {transactions.length} Data)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Audit log real-time membongkar setiap putaran permainan dan intervensi algoritma bandar.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              disabled={filteredTransactions.length === 0}
              className="px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-300 text-xs font-bold flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <FileCode className="w-4 h-4" />
              <span>Ekspor JSON</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#1E2D44]">
          
          {/* Game Select */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Filter Permainan:</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#05070B] border border-[#1E2D44] text-xs text-slate-200 outline-none focus:border-purple-500"
            >
              <option value="all">Semua Permainan (6 Game)</option>
              <option value="slot">Olympus Slot</option>
              <option value="crash">Crash Rocket</option>
              <option value="roulette">European Roulette</option>
              <option value="dice">Dice Roll</option>
              <option value="togel">Togel 4D</option>
              <option value="sportsbook">Tebak Skor Bola</option>
            </select>
          </div>

          {/* Outcome Select */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Hasil Putaran:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#05070B] border border-[#1E2D44] text-xs text-slate-200 outline-none focus:border-purple-500"
            >
              <option value="all">Semua Hasil (Menang & Kalah)</option>
              <option value="win">Hanya Menang (Payout &gt; 0)</option>
              <option value="loss">Hanya Kalah (Modal Hangus)</option>
            </select>
          </div>

          {/* Rigged Select */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Status Intervensi:</label>
            <select
              value={selectedRigged}
              onChange={(e) => setSelectedRigged(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#05070B] border border-[#1E2D44] text-xs text-slate-200 outline-none focus:border-purple-500"
            >
              <option value="all">Semua Status</option>
              <option value="rigged">Hanya Dimanipulasi Bandar</option>
              <option value="natural">Alami (Tanpa Manipulasi)</option>
            </select>
          </div>

          {/* Search Query */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Pencarian Teks:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari detail / ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-3 rounded-xl bg-[#05070B] border border-[#1E2D44] text-xs text-slate-200 outline-none focus:border-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>
      </div>

      {/* Ledger Table / List */}
      <div className="p-6 rounded-2xl bg-[#0B111B] border border-[#1E2D44] space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              Tidak ada transaksi yang cocok dengan kriteria filter saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-[#1E2D44] text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-3 pr-4">Waktu</th>
                  <th className="pb-3 pr-4">Permainan</th>
                  <th className="pb-3 pr-4">Taruhan (Bet)</th>
                  <th className="pb-3 pr-4">Multiplier</th>
                  <th className="pb-3 pr-4">Payout</th>
                  <th className="pb-3 pr-4">Net Profit</th>
                  <th className="pb-3 pr-4">Saldo Akhir</th>
                  <th className="pb-3 pr-4">Status Rigged</th>
                  <th className="pb-3">Detail & Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D44]/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#05070B]/60 transition">
                    <td className="py-3 pr-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="py-3 pr-4 font-bold text-white whitespace-nowrap">
                      {tx.gameTitle}
                    </td>
                    <td className="py-3 pr-4 font-mono font-semibold text-slate-300 whitespace-nowrap">
                      {formatIDR(tx.betAmount)}
                    </td>
                    <td className="py-3 pr-4 font-mono text-purple-300 whitespace-nowrap">
                      {tx.multiplier}x
                    </td>
                    <td className="py-3 pr-4 font-mono font-bold whitespace-nowrap">
                      {tx.isWin ? (
                        <span className="text-emerald-400">+{formatIDR(tx.payout)}</span>
                      ) : (
                        <span className="text-slate-500">Rp 0</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono font-bold whitespace-nowrap">
                      {tx.netProfit > 0 ? (
                        <span className="text-emerald-400">+{formatIDR(tx.netProfit)}</span>
                      ) : (
                        <span className="text-red-400">{formatIDR(tx.netProfit)}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono text-slate-300 whitespace-nowrap">
                      {formatIDR(tx.balanceAfter)}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {tx.riggedApplied ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          Manipulasi Bandar
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                          Alami
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-[11px] text-slate-400 max-w-xs truncate">
                      {tx.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminAuditLedger;
