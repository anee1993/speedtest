"use client";

import { useEffect, useRef } from "react";

export default function JitterAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const W = canvas.width;
    const H = canvas.height;
    let frame = 0;
    let rafId: number;

    // Two lanes: stable (top) and jittery (bottom)
    const LANE_Y1 = H * 0.3;
    const LANE_Y2 = H * 0.7;
    const LANE_H = 6;

    interface Dot { x: number; targetX: number; lane: number }
    const stableDots: Dot[] = [];
    const jitterDots: Dot[] = [];

    const SPACING_STABLE = 24; // even spacing
    let nextStableX = W + 10;
    let nextJitterX = W + 10;

    function draw() {
      rafId = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Lane lines
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, LANE_Y1); ctx.lineTo(W, LANE_Y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, LANE_Y2); ctx.lineTo(W, LANE_Y2); ctx.stroke();

      // Labels
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 10px system-ui";
      ctx.textAlign = "left";
      ctx.fillText("Low jitter (stable)", 8, LANE_Y1 - 12);
      ctx.fillStyle = "#f87171";
      ctx.fillText("High jitter (unstable)", 8, LANE_Y2 - 12);

      // Ping values
      ctx.fillStyle = "#64748b";
      ctx.font = "9px system-ui";
      ctx.textAlign = "right";
      ctx.fillText("30ms  30ms  31ms  30ms  29ms", W - 8, LANE_Y1 - 12);
      ctx.fillText("12ms  68ms  25ms  82ms  41ms", W - 8, LANE_Y2 - 12);

      // Spawn stable dots (evenly spaced)
      if (frame % 12 === 0) {
        stableDots.push({ x: W + 5, targetX: W + 5, lane: 1 });
      }

      // Spawn jittery dots (randomly spaced)
      if (frame % 12 === 0) {
        const jitterOffset = (Math.random() - 0.5) * 30; // random timing variation
        jitterDots.push({ x: W + 5 + jitterOffset, targetX: W + 5, lane: 2 });
      }

      // Draw and move stable dots
      for (let i = stableDots.length - 1; i >= 0; i--) {
        stableDots[i].x -= 1.5;
        if (stableDots[i].x < -10) { stableDots.splice(i, 1); continue; }
        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.arc(stableDots[i].x, LANE_Y1, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and move jittery dots (with vertical wobble)
      for (let i = jitterDots.length - 1; i >= 0; i--) {
        jitterDots[i].x -= 1.5 + (Math.random() - 0.5) * 0.8; // speed variation
        if (jitterDots[i].x < -10) { jitterDots.splice(i, 1); continue; }
        const wobble = Math.sin(frame * 0.3 + i) * 6; // vertical wobble
        ctx.fillStyle = "#f87171";
        ctx.beginPath();
        ctx.arc(jitterDots[i].x, LANE_Y2 + wobble, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gap indicators for jitter lane
      if (jitterDots.length >= 2) {
        for (let i = 0; i < jitterDots.length - 1; i++) {
          const gap = Math.abs(jitterDots[i].x - jitterDots[i + 1].x);
          if (gap > 30) {
            // Draw gap highlight
            const midX = (jitterDots[i].x + jitterDots[i + 1].x) / 2;
            ctx.fillStyle = "rgba(248, 113, 113, 0.15)";
            ctx.fillRect(jitterDots[i + 1].x, LANE_Y2 - 10, gap, 20);
          }
        }
      }
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]">
      <canvas ref={canvasRef} width={400} height={120} className="w-full h-auto bg-[#0f172a]" />
      <p className="text-[0.65rem] text-slate-500 text-center py-2 bg-[#0f172a]">
        Low jitter = packets arrive evenly. High jitter = erratic, unpredictable timing.
      </p>
    </div>
  );
}
