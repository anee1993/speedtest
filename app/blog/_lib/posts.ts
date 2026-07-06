export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
}

export const posts: BlogPost[] = [
  {
    slug: "good-internet-speed",
    title: "What Is a Good Internet Speed?",
    description:
      "Find out what internet speed you actually need for streaming, gaming, video calls, and working from home. Includes recommended speeds per activity.",
    date: "2025-01-15",
    content: `
<h2>What Counts as a "Good" Internet Speed?</h2>
<p>Internet speed requirements depend entirely on what you do online. A solo web browser needs far less bandwidth than a household of four streaming 4K video simultaneously. The key metric is <strong>download speed</strong>, measured in Megabits per second (Mbps), though upload speed and latency matter too.</p>
<p>Before diving into recommendations, it helps to know your current speed. You can <a href="https://howfastismy.net">run a free speed test</a> to see exactly what you are working with right now.</p>

<h2>Recommended Speeds by Activity</h2>
<p>Here is a practical breakdown of the minimum download speeds you need for common online activities:</p>
<table>
<thead>
<tr><th>Activity</th><th>Minimum Speed</th><th>Recommended Speed</th></tr>
</thead>
<tbody>
<tr><td>Basic browsing &amp; email</td><td>3 Mbps</td><td>10 Mbps</td></tr>
<tr><td>HD video streaming (1080p)</td><td>5 Mbps</td><td>10 Mbps</td></tr>
<tr><td>4K video streaming</td><td>25 Mbps</td><td>35 Mbps</td></tr>
<tr><td>Video calls (Zoom, Teams)</td><td>3 Mbps</td><td>10 Mbps</td></tr>
<tr><td>Online gaming</td><td>10 Mbps</td><td>25 Mbps</td></tr>
<tr><td>Working from home (VPN, cloud apps)</td><td>10 Mbps</td><td>50 Mbps</td></tr>
<tr><td>Large file downloads</td><td>25 Mbps</td><td>100+ Mbps</td></tr>
</tbody>
</table>

<h2>Speeds for Streaming</h2>
<p>Streaming is the most common bandwidth consumer in most homes. Netflix recommends 5 Mbps for HD and 15 Mbps for 4K Ultra HD per stream. If multiple people are watching at once, multiply those numbers accordingly.</p>
<p>YouTube and Disney+ have similar requirements. The takeaway: for a household that streams on two or three screens simultaneously in high quality, you want at least 50 Mbps.</p>

<h2>Speeds for Gaming</h2>
<p>Online gaming actually does not require much bandwidth — 10 to 25 Mbps is usually enough. What matters more for gaming is <strong>latency</strong> (ping) and consistency. A fiber connection with low ping will feel far better than a high-bandwidth connection with packet loss.</p>
<p>However, downloading modern game files (which can exceed 100 GB) benefits from faster speeds. A 100 Mbps connection downloads a 50 GB game in about an hour, while 25 Mbps takes four hours.</p>

<h2>Speeds for Video Calls</h2>
<p>Zoom recommends 3.8 Mbps for group HD video calls. Microsoft Teams suggests similar. The critical factor here is <strong>upload speed</strong> — you need at least 3 Mbps upload for clear outgoing video. Many cable internet plans have asymmetric speeds with much slower uploads, so check both directions.</p>

<h2>Speeds for Working from Home</h2>
<p>Remote work often combines video calls, VPN connections, cloud storage sync, and web apps running simultaneously. A minimum of 25 Mbps download and 5 Mbps upload keeps things smooth for a single worker. If multiple people in the household are also online, aim for 100 Mbps or more.</p>

<h2>What About Large Households?</h2>
<p>The FCC considers 25 Mbps a baseline for a single user, but modern households often have 10 or more connected devices. Phones, tablets, smart TVs, laptops, game consoles, and smart home devices all compete for bandwidth.</p>
<p>For a household of 3-4 people with moderate to heavy use, 200 to 300 Mbps provides comfortable headroom. Families with heavy gamers or remote workers may benefit from 500 Mbps or gigabit plans.</p>

<h2>How to Check Your Speed</h2>
<p>The best way to know if your speed matches your needs is to measure it. Use our <a href="https://howfastismy.net">free internet speed test</a> to check your download speed, upload speed, and ping in under 30 seconds. Test at different times of day to see if your ISP delivers consistent performance.</p>
<p>If your results fall short of what you are paying for, contact your provider or check our guide on <a href="/blog/why-is-my-internet-slow">why your internet might be slow</a>.</p>

<h2>Bottom Line</h2>
<p>A "good" internet speed is one that reliably handles everything your household does online without buffering, lag, or dropped calls. For most homes today, that means 100 Mbps or more. But the only way to know if you are getting what you need is to test it — <a href="https://howfastismy.net">check your speed now</a>.</p>
`,
  },
  {
    slug: "why-is-my-internet-slow",
    title: "Why Is My Internet So Slow?",
    description:
      "Diagnose common causes of slow internet including WiFi interference, ISP throttling, outdated routers, and peak-hour congestion. Practical troubleshooting steps included.",
    date: "2025-01-22",
    content: `
<h2>Slow Internet Is Frustrating — But Usually Fixable</h2>
<p>Few things are more annoying than watching a loading spinner when you are trying to work, stream, or game. Slow internet has many possible causes, and most of them are within your control. The first step is measuring your actual speed with a <a href="https://howfastismy.net">quick speed test</a> so you know where you stand.</p>

<h2>Common Causes of Slow Internet</h2>

<h3>1. WiFi Interference</h3>
<p>WiFi signals degrade with distance, walls, and interference from other electronics. Microwaves, baby monitors, Bluetooth devices, and neighboring WiFi networks all compete for the same radio frequencies. If your router is in a corner of the house, devices on the far side may get a fraction of your actual speed.</p>
<p><strong>Fix:</strong> Move your router to a central location. Switch to the 5 GHz band for nearby devices (faster but shorter range) and use 2.4 GHz for distant ones. Consider a mesh WiFi system for large homes.</p>

<h3>2. Too Many Devices</h3>
<p>Every connected device shares your bandwidth. Smartphones running background updates, smart home gadgets, and tablets streaming video all add up. A 100 Mbps connection shared across 15 devices can feel much slower than the numbers suggest.</p>
<p><strong>Fix:</strong> Audit connected devices in your router admin panel. Disconnect devices you are not using. Prioritize bandwidth for critical devices using QoS (Quality of Service) settings if your router supports them.</p>

<h3>3. ISP Throttling</h3>
<p>Some Internet Service Providers intentionally slow down certain types of traffic — especially streaming video or torrents — during peak hours or after you exceed a data cap. This is called throttling.</p>
<p><strong>Fix:</strong> Run speed tests at different times and compare results. If you consistently see slower speeds during evenings or on specific services, throttling may be the cause. A VPN can sometimes bypass throttling, though it adds its own overhead.</p>

<h3>4. Outdated Router or Modem</h3>
<p>Networking hardware has a lifespan. Routers older than 4-5 years may not support modern WiFi standards (WiFi 5 or WiFi 6) and can become a bottleneck. Similarly, an old DOCSIS 3.0 modem on a cable connection cannot deliver gigabit speeds — you need DOCSIS 3.1.</p>
<p><strong>Fix:</strong> Check your router model and compare its maximum throughput to your plan speed. If it is a limiting factor, upgrade to a WiFi 6 or WiFi 6E router.</p>

<h3>5. Peak Hour Congestion</h3>
<p>Cable and fixed wireless internet connections share bandwidth among neighbors. During evenings when everyone is streaming, speeds can drop noticeably. Fiber connections are generally immune to this problem.</p>
<p><strong>Fix:</strong> Test your speed at different times. If peak-hour slowdowns are severe, consider switching to fiber if available in your area.</p>

<h3>6. Background Applications</h3>
<p>Cloud backup services, system updates, file syncing (Dropbox, OneDrive, iCloud), and browser tabs with auto-refreshing content all consume bandwidth silently.</p>
<p><strong>Fix:</strong> Check your system's network activity monitor. Schedule large backups and updates for off-hours. Close unnecessary browser tabs.</p>

<h3>7. DNS Issues</h3>
<p>A slow DNS server can make websites feel unresponsive even when your raw speed is fine. Your ISP's default DNS may not be the fastest option.</p>
<p><strong>Fix:</strong> Switch to a faster DNS provider like Cloudflare (1.1.1.1) or Google (8.8.8.8). You can configure this on your router to apply network-wide.</p>

<h2>Troubleshooting Steps</h2>
<ol>
<li><strong>Test your speed</strong> — Use <a href="https://howfastismy.net">howfastismy.net</a> to get your current download, upload, and ping.</li>
<li><strong>Test wired vs wireless</strong> — Connect directly to your router with an Ethernet cable. If wired speed is much faster, the problem is WiFi-related.</li>
<li><strong>Restart your router</strong> — Power cycle your router and modem (unplug for 30 seconds). This clears memory and can resolve many issues.</li>
<li><strong>Check for interference</strong> — Move the router away from walls, metal objects, and other electronics.</li>
<li><strong>Update firmware</strong> — Log into your router and check for firmware updates. Manufacturers regularly release performance fixes.</li>
<li><strong>Contact your ISP</strong> — If wired speeds consistently fall below what you are paying for, your ISP may have a line issue or need to provision your connection correctly.</li>
</ol>

<h2>When to Upgrade Your Plan</h2>
<p>If your speeds match your plan but still feel slow, you may have outgrown your bandwidth tier. Check our guide on <a href="/blog/good-internet-speed">what speeds you actually need</a> to see if an upgrade makes sense for your usage.</p>

<h2>Diagnose It Now</h2>
<p>Start with a baseline measurement. <a href="https://howfastismy.net">Run a free speed test</a> to see your actual download speed, upload speed, and latency. Compare those numbers to your plan, then work through the troubleshooting steps above. Most slow internet problems can be resolved in under 15 minutes.</p>
`,
  },
  {
    slug: "mbps-vs-mbs",
    title: "Mbps vs MB/s — What's the Difference?",
    description:
      "Understand the difference between Megabits per second (Mbps) and Megabytes per second (MB/s), why ISPs use Mbps, and how to convert between them.",
    date: "2025-02-05",
    content: `
<h2>Why Internet Speeds Are Confusing</h2>
<p>You pay for "100 Mbps" internet, but when you download a file, your browser shows 12 MB/s. Did you get ripped off? Not at all — those are two different units measuring the same thing. Understanding the difference between <strong>Megabits per second (Mbps)</strong> and <strong>Megabytes per second (MB/s)</strong> clears up a lot of confusion.</p>

<h2>Bits vs Bytes — The Basics</h2>
<p>A <strong>bit</strong> is the smallest unit of digital data — a single 0 or 1. A <strong>byte</strong> is a group of 8 bits. This 8:1 ratio is the root of the Mbps vs MB/s confusion.</p>
<ul>
<li>1 Byte = 8 bits</li>
<li>1 Megabyte (MB) = 8 Megabits (Mb)</li>
<li>1 Megabit per second (Mbps) = 0.125 Megabytes per second (MB/s)</li>
</ul>
<p>The capitalization matters: a lowercase "b" means bits, an uppercase "B" means bytes. So "Mbps" is Megabits per second, and "MB/s" is Megabytes per second.</p>

<h2>Why ISPs Use Megabits (Mbps)</h2>
<p>Internet Service Providers advertise speeds in Mbps because it is the industry standard for measuring data transmission rates. Networking equipment, line speeds, and protocols have always been measured in bits per second. It also produces bigger numbers — "100 Mbps" sounds faster than "12.5 MB/s" even though they are the same speed.</p>
<p>This is not deceptive; it is simply the convention used across the entire telecommunications industry worldwide.</p>

<h2>How to Convert Mbps to MB/s</h2>
<p>The formula is straightforward:</p>
<ul>
<li><strong>Mbps ÷ 8 = MB/s</strong></li>
<li><strong>MB/s × 8 = Mbps</strong></li>
</ul>

<h3>Conversion Examples</h3>
<table>
<thead>
<tr><th>Plan Speed (Mbps)</th><th>Real Download Rate (MB/s)</th><th>Time to Download 1 GB</th></tr>
</thead>
<tbody>
<tr><td>25 Mbps</td><td>3.1 MB/s</td><td>~5 minutes 20 seconds</td></tr>
<tr><td>50 Mbps</td><td>6.25 MB/s</td><td>~2 minutes 40 seconds</td></tr>
<tr><td>100 Mbps</td><td>12.5 MB/s</td><td>~1 minute 20 seconds</td></tr>
<tr><td>250 Mbps</td><td>31.25 MB/s</td><td>~32 seconds</td></tr>
<tr><td>500 Mbps</td><td>62.5 MB/s</td><td>~16 seconds</td></tr>
<tr><td>1000 Mbps (1 Gbps)</td><td>125 MB/s</td><td>~8 seconds</td></tr>
</tbody>
</table>
<p>Keep in mind: real-world downloads are slightly slower than theoretical maximums due to protocol overhead, server limits, and network congestion.</p>

<h2>Real-World Examples</h2>
<p>Here is what different speeds feel like in practice:</p>
<ul>
<li><strong>100 Mbps connection:</strong> Downloads a 4 GB movie in about 5.5 minutes. A 700 MB album downloads in under a minute.</li>
<li><strong>50 Mbps connection:</strong> That same 4 GB movie takes about 11 minutes.</li>
<li><strong>25 Mbps connection:</strong> The movie takes around 22 minutes. Still usable, but noticeable for large files.</li>
</ul>
<p>For streaming, bits per second is what matters directly — Netflix streams 4K at about 25 Mbps, which is the actual data rate flowing to your device.</p>

<h2>Common Points of Confusion</h2>
<h3>Steam and Game Downloads</h3>
<p>Steam displays download speeds in MB/s by default. So if you have a 100 Mbps connection and Steam shows 11-12 MB/s, that is perfectly normal and expected — you are getting full speed.</p>

<h3>Speed Test Results vs File Downloads</h3>
<p>Speed tests (like <a href="https://howfastismy.net">howfastismy.net</a>) report in Mbps because that is the standard for connection speed. When you see "95 Mbps" on a speed test, divide by 8 to predict your file download rate: roughly 11.8 MB/s.</p>

<h3>Storage vs Speed</h3>
<p>File sizes are measured in Bytes (KB, MB, GB). Connection speeds are measured in bits per second (Kbps, Mbps, Gbps). They use different units because they measure different things — one measures an amount of data, the other measures a rate of transfer.</p>

<h2>Check Your Actual Speed</h2>
<p>Now that you know the difference, <a href="https://howfastismy.net">test your internet speed</a> to see your connection in Mbps. Then divide by 8 to know your real-world download capability in MB/s. If the numbers seem low compared to your plan, check out our guide on <a href="/blog/why-is-my-internet-slow">why your internet might be slow</a>.</p>

<h2>Quick Reference</h2>
<ul>
<li><strong>Mbps</strong> = Megabits per second (used for connection speeds)</li>
<li><strong>MB/s</strong> = Megabytes per second (used for file download rates)</li>
<li><strong>Divide Mbps by 8</strong> to get MB/s</li>
<li><strong>Multiply MB/s by 8</strong> to get Mbps</li>
<li>Both measure the same thing — just in different units</li>
</ul>
`,
  },
  {
    slug: "what-is-ping",
    title: "What Is Ping and Why Does It Matter?",
    description:
      "Learn what ping (latency) means, how it works, what affects it, and what constitutes good vs bad ping for gaming, video calls, and browsing.",
    date: "2025-02-18",
    content: `
<h2>Ping Explained Simply</h2>
<p><strong>Ping</strong> measures the time it takes for a small packet of data to travel from your device to a server and back. It is measured in milliseconds (ms) and is also called <strong>latency</strong>. A lower ping means a more responsive connection.</p>
<p>Think of it like this: download speed determines how quickly you can fill a bucket with water. Ping determines how long it takes for the water to start flowing after you turn the tap. Both matter, but for different reasons.</p>

<h2>How Ping Works</h2>
<p>When you interact with anything online — loading a webpage, sending a message, or making a move in a game — your device sends a request to a remote server. The server processes it and sends a response back. Ping is the round-trip time for that exchange.</p>
<p>The ping command (and tools like our <a href="https://howfastismy.net/tools/ping">ping test</a>) sends a tiny data packet to a target server and measures how many milliseconds the round trip takes. The result tells you how responsive your connection is regardless of bandwidth.</p>

<h2>What Affects Ping?</h2>

<h3>Physical Distance</h3>
<p>Data travels through cables at roughly two-thirds the speed of light. A server 100 miles away will naturally respond faster than one 5,000 miles away. This is why connecting to a game server on your continent feels better than one across the ocean.</p>

<h3>Number of Network Hops</h3>
<p>Data packets pass through multiple routers and switches between you and the destination. Each "hop" adds a small delay. More hops mean higher ping.</p>

<h3>Connection Type</h3>
<ul>
<li><strong>Fiber optic:</strong> Lowest latency (typically 1-10 ms to nearby servers)</li>
<li><strong>Cable:</strong> Low latency (10-30 ms)</li>
<li><strong>DSL:</strong> Moderate latency (20-50 ms)</li>
<li><strong>Fixed wireless:</strong> Variable (20-60 ms)</li>
<li><strong>Satellite:</strong> High latency (500-700 ms for traditional, 30-60 ms for low-earth orbit like Starlink)</li>
<li><strong>Mobile (4G/5G):</strong> Variable (30-80 ms for 4G, 10-30 ms for 5G)</li>
</ul>

<h3>Network Congestion</h3>
<p>When your local network or ISP is heavily loaded, packets queue up and wait their turn. This increases latency even if your bandwidth is technically sufficient. Peak evening hours often produce higher ping.</p>

<h3>WiFi vs Ethernet</h3>
<p>WiFi adds latency due to radio transmission overhead and potential interference. Switching to a wired Ethernet connection typically reduces ping by 5-15 ms and provides more consistent timing.</p>

<h2>Good vs Bad Ping Ranges</h2>
<table>
<thead>
<tr><th>Ping (ms)</th><th>Rating</th><th>Suitable For</th></tr>
</thead>
<tbody>
<tr><td>0-20 ms</td><td>Excellent</td><td>Competitive gaming, real-time trading</td></tr>
<tr><td>20-50 ms</td><td>Good</td><td>Online gaming, video calls, all general use</td></tr>
<tr><td>50-100 ms</td><td>Fair</td><td>Casual gaming, video calls (some delay noticeable)</td></tr>
<tr><td>100-200 ms</td><td>Poor</td><td>Web browsing fine, gaming laggy, video calls delayed</td></tr>
<tr><td>200+ ms</td><td>Bad</td><td>Noticeable delay on everything, gaming unplayable</td></tr>
</tbody>
</table>

<h2>Ping for Gaming</h2>
<p>For competitive online games (first-person shooters, fighting games, battle royales), ping is arguably more important than download speed. A player with 20 ms ping has a meaningful advantage over one with 100 ms — their actions register on the server sooner.</p>
<p>Most gamers aim for under 50 ms. Under 20 ms is ideal for competitive play. If you are experiencing lag, rubberbanding, or hit registration issues, high ping is likely the cause.</p>
<p>Tips for lower gaming ping:</p>
<ul>
<li>Use a wired Ethernet connection</li>
<li>Connect to game servers in your region</li>
<li>Close background applications using bandwidth</li>
<li>Enable QoS on your router to prioritize game traffic</li>
</ul>

<h2>Ping for Video Calls</h2>
<p>Video conferencing works well with ping under 100 ms. Above that, conversations start feeling out of sync — you talk over each other because responses are delayed. If your video calls feel laggy despite good bandwidth, high ping is usually the culprit.</p>

<h2>Ping for Browsing</h2>
<p>Web browsing involves dozens of small requests (HTML, CSS, images, scripts). High ping adds delay to each one. With 200 ms ping, a page making 30 requests experiences noticeable sluggishness even on a fast connection. For general browsing, under 50 ms keeps things feeling snappy.</p>

<h2>Ping vs Jitter</h2>
<p>While ping measures average latency, <strong>jitter</strong> measures how much that latency varies. A connection with 30 ms ping but high jitter (varying between 10 ms and 80 ms) will feel worse than a steady 50 ms ping. Consistent timing matters as much as low timing, especially for real-time applications.</p>

<h2>Test Your Ping</h2>
<p>Curious about your latency? Use our <a href="https://howfastismy.net/tools/ping">ping test tool</a> to measure your ping to various servers. Or run a full <a href="https://howfastismy.net">speed test</a> that includes ping, jitter, and download/upload speeds in one go.</p>
<p>If your ping is higher than expected, try switching to a wired connection, restarting your router, or testing at different times of day to see if congestion is the issue.</p>
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((post) => post.slug);
}
