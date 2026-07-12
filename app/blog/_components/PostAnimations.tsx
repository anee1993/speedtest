"use client";

import dynamic from "next/dynamic";

const MbpsAnimation = dynamic(() => import("./MbpsAnimation"), { ssr: false });
const PingAnimation = dynamic(() => import("./PingAnimation"), { ssr: false });
const JitterAnimation = dynamic(() => import("./JitterAnimation"), { ssr: false });
const BandwidthSplitAnimation = dynamic(() => import("./BandwidthSplitAnimation"), { ssr: false });
const FiberCableDslAnimation = dynamic(() => import("./FiberCableDslAnimation"), { ssr: false });
const ThrottlingAnimation = dynamic(() => import("./ThrottlingAnimation"), { ssr: false });

// Maps article slugs to their animated diagram components
const ANIMATIONS: Record<string, React.ComponentType> = {
  "mbps-vs-mbs": MbpsAnimation,
  "what-is-ping": PingAnimation,
  "what-is-jitter": JitterAnimation,
  "is-100-mbps-enough-for-family": BandwidthSplitAnimation,
  "fiber-vs-cable-vs-dsl": FiberCableDslAnimation,
  "is-my-isp-throttling-me": ThrottlingAnimation,
};

export default function PostAnimation({ slug }: { slug: string }) {
  const Component = ANIMATIONS[slug];
  if (!Component) return null;
  return <Component />;
}
