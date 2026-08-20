'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ROULETTE_WHEEL_NUMBERS,
  getNumberColor,
  PocketColor,
  RouletteNumber,
} from '@/lib/math/rouletteMath';
import { synthEngine } from '@/lib/sound/synthEngine';

interface RouletteWheelProps {
  isSpinning: boolean;
  targetPocket: number | null;
  onSpinComplete: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isSpinning,
  targetPocket,
  onSpinComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const spinStateRef = useRef<{
    wheelAngle: number;
    ballAngle: number;
    ballRadiusProgress: number; // 0 (outer rim) to 1 (pocket lock)
    startTime: number | null;
    duration: number;
    startWheelAngle: number;
    targetWheelAngle: number;
    startBallAngle: number;
    targetBallAngle: number;
    lastTickPocket: number;
    bouncesLeft: number;
    isComplete: boolean;
  }>({
    wheelAngle: 0,
    ballAngle: 0,
    ballRadiusProgress: 0,
    startTime: null,
    duration: 4500, // 4.5 seconds
    startWheelAngle: 0,
    targetWheelAngle: 0,
    startBallAngle: 0,
    targetBallAngle: 0,
    lastTickPocket: -1,
    bouncesLeft: 3,
    isComplete: false,
  });

  const [highlightPocket, setHighlightPocket] = useState<number | null>(null);

