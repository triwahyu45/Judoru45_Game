'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  Coins,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Sliders,
  Trash2,
  PlusCircle,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { userDb, UserAccount } from '@/lib/database/userDb';
import { formatIDR } from '@/lib/utils/currency';
import { useGame } from '@/lib/context/GameContext';

export const AdminUserManagement: React.FC = () => {
  const { refreshUser } = useGame();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadUsers = () => {
    const list = userDb.getUsers();
    setUsers([...list]);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOverrideChange = (userId: string, override: 'AUTO' | 'FORCE_WIN' | 'FORCE_LOSE' | 'NEAR_MISS') => {
    userDb.adminSetUserRigged(userId, override);
    loadUsers();
    refreshUser();
    showToast(`Status manipulasi user diperbarui ke: ${override}`);
  };

  const handleAddBalance = (userId: string, amount: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    userDb.adminSetUserBalance(userId, user.balance + amount);
    loadUsers();
    refreshUser();
    showToast(`Berhasil menambah ${formatIDR(amount)} ke saldo ${user.username}`);
  };

  const handleDrainBalance = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    userDb.adminSetUserBalance(userId, 0);
    loadUsers();
    refreshUser();
    showToast(`Saldo ${user.username} berhasil dikuras menjadi Rp 0`);
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (confirm(`Yakin ingin menghapus akun ${username}?`)) {
      userDb.adminDeleteUser(userId);
      loadUsers();
      refreshUser();
      showToast(`Akun ${username} berhasil dihapus dari database`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[#0B111B] border border-[#1E2D44]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Manajemen Database Pengguna Terdaftar ({users.length} Akun)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola data akun, pantau saldo pemain, dan atur manipulasi kemenangan/kekalahan khusus per-user.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="px-3 py-1.5 rounded-xl bg-[#121B2A] hover:bg-[#1A263B] border border-[#1E2D44] text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#1E2D44] bg-[#0B111B] shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#05070B] text-slate-400 font-semibold border-b border-[#1E2D44]">
            <tr>
              <th className="p-3.5">Pemain / ID</th>
              <th className="p-3.5">Saldo Virtual</th>
              <th className="p-3.5">Total Pasang</th>
              <th className="p-3.5">Total Rungkad (Kalah)</th>
              <th className="p-3.5">Manipulasi Bandar (Per User)</th>
              <th className="p-3.5 text-right">Aksi Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2D44]/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#121B2A]/50 transition">
                <td className="p-3.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
                      {u.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <span>{u.name || u.username}</span>
                        <span className="text-[10px] text-slate-500 font-mono">(@{u.username})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                    </div>
                  </div>
                </td>

                <td className="p-3.5">
                  <span className="font-mono font-bold text-gold-gradient text-sm">
                    {formatIDR(u.balance)}
                  </span>
                </td>

                <td className="p-3.5 font-mono text-slate-300">
                  {formatIDR(u.totalWagered)} ({u.roundsPlayed}x main)
                </td>

                <td className="p-3.5 font-mono font-bold text-red-400">
                  {formatIDR(u.totalLost)}
                </td>

                {/* Per-User Rigged Manipulation Select */}
                <td className="p-3.5">
                  <select
                    value={u.riggedOverride || 'AUTO'}
                    onChange={(e) => handleOverrideChange(u.id, e.target.value as any)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition ${
                      u.riggedOverride === 'FORCE_LOSE'
                        ? 'bg-red-950/60 border-red-500/60 text-red-300'
                        : u.riggedOverride === 'FORCE_WIN'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                        : u.riggedOverride === 'NEAR_MISS'
                        ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                        : 'bg-[#05070B] border-[#1E2D44] text-slate-300'
                    }`}
                  >
                    <option value="AUTO">🤖 Auto (Ikuti Global RTP)</option>
                    <option value="FORCE_LOSE">💀 Pasti Rungkad (100% Kalah)</option>
                    <option value="FORCE_WIN">🪝 Pasti Menang (Hook Jackpot)</option>
                    <option value="NEAR_MISS">🎯 Near-Miss Trap (Meleset 1 Angka)</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddBalance(u.id, 500000)}
                      className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition"
                      title="Tambah +Rp 500.000 Saldo"
                    >
                      +500rb
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDrainBalance(u.id)}
                      className="p-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-[11px] font-bold transition"
                      title="Kuras Saldo (Set Rp 0)"
                    >
                      Kuras
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u.id, u.username)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 transition"
                      title="Hapus Akun"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-300 flex items-start space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-purple-200">Hak Prerogatif Master Bandar:</span>
          <p className="text-slate-400 leading-relaxed">
            Anda dapat mengubah status manipulasi pemain secara *real-time*. Jika akun pemain diset ke <strong>&quot;Pasti Rungkad&quot;</strong>, maka semua putaran slot, ledakan roket, dan roda roulette yang dimainkannya akan dipaksa kalah seketika oleh algoritma bandar.
          </p>
        </div>
      </div>
    </div>
  );
};
