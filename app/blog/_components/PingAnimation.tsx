"use client";

import { useEffect, useRef } from "react";

export default function PingAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const W = canvas.width;
    const H = canvas.height;
    let rafId: number;

    const DEVICE_X = 60;
    const SERVER_X = W - 60;
    const MID_Y = H / 2;

    interface Packet {
      x: number;
      goingRight: boolean;
      startTime: number;
      speed: number;
    }

    let packets: Packet[] = [];
    let lastSpawn = 0;
    let displayMs = 0;
    let startTime = performance.now();

    function draw(now: number) {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Connection line
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(DEVICE_X + 20, MID_Y);
      ctx.lineTo(SERVER_X - 20, MID_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Device (left)
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(DEVICE_X - 18, MID_Y - 22, 36, 44);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(DEVICE_X - 18, MID_Y - 22, 36, 44);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("You", DEVICE_X, MID_Y + 36);

      // Screen glow
      ctx.fillStyle = "#334155";
      ctx.fillRect(DEVICE_X - 13, MID_Y - 17, 26, 30);

      // Server (right)
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(SERVER_X - 16, MID_Y - 25, 32, 50);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(SERVER_X - 16, MID_Y - 25, 32, 50);
      // Server LEDs
      ctx.fillStyle = "#34d399";
      ctx.beginPath(); ctx.arc(SERVER_X - 6, MID_Y - 15, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath(); ctx.arc(SERVER_X + 4, MID_Y - 15, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px system-ui";
      ctx.fillText("Server", SERVER_X, MID_Y + 36);

      // Spawn packet every 2 seconds
      if (now - lastSpawn > 2000) {
        packets.push({ x: DEVICE_X + 22, goingRight: true, startTime: now, speed: 3 });
        lastSpawn = now;
        startTime = now;
      }

      // Update packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if (p.goingRight) {
          p.x += p.speed;
          if (p.x >= SERVER_X - 22) {
            p.goingRight = false; // bounce back
          }
        } else {
          p.x -= p.speed;
          if (p.x <= DEVICE_X + 22) {
            displayMs = Math.round(now - p.startTime) / 10; // scaled for visual
            packets.splice(i, 1);
            continue;
          }
        }

        // Draw packet
        ctx.fillStyle = p.goingRight ? "#60a5fa" : "#34d399";
        ctx.beginPath();
        ctx.arc(p.x, MID_Y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        ctx.fillStyle = p.goingRight ? "rgba(96,165,250,0.3)" : "rgba(52,211,153,0.3)";
        const trailDir = p.goingRight ? -1 : 1;
        for (let t = 1; t <= 3; t++) {
          ctx.beginPath();
          ctx.arc(p.x + trailDir * t * 8, MID_Y, 3 - t * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Timer display
      const elapsed = packets.length > 0 ? Math.round((now - startTime) / 10) : displayMs;
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${elapsed || displayMs} ms`, W / 2, H - 10);

      // Labels
      ctx.fillStyle = "#60a5fa";
      ctx.font = "9px system-ui";
      ctx.fillText("→ Request", W / 2 - 40, MID_Y - 14);
      ctx.fillStyle = "#34d399";
      ctx.fillText("← Response", W / 2 + 40, MID_Y - 14);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]">
      <canvas ref={canvasRef} width={400} height={100} className="w-full h-auto bg-[#0f172a]" />
      <p className="text-[0.65rem] text-slate-500 text-center py-2 bg-[#0f172a]">
        Ping = round-trip time from your device to the server and back
      </p>
    </div>
  );
}
