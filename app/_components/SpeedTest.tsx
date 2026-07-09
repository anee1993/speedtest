"use client";

import { useRef, useState, useEffect, useCallback } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const UL_URL = "https://speed.cloudflare.com/__up";

const FORMS = [
  { name: "—", minMbps: 0, aura: null, rings: 0, lightning: false, imgFilter: "none", hairColor: "#000000", thumbFilter: "none" },
  { name: "KAIOKEN", minMbps: 1, aura: ["#ff3300", "#ff6600", "#ff1100"], rings: 1, lightning: false, imgFilter: "drop-shadow(0 0 10px #ff4400) drop-shadow(0 0 4px #ff0000)", hairColor: "#1a0000", thumbFilter: "drop-shadow(0 0 4px #ff4400) brightness(1.1)" },
  { name: "SUPER SAIYAN", minMbps: 20, aura: ["#ffe600", "#ffaa00", "#fff4aa"], rings: 2, lightning: true, imgFilter: "drop-shadow(0 0 14px #ffe600) drop-shadow(0 0 28px #ffaa00)", hairColor: "#ffe600", thumbFilter: "hue-rotate(30deg) saturate(5) brightness(1.5) drop-shadow(0 0 4px #ffe600)" },
  { name: "SUPER SAIYAN 2", minMbps: 80, aura: ["#ffffff", "#ffe600", "#ffdd44"], rings: 3, lightning: true, imgFilter: "drop-shadow(0 0 18px #fff) drop-shadow(0 0 36px #ffe600)", hairColor: "#fff4aa", thumbFilter: "hue-rotate(30deg) saturate(3) brightness(2) drop-shadow(0 0 4px #fff)" },
  { name: "SSJ GOD", minMbps: 150, aura: ["#ff3366", "#ff6644", "#ffaa88"], rings: 2, lightning: false, imgFilter: "drop-shadow(0 0 14px #ff3366) drop-shadow(0 0 28px #ff4444)", hairColor: "#cc2244", thumbFilter: "hue-rotate(-20deg) saturate(4) brightness(1.3) drop-shadow(0 0 4px #ff3366)" },
  { name: "SUPER SAIYAN BLUE", minMbps: 250, aura: ["#00cfff", "#0077ff", "#aaddff"], rings: 3, lightning: true, imgFilter: "drop-shadow(0 0 18px #00cfff) drop-shadow(0 0 36px #0055ff)", hairColor: "#00ccff", thumbFilter: "hue-rotate(180deg) saturate(5) brightness(1.5) drop-shadow(0 0 4px #00cfff)" },
  { name: "ULTRA INSTINCT", minMbps: 500, aura: ["#ffffff", "#ccccff", "#e8e8ff"], rings: 4, lightning: true, imgFilter: "drop-shadow(0 0 22px #fff) drop-shadow(0 0 44px #ccccff)", hairColor: "#d8d8f0", thumbFilter: "grayscale(0.4) brightness(2.5) drop-shadow(0 0 4px #fff)" },
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
    return { ip: d.ip || "—", isp: d.org || "—", region: d.city ? `${d.city}, ${d.region}` : "—", city: d.city || null };
  } catch {
    try {
      const r2 = await fetch("https://api.ipify.org?format=json");
      const d2 = await r2.json();
      return { ip: d2.ip || "—", isp: "—", region: "—", city: null };
    } catch { return { ip: "—", isp: "—", region: "—", city: null }; }
  }
}

// Get precise city via Browser Geolocation + reverse geocoding
async function getPreciseCity(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          resolve(data.city || data.locality || null);
        } catch { resolve(null); }
      },
      () => resolve(null), // denied or error
      { timeout: 8000, maximumAge: 300000 }
    );
  });
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

