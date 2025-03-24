"use client";
import { useState } from "react";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface SearchHistoryItem {
  query: string;
  location: { lat: number; lng: number };
}

const mockSearchHistory: SearchHistoryItem[] = [
  { query: "CVS Pharmacy", location: { lat: 37.7749, lng: -122.4194 } },
  { query: "Walgreens", location: { lat: 37.7849, lng: -122.4294 } },
];

const PharmacySearchHistoryPage: FC = () => {
  const router = useRouter();
  const [history] = useState<SearchHistoryItem[]>(mockSearchHistory);

  const navigateToSearch = () => {
    router.push("/pharmacy-search");
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Search History</CardTitle>
          <p className="text-gray-600">View your past pharmacy searches.</p>
        </CardHeader>
        <CardContent>
          {/* Replace this with a proper table component if available */}
          <div>
            <h3 className="font-medium">Search Queries:</h3>
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li key={index} className="border p-2 rounded">
                  <strong>{item.query}</strong>
                  <br />
                  Location: {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Map Section */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={history[0]?.location || { lat: 37.7749, lng: -122.4194 }}
          zoom={12}
        >
          {history.map((item, index) => (
            <Marker
              key={index}
              position={item.location}
              title={item.query}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Navigation to Search Page */}
      <Button onClick={navigateToSearch}>Back to Search</Button>
    </div>
  );
};

export default PharmacySearchHistoryPage;