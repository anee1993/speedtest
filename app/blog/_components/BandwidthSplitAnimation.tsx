"use client";

import { useEffect, useRef } from "react";

export default function BandwidthSplitAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    let frame = 0;
    let rafId: number;

    const PIPE_X = 30;
    const PIPE_W = W - 60;
    const TOTAL_BW = 100; // 100 Mbps

    const activities = [
      { label: "4K Stream", mbps: 25, color: "#60a5fa" },
      { label: "4K Stream", mbps: 25, color: "#818cf8" },
      { label: "Zoom Call", mbps: 8, color: "#34d399" },
      { label: "Gaming", mbps: 5, color: "#fbbf24" },
      { label: "Browsing", mbps: 10, color: "#f87171" },
      { label: "Free", mbps: 27, color: "#1e293b" },
    ];

    function draw() {
      rafId = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Title
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("100 Mbps shared across a household", W / 2, 16);

      // Draw the pipe segments
      const pipeY = 32;
      const pipeH = 36;
      let offsetX = PIPE_X;

      // Animated fill: segments grow in over time
      const progress = Math.min(1, frame / 60);

      for (const act of activities) {
        const segW = (act.mbps / TOTAL_BW) * PIPE_W * progress;
        ctx.fillStyle = act.color;
        ctx.fillRect(offsetX, pipeY, segW, pipeH);

        // Label (only if segment is wide enough)
        if (segW > 30 && act.label !== "Free") {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 8px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(act.label, offsetX + segW / 2, pipeY + pipeH / 2 - 4);
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.font = "8px system-ui";
          ctx.fillText(`${act.mbps} Mbps`, offsetX + segW / 2, pipeY + pipeH / 2 + 8);
        }
        offsetX += segW;
      }

      // Pipe border
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(PIPE_X, pipeY, PIPE_W * progress, pipeH);

      // Capacity marker
      if (progress >= 1) {
        const usedPct = ((TOTAL_BW - 27) / TOTAL_BW) * 100;
        ctx.fillStyle = "#94a3b8";
        ctx.font = "9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${usedPct.toFixed(0)}% used — ${27} Mbps headroom`, W / 2, pipeY + pipeH + 16);

        // Animated pulse on the "free" section to show it's available
        const pulseAlpha = 0.1 + Math.sin(frame * 0.05) * 0.05;
        const freeX = PIPE_X + ((TOTAL_BW - 27) / TOTAL_BW) * PIPE_W;
        ctx.fillStyle = `rgba(52, 211, 153, ${pulseAlpha})`;
        ctx.fillRect(freeX, pipeY, (27 / TOTAL_BW) * PIPE_W, pipeH);
      }
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]">
      <canvas ref={canvasRef} width={400} height={90} className="w-full h-auto bg-[#0f172a]" />
      <p className="text-[0.65rem] text-slate-500 text-center py-2 bg-[#0f172a]">
        Family of 4 using 73 Mbps of a 100 Mbps connection — tight but workable
      </p>
    </div>
  );
}
