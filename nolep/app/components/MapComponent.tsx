"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Compass, Coffee, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import type { Map, Marker, LatLngBoundsExpression } from "leaflet";

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

interface RestArea {
  name: string;
  lat: number;
  lng: number;
  distance: number; // distance in km
  amenities?: string[];
}

// Tipe untuk Leaflet
type LeafletMapType = Map;
type LeafletMarkerType = Marker;
type LeafletType = typeof import("leaflet");

// Komponen ini hanya akan dijalankan di sisi klien
const MapContent = () => {
  const router = useRouter();

  // State untuk pencarian dan lokasi
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [needsRestArea, setNeedsRestArea] = useState(false);
  const [restAreas, setRestAreas] = useState<RestArea[]>([]);
  const [selectedRestArea, setSelectedRestArea] = useState<RestArea | null>(
    null
  );

  // State untuk menyimpan referensi Leaflet
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const leafletMap = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const restAreaMarkersRef = useRef<Marker[]>([]);
  const L = useRef<typeof import("leaflet") | null>(null);

  function debounce(
    func: (query: string) => void,
    wait: number
  ): (query: string) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (query: string) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(query), wait);
 
    };
  }

  // Search for rest areas near a location
  const searchRestAreas = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true);
      setError(null);

      try {
        // Search for "rest area", "gas station", "spbu", etc. near the location
        const searchTerms = [
          "rest+area",
          "gas+station",
          "spbu",
          "rumah+makan",
          "cafe",
        ];
        let allResults: SearchResult[] = [];

        // Use overpass API to get actual POIs or use Nominatim
        // For this implementation, we'll use Nominatim with different queries
        for (const term of searchTerms) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${term}&lat=${lat}&lon=${lng}&bounded=1&addressdetails=1&limit=5`
          );

          if (!response.ok) {
            throw new Error(`Failed to search for ${term}`);
          }

          const data = await response.json();
          allResults = [...allResults, ...data];
        }

        // Process and deduplicate results
        const processedResults: RestArea[] = allResults.map((result) => ({
          name: result.display_name.split(",")[0],
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          distance: calculateDistance(
            lat,
            lng,
            parseFloat(result.lat),
            parseFloat(result.lon)
          ),
          amenities: [],
        }));

        // Remove duplicates based on name or close proximity
        const uniqueResults = processedResults.filter(
          (result, index, self) =>
            index ===
            self.findIndex(
              (r) =>
                r.name === result.name ||
                calculateDistance(r.lat, r.lng, result.lat, result.lng) < 0.1
            )
        );

        // Sort by distance
        const sortedResults = uniqueResults.sort(
          (a, b) => a.distance - b.distance
        );

        // Take the closest 5
        const closestRestAreas = sortedResults.slice(0, 5);

        setRestAreas(closestRestAreas);

        // Add rest area markers to the map
        if (leafletMap.current && L.current && userLocation) {
          // Clear existing rest area markers
          restAreaMarkersRef.current.forEach((marker) => marker.remove());
          restAreaMarkersRef.current = [];

          // Create a coffee icon
          const coffeeIcon = L.current.divIcon({
            html: `<div style="background-color: #3b82f6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 14px;">☕</div>`,
            className: "custom-div-icon",
            iconSize: [25, 25],
            iconAnchor: [12, 12],
          });

          // Add markers for each rest area
          closestRestAreas.forEach((restArea) => {
            const marker = L.current!.marker([restArea.lat, restArea.lng], {
              icon: coffeeIcon,
            }).addTo(leafletMap.current!);

            marker.bindPopup(`
            <strong>${restArea.name}</strong><br>
            Jarak: ${restArea.distance.toFixed(1)} km
          `);

            marker.on("click", () => {
              setSelectedRestArea(restArea);
            });

            restAreaMarkersRef.current.push(marker);
          });

          // Fit map to include all markers if there are any
          if (closestRestAreas.length > 0) {
            const latLngs: LatLngExpression[] = [
              [userLocation.lat, userLocation.lng],
              ...closestRestAreas.map(
                (ra) => [ra.lat, ra.lng] as LatLngExpression
              ),
            ];
            const bounds = L.current.latLngBounds(latLngs);
            leafletMap.current.fitBounds(bounds, { padding: [50, 50] });
          }
        }
      } catch (err) {
        console.error("Error searching for rest areas:", err);
        setError("Failed to find rest areas. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [userLocation]
  );

  // Muat Leaflet hanya di sisi klien
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Import dinamis untuk Leaflet
        const leaflet = await import("leaflet");
        // Import CSS untuk Leaflet - perbaiki import CSS
        await import("leaflet/dist/leaflet.css").catch(() => {
          console.warn("Could not import Leaflet CSS");
        });

        L.current = leaflet;
        setLeafletLoaded(true);
      } catch (err) {
        console.error("Error loading Leaflet:", err);
        setError("Failed to load map library");
      }
    };

    loadLeaflet();
  }, []);

  // Check if we need to show rest areas
  useEffect(() => {
    const needsRest = localStorage.getItem("needsRestArea") === "true";
    setNeedsRestArea(needsRest);

    // Get user location from localStorage if available
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      try {
        const location = JSON.parse(storedLocation);
        setUserLocation(location);
      } catch (err) {
        console.error("Error parsing stored location:", err);
      }
    }
  }, []);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Use default location if can't get user location
        }
      );
    }
  }, []);

  const fixLeafletIcon = () => {
    if (!L.current) return;

    L.current.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  };

  // Initialize map after Leaflet is loaded and container is ready
  useEffect(() => {
    if (!leafletLoaded || !L.current || !mapRef.current || leafletMap.current)
      return;

    try {
      fixLeafletIcon();

      // Use user location if available, otherwise use default (Jakarta)
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

      // Add marker for initial position
      markerRef.current = L.current
        .marker([centerLat, centerLng])
        .addTo(leafletMap.current);

      // Add popup for user location
      if (userLocation) {
        markerRef.current.bindPopup("Lokasi Anda saat ini").openPopup();
      }

      // If we need to search for rest areas, do it now
      if (needsRestArea && userLocation) {
        searchRestAreas(userLocation.lat, userLocation.lng);
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

  }, [leafletLoaded, userLocation, needsRestArea]);

 distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Search for rest areas near a location
  const searchRestAreas = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Search for "rest area", "gas station", "spbu", etc. near the location
      const searchTerms = [
        "rest+area",
        "gas+station",
        "spbu",
        "rumah+makan",
        "cafe",
      ];
      let allResults: SearchResult[] = [];

      // Use overpass API to get actual POIs or use Nominatim
      // For this implementation, we'll use Nominatim with different queries
      for (const term of searchTerms) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${term}&lat=${lat}&lon=${lng}&bounded=1&addressdetails=1&limit=5`
        );

        if (!response.ok) {
          throw new Error(`Failed to search for ${term}`);
        }

        const data = await response.json();
        allResults = [...allResults, ...data];
      }

      // Process and deduplicate results
      const processedResults: RestArea[] = allResults.map(
        (result: SearchResult) => ({
          name: result.display_name.split(",")[0],
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          distance: calculateDistance(
            lat,
            lng,
            parseFloat(result.lat),
            parseFloat(result.lon)
          ),
          amenities: [],
        })
      );

      // Remove duplicates based on name or close proximity
      const uniqueResults = processedResults.filter(
        (result, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.name === result.name ||
              calculateDistance(r.lat, r.lng, result.lat, result.lng) < 0.1
          )
      );

      // Sort by distance
      const sortedResults = uniqueResults.sort(
        (a, b) => a.distance - b.distance
      );

      // Take the closest 5
      const closestRestAreas = sortedResults.slice(0, 5);

      setRestAreas(closestRestAreas);

      // Add rest area markers to the map
      if (leafletMap.current && L.current) {
        // Clear existing rest area markers
        restAreaMarkersRef.current.forEach((marker) => marker.remove());
        restAreaMarkersRef.current = [];

        // Create a coffee icon
        const coffeeIcon = L.current.divIcon({
          html: `<div style="background-color: #3b82f6; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 14px;">☕</div>`,
          className: "custom-div-icon",
          iconSize: [25, 25],
          iconAnchor: [12, 12],
        });

        // Add markers for each rest area
        closestRestAreas.forEach((restArea) => {
          const marker = L.current!.marker([restArea.lat, restArea.lng], {
            icon: coffeeIcon,
          }).addTo(leafletMap.current!);

          marker.bindPopup(`
            <strong>${restArea.name}</strong><br>
            Jarak: ${restArea.distance.toFixed(1)} km
          `);

          marker.on("click", () => {
            setSelectedRestArea(restArea);
          });

          restAreaMarkersRef.current.push(marker);
        });

        // Add a null check before accessing userLocation
        if (userLocation && closestRestAreas.length > 0) {
          const bounds = L.current.latLngBounds([
            [userLocation.lat, userLocation.lng] as [number, number],
            ...closestRestAreas.map(
              (ra) => [ra.lat, ra.lng] as [number, number]
            ),
          ]);
          leafletMap.current.fitBounds(bounds as LatLngBoundsExpression, {
            padding: [50, 50],
          });
        }
      }
    } catch (err) {
      console.error("Error searching for rest areas:", err);
      setError("Failed to find rest areas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  // Location search using OpenStreetMap Nominatim API
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

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((query: string) => {
      searchLocation(query);
    }, 500)
  ).current;

  // Update search when query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Move map to selected location
  const goToLocation = (lat: number, lon: number) => {
    if (!leafletMap.current || !L.current) return;

    leafletMap.current.setView([lat, lon], 16);

    // Remove existing marker if exists
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Add new marker
    markerRef.current = L.current.marker([lat, lon]).addTo(leafletMap.current);

    // Clear search results
    setSearchResults([]);
  };

  // Get current user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          goToLocation(latitude, longitude);

          // If we need rest areas, search them with the new location
          if (needsRestArea) {
            searchRestAreas(latitude, longitude);
          }
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

  // Find rest areas manually
  const findRestAreas = () => {
    if (!userLocation) {
      setError("Please allow location access to find rest areas");
      return;
    }

    searchRestAreas(userLocation.lat, userLocation.lng);

    // Set the flag for user feedback
    setNeedsRestArea(true);
  };

  // Back to drowsiness detection
  const goBackToDrowsinessDetection = () => {
    // Clear the rest area flag
    localStorage.setItem("needsRestArea", "false");
    router.push("/drowsiness");
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              {needsRestArea && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBackToDrowsinessDetection}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {needsRestArea ? "Rest Areas Near You" : "Interactive Map"}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                title="Get your current location"
              >
                <Compass className="h-4 w-4" />
              </Button>
              {!needsRestArea && (
                <Button
                  variant="default"
                  className="flex items-center gap-1"
                  onClick={findRestAreas}
                >
                  <Coffee className="h-4 w-4" />
                  <span>Find Rest Areas</span>
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {needsRestArea && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700 text-sm">
                Drowsiness detected! Here are rest areas near your location.
                Please consider taking a break.
              </p>
            </div>
          )}

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

          {restAreas.length > 0 && (
            <div className="mt-4 border rounded-md max-h-64 overflow-y-auto">
              <div className="p-2 bg-muted font-medium text-sm">
                {restAreas.length} Rest Areas Found
              </div>
              <ul className="divide-y">
                {restAreas.map((restArea, index) => (
                  <li
                    key={index}
                    className={`px-3 py-2 hover:bg-muted cursor-pointer flex items-center gap-2 ${
                      selectedRestArea?.name === restArea.name
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedRestArea(restArea);
                      goToLocation(restArea.lat, restArea.lng);
                    }}
                  >
                    <Coffee className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{restArea.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {restArea.distance.toFixed(1)} km away
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRestArea && (
            <div className="mt-4 border rounded-md p-3">
              <h3 className="font-medium">{selectedRestArea.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Distance: {selectedRestArea.distance.toFixed(1)} km
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedRestArea.lat},${selectedRestArea.lng}&travelmode=driving`,
                      "_blank"
                    )
                  }
                >
                  Get Directions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Using dynamic import with strong options to completely avoid SSR
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
