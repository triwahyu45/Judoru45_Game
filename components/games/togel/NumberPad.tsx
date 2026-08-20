'use client';

import React, { useState, useMemo } from 'react';
import { Dices, PlusCircle, Delete, Sparkles, Tag, Check, Info } from 'lucide-react';
import {
  TogelBetType,
  TOGEL_RULES,
  SHIO_LIST,
  validateTogelNumber,
  calculateTicketCost,
  generateQuickPick,
  TogelTicket,
} from '@/lib/math/togelMath';
import { formatIDR } from '@/lib/utils/currency';
import { synthEngine } from '@/lib/sound/synthEngine';

interface NumberPadProps {
  onAddTicket: (ticket: TogelTicket) => void;
  disabled?: boolean;
}

const BET_TYPES: TogelBetType[] = [
  '4D',
  '3D',
  '2D_BELAKANG',
  '2D_DEPAN',
  '2D_TENGAH',
  'COLOK_BEBAS',
  'COLOK_MACAU',
  'COLOK_NAGA',
  'SHIO',
];

const PRESET_BETS = [1000, 5000, 10000, 25000, 50000, 100000];

export const NumberPad: React.FC<NumberPadProps> = ({ onAddTicket, disabled = false }) => {
  const [activeType, setActiveType] = useState<TogelBetType>('4D');
  const [numberInput, setNumberInput] = useState<string>('');
  const [grossAmount, setGrossAmount] = useState<number>(10000);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeRule = TOGEL_RULES[activeType];

  // Cost calculation
  const costCalc = useMemo(() => {
    return calculateTicketCost(activeType, grossAmount);
  }, [activeType, grossAmount]);

  const handleTypeChange = (type: TogelBetType) => {
    setActiveType(type);
    setNumberInput('');
    setErrorMessage(null);
    setSuccessMessage(null);
    synthEngine.playClick();
  };

  const handleDigitPress = (digit: string) => {
    if (disabled) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    // Limit input length based on bet type
    if (activeType === '4D' && numberInput.length >= 4) return;
    if (activeType === '3D' && numberInput.length >= 3) return;
    if (
      (activeType === '2D_BELAKANG' || activeType === '2D_DEPAN' || activeType === '2D_TENGAH') &&
      numberInput.length >= 2
    )
      return;
    if (activeType === 'COLOK_BEBAS' && numberInput.length >= 1) return;
    if (activeType === 'COLOK_MACAU' && numberInput.replace(/\D/g, '').length >= 2) return;
    if (activeType === 'COLOK_NAGA' && numberInput.replace(/\D/g, '').length >= 3) return;

    synthEngine.playClick();

    if (activeType === 'COLOK_MACAU') {
      const currentDigits = numberInput.replace(/\D/g, '');
      if (currentDigits.length === 0) setNumberInput(digit);
      else if (currentDigits.length === 1 && currentDigits !== digit) {
        setNumberInput(`${currentDigits}, ${digit}`);
      }
      return;
    }

    if (activeType === 'COLOK_NAGA') {
      const currentDigits = numberInput.replace(/\D/g, '');
      if (currentDigits.length === 0) setNumberInput(digit);
      else if (currentDigits.length === 1 && !currentDigits.includes(digit)) {
        setNumberInput(`${currentDigits}, ${digit}`);
      } else if (currentDigits.length === 2 && !currentDigits.includes(digit)) {
        setNumberInput(`${currentDigits[0]}, ${currentDigits[1]}, ${digit}`);
      }
      return;
    }

    setNumberInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (disabled) return;
    synthEngine.playClick();
    if (activeType === 'COLOK_MACAU' || activeType === 'COLOK_NAGA') {
      const digits = numberInput.replace(/\D/g, '');
      if (digits.length <= 1) setNumberInput('');
      else {
        const remaining = digits.slice(0, -1).split('').join(', ');
        setNumberInput(remaining);
      }
    } else {
      setNumberInput((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (disabled) return;
    synthEngine.playClick();
    setNumberInput('');
    setErrorMessage(null);
  };

  const handleQuickPick = () => {
    if (disabled) return;
    synthEngine.playClick();
    const pick = generateQuickPick(activeType);
    setNumberInput(pick);
    setErrorMessage(null);
  };

  const handleShioSelect = (shioName: string) => {
    if (disabled) return;
    synthEngine.playClick();
    setNumberInput(shioName);
    setErrorMessage(null);
  };

  const handleAddTicket = () => {
    if (disabled) return;

    const validation = validateTogelNumber(activeType, numberInput);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Nomor tidak valid');
      return;
    }

    if (grossAmount < 1000) {
      setErrorMessage('Minimal taruhan adalah Rp 1.000');
      return;
    }

    const ticket: TogelTicket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: activeType,
      numbers: validation.formatted,
      grossBet: grossAmount,
      discountPercent: costCalc.discountPercent,
      discountAmount: costCalc.discountAmount,
      netBet: costCalc.netAmount,
      potentialPayout: costCalc.potentialPayout,
      createdAt: Date.now(),
    };

    onAddTicket(ticket);
    synthEngine.playCoin();

    setSuccessMessage(`Tiket ${activeRule.shortName} (${validation.formatted}) ditambahkan!`);
    setNumberInput('');
    setErrorMessage(null);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);
  };

  return (
    <div className="rounded-3xl bg-[#0B111B] border border-slate-800 p-6 space-y-6 shadow-xl">
      {/* Bet Type Category Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>1. Pilih Tipe Pasaran Togel</span>
          <span className="text-purple-400 text-[11px] normal-case">
            Diskon hingga {Math.max(...Object.values(TOGEL_RULES).map((r) => r.discountPercent))}%
          </span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {BET_TYPES.map((type) => {
            const rule = TOGEL_RULES[type];
            const isSelected = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`p-2.5 rounded-xl text-center border transition-all ${
                  isSelected
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/25 font-bold'
                    : 'bg-[#121A2A] border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="text-xs font-black">{rule.shortName}</div>
                <div className="text-[10px] text-purple-200/80 font-medium">
                  {rule.payoutMultiplier}x | Disc {rule.discountPercent}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description Banner for Selected Type */}
      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-purple-300">{activeRule.name}:</span> {activeRule.description}.{' '}
          <span className="text-slate-400">Peluang matematis: {activeRule.winProbabilityText}</span>
        </div>
      </div>

      {/* Number Input & Display Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>2. Masukkan Angka Tebakan</span>
          <button
            type="button"
            onClick={handleQuickPick}
            disabled={disabled}
            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Pick / Acak</span>
          </button>
        </div>

        {activeType === 'SHIO' ? (
          /* Shio Interactive Grid */
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
            {SHIO_LIST.map((shio) => {
              const isSelected = numberInput.toUpperCase() === shio.name.toUpperCase();
              return (
                <button
                  key={shio.id}
                  type="button"
                  onClick={() => handleShioSelect(shio.name)}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    isSelected
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                      : 'bg-[#121A2A] border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{shio.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{shio.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {shio.numbers.slice(0, 3).join(', ')}...
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Standard Digit Display & Number Pad */
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder={`Contoh: ${activeRule.example}`}
                disabled={disabled}
                className="w-full bg-[#070B12] border-2 border-purple-500/40 rounded-2xl px-4 py-3.5 text-center text-2xl font-mono font-black text-purple-200 tracking-widest focus:outline-none focus:border-purple-400 placeholder:text-slate-700"
              />
            </div>

            {/* Interactive Numeric Pad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => {
                const isClear = btn === 'C';
                const isBackspace = btn === '⌫';

                return (
                  <button
                    key={btn}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (isClear) handleClear();
                      else if (isBackspace) handleBackspace();
                      else handleDigitPress(btn);
                    }}
                    className={`py-3 rounded-xl font-bold text-base transition-all border ${
                      isClear
                        ? 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
                        : isBackspace
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-[#121A2A] border-slate-700/80 text-white hover:bg-slate-700 active:scale-95'
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bet Amount & Indonesian Discount Breakdown */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>3. Nominal Taruhan & Diskon</span>
          <span className="text-emerald-400 font-mono">Diskon {costCalc.discountPercent}%</span>
        </div>

        {/* Preset Amount Chips */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_BETS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setGrossAmount(amt);
                synthEngine.playClick();
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                grossAmount === amt
                  ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                  : 'bg-[#121A2A] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {formatIDR(amt)}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Nominal Bet:</span>
          <input
            type="number"
            min="1000"
            step="1000"
            value={grossAmount}
            onChange={(e) => setGrossAmount(Math.max(1000, parseInt(e.target.value) || 0))}
            className="flex-1 bg-[#070B12] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Live Calculation Receipt Box */}
        <div className="p-3.5 rounded-2xl bg-[#070B12] border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Nilai Taruhan Kotor:</span>
            <span className="font-mono text-slate-300">{formatIDR(costCalc.grossAmount)}</span>
          </div>
          <div className="flex justify-between text-emerald-400">
            <span>Diskon Pasar ({costCalc.discountPercent}%):</span>
            <span className="font-mono font-semibold">-{formatIDR(costCalc.discountAmount)}</span>
          </div>
          <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800 text-sm">
            <span>Bayar Bersih (Net):</span>
            <span className="font-mono text-amber-400">{formatIDR(costCalc.netAmount)}</span>
          </div>
          <div className="flex justify-between text-purple-400 font-bold text-xs pt-1">
            <span>Potensi Hadiah ({activeRule.payoutMultiplier}x):</span>
            <span className="font-mono text-purple-300">{formatIDR(costCalc.potentialPayout)}</span>
          </div>
        </div>
      </div>

      {/* Error / Success Feedback */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Ticket Button */}
      <button
        type="button"
        disabled={disabled || !numberInput}
        onClick={handleAddTicket}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        <PlusCircle className="w-4 h-4" />
        <span>TAMBAH KE KERANJANG TIKET</span>
      </button>
    </div>
  );
};
