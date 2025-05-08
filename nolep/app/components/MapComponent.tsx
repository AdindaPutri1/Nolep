"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Compass } from "lucide-react";
import dynamic from "next/dynamic";

// Definisi tipe-tipe untuk pencarian dan peta
interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

// Komponen ini hanya akan dijalankan di sisi klien
const MapContent = () => {
  // State untuk pencarian dan lokasi
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // State untuk menyimpan referensi Leaflet
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const L = useRef<any>(null);

  // Fungsi debounce dengan tipe yang tepat
  function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeout: NodeJS.Timeout | null = null;

    return function (this: any, ...args: Parameters<F>) {
      const context = this;
      const later = () => {
        timeout = null;
        func.apply(context, args);
      };
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Muat Leaflet hanya di sisi klien
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Import dinamis untuk Leaflet
        const leaflet = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        L.current = leaflet;
        setLeafletLoaded(true);
      } catch (err) {
        console.error("Error loading Leaflet:", err);
        setError("Failed to load map library");
      }
    };

    loadLeaflet();
  }, []);

  // Dapatkan lokasi pengguna saat komponen dimuat
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Gunakan lokasi default jika tidak bisa mendapatkan lokasi pengguna
        }
      );
    }
  }, []);

  // Fix untuk ikon Leaflet yang tidak muncul
  const fixLeafletIcon = () => {
    if (!L.current) return;

    delete L.current.Icon.Default.prototype._getIconUrl;

    L.current.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  };

  // Inisialisasi peta setelah Leaflet dimuat dan container siap
  useEffect(() => {
    if (!leafletLoaded || !L.current || !mapRef.current || leafletMap.current)
      return;

    try {
      fixLeafletIcon();

      // Gunakan lokasi pengguna jika tersedia, jika tidak gunakan default (Jakarta)
      const centerLat = userLocation?.lat || -6.2088;
      const centerLng = userLocation?.lng || 106.8456;

      leafletMap.current = L.current
        .map(mapRef.current)
        .setView([centerLat, centerLng], 13);

      L.current
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(leafletMap.current);

      // Tambahkan marker untuk posisi awal
      markerRef.current = L.current
        .marker([centerLat, centerLng])
        .addTo(leafletMap.current);

      // Tambahkan popup untuk lokasi pengguna
      if (userLocation) {
        markerRef.current.bindPopup("Lokasi Anda saat ini").openPopup();
      }
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize map");
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [leafletLoaded, userLocation]);

  // Pencarian lokasi menggunakan Nominatim OpenStreetMap API
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to search location");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError("Error searching for location. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi debounce untuk pencarian
  const debouncedSearch = useRef(
    debounce((query: string) => {
      searchLocation(query);
    }, 500)
  ).current;

  // Update pencarian saat query berubah
  useEffect(() => {
    debouncedSearch(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Pindah peta ke lokasi yang dipilih
  const goToLocation = (lat: number, lon: number) => {
    if (!leafletMap.current || !L.current) return;

    leafletMap.current.setView([lat, lon], 16);

    // Hapus marker yang ada jika ada
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Tambahkan marker baru
    markerRef.current = L.current.marker([lat, lon]).addTo(leafletMap.current);

    // Kosongkan hasil pencarian
    setSearchResults([]);
  };

  // Dapatkan lokasi pengguna saat ini
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          goToLocation(latitude, longitude);
        },
        (err) => {
          setError(`Error getting current location: ${err.message}`);
          console.error("Geolocation error:", err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>Interactive Map</div>
            <Button
              variant="outline"
              size="icon"
              onClick={getCurrentLocation}
              title="Get your current location"
            >
              <Compass className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading && (
            <div className="text-sm text-muted-foreground">Searching...</div>
          )}

          {error && <div className="text-sm text-red-500">{error}</div>}

          {searchResults.length > 0 && (
            <div className="mb-4 border rounded-md max-h-32 overflow-y-auto">
              <ul className="divide-y">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                    onClick={() =>
                      goToLocation(
                        parseFloat(result.lat),
                        parseFloat(result.lon)
                      )
                    }
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">
                      {result.display_name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            ref={mapRef}
            className="h-64 w-full rounded-md overflow-hidden border"
          />

          {!leafletLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-sm">Loading map...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Menggunakan dynamic import dengan opsi yang kuat untuk menghindari SSR sepenuhnya
const MapComponent = dynamic(() => Promise.resolve(() => <MapContent />), {
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
});

export default MapComponent;
