"use client";

import Navbar from "@/components/ui/Navbar";
import CameraStream from "@/components/ui/CameraStream";
import { motion } from "framer-motion";
import Head from "next/head";
import { useState, useEffect } from "react"; 

export default function Camera() {

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Camera</h1>
        <p>Halaman kamera untuk mendeteksi kantuk pengemudi.</p>
      </main>
    </div>
  );

    const [scanning, setScanning] = useState(true); 
    const [result, setResult] = useState(""); 
    const [isDetecting, setIsDetecting] = useState(false); 

    // Fungsi untuk ngolah hasil dari AI
    function handleAIResult(data: string) {
        setScanning(false); 
        setResult(data);
        setIsDetecting(false); 
    }

    // Fungsi untuk memulai deteksi baru setiap 1 detik
    function startScanning() {
        setIsDetecting(true);
        setScanning(true); 
        setResult(""); 
    }

    useEffect(() => {
        const interval = setInterval(() => {
            startScanning(); // Mulai scanning ulang tiap 1 detik
        }, 1000); 

        return () => clearInterval(interval); 
    }, []);

    return (
        <>
            <Head>
                <title>Face Scan | Your App Name</title>
                <meta name="description" content="Scan your face for authentication" />
            </Head>

            <div className="min-h-screen bg-white">
                <Navbar />

                <main className="flex flex-col items-center justify-center p-6 bg-white mx-8 my-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 mt-4">Scan Your Face</h1>

                    {/* Kontainer kamera */}
                    <div className="w-full max-w-3xl h-[30rem] bg-pink-50 flex items-center justify-center overflow-hidden rounded-md border-2 border-gray-200 relative">
                        {/* Garis Scan */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1 bg-red-500 z-10"
                            animate={scanning ? { y: [0, 400, 0] } : { y: 200 }} //scanning
                            transition={{
                                duration: 2,
                                repeat: scanning ? Infinity : 0, 
                                ease: "easeInOut",
                            }}
                        />

                        {/* Kamera */}
                        <div className="w-full h-full">
                            <CameraStream onDetect={handleAIResult} /> {}
                        </div>

                        {/* Overlay Instructions */}
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-2 px-4">
                            {scanning
                                ? "Please position your face within the frame"
                                : result === "Mengantuk"
                                    ? "🚨 Kamu Mengantuk!"
                                    : "✅ Kamu Tidak Mengantuk"}
                        </div>
                    </div>

                    <p className="text-center mt-20 text-gray-800 text-sm">
                        {"If you're tired, let's head to the nearest "}
                        <a href="/rest-area" className="font-bold underline hover:text-blue-600 transition-colors">
                            Rest Area
                        </a>.
                    </p>
                </main>
            </div>
        </>
    );

}
