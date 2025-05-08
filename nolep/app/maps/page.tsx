"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/ui/Navbar";

// Import komponen peta secara dinamis untuk menghindari SSR
const MapComponentNoSSR = dynamic(
  () => import("@/app/components/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full rounded-md overflow-hidden border flex items-center justify-center bg-muted">
            <div className="text-muted-foreground">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    ),
  }
);

export default function Maps() {
  return (
    <>
      <Navbar />
      {/* Background Layer */}
      <div className="container mx-auto p-4">
        <main className="space-y-4">
          <h1 className="text-2xl font-bold">Maps</h1>
          <p>Ini adalah halaman peta interaktif.</p>
          <Suspense fallback={<div>Loading map...</div>}>
            <MapComponentNoSSR />
          </Suspense>
        </main>
      </div>
    </>
  );
}
