"use client";
import { useState } from "react";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface Pharmacy {
  name: string;
  address: string;
  location: { lat: number; lng: number };
}

const libraries = ["places"]; // Use string[] instead of Library[]

const PharmacySearchPage: FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default: San Francisco

  const handleSearch = async () => {
    try {
      // Replace with your actual backend API endpoint
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacy/search/pharmacy?query=${encodeURIComponent(searchQuery)}`;

      // Make the API request
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pharmacies");
      }

      // Parse the response data
      const data: Pharmacy[] = await response.json();

      // Update the state with the fetched pharmacies
      setPharmacies(data);

      // Center the map on the first result (if available)
      if (data.length > 0) {
        setMapCenter(data[0].location);
      } else {
        setMapCenter({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      alert("An error occurred while fetching pharmacies. Please try again.");
    }
  };

  const navigateToHistory = () => {
    router.push("/pharmacy-search-history");
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pharmacy Search</CardTitle>
          <p className="text-gray-600">Find nearby pharmacies by name or location.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="search">Search for a Pharmacy</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter pharmacy name or location"
              />
            </div>
            <Button onClick={handleSearch} className="w-full">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Section */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
        >
          {pharmacies.map((pharmacy, index) => (
            <Marker
              key={index}
              position={pharmacy.location}
              title={pharmacy.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Search Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {pharmacies.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <ul className="space-y-2">
              {pharmacies.map((pharmacy, index) => (
                <li key={index} className="border p-2 rounded">
                  <strong>{pharmacy.name}</strong>
                  <br />
                  {pharmacy.address}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Navigation to History Page */}
      <Button variant="outline" onClick={navigateToHistory}>
        View Search History
      </Button>
    </div>
  );
};

export default PharmacySearchPage;