import SpeedTest from "./_components/SpeedTest";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-wide mb-1 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
        ⚡ Internet Speed Test
      </h1>
      <p className="text-sm text-indigo-300 mb-8">
        Measure download, upload, ping & jitter
      </p>
      <SpeedTest />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "howfastismy.net",
            url: "https://howfastismy.net",
            description: "Free internet speed test measuring download, upload, ping, jitter with an Internet Health Score.",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "All",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
