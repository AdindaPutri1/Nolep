"use client";

import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function DrowsinessDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrowsy, setIsDrowsy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [drowsyCount, setDrowsyCount] = useState(0);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { user } = useUser();

  // Refs for drowsiness detection logic
  const eyesClosedStartTime = useRef<number | null>(null);
  const isEyesClosed = useRef<boolean>(false);
  const isYawning = useRef<boolean>(false);
  const eyeClosedDuration = useRef<number>(0);
  const yawnDetected = useRef<boolean>(false);
  const drowsyReason = useRef<string>("");
  const previouslyDrowsy = useRef<boolean>(false);

  // Function to save drowsiness status to database
  const saveDrowsinessStatus = async (isSleepy: boolean) => {
    if (!user?.id) return;

    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          isSleepy,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save drowsiness status");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving drowsiness status:", error);
    }
  };

  // Load scripts manually to ensure they're properly loaded
  // Create audio element for alerts
  useEffect(() => {
    // Create audio element for drowsiness alerts
    audioRef.current = new Audio("/assets/bangun.mp3");
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Navigate to maps when drowsy count reaches multiples of 5
  useEffect(() => {
    if (drowsyCount > 0 && drowsyCount % 5 === 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            localStorage.setItem(
              "userLocation",
              JSON.stringify({ lat: latitude, lng: longitude })
            );
            localStorage.setItem("needsRestArea", "true");
            router.push("/maps");
          },
          (err) => {
            console.error("Error getting location before navigation:", err);
            localStorage.setItem("needsRestArea", "true");
            router.push("/maps");
          }
        );
      } else {
        localStorage.setItem("needsRestArea", "true");
        router.push("/maps");
      }
    }
  }, [drowsyCount, router]);

  // Play alert sound when drowsy count reaches specific thresholds
  useEffect(() => {
    if (drowsyCount === 3 || drowsyCount === 6 || drowsyCount === 9) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio alert:", err);
        });
      }
    }
  }, [drowsyCount]);

  useEffect(() => {
    const loadScripts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        // Function to load a script
        const loadScript = (src: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
              resolve();
              return;
            }

            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () =>
              reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
          });
        };

        // Load MediaPipe scripts in sequence
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/face_mesh.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js"
        );

        // Give browser a moment to initialize the loaded libraries
        setTimeout(() => {
          setIsLoading(false);
          initCamera();
        }, 1000);
      } catch (error) {
        console.error("Error loading MediaPipe scripts:", error);
        setErrorMessage("Failed to load required libraries. Please try again.");
        setIsLoading(false);
      }
    };

    loadScripts();

    // Cleanup function
    return () => {
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch (e) {
          console.error("Error stopping camera:", e);
        }
      }
    };
  }, []);

  const initCamera = async () => {
    try {
      if (
        !(window as any).FaceMesh ||
        !(window as any).drawConnectors ||
        !(window as any).Camera
      ) {
        throw new Error("MediaPipe libraries not loaded properly");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((e) => {
              console.error("Error playing video:", e);
              setErrorMessage(
                "Couldn't start video stream. Please refresh and try again."
              );
            });
          }
        };

        initFaceMesh();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage(
        "Camera access is required. Please allow camera access and refresh the page."
      );
      setIsLoading(false);
    }
  };

  const initFaceMesh = () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const FaceMesh = (window as any).FaceMesh;
      const drawConnectors = (window as any).drawConnectors;
      const FACEMESH_TESSELATION = (window as any).FACEMESH_TESSELATION;
      const Camera = (window as any).Camera;

      faceMeshRef.current = new FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`;
        },
      });

      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMeshRef.current.onResults((results: any) => {
        const canvasCtx = canvasRef.current?.getContext("2d");
        if (!canvasRef.current || !canvasCtx) return;

        canvasCtx.save();
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        if (
          results.multiFaceLandmarks &&
          results.multiFaceLandmarks.length > 0
        ) {
          const landmarks = results.multiFaceLandmarks[0];

          // Draw face mesh connections
          drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });

          // Calculate Eye Aspect Ratio (EAR)
          const EAR = (p: any[]) => {
            const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);
            const A = dist(p[1], p[5]);
            const B = dist(p[2], p[4]);
            const C = dist(p[0], p[3]);
            return (A + B) / (2.0 * C);
          };

          const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);

          // Eye landmark indices for MediaPipe face mesh
          const leftEyePoints = [
            landmarks[33],
            landmarks[160],
            landmarks[158],
            landmarks[133],
            landmarks[153],
            landmarks[144],
          ];

          const rightEyePoints = [
            landmarks[263],
            landmarks[387],
            landmarks[386],
            landmarks[362],
            landmarks[380],
            landmarks[373],
          ];

          // Mouth landmarks for yawn detection
          const upperLip = landmarks[13];
          const lowerLip = landmarks[14];
          const mouthTop = landmarks[82];
          const mouthBottom = landmarks[18];

          // Calculate mouth aspect ratio (MAR) for yawn detection
          const mouthHeight = dist(upperLip, lowerLip);
          const mouthWidth = dist(landmarks[78], landmarks[308]);
          const innerMouthHeight = dist(mouthTop, mouthBottom);

          const MAR = mouthHeight / mouthWidth;
          const innerMAR = innerMouthHeight / mouthWidth;

          // Get average EAR from both eyes
          const leftEAR = EAR(leftEyePoints);
          const rightEAR = EAR(rightEyePoints);
          const averageEAR = (leftEAR + rightEAR) / 2;

          // Define thresholds
          const EAR_THRESHOLD = 0.22;
          const MAR_THRESHOLD = 0.6;
          const INNER_MAR_THRESHOLD = 0.25;

          // Eyes closed detection
          const eyesClosed = averageEAR < EAR_THRESHOLD;

          // Yawn detection
          const isYawningNow =
            MAR > MAR_THRESHOLD && innerMAR > INNER_MAR_THRESHOLD;

          // Handle eyes closed time tracking
          const currentTime = performance.now();

          if (eyesClosed) {
            if (!isEyesClosed.current) {
              eyesClosedStartTime.current = currentTime;
              isEyesClosed.current = true;
            }

            if (eyesClosedStartTime.current) {
              eyeClosedDuration.current =
                (currentTime - eyesClosedStartTime.current) / 1000;
            }
          } else {
            isEyesClosed.current = false;
            eyesClosedStartTime.current = null;
            eyeClosedDuration.current = 0;
          }

          // Update yawn detection state
          isYawning.current = isYawningNow;
          if (isYawningNow) {
            yawnDetected.current = true;
          }

          // Debug visuals - draw landmarks
          canvasCtx.fillStyle = eyesClosed ? "#FF0000" : "#00FF00";
          leftEyePoints.forEach((point) => {
            canvasCtx.beginPath();
            canvasCtx.arc(
              point.x * canvasRef.current!.width,
              point.y * canvasRef.current!.height,
              2,
              0,
              2 * Math.PI
            );
            canvasCtx.fill();
          });

          rightEyePoints.forEach((point) => {
            canvasCtx.beginPath();
            canvasCtx.arc(
              point.x * canvasRef.current!.width,
              point.y * canvasRef.current!.height,
              2,
              0,
              2 * Math.PI
            );
            canvasCtx.fill();
          });

          // Mouth
          canvasCtx.fillStyle = isYawningNow ? "#FF0000" : "#0000FF";
          [upperLip, lowerLip, mouthTop, mouthBottom].forEach((point) => {
            canvasCtx.beginPath();
            canvasCtx.arc(
              point.x * canvasRef.current!.width,
              point.y * canvasRef.current!.height,
              2,
              0,
              2 * Math.PI
            );
            canvasCtx.fill();
          });

          // Combined drowsiness detection
          let isDrowsyNow = false;

          if (eyeClosedDuration.current > 1) {
            isDrowsyNow = true;
            drowsyReason.current = "Mata tertutup > 1 detik";
          } else if (yawnDetected.current && isYawning.current) {
            isDrowsyNow = true;
            drowsyReason.current = "Menguap terdeteksi";
          } else {
            drowsyReason.current = "";
            if (MAR < 0.4 && innerMAR < 0.1) {
              yawnDetected.current = false;
            }
          }

          // Save to database when drowsiness is detected
          if (isDrowsyNow && !previouslyDrowsy.current && user?.id) {
            setDrowsyCount((prevCount) => prevCount + 1);
            saveDrowsinessStatus(true);
          }

          previouslyDrowsy.current = isDrowsyNow;
          setIsDrowsy(isDrowsyNow);

          // Draw debug text
          canvasCtx.font = "16px Arial";
          canvasCtx.fillStyle = "#FFFFFF";
          canvasCtx.fillText(`EAR: ${averageEAR.toFixed(2)}`, 20, 30);
          canvasCtx.fillText(`MAR: ${MAR.toFixed(2)}`, 20, 50);
          canvasCtx.fillText(`Inner MAR: ${innerMAR.toFixed(2)}`, 20, 70);
          if (eyeClosedDuration.current > 0) {
            canvasCtx.fillText(
              `Eyes Closed: ${eyeClosedDuration.current.toFixed(1)}s`,
              20,
              90
            );
          }
        }

        canvasCtx.restore();
      });

      // Initialize camera with FaceMesh
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && faceMeshRef.current) {
            await faceMeshRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current.start().catch((error: any) => {
        console.error("Error starting camera:", error);
        setErrorMessage(
          "Failed to start camera. Please refresh and try again."
        );
      });
    } catch (error) {
      console.error("Error initializing FaceMesh:", error);
      setErrorMessage(
        "Failed to initialize facial detection. Please try refreshing the page."
      );
    }
  };

  return (
    <div className="relative">
      <Head>
        <title>Drowsiness Detection - Nolep</title>
      </Head>

      <div className="flex flex-col items-center max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Drowsiness Detection</h1>

        {isLoading ? (
          <div className="text-center p-8">
            <p className="mb-2">Loading MediaPipe components...</p>
            <div className="animate-pulse bg-gray-300 h-4 w-48 rounded"></div>
          </div>
        ) : errorMessage ? (
          <div className="text-center p-8 bg-red-100 rounded-lg">
            <p className="text-red-600">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <div className="relative">
            <video ref={videoRef} playsInline className="hidden" />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
              <div
                className={`px-4 py-2 rounded-lg text-lg ${
                  isDrowsy ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {isDrowsy
                  ? `😴 Mengantuk! (${drowsyReason.current})`
                  : "😊 Waspada"}
              </div>

              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg">
                Kantuk: {drowsyCount} kali
              </div>
            </div>

            {drowsyCount > 0 && drowsyCount % 5 === 0 && (
              <div className="absolute top-4 left-0 right-0 bg-yellow-100 p-4 rounded-lg text-center">
                <p className="text-yellow-800 font-medium">
                  Anda terdeteksi mengantuk {drowsyCount} kali. Mencari rest
                  area terdekat...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