// ── Share as image ─────────────────────────────────────────────────────────────
function shareAsImage(dl: string, ul: string, ping: string, jitter: string, score: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 600; canvas.height = 340;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 600, 340);
  bg.addColorStop(0, "#0f0c29"); bg.addColorStop(0.5, "#1e1b4b"); bg.addColorStop(1, "#0f172a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 600, 340);

  // Border
  ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 2;
  ctx.roundRect(10, 10, 580, 320, 20); ctx.stroke();

  // Title
  ctx.fillStyle = "#a78bfa"; ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillText("⚡ howfastismy.net", 40, 50);
  ctx.fillStyle = "#64748b"; ctx.font = "14px system-ui, sans-serif";
  ctx.fillText("Internet Speed Test Results", 40, 74);

  // Metrics
  const y = 120;
  ctx.font = "bold 42px system-ui, sans-serif";
  ctx.fillStyle = "#60a5fa"; ctx.fillText(dl, 40, y);
  ctx.fillStyle = "#a78bfa"; ctx.fillText(ul, 220, y);
  ctx.fillStyle = "#34d399"; ctx.fillText(ping, 400, y);

  ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = "#94a3b8";
  ctx.fillText("DOWNLOAD (Mbps)", 40, y + 22);
  ctx.fillText("UPLOAD (Mbps)", 220, y + 22);
  ctx.fillText("PING (ms)", 400, y + 22);

  // Jitter
  ctx.font = "bold 28px system-ui, sans-serif"; ctx.fillStyle = "#34d399";
  ctx.fillText(jitter, 400, y + 70);
  ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = "#94a3b8";
  ctx.fillText("JITTER (ms)", 400, y + 90);

  // Health score
  const scoreColor = score >= 85 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";
  ctx.font = "bold 48px system-ui, sans-serif"; ctx.fillStyle = scoreColor;
  ctx.fillText(`${score}/100`, 40, y + 80);
  ctx.font = "12px system-ui, sans-serif"; ctx.fillStyle = "#94a3b8";
  ctx.fillText("HEALTH SCORE", 40, y + 100);

  // Date
  ctx.font = "11px system-ui, sans-serif"; ctx.fillStyle = "#475569";
  ctx.fillText(new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }), 40, 310);

  // Download
  const link = document.createElement("a");
  link.download = "speed-test-results.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ── History ────────────────────────────────────────────────────────────────────
interface HistoryEntry {
  date: string;
  dl: number;
  ul: number;
  ping: number;
  jitter: number;
  score: number;
}

