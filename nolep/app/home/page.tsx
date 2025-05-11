// home/page.tsx
"use client";
import dynamic from "next/dynamic";
import Navbar from "../../components/ui/Navbar";

// Import ChartSection secara dinamis tanpa SSR
const ChartSection = dynamic(() => import("@/components/ui/ChartSection"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <h1 className="text-4xl font-bold text-center mt-20">
          Driver Drowsiness Monitor
        </h1>
        <ChartSection />
      </main>
    </>
  );
}
