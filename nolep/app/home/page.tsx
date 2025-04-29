"use client";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";

const ChartSection = dynamic(() => import("@/components/ui/ChartSection"), {
    ssr: false,
});

export default function Home() {
    return (
        <div>
            <Navbar />
            <main className="p-6">
                <h1 className="text-4xl font-bold text-center mt-20">Driver Drowsiness Monitor</h1>
                <ChartSection />
            </main>
        </div>
    );
}