const HISTORY_KEY = "speedtest_history";
const MAX_HISTORY = 10;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveToHistory(entry: HistoryEntry) {
  const hist = loadHistory();
  hist.unshift(entry);
  if (hist.length > MAX_HISTORY) hist.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
  return hist;
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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cityComparison, setCityComparison] = useState<{ city: string; avg_dl: number; avg_ul: number; avg_ping: number; test_count: number } | null>(null);
  const [locationAsked, setLocationAsked] = useState(false);
  const [locationCity, setLocationCity] = useState<string | null>(null);

  // Refs for animation loop
  const liveMbpsRef = useRef(0);
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // ── Load SVG inline so we can manipulate hair color ──
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    const container = gokuRef.current;
    if (!container) return;
    fetch("/Goku.svg")
      .then(r => r.text())
      .then(svgText => {
        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (svg) {
          // The SVG is 210mm × 297mm — in Inkscape default (90dpi) = 744.09 × 1052.36 px
          svg.setAttribute("viewBox", "0 0 744.09 1052.36");
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
          svg.style.width = "100%";
          svg.style.height = "100%";
          svg.style.position = "absolute";
          svg.style.inset = "0";
        }
        // Find the hair element specifically by ID (path3966 is the main hair shape)
        const hairEl = container.querySelector("#path3966") as SVGElement | null;
        if (hairEl) {
          hairElementsRef.current = [hairEl];
        } else {
          // Fallback: try finding by fill color
          const allPaths = container.querySelectorAll("path, polygon, ellipse, rect, circle");
          const hairEls: SVGElement[] = [];
          allPaths.forEach(el => {
            const style = el.getAttribute("style") || "";
            const fill = el.getAttribute("fill") || "";
            if (style.includes("fill:#ffff00") || fill === "#ffff00") {
              hairEls.push(el as SVGElement);
            }
          });
          hairElementsRef.current = hairEls;
        }
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
          // Replace fill color in style attribute (handles both #000000 and any 6-digit hex)
          const newStyle = style.replace(/fill:#[0-9a-fA-F]{6}/, `fill:${form.hairColor}`);
          el.setAttribute("style", newStyle);
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
    setCityComparison(null);

    const testStart = performance.now();
    const ipPromise = getIPInfo();

    // Request precise location if not already asked
    let preciseCity = locationCity;
    if (!locationAsked) {
      setLocationAsked(true);
      preciseCity = await getPreciseCity();
      if (preciseCity) setLocationCity(preciseCity);
    }

    try {
      // 1. Ping + Jitter — use Cloudflare's main CDN (routes to nearest PoP)
      setStatusText("Measuring ping & jitter…"); setProgressVal(5);
      const PING_URL = "https://www.cloudflare.com/cdn-cgi/trace";
      const times: number[] = [];
      for (let i = 0; i < 8; i++) {
        const t0 = performance.now();
        try { await fetch(PING_URL, { cache: "no-store", mode: "no-cors" }); } catch {}
        times.push(performance.now() - t0);
      }
      // Drop first measurement (TCP cold start)
      const warmTimes = times.slice(1);
      const avg = warmTimes.reduce((a, b) => a + b, 0) / warmTimes.length;
      const jitter = Math.round(warmTimes.reduce((a, t2) => a + Math.abs(t2 - avg), 0) / warmTimes.length);
      const ping = Math.round(avg);
      setPingMs(String(ping)); setJitterMs(String(jitter)); setProgressVal(15);

      // 2. Download — parallel connections for max throughput
      setStatusText("Testing download speed…");
      runningRef.current = true; liveMbpsRef.current = 0;
      const DL_CONNECTIONS = 8;
      const DL_MIN_SECS = 6;
      // Use Cloudflare's speed endpoint which routes to nearest edge
      const DL_CHUNK_URL = "https://speed.cloudflare.com/__down?bytes=25000000"; // 25MB per stream

      let dlTotalBytes = 0;
      const dlStartTime = performance.now();
      let dlRunning = true;

      // Launch parallel download streams
      async function dlWorker() {
        while (dlRunning) {
          try {
            const res = await fetch(DL_CHUNK_URL, { cache: "no-store" });
            const reader = res.body!.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done || !dlRunning) break;
              dlTotalBytes += value.byteLength;
            }
          } catch { /* retry silently */ }
        }
      }

      // Live display updater
      const dlDisplayInterval = setInterval(() => {
        const elapsed = (performance.now() - dlStartTime) / 1000;
        if (elapsed > 0.5 && dlTotalBytes > 0) {
          liveMbpsRef.current = (dlTotalBytes * 8 / 1e6) / elapsed;
          setDlSpeed(liveMbpsRef.current.toFixed(1));
        }
      }, 300);

      const dlWorkers = Array.from({ length: DL_CONNECTIONS }, () => dlWorker());

      // Wait for minimum duration then stop
      await new Promise<void>(resolve => {
        setTimeout(() => { dlRunning = false; resolve(); }, DL_MIN_SECS * 1000);
      });

      // Give workers a moment to finish their current read
      await Promise.race([
        Promise.allSettled(dlWorkers),
        new Promise(r => setTimeout(r, 2000)),
      ]);

      clearInterval(dlDisplayInterval);
      const dlTotalSec = (performance.now() - dlStartTime) / 1000;
      const dl = (dlTotalBytes * 8 / 1e6) / dlTotalSec;
      runningRef.current = false; liveMbpsRef.current = 0;
      setDlSpeed(dl.toFixed(1));
      setDlRank(getForm(dl).name === "—" ? "" : getForm(dl).name);
      setProgressVal(60);
      await new Promise(r => setTimeout(r, 800));

      // 3. Upload — sequential with abort safety
      setStatusText("Testing upload speed…"); setProgressVal(65);
      runningRef.current = true; liveMbpsRef.current = 0;
      const UL_DURATION = 6000; // 6 seconds
      const UL_CHUNK_SIZE = 512 * 1024;

      // Build upload payload
      const ulBuf = new Uint8Array(UL_CHUNK_SIZE);
      for (let offset = 0; offset < UL_CHUNK_SIZE; offset += 65536) {
        crypto.getRandomValues(ulBuf.subarray(offset, Math.min(offset + 65536, UL_CHUNK_SIZE)));
      }
      const ulBlob = new Blob([ulBuf]);

      let ulTotalBytes = 0;
      const ulStartTime = performance.now();
      const ulAbort = new AbortController();

      // Hard stop after duration
      const ulTimeout = setTimeout(() => ulAbort.abort(), UL_DURATION);

      while (!ulAbort.signal.aborted) {
        try {
          await fetch(UL_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: ulBlob,
            mode: "no-cors",
            signal: ulAbort.signal,
          });
          ulTotalBytes += UL_CHUNK_SIZE;
          const elapsed = (performance.now() - ulStartTime) / 1000;
          if (elapsed > 0.3) {
            liveMbpsRef.current = (ulTotalBytes * 8 / 1e6) / elapsed;
            setUlSpeed(liveMbpsRef.current.toFixed(1));
          }
        } catch {
          // AbortError or network error — break if aborted
          if (ulAbort.signal.aborted) break;
          await new Promise(r => setTimeout(r, 50));
        }
      }

      clearTimeout(ulTimeout);
      const ulTotalSec = (performance.now() - ulStartTime) / 1000;
      const ul = ulTotalBytes > 0 ? (ulTotalBytes * 8 / 1e6) / ulTotalSec : 0;
      runningRef.current = false; liveMbpsRef.current = 0;
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

      // Save to history
      const newHist = saveToHistory({
        date: new Date().toISOString(),
        dl: parseFloat(dl.toFixed(1)),
        ul: parseFloat(ul.toFixed(1)),
        ping,
        jitter,
        score,
      });
      setHistory(newHist);

      // Save anonymized result to database (fire and forget)
      const cityForDb = preciseCity || ipInfo.city || ipInfo.region?.split(",")[0]?.trim() || null;
      fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dl: parseFloat(dl.toFixed(1)),
          ul: parseFloat(ul.toFixed(1)),
          ping,
          jitter,
          city: cityForDb,
          region: ipInfo.region || null,
          country: null,
          isp: ipInfo.isp || null,
        }),
      }).catch(() => {}); // silent fail — not critical

      // Check city average
      if (cityForDb) {
        fetch(`/api/results?city=${encodeURIComponent(cityForDb)}`)
          .then(r => r.json())
          .then(data => {
            if (data.available) {
              setCityComparison(data);
            }
          })
          .catch(() => {});
      }

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        <MeterBox label="Download" value={dlSpeed} unit="Mbps" color="#60a5fa" />
        <MeterBox label="Upload" value={ulSpeed} unit="Mbps" color="#a78bfa" />
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

      {!locationAsked && (
        <p className="text-[0.65rem] text-slate-500 text-center mt-2 leading-relaxed">
          📍 We may ask for your location to compare your speed against others in the same area. This is optional and your exact location is never stored.
        </p>
      )}

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

          {/* City comparison */}
          {cityComparison && (
            <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-xs text-slate-400 mb-2">
                <span className="font-semibold text-slate-300">Users in {cityComparison.city}</span> average ({cityComparison.test_count} tests):
              </p>
              <div className="flex gap-4 text-xs text-slate-300">
                <span>↓ {cityComparison.avg_dl} Mbps</span>
                <span>↑ {cityComparison.avg_ul} Mbps</span>
                <span>🏓 {cityComparison.avg_ping} ms</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {parseFloat(dlSpeed) > cityComparison.avg_dl
                  ? <span>Your download is <span className="text-emerald-400 font-semibold">{((parseFloat(dlSpeed) / cityComparison.avg_dl - 1) * 100).toFixed(0)}% faster</span> than average.</span>
                  : <span>Your download is <span className="text-yellow-400 font-semibold">{((1 - parseFloat(dlSpeed) / cityComparison.avg_dl) * 100).toFixed(0)}% slower</span> than average.</span>
                }
              </p>
            </div>
          )}

          {/* Share buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                const text = `🚀 My Internet Speed (howfastismy.net)\nDownload: ${dlSpeed} Mbps\nUpload: ${ulSpeed} Mbps\nPing: ${pingMs} ms\nHealth: ${healthScore}/100`;
                navigator.clipboard.writeText(text).catch(() => {});
              }}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-indigo-300 text-sm font-semibold tracking-wide hover:bg-white/[0.03] transition"
            >
              📋 Copy Text
            </button>
            <button
              onClick={() => shareAsImage(dlSpeed, ulSpeed, pingMs, jitterMs, healthScore)}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-indigo-300 text-sm font-semibold tracking-wide hover:bg-white/[0.03] transition"
            >
              🖼️ Save Image
            </button>
          </div>
        </div>
      )}

      {/* Speed History */}
      {history.length > 0 && (
        <div className="mt-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <h3 className="text-xs font-bold tracking-[2px] uppercase text-slate-400 mb-3">Speed History</h3>

          {/* Mini chart */}
          <div className="flex items-end gap-1 h-16 mb-4">
            {history.slice().reverse().map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className="w-full rounded-sm bg-blue-400/60"
                  style={{ height: `${Math.max(8, (h.dl / Math.max(...history.map(x => x.dl))) * 100)}%` }}
                  title={`DL: ${h.dl} Mbps`}
                />
                <div
                  className="w-full rounded-sm bg-purple-400/60"
                  style={{ height: `${Math.max(8, (h.ul / Math.max(...history.map(x => x.ul), 1)) * 100)}%` }}
                  title={`UL: ${h.ul} Mbps`}
                />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mb-3 text-[0.6rem] text-slate-500">
            <span><span className="inline-block w-2 h-2 rounded-sm bg-blue-400/60 mr-1" />Download</span>
            <span><span className="inline-block w-2 h-2 rounded-sm bg-purple-400/60 mr-1" />Upload</span>
          </div>

          {/* Table */}
          <div className="space-y-1.5">
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-500">
                  {new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-slate-300">
                  ↓{h.dl} ↑{h.ul} <span className="text-slate-500">| {h.ping}ms | {h.score}/100</span>
                </span>
              </div>
            ))}
          </div>

          {history.length > 1 && (
            <button
              onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }}
              className="mt-3 text-[0.65rem] text-slate-500 hover:text-red-400 transition"
            >
              Clear history
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function MeterBox({ label, value, unit, color }: { label: string; value: string; unit: string; color: string; rank?: string }) {
  const mbps = parseFloat(value);
  const mbsVal = !isNaN(mbps) && mbps > 0 ? (mbps / 8).toFixed(1) : null;

  return (
    <div className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
      <p className="text-[0.65rem] tracking-[1px] uppercase text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-[0.65rem] text-slate-400 mt-1">{unit}</p>
      {mbsVal && unit === "Mbps" && (
        <p className="text-[0.6rem] font-semibold mt-1" style={{ color }}>{mbsVal} MB/s</p>
      )}
    </div>
  );
}
