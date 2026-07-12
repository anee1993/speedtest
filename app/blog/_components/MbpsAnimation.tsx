"use client";

import { useEffect, useRef } from "react";

export default function MbpsAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const W = canvas.width;
    const H = canvas.height;
    let frame = 0;
    let rafId: number;

    // Bits flowing in a pipe, grouping into bytes
    const bits: { x: number; y: number; speed: number; grouped: boolean }[] = [];
    const PIPE_Y = H / 2;
    const PIPE_H = 40;
    const GROUP_X = W * 0.6; // where bits form a byte

    function spawnBit() {
      bits.push({
        x: -10,
        y: PIPE_Y - PIPE_H / 2 + Math.random() * PIPE_H,
        speed: 1.5 + Math.random() * 0.5,
        grouped: false,
      });
    }

    function draw() {
      rafId = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Pipe
      ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
      ctx.fillRect(0, PIPE_Y - PIPE_H / 2, W, PIPE_H);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, PIPE_Y - PIPE_H / 2, W, PIPE_H);

      // Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("1 bit each", W * 0.25, PIPE_Y - PIPE_H / 2 - 8);
      ctx.fillText("8 bits = 1 Byte", W * 0.75, PIPE_Y - PIPE_H / 2 - 8);

      // Divider line
      ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(GROUP_X, PIPE_Y - PIPE_H / 2 - 4);
      ctx.lineTo(GROUP_X, PIPE_Y + PIPE_H / 2 + 4);
      ctx.stroke();
      ctx.setLineDash([]);

      // Speed labels at bottom
      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 12px system-ui, sans-serif";
      ctx.fillText("100 Megabits/sec", W * 0.25, PIPE_Y + PIPE_H / 2 + 20);
      ctx.fillStyle = "#a78bfa";
      ctx.fillText("12.5 Megabytes/sec", W * 0.75, PIPE_Y + PIPE_H / 2 + 20);
      ctx.fillStyle = "#64748b";
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText("÷ 8", GROUP_X, PIPE_Y + PIPE_H / 2 + 20);

      // Spawn bits
      if (frame % 4 === 0) spawnBit();

      // Update and draw bits
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.x += b.speed;

        if (b.x > W + 10) { bits.splice(i, 1); continue; }

        // Before grouping — small blue dots (individual bits)
        if (b.x < GROUP_X) {
          ctx.fillStyle = "#60a5fa";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // After grouping — larger purple squares (bytes)
          if (!b.grouped) {
            b.grouped = true;
            b.y = PIPE_Y; // snap to center
            b.speed = b.speed * 0.7; // slower (fewer units per sec)
          }
          ctx.fillStyle = "#a78bfa";
          ctx.fillRect(b.x - 5, b.y - 5, 10, 10);
          // "8" label inside
          ctx.fillStyle = "#fff";
          ctx.font = "bold 7px system-ui";
          ctx.textAlign = "center";
          ctx.fillText("8", b.x, b.y + 3);
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
        100 Mbps = 12.5 MB/s — same speed, different units
      </p>
    </div>
  );
}