  // Draw static/dynamic wheel on Canvas
  const drawWheel = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      wheelAngle: number,
      ballAngle: number,
      ballProgress: number,
      spinning: boolean
    ) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.46;
      const pocketCount = 37;
      const anglePerPocket = (Math.PI * 2) / pocketCount;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // 1. Outer Mahogany / Brass Beveled Rim
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      const outerRimGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.85,
        centerX,
        centerY,
        radius
      );
      outerRimGrad.addColorStop(0, '#1E140A');
      outerRimGrad.addColorStop(0.5, '#4A2E16');
      outerRimGrad.addColorStop(0.85, '#D4AF37'); // Gold brass rim
      outerRimGrad.addColorStop(1, '#1A0E05');
      ctx.fillStyle = outerRimGrad;
      ctx.fill();
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 2. Ball Track Ring (Smooth Dark Track)
      const trackRadius = radius * 0.88;
      ctx.beginPath();
      ctx.arc(centerX, centerY, trackRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#080C14';
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Rotating Wheel Group
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(wheelAngle);

      // Pockets Ring
      const pocketOuterR = radius * 0.82;
      const pocketInnerR = radius * 0.54;

      ROULETTE_WHEEL_NUMBERS.forEach((num, index) => {
        const startAngle = index * anglePerPocket - Math.PI / 2 - anglePerPocket / 2;
        const endAngle = startAngle + anglePerPocket;
        const color = getNumberColor(num);

        ctx.beginPath();
        ctx.arc(0, 0, pocketOuterR, startAngle, endAngle);
        ctx.arc(0, 0, pocketInnerR, endAngle, startAngle, true);
        ctx.closePath();

        if (num === highlightPocket) {
          ctx.fillStyle = '#FDE047'; // Bright Highlight
        } else if (color === 'green') {
          ctx.fillStyle = '#059669'; // Emerald 0
        } else if (color === 'red') {
          ctx.fillStyle = '#DC2626'; // Crimson Red
        } else {
          ctx.fillStyle = '#111827'; // Midnight Black
        }
        ctx.fill();

        // Silver / Brass Fret Separator
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pocket Number Text
        ctx.save();
        const midAngle = startAngle + anglePerPocket / 2;
        ctx.rotate(midAngle + Math.PI / 2);
        ctx.translate(0, -pocketInnerR - (pocketOuterR - pocketInnerR) * 0.48);

        ctx.font = `bold ${Math.max(10, Math.floor(radius * 0.08))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = num === highlightPocket ? '#000000' : '#FFFFFF';
        ctx.fillText(num.toString(), 0, 0);
        ctx.restore();
      });

      // 4. Inner Brass Cone / Turret Base
      ctx.beginPath();
      ctx.arc(0, 0, pocketInnerR, 0, Math.PI * 2);
      const innerGoldGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, pocketInnerR);
      innerGoldGrad.addColorStop(0, '#FFFBEB');
      innerGoldGrad.addColorStop(0.3, '#F59E0B');
      innerGoldGrad.addColorStop(0.7, '#78350F');
      innerGoldGrad.addColorStop(1, '#D97706');
      ctx.fillStyle = innerGoldGrad;
      ctx.fill();
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 8-Spoke Golden Center Turret Cross
      for (let i = 0; i < 8; i++) {
        const spokeAngle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(spokeAngle) * (pocketInnerR * 0.75), Math.sin(spokeAngle) * (pocketInnerR * 0.75));
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Center Diamond Dome
      ctx.beginPath();
      ctx.arc(0, 0, pocketInnerR * 0.28, 0, Math.PI * 2);
      const domeGrad = ctx.createRadialGradient(
        -pocketInnerR * 0.08,
        -pocketInnerR * 0.08,
        2,
        0,
        0,
        pocketInnerR * 0.28
      );
      domeGrad.addColorStop(0, '#FFFFFF');
      domeGrad.addColorStop(0.5, '#F59E0B');
      domeGrad.addColorStop(1, '#451A03');
      ctx.fillStyle = domeGrad;
      ctx.fill();
      ctx.restore(); // Restore Rotating Group

      // 5. The Ball Physics (Orbiting / Spiraling / Bouncing)
      if (spinning || ballProgress > 0) {
        // Radius interpolates from outer rim track to exact pocket circle
        const startBallR = trackRadius * 0.94;
        const targetBallR = pocketInnerR + (pocketOuterR - pocketInnerR) * 0.5;
        const currentBallR = startBallR - (startBallR - targetBallR) * Math.pow(ballProgress, 1.8);

        const ballX = centerX + Math.cos(ballAngle) * currentBallR;
        const ballY = centerY + Math.sin(ballAngle) * currentBallR;
        const ballSize = Math.max(5, radius * 0.045);

        // Ball Shadow
        ctx.beginPath();
        ctx.arc(ballX + 2, ballY + 3, ballSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fill();

        // Glowing Ivory Ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        const ballGrad = ctx.createRadialGradient(
          ballX - ballSize * 0.3,
          ballY - ballSize * 0.3,
          1,
          ballX,
          ballY,
          ballSize
        );
        ballGrad.addColorStop(0, '#FFFFFF');
        ballGrad.addColorStop(0.7, '#E2E8F0');
        ballGrad.addColorStop(1, '#94A3B8');
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    },
    [highlightPocket]
  );

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = 360;
    const height = 360;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (!isSpinning) {
      // Static render
      drawWheel(
        ctx,
        width,
        height,
        spinStateRef.current.wheelAngle,
        spinStateRef.current.ballAngle,
        spinStateRef.current.ballRadiusProgress,
        false
      );
      return;
    }

    // Initialize Spin Parameters
    const pocketIndex =
      targetPocket !== null
        ? ROULETTE_WHEEL_NUMBERS.indexOf(targetPocket as RouletteNumber)
        : 0;
    const anglePerPocket = (Math.PI * 2) / 37;

    // The target angle for pocket to land at top/indicator
    const targetPocketAngle = -(pocketIndex * anglePerPocket);
    const extraWheelRevolutions = 4 * Math.PI * 2;
    const extraBallRevolutions = -6 * Math.PI * 2; // Counter-clockwise ball rotation

    const state = spinStateRef.current;
    state.startTime = performance.now();
    state.startWheelAngle = state.wheelAngle % (Math.PI * 2);
    state.targetWheelAngle = state.startWheelAngle + extraWheelRevolutions + targetPocketAngle;

    state.startBallAngle = state.ballAngle % (Math.PI * 2);
    state.targetBallAngle = state.startBallAngle + extraBallRevolutions + targetPocketAngle;
    state.ballRadiusProgress = 0;
    state.lastTickPocket = -1;
    state.bouncesLeft = 3;
    state.isComplete = false;
    setHighlightPocket(null);

    let lastTickTime = 0;

    const animate = (time: number) => {
      if (!state.startTime) state.startTime = time;
      const elapsed = time - state.startTime;
      const t = Math.min(1, elapsed / state.duration);

      // Quintic Ease-Out curve for realistic heavy friction deceleration
      // f(t) = 1 - (1 - t)^5
      const easeOutQuint = 1 - Math.pow(1 - t, 5);

      state.wheelAngle = state.startWheelAngle + (state.targetWheelAngle - state.startWheelAngle) * easeOutQuint;
      state.ballAngle = state.startBallAngle + (state.targetBallAngle - state.startBallAngle) * easeOutQuint;
      state.ballRadiusProgress = easeOutQuint;

      // Audio: Tick sound as ball flies over pockets
      const speedRatio = 1 - easeOutQuint;
      const tickInterval = Math.max(40, 250 * (1 - speedRatio));
      if (time - lastTickTime > tickInterval && speedRatio > 0.05) {
        synthEngine.playRouletteBall(Math.max(0.4, speedRatio * 1.5));
        lastTickTime = time;
      }

      drawWheel(ctx, width, height, state.wheelAngle, state.ballAngle, state.ballRadiusProgress, true);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin Complete
        state.wheelAngle = state.targetWheelAngle % (Math.PI * 2);
        state.ballAngle = state.targetBallAngle % (Math.PI * 2);
        state.ballRadiusProgress = 1;
        setHighlightPocket(targetPocket);
        synthEngine.playWin(1);
        drawWheel(ctx, width, height, state.wheelAngle, state.ballAngle, 1, false);
        onSpinComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSpinning, targetPocket, drawWheel, onSpinComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-[#070D18] rounded-3xl border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.15)]">
      {/* Top Center Pointer / Needle */}
      <div className="absolute top-2 z-20 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[16px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]" />
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: '360px', height: '360px' }}
        className="max-w-full aspect-square cursor-default select-none"
      />

      {/* Wheel Status Footer */}
      <div className="mt-2 text-center">
        <span className="text-[11px] uppercase tracking-widest font-bold text-amber-300/80">
          European Single Zero (37 Pockets)
        </span>
      </div>
    </div>
  );
};

export default RouletteWheel;
