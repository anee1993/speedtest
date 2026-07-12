"use client";

import { useEffect, useRef } from "react";

export default function FiberCableDslAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    let frame = 0;
    let rafId: number;

    interface Packet { x: number; speed: number; size: number }

    const lanes = [
      { label: "Fiber", y: 25, color: "#34d399", speed: 4, pipeW: 16, packets: [] as Packet[] },
      { label: "Cable", y: 65, color: "#60a5fa", speed: 2.5, pipeW: 12, packets: [] as Packet[] },
      { label: "DSL",   y: 105, color: "#f87171", speed: 1, pipeW: 6, packets: [] as Packet[] },
    ];

    // Cable congestion simulation
    let cableSlow = false;
    let congestionTimer = 0;

    function draw() {
      rafId = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Congestion toggle for cable every ~180 frames
      congestionTimer++;
      if (congestionTimer > 180) {
        cableSlow = !cableSlow;
        congestionTimer = 0;
      }

      for (const lane of lanes) {
        const currentSpeed = (lane.label === "Cable" && cableSlow) ? lane.speed * 0.4 : lane.speed;

        // Pipe background
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fillRect(60, lane.y - lane.pipeW / 2, W - 80, lane.pipeW);
        ctx.strokeStyle = lane.color + "44";
        ctx.lineWidth = 1;
        ctx.strokeRect(60, lane.y - lane.pipeW / 2, W - 80, lane.pipeW);

        // Label
        ctx.fillStyle = lane.color;
        ctx.font = "bold 10px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(lane.label, 4, lane.y + 4);

        // Speed label on right
        const speedLabel = lane.label === "Cable" && cableSlow ? "Congested!" : `${lane.label === "Fiber" ? "1000" : lane.label === "Cable" ? "300" : "50"} Mbps`;
        ctx.fillStyle = (lane.label === "Cable" && cableSlow) ? "#fbbf24" : "#64748b";
        ctx.font = "9px system-ui";
        ctx.textAlign = "right";
        ctx.fillText(speedLabel, W - 6, lane.y + 4);

        // Spawn packets
        if (frame % Math.round(8 / currentSpeed) === 0) {
          lane.packets.push({ x: 60, speed: currentSpeed, size: Math.min(lane.pipeW - 2, 6) });
        }

        // Draw packets
        for (let i = lane.packets.length - 1; i >= 0; i--) {
          const p = lane.packets[i];
          p.x += p.speed;
          if (p.x > W - 20) { lane.packets.splice(i, 1); continue; }

          ctx.fillStyle = lane.color;
          ctx.beginPath();
          ctx.arc(p.x, lane.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Congestion indicator for cable
      if (cableSlow) {
        ctx.fillStyle = "rgba(251, 191, 36, 0.08)";
        ctx.fillRect(60, lanes[1].y - lanes[1].pipeW / 2 - 2, W - 80, lanes[1].pipeW + 4);
      }
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]">
      <canvas ref={canvasRef} width={400} height={130} className="w-full h-auto bg-[#0f172a]" />
      <p className="text-[0.65rem] text-slate-500 text-center py-2 bg-[#0f172a]">
        Fiber is fastest and most consistent. Cable slows during peak hours. DSL is limited but stable.
      </p>
    </div>
  );
}
