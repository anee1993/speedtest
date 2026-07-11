export default function Loading() {
  return (
    <div className="w-full max-w-lg animate-pulse">
      {/* Scene skeleton */}
      <div className="h-64 mb-4 rounded-2xl bg-white/[0.04]" />

      {/* Meters skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white/[0.04] rounded-xl p-3 h-24" />
        ))}
      </div>

      {/* Progress bar skeleton */}
      <div className="h-1.5 rounded-full bg-white/[0.06] mb-5" />

      {/* Status skeleton */}
      <div className="h-5 w-48 mx-auto rounded bg-white/[0.06] mb-5" />

      {/* Button skeleton */}
      <div className="h-12 rounded-xl bg-white/[0.06]" />
    </div>
  );
}
