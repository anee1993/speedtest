"use client";

import { useRef, useState, useEffect, useCallback } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const DL_URL = "https://speed.cloudflare.com/__down?bytes=100000000";
const UL_URL = "https://speed.cloudflare.com/__up";

const FORMS = [
  { name: "—", minMbps: 0, aura: null, rings: 0, lightning: false, imgFilter: "none", hairColor: "#ffff00" },
  { name: "KAIOKEN", minMbps: 1, aura: ["#ff3300", "#ff6600", "#ff1100"], rings: 1, lightning: false, imgFilter: "drop-shadow(0 0 10px #ff4400) drop-shadow(0 0 4px #ff0000)", hairColor: "#1a1a1a" },
  { name: "SUPER SAIYAN", minMbps: 20, aura: ["#ffe600", "#ffaa00", "#fff4aa"], rings: 2, lightning: true, imgFilter: "drop-shadow(0 0 14px #ffe600) drop-shadow(0 0 28px #ffaa00)", hairColor: "#ffe600" },
  { name: "SUPER SAIYAN 2", minMbps: 80, aura: ["#ffffff", "#ffe600", "#ffdd44"], rings: 3, lightning: true, imgFilter: "drop-shadow(0 0 18px #fff) drop-shadow(0 0 36px #ffe600)", hairColor: "#fff4aa" },
  { name: "SSJ GOD", minMbps: 150, aura: ["#ff3366", "#ff6644", "#ffaa88"], rings: 2, lightning: false, imgFilter: "drop-shadow(0 0 14px #ff3366) drop-shadow(0 0 28px #ff4444)", hairColor: "#cc2244" },
  { name: "SUPER SAIYAN BLUE", minMbps: 250, aura: ["#00cfff", "#0077ff", "#aaddff"], rings: 3, lightning: true, imgFilter: "drop-shadow(0 0 18px #00cfff) drop-shadow(0 0 36px #0055ff)", hairColor: "#00ccff" },
  { name: "ULTRA INSTINCT", minMbps: 500, aura: ["#ffffff", "#ccccff", "#e8e8ff"], rings: 4, lightning: true, imgFilter: "drop-shadow(0 0 22px #fff) drop-shadow(0 0 44px #ccccff)", hairColor: "#e0e0f0" },
];

const LABEL_COLORS: Record<string, string> = {
  "—": "#475569", KAIOKEN: "#ff4400", "SUPER SAIYAN": "#ffe600",
  "SUPER SAIYAN 2": "#ffffff", "SSJ GOD": "#ff3366", "SUPER SAIYAN BLUE": "#00aaff", "ULTRA INSTINCT": "#ccccff",
};

function getForm(mbps: number) {
  let f = FORMS[0];
  for (const form of FORMS) { if (mbps >= form.minMbps) f = form; }
  return f;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/")) return "Opera";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Unknown";
}
function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  return "Unknown";
}

async function getIPInfo() {
  try {
    const res = await fetch("https://ipinfo.io/json?token=");
    const d = await res.json();
    return { ip: d.ip || "—", isp: d.org || "—", region: d.city ? `${d.city}, ${d.region}` : "—" };
  } catch {
    try {
      const r2 = await fetch("https://api.ipify.org?format=json");
      const d2 = await r2.json();
      return { ip: d2.ip || "—", isp: "—", region: "—" };
    } catch { return { ip: "—", isp: "—", region: "—" }; }
  }
}

function computeHealth(dl: number, ul: number, ping: number, jitter: number) {
  let score = 100;
  if (dl < 5) score -= 30; else if (dl < 15) score -= 15; else if (dl < 50) score -= 5;
  if (ul < 2) score -= 25; else if (ul < 10) score -= 10; else if (ul < 20) score -= 3;
  if (ping > 100) score -= 20; else if (ping > 50) score -= 10; else if (ping > 30) score -= 5;
  if (jitter > 30) score -= 15; else if (jitter > 15) score -= 8; else if (jitter > 5) score -= 3;
  return Math.max(0, Math.min(100, score));
}

