"use client";

import { useEffect, useRef } from "react";

export default function CameraStream({ onDetect }: { onDetect: (data: string) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        startCamera();
    }, []);

    // Deteksi wajah setiap 5 detik
    useEffect(() => {
        const simulateAIDetection = setInterval(() => {
            const isTired = Math.random() > 0.5 ? "Mengantuk" : "Tidak Mengantuk";
            onDetect(isTired);
        }, 5000); // Deteksi dilakukan setiap 5 detik

        return () => clearInterval(simulateAIDetection); 
    }, [onDetect]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-md"
        />
    );
}
