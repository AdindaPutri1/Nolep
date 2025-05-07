"use client";
import Navbar from "../../components/ui/Navbar";
import dynamic from "next/dynamic";

export default function function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
          <h1 className="text-4xl font-bold text-center mt-20">Driver Drowsiness Monitor</h1>
          <ChartSection />
      </main>
    </>
  );
