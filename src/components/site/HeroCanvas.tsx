"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; vx: number; vy: number; r: number; a: number };

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts: Point[] = [];
    const N = 64;
    let W = 0;
    let H = 0;
    let raf = 0;
    const mouse = { x: 0.5, y: 0.5, active: false };
    let running = true;

    function readAccent() {
      const s = getComputedStyle(document.documentElement);
      return {
        accent: s.getPropertyValue("--accent").trim() || "#c6623a",
        ink: s.getPropertyValue("--ink").trim() || "#1a1815",
      };
    }

    function size() {
      if (!canvas || !ctx) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      size();
      pts.length = 0;
      for (let i = 0; i < N; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1.5 + Math.random() * 2.5,
          a: 0.3 + Math.random() * 0.5,
        });
      }
    }

    function toHex2(n: number) {
      return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    }

    function frame() {
      if (!running || !ctx) return;
      const { accent, ink } = readAccent();
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const alpha = (1 - d2 / (120 * 120)) * 0.28;
            ctx.strokeStyle = `${ink}${toHex2(alpha * 255)}`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (mouse.active) {
        const mx = mouse.x * W;
        const my = mouse.y * H;
        ctx.strokeStyle = accent + "66";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 120, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        if (mouse.active) {
          const mx = mouse.x * W;
          const my = mouse.y * H;
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 200) {
            p.vx += (dx / d) * 0.02;
            p.vy += (dy / d) * 0.02;
          }
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vx += (Math.random() - 0.5) * 0.03;
        p.vy += (Math.random() - 0.5) * 0.03;

        ctx.fillStyle = accent;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = ink + "22";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(W * 0.55, H * 0.5, Math.min(W, H) * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W * 0.55, H * 0.5, Math.min(W, H) * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      raf = requestAnimationFrame(frame);
    }

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
      mouse.active = mouse.x >= -0.2 && mouse.x <= 1.2 && mouse.y >= -0.2 && mouse.y <= 1.2;
    }
    function onLeave() {
      mouse.active = false;
    }

    init();
    frame();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-art" aria-hidden="true" />;
}
