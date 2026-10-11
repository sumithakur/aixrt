'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  rotation: number;
  rotSpeed: number;
}

export function HeroNightSkyStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Color palette matching AIX brand
    const colors = ['#FFFFFF', '#A855F7', '#00F2FE', '#FF007A', '#E9D5FF'];

    // 1. Ambient Background Stars
    const starsCount = Math.floor((width * height) / 12000);
    const stars: Star[] = [];

    for (let i = 0; i < starsCount; i++) {
      const baseAlpha = 0.2 + Math.random() * 0.6;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.75), // Concentrate in the upper night sky
        radius: 0.6 + Math.random() * 1.4,
        alpha: baseAlpha,
        baseAlpha,
        twinkleSpeed: 0.01 + Math.random() * 0.025,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 2. Interactive Cursor Sparkles / Twinkles
    const sparkles: SparkleParticle[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      // Only generate sparkles if within upper 80% (sky area)
      if (mouseY < height * 0.85) {
        // Spawn 2-4 reactive sparkling stars near cursor
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.3 + Math.random() * 1.2;
          const maxLife = 40 + Math.random() * 35;
          sparkles.push({
            x: mouseX + (Math.random() - 0.5) * 24,
            y: mouseY + (Math.random() - 0.5) * 24,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.2, // slight upward float
            size: 1.2 + Math.random() * 2.2,
            alpha: 1,
            life: maxLife,
            maxLife,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.08,
          });
        }
      }

      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 150);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let time = 0;
    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Render Ambient Stars with sinusoidal twinkle
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + i) * 0.28;
        const currentAlpha = Math.max(0.08, Math.min(1, alpha));

        ctx.save();
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle cross-sparkle on larger stars
        if (star.radius > 1.2 && currentAlpha > 0.6) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.radius * 2, star.y);
          ctx.lineTo(star.x + star.radius * 2, star.y);
          ctx.moveTo(star.x, star.y - star.radius * 2);
          ctx.lineTo(star.x, star.y + star.radius * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render Interactive Cursor Sparkles (4-point star burst)
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const p = sparkles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life--;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Draw 4-point diamond star
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2.5);
        ctx.quadraticCurveTo(0, 0, s * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 2.5);
        ctx.quadraticCurveTo(0, 0, -s * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 2.5);
        ctx.closePath();
        ctx.fill();

        // Central bright core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(moveTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
