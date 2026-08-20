'use client';

import React, { useRef, useEffect } from 'react';

interface RocketCanvasProps {
  multiplier: number;
  isFlying: boolean;
  isCrashed: boolean;
  isCashedOut: boolean;
  crashMultiplier: number;
  cashedOutMultiplier?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export const RocketCanvas: React.FC<RocketCanvasProps> = ({
  multiplier,
  isFlying,
  isCrashed,
  isCashedOut,
  crashMultiplier,
  cashedOutMultiplier,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);

  // Initialize background starfield
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 450,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.8 + 0.2,
        brightness: Math.random() * 0.8 + 0.2,
      });
    }
    starsRef.current = stars;
  }, []);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = Math.min(420, Math.max(300, width * 0.55)));

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(420, Math.max(300, width * 0.55));
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Space Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(0.6, '#080E1E');
      bgGrad.addColorStop(1, '#0C1326');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Moving Stars (Parallax down-left)
      ctx.fillStyle = '#FFFFFF';
      starsRef.current.forEach((star) => {
        if (isFlying) {
          star.x -= star.speed * (1 + (multiplier - 1) * 0.1);
          star.y += star.speed * 0.5;
          if (star.x < 0) star.x = width;
          if (star.y > height) star.y = 0;
        }
        ctx.globalAlpha = star.brightness;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 3. Draw Grid Coordinate Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 4. Calculate Rocket Position (Origin at bottom-left)
      const originX = 40;
      const originY = height - 40;

      // Progress normalized (log scale for smooth visual curve)
      const flightProgress = Math.min(1.0, Math.max(0.0, Math.log(multiplier) / Math.log(20)));
      const rocketX = originX + flightProgress * (width - 120);
      const rocketY = originY - Math.pow(flightProgress, 0.85) * (height - 90);

      // 5. Draw Flight Trajectory Curve (Neon Cyan / Gold Glowing Curve)
      if (multiplier > 1.0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.quadraticCurveTo((originX + rocketX) / 2, originY, rocketX, rocketY);

        ctx.strokeStyle = isCrashed
          ? 'rgba(239, 68, 68, 0.6)'
          : 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 3;
        ctx.shadowColor = isCrashed ? '#EF4444' : '#38BDF8';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Area under curve fill
        ctx.lineTo(rocketX, originY);
        ctx.lineTo(originX, originY);
        ctx.closePath();
        const areaGrad = ctx.createLinearGradient(0, rocketY, 0, originY);
        areaGrad.addColorStop(
          0,
          isCrashed ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.2)'
        );
        areaGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
        ctx.fillStyle = areaGrad;
        ctx.fill();
        ctx.restore();
      }

      // 6. Rocket Thruster Particle Generation
      if (isFlying && !isCrashed) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push({
            x: rocketX - 12 + Math.random() * 4,
            y: rocketY + 8 + Math.random() * 4,
            vx: -(Math.random() * 3 + 2),
            vy: Math.random() * 2 + 1,
            size: Math.random() * 4 + 2,
            color: Math.random() < 0.6 ? '#F59E0B' : '#EF4444',
            alpha: 1.0,
            life: 0,
            maxLife: 20 + Math.random() * 15,
          });
        }
      }

      // Explosion Particles on Crash
      if (isCrashed && particlesRef.current.length < 30) {
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6 + 1;
          particlesRef.current.push({
            x: rocketX,
            y: rocketY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 2,
            color: ['#EF4444', '#F59E0B', '#FCD34D', '#FFFFFF'][Math.floor(Math.random() * 4)],
            alpha: 1.0,
            life: 0,
            maxLife: 35 + Math.random() * 20,
          });
        }
      }

      // Render & Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 7. Draw Rocket Sprite
      if (!isCrashed) {
        ctx.save();
        ctx.translate(rocketX, rocketY);
        // Tilt angle based on ascent
        const angle = -Math.PI / 5;
        ctx.rotate(angle);

        // Rocket Emoji / Drawing
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚀', 0, 0);

        ctx.restore();
      } else {
        // Red Crash Flash Aura
        ctx.save();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💥', rocketX, rocketY);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [multiplier, isFlying, isCrashed]);

  return (
    <div className="relative w-full rounded-3xl bg-[#070B14] border-2 border-cyan-500/40 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px]">
      {/* HTML5 Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Center Multiplier Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-20">
        {isCrashed ? (
          <div className="text-center space-y-1 animate-bounce">
            <span className="text-xs sm:text-sm font-black text-red-400 tracking-widest uppercase bg-red-950/80 px-3 py-1 rounded-full border border-red-500/50">
              FLEW AWAY (CRASHED)
            </span>
            <p className="text-4xl sm:text-6xl md:text-7xl font-black text-red-500 filter drop-shadow-[0_0_25px_#EF4444]">
              {crashMultiplier.toFixed(2)}x
            </p>
          </div>
        ) : isFlying ? (
          <div className="text-center space-y-1">
            <p className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-emerald-400 to-green-400 filter drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">
              {multiplier.toFixed(2)}x
            </p>
            {isCashedOut && (
              <span className="inline-block text-xs font-black text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/50 shadow-lg">
                CASHED OUT @ {cashedOutMultiplier?.toFixed(2)}x!
              </span>
            )}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">
              MENUNGGU TARUHAN DIMULAI
            </p>
            <p className="text-4xl sm:text-5xl font-black text-slate-500">1.00x</p>
          </div>
        )}
      </div>
    </div>
  );
};