function getSuitableTags(dl: number, ul: number, ping: number) {
  const t: string[] = [];
  if (dl >= 25 && ping < 60) t.push("4K Streaming");
  if (dl >= 5) t.push("HD Streaming");
  if (ping < 40 && dl >= 15) t.push("Gaming");
  if (dl >= 5 && ul >= 3 && ping < 80) t.push("Video Calls");
  if (dl >= 50) t.push("Large Downloads");
  if (dl >= 10 && ul >= 5 && ping < 60) t.push("Remote Work");
  return t;
}

function getRecommendations(dl: number, ul: number, ping: number, jitter: number) {
  const r: string[] = [];
  if (ping < 20) r.push("Your latency is excellent for gaming.");
  else if (ping > 80) r.push("High latency — gaming and video calls may suffer.");
  if (jitter > 20) r.push("Jitter is elevated — connection may feel inconsistent.");
  else if (jitter < 5) r.push("Very low jitter — stable connection.");
  if (ul < 5) r.push("Upload speed is lower than expected for video conferencing.");
  if (dl >= 100) r.push("Download speed is excellent for all activities.");
  else if (dl < 10) r.push("Download speed may be too slow for 4K streaming.");
  if (dl >= 25 && ul >= 10 && ping < 40) r.push("Your connection is ideal for video conferencing.");
  return r;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function SpeedTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gokuRef = useRef<HTMLDivElement>(null);
  const hairElementsRef = useRef<SVGElement[]>([]);

  const [dlSpeed, setDlSpeed] = useState<string>("–");
  const [ulSpeed, setUlSpeed] = useState<string>("–");
  const [pingMs, setPingMs] = useState<string>("–");
  const [jitterMs, setJitterMs] = useState<string>("–");
  const [dlRank, setDlRank] = useState("");
  const [ulRank, setUlRank] = useState("");
  const [status, setStatusText] = useState("Ready to test your speed");
  const [progress, setProgressVal] = useState(0);
  const [formLabel, setFormLabel] = useState("—");
  const [formColor, setFormColor] = useState("#475569");
  const [btnText, setBtnText] = useState("START TEST");
  const [testing, setTesting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{ key: string; val: string }[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [healthColor, setHealthColor] = useState("#34d399");
  const [tags, setTags] = useState<string[]>([]);
  const [recs, setRecs] = useState<string[]>([]);

  // Refs for animation loop
  const liveMbpsRef = useRef(0);
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // ── Load SVG inline so we can manipulate hair color ──
  useEffect(() => {
    const container = gokuRef.current;
    if (!container) return;
    fetch("/Goku.svg")
      .then(r => r.text())
      .then(svgText => {
        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (svg) {
          svg.style.width = "100%";
          svg.style.height = "100%";
          svg.style.position = "absolute";
          svg.style.inset = "0";
          svg.style.objectFit = "contain";
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
        // Find all elements with yellow hair fill (#ffff00)
        const allPaths = container.querySelectorAll("path, polygon, ellipse, rect, circle");
        const hairEls: SVGElement[] = [];
        allPaths.forEach(el => {
          const style = el.getAttribute("style") || "";
          const fill = el.getAttribute("fill") || "";
          if (style.includes("fill:#ffff00") || style.includes("fill: #ffff00") || fill === "#ffff00") {
            hairEls.push(el as SVGElement);
          }
        });
        hairElementsRef.current = hairEls;
      })
      .catch(() => {
        // Fallback: just show the img
        container.innerHTML = '<img src="/Goku.svg" alt="Goku" style="width:100%;height:100%;object-fit:contain;" />';
      });
  }, []);

  // ── Canvas aura animation ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0, pulse = 0, pulseDir = 1, lastNow: number | null = null;

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();
    window.addEventListener("resize", resize);

    function loop(now: number) {
      rafRef.current = requestAnimationFrame(loop);
      if (!ctx || !canvas) return;
      const dt = lastNow ? Math.min((now - lastNow) / 1000, 0.05) : 0;
      lastNow = now;
      t += dt;
      pulse += pulseDir * dt * (1.4 + liveMbpsRef.current / 100);
      if (pulse > 1) { pulse = 1; pulseDir = -1; }
      if (pulse < 0) { pulse = 0; pulseDir = 1; }

      const form = runningRef.current ? getForm(liveMbpsRef.current) : FORMS[0];

      // Update form label
      setFormLabel(form.name);
      setFormColor(LABEL_COLORS[form.name] || "#fff");

      // Update goku filter + hair color
      if (gokuRef.current) {
        const svg = gokuRef.current.querySelector("svg");
        if (svg) svg.style.filter = form.imgFilter;
      }
      // Change hair color directly on SVG paths
      if (hairElementsRef.current.length > 0) {
        for (const el of hairElementsRef.current) {
          const style = el.getAttribute("style") || "";
          const newStyle = style.replace(/fill:#[0-9a-fA-F]{6}/, `fill:${form.hairColor}`);
          el.setAttribute("style", newStyle);
          if (el.getAttribute("fill")) el.setAttribute("fill", form.hairColor);
        }
      }

      const cw = canvas.width, ch = canvas.height;
      const cx = cw * 0.5, cy = ch * 0.5;
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      if (!form.aura) return;

      // Background energy lines
      const gy = ch * 0.88;
      ctx.strokeStyle = form.aura[0]; ctx.lineWidth = 1;
      ctx.globalAlpha = 0.12 + pulse * 0.04;
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI;
        ctx.beginPath(); ctx.moveTo(cx, gy);
        ctx.lineTo(cx + Math.cos(a) * cw * 0.6, gy - Math.sin(a) * ch * 0.7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Aura glow layers
      const baseR = 55 + pulse * 10;
      for (let l = 3; l >= 1; l--) {
        const r = baseR * l * 0.75;
        const grd = ctx.createRadialGradient(cx, cy, 8, cx, cy, r);
        grd.addColorStop(0, form.aura[0] + "cc");
        grd.addColorStop(0.4, form.aura[1] + "44");
        grd.addColorStop(1, form.aura[2] + "00");
        ctx.fillStyle = grd; ctx.globalAlpha = 0.22 / l;
        ctx.beginPath(); ctx.ellipse(cx, cy + 10, r * 0.65, r, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Rings
      for (let i = 0; i < form.rings; i++) {
        const ph = (t * 1.4 + i / form.rings) % 1;
        const rr = baseR * 0.4 + ph * baseR * 1.3;
        ctx.globalAlpha = (1 - ph) * 0.55;
        ctx.strokeStyle = form.aura[0]; ctx.lineWidth = 2.5 - ph * 2;
        ctx.shadowColor = form.aura[0]; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.ellipse(cx, cy + 10, rr * 0.65, rr, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Test logic ──
  const runTest = useCallback(async () => {
    setTesting(true); setBtnText("TESTING…");
    setDlSpeed("–"); setUlSpeed("–"); setPingMs("–"); setJitterMs("–");
    setDlRank(""); setUlRank(""); setShowResults(false);
    setProgressVal(0); liveMbpsRef.current = 0; runningRef.current = false;

    const testStart = performance.now();
    const ipPromise = getIPInfo();

    try {
      // 1. Ping + Jitter
      setStatusText("Measuring ping & jitter…"); setProgressVal(5);
      const times: number[] = [];
      for (let i = 0; i < 6; i++) {
        const t0 = performance.now();
        try { await fetch("https://speed.cloudflare.com/__down?bytes=1", { cache: "no-store" }); } catch {}
        times.push(performance.now() - t0);
      }
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const jitter = Math.round(times.reduce((a, t2) => a + Math.abs(t2 - avg), 0) / times.length);
      const ping = Math.round(avg);
      setPingMs(String(ping)); setJitterMs(String(jitter)); setProgressVal(15);

      // 2. Download
      setStatusText("Testing download speed…");
      runningRef.current = true; liveMbpsRef.current = 0;
      const MIN_DL_SECS = 6;
      let totalLoaded = 0, totalDlSec = 0;
      while (true) {
        const t0 = performance.now();
        const res = await fetch(DL_URL, { cache: "no-store" });
        const reader = res.body!.getReader();
        let loaded = 0, lastTick = t0, lastBytes = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          loaded += value.byteLength; totalLoaded += value.byteLength;
          const now = performance.now(), el = (now - lastTick) / 1000;
          if (el >= 0.25) {
            liveMbpsRef.current = ((loaded - lastBytes) * 8 / 1e6) / el;
            setDlSpeed(liveMbpsRef.current.toFixed(1));
            lastTick = now; lastBytes = loaded;
          }
        }
        totalDlSec += (performance.now() - t0) / 1000;
        if (totalDlSec >= MIN_DL_SECS) break;
      }
      const dl = (totalLoaded * 8 / 1e6) / totalDlSec;
      runningRef.current = false; liveMbpsRef.current = 0;
      setDlSpeed(dl.toFixed(1));
      setDlRank(getForm(dl).name === "—" ? "" : getForm(dl).name);
      setProgressVal(60);
      await new Promise(r => setTimeout(r, 800));

      // 3. Upload
      setStatusText("Testing upload speed…"); setProgressVal(65);
      runningRef.current = true; liveMbpsRef.current = 0;
      const UNIT = 65536, REPS = 8, CHUNK = UNIT * REPS;
      const buf = new Uint8Array(CHUNK);
      for (let i = 0; i < REPS; i++) crypto.getRandomValues(buf.subarray(i * UNIT, (i + 1) * UNIT));
      const blob = new Blob([buf]);
      await new Promise(r => setTimeout(r, 30));
      const MIN_UL = 6, MAX_UL = 15, speeds: number[] = [];
      const ts = performance.now();
      while (true) {
        const el = (performance.now() - ts) / 1000;
        if (el > MAX_UL) break;
        if (el >= MIN_UL && speeds.length >= 4) break;
        setStatusText("Testing upload speed…");
        const t0 = performance.now();
        try { await fetch(UL_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: blob, mode: "no-cors" }); }
        catch { continue; }
        const secs = (performance.now() - t0) / 1000;
        speeds.push((CHUNK * 8 / 1e6) / secs);
        liveMbpsRef.current = speeds.slice(-3).reduce((a, b) => a + b, 0) / Math.min(speeds.length, 3);
        setUlSpeed(liveMbpsRef.current.toFixed(1));
        await new Promise(r => setTimeout(r, 0));
      }
      runningRef.current = false; liveMbpsRef.current = 0;
      const trimmed = speeds.length > 2 ? speeds.slice(1) : speeds;
      const ul = trimmed.length > 0 ? trimmed.reduce((a, b) => a + b, 0) / trimmed.length : 0;
      setUlSpeed(ul.toFixed(1));
      setUlRank(getForm(ul).name === "—" ? "" : getForm(ul).name);
      setProgressVal(100);

      // 4. Done
      const duration = (performance.now() - testStart) / 1000;
      const ipInfo = await ipPromise;

      setStatusText(`Download ${dl.toFixed(1)} Mbps · Upload ${ul.toFixed(1)} Mbps · Ping ${ping} ms`);
      setBtnText("TEST AGAIN");

      // Results
      setResults([
        { key: "Jitter", val: jitter + " ms" },
        { key: "Public IP", val: ipInfo.ip },
        { key: "ISP", val: ipInfo.isp },
        { key: "Region", val: ipInfo.region },
        { key: "Browser", val: getBrowser() },
        { key: "OS", val: getOS() },
        { key: "Test Server", val: "Cloudflare CDN" },
        { key: "Duration", val: duration.toFixed(1) + "s" },
      ]);
      const score = computeHealth(dl, ul, ping, jitter);
      setHealthScore(score);
      setHealthColor(score >= 85 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171");
      setTags(getSuitableTags(dl, ul, ping));
      setRecs(getRecommendations(dl, ul, ping, jitter));
      setShowResults(true);

    } catch (err: unknown) {
      runningRef.current = false; liveMbpsRef.current = 0;
      setStatusText("⚠ Test failed: " + (err instanceof Error ? err.message : String(err)));
    }
    setTesting(false);
  }, []);

  return (
    <div className="w-full max-w-lg">
      {/* Scene */}
      <div className="relative h-64 mb-4 rounded-2xl overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div ref={gokuRef} className="absolute inset-0 w-full h-full transition-[filter] duration-600" />
      </div>

      {/* Form label */}
      <p className="text-center text-xs font-bold tracking-[3px] uppercase mb-2 transition-colors duration-500" style={{ color: formColor }}>
        {formLabel}
      </p>

      {/* Meters */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <MeterBox label="Download" value={dlSpeed} unit="Mbps" color="#60a5fa" rank={dlRank} />
        <MeterBox label="Upload" value={ulSpeed} unit="Mbps" color="#a78bfa" rank={ulRank} />
        <MeterBox label="Ping" value={pingMs} unit="ms" color="#34d399" />
        <MeterBox label="Jitter" value={jitterMs} unit="ms" color="#34d399" />
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-white/10 mb-5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 transition-all duration-300" style={{ width: progress + "%" }} />
      </div>

      {/* Status */}
      <p className="text-center text-sm text-indigo-300 mb-5 min-h-5">{status}</p>

      {/* Button */}
      <button
        onClick={runTest}
        disabled={testing}
        className="w-full py-3.5 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-400 text-white font-bold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition"
      >
        {btnText}
      </button>

      {/* Results panel */}
      {showResults && (
        <div className="mt-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h3 className="text-xs font-bold tracking-[2px] uppercase text-slate-400 mb-3">Test Details</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {results.map(r => (
              <div key={r.key} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-xs text-slate-500">{r.key}</span>
                <span className="text-xs text-slate-200 font-semibold">{r.val}</span>
              </div>
            ))}
          </div>

          {/* Health score */}
          <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <p className="text-center text-3xl font-extrabold" style={{ color: healthColor }}>{healthScore}/100</p>
            <p className="text-center text-xs text-slate-400 tracking-[1.5px] uppercase mb-3">Internet Health Score</p>
            <div className="flex flex-wrap gap-1.5 justify-center mb-3">
              {tags.map(tag => (
                <span key={tag} className="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">{tag}</span>
              ))}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed border-l-2 border-white/[0.06] pl-3">
              {recs.map((r, i) => <p key={i} className="mb-1">• {r}</p>)}
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={() => {
              const text = `🚀 My Internet Speed (howfastismy.net)\nDownload: ${dlSpeed} Mbps\nUpload: ${ulSpeed} Mbps\nPing: ${pingMs} ms\nHealth: ${healthScore}/100`;
              navigator.clipboard.writeText(text).catch(() => {});
            }}
            className="mt-4 w-full py-2.5 rounded-xl border border-white/10 text-indigo-300 text-sm font-semibold tracking-wide hover:bg-white/[0.03] transition"
          >
            📋 COPY RESULTS
          </button>
        </div>
      )}
    </div>
  );
}

function MeterBox({ label, value, unit, color, rank }: { label: string; value: string; unit: string; color: string; rank?: string }) {
  return (
    <div className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
      <p className="text-[0.65rem] tracking-[1px] uppercase text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-[0.65rem] text-slate-400 mt-1">{unit}</p>
      {rank && <p className="text-[0.6rem] font-bold tracking-[1.5px] uppercase mt-1" style={{ color: LABEL_COLORS[rank] || "#94a3b8" }}>{rank}</p>}
    </div>
  );
}
