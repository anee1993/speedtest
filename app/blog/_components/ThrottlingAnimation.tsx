"use client";

import { useEffect, useRef } from "react";

export default function ThrottlingAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    let frame = 0;
    let rafId: number;

    // Two gauges: without VPN (throttled) and with VPN (full speed)
    const GAUGE_R = 38;
    const LEFT_X = W * 0.28;
    const RIGHT_X = W * 0.72;
    const GAUGE_Y = H * 0.5;

    function drawGauge(cx: number, cy: number, value: number, maxVal: number, label: string, speedLabel: string, color: string) {
      const pct = value / maxVal;
      const startAngle = Math.PI * 0.75;
      const endAngle = Math.PI * 2.25;
      const valueAngle = startAngle + (endAngle - startAngle) * pct;

      // Background arc
      ctx.beginPath();
      ctx.arc(cx, cy, GAUGE_R, startAngle, endAngle);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.stroke();

      // Value arc
      ctx.beginPath();
      ctx.arc(cx, cy, GAUGE_R, startAngle, valueAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.stroke();

      // Glow
      ctx.beginPath();
      ctx.arc(cx, cy, GAUGE_R, startAngle, valueAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Speed text
      ctx.fillStyle = color;
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(speedLabel, cx, cy + 4);

      // Label below
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px system-ui";
      ctx.fillText(label, cx, cy + GAUGE_R + 16);
    }

    function draw() {
      rafId = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Animate values with slight fluctuation
      const throttledSpeed = 15 + Math.sin(frame * 0.03) * 3; // ~12-18 Mbps (throttled)
      const fullSpeed = 95 + Math.sin(frame * 0.02) * 5; // ~90-100 Mbps (full)

      // Title
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("ISP Throttling Detection: VPN Comparison", W / 2, 14);

      // Draw gauges
      drawGauge(LEFT_X, GAUGE_Y, throttledSpeed, 100, "Without VPN", `${Math.round(throttledSpeed)} Mbps`, "#f87171");
      drawGauge(RIGHT_X, GAUGE_Y, fullSpeed, 100, "With VPN", `${Math.round(fullSpeed)} Mbps`, "#34d399");

      // VS divider
      ctx.fillStyle = "#475569";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("vs", W / 2, GAUGE_Y + 4);

      // Verdict
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 9px system-ui";
      ctx.fillText("⚠ Throttling detected — VPN restores full speed", W / 2, H - 8);
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]">
      <canvas ref={canvasRef} width={400} height={130} className="w-full h-auto bg-[#0f172a]" />
      <p className="text-[0.65rem] text-slate-500 text-center py-2 bg-[#0f172a]">
        If speed jumps dramatically with a VPN, your ISP is likely throttling specific traffic
      </p>
    </div>
  );
}
