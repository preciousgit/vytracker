"use client";

import { useState, useEffect, useCallback } from "react";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getRequest } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Clock, Star } from "lucide-react";

// Define types for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: GoogleMapOptions) => GoogleMap;
        Marker: new (options: GoogleMarkerOptions) => GoogleMarker;
      };
    };
  }
}

interface GoogleMapOptions {
  center: { lat: number; lng: number };
  zoom: number;
}

interface GoogleMarker {
  addListener: (event: string, callback: () => void) => void;
}

interface GoogleMarkerOptions {
  position: { lat: number; lng: number };
  map: GoogleMap;
  title: string;
  icon?: {
    url: string;
  };
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GoogleMap {

}

// Define interfaces for hospital data
interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance: number;
  latitude: number;
  longitude: number;
  type: string;
  emergencyServices: boolean;
  rating: number;
  specialties: string[];
}

interface Location {
  latitude: number;
  longitude: number;
}

interface SearchHistoryItem {
  id: string;
  timestamp: number;
  searchTerm: string;
  searchRadius: string;
  filterType: string;
  hospitalType: string;
  hasEmergency: boolean;
  location: Location;
  results: number;
}

const HospitalLocator: FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [searchRadius, setSearchRadius] = useState("10");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterType, setFilterType] = useState("distance");
  const [hospitalType, setHospitalType] = useState("all");
  const [hasEmergency, setHasEmergency] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SearchHistoryItem | null>(null);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          toast.error("Unable to retrieve your location. Please enable location services.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  }, []);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("hospitalSearchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing search history:", error);
      }
    }
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google && !document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, []);

  // Fetch hospitals data
  const { data: hospitals = [], isLoading, error, refetch } = useQuery({
    queryKey: ["hospitals", userLocation, searchRadius, searchTerm, hospitalType, hasEmergency],
    queryFn: async () => {
      if (!userLocation) return [];
      
      try {
        // Replace with your actual API endpoint
        const response = await getRequest(`/Hospital/nearby?lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=${searchRadius}&type=${hospitalType}&emergency=${hasEmergency}`);
        
        if (response && response.data) {
          return response.data;
        }
        
        // Fallback data if API fails or isn't available
        return [
          {
            id: "1",
            name: "Memorial General Hospital",
            address: "1000 Medical Center Dr, Anytown, USA",
            phone: "(555) 123-4567",
            hours: "Open 24 Hours",
            distance: 1.3,
            latitude: userLocation.latitude + 0.009,
            longitude: userLocation.longitude + 0.004,
            type: "General",
            emergencyServices: true,
            rating: 4.2,
            specialties: ["Cardiology", "Orthopedics", "Neurology", "Oncology"]
          },
          {
            id: "2",
            name: "St. Mary's Medical Center",
            address: "2500 Community Ave, Anytown, USA",
            phone: "(555) 987-6543",
            hours: "Open 24 Hours",
            distance: 2.7,
            latitude: userLocation.latitude - 0.012,
            longitude: userLocation.longitude + 0.008,
            type: "General",
            emergencyServices: true,
            rating: 4.5,
            specialties: ["Pediatrics", "Obstetrics", "Cardiology", "Trauma"]
          },
          {
            id: "3",
            name: "Riverside Specialty Hospital",
            address: "300 Riverside Parkway, Anytown, USA",
            phone: "(555) 456-7890",
            hours: "Mon-Fri: 8am-8pm, Sat-Sun: 9am-5pm",
            distance: 3.5,
            latitude: userLocation.latitude + 0.018,
            longitude: userLocation.longitude - 0.005,
            type: "Specialty",
            emergencyServices: false,
            rating: 4.7,
            specialties: ["Orthopedics", "Sports Medicine", "Physical Therapy"]
          },
          {
            id: "4",
            name: "Children's Health Center",
            address: "500 Pediatric Lane, Anytown, USA",
            phone: "(555) 234-5678",
            hours: "Mon-Fri: 7am-9pm, Sat-Sun: 8am-6pm",
            distance: 4.2,
            latitude: userLocation.latitude - 0.007,
            longitude: userLocation.longitude - 0.015,
            type: "Children's",
            emergencyServices: true,
            rating: 4.8,
            specialties: ["Pediatrics", "Neonatology", "Pediatric Surgery", "Child Psychology"]
          },
          {
            id: "5",
            name: "Veterans Memorial Hospital",
            address: "1200 Veterans Blvd, Anytown, USA",
            phone: "(555) 345-6789",
            hours: "Open 24 Hours",
            distance: 5.8,
            latitude: userLocation.latitude + 0.022,
            longitude: userLocation.longitude + 0.017,
            type: "VA",
            emergencyServices: true,
            rating: 4.0,
            specialties: ["General Medicine", "Mental Health", "Rehabilitation", "Geriatrics"]
          },
          {
            id: "6",
            name: "University Medical Center",
            address: "800 Academic Way, Anytown, USA",
            phone: "(555) 876-5432",
            hours: "Open 24 Hours",
            distance: 6.3,
            latitude: userLocation.latitude - 0.019,
            longitude: userLocation.longitude + 0.021,
            type: "Teaching",
            emergencyServices: true,
            rating: 4.6,
            specialties: ["Research", "Oncology", "Transplant", "Neurosurgery", "Cardiology"]
          },
          {
            id: "7",
            name: "Community Outpatient Center",
            address: "450 Health Parkway, Anytown, USA",
            phone: "(555) 765-4321",
            hours: "Mon-Fri: 8am-6pm, Sat: 9am-1pm, Sun: Closed",
            distance: 3.1,
            latitude: userLocation.latitude + 0.005,
            longitude: userLocation.longitude - 0.011,
            type: "Outpatient",
            emergencyServices: false,
            rating: 4.3,
            specialties: ["Primary Care", "Imaging", "Lab Services", "Physical Therapy"]
          }
        ];
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        throw new Error("Failed to fetch nearby hospitals");
      }
    },
    enabled: !!userLocation,
  });

  // Define initializeMap as a useCallback function
  const initializeMap = useCallback(() => {
    const mapContainer = document.getElementById("hospital-map");
    if (!mapContainer || !userLocation || !window.google) return;

    const map = new window.google.maps.Map(mapContainer, {
      center: { lat: userLocation.latitude, lng: userLocation.longitude },
      zoom: 12,
    });

    // Add user location marker
    new window.google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map,
      title: "Your Location",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
    });

    // Add hospital markers
    hospitals.forEach((hospital: Hospital) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hospital.latitude, lng: hospital.longitude },
        map,
        title: hospital.name,
        icon: hospital.emergencyServices ? 
          { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" } : 
          undefined
      });

      // Add click event to marker
      marker.addListener("click", () => {
        setSelectedHospital(hospital);
        setShowDetailsDialog(true);
      });
    });
  }, [userLocation, hospitals]);

  // Initialize map when both the map script is loaded and user location is available
  useEffect(() => {
    if (mapLoaded && userLocation && hospitals.length > 0) {
      initializeMap();
    }
  }, [mapLoaded, userLocation, hospitals.length, initializeMap]);

  // Save search to history
  const saveSearchToHistory = () => {
    if (!userLocation) return;
    
    const newHistoryItem: SearchHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      searchTerm,
      searchRadius,
      filterType,
      hospitalType,
      hasEmergency,
      location: { ...userLocation },
      results: filteredHospitals.length,
    };
    
    const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 20); // Keep last 20 searches
    setSearchHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem("hospitalSearchHistory", JSON.stringify(updatedHistory));
    
    toast.success("Search saved to history");
  };

  // Load search from history
  const loadSearchFromHistory = (historyItem: SearchHistoryItem) => {
    setSearchTerm(historyItem.searchTerm);
    setSearchRadius(historyItem.searchRadius);
    setFilterType(historyItem.filterType);
    setHospitalType(historyItem.hospitalType);
    setHasEmergency(historyItem.hasEmergency);
    setSelectedHistoryItem(historyItem);
    setActiveTab("search");
    
    // Only update location if it's significantly different
    if (
      !userLocation || 
      Math.abs(userLocation.latitude - historyItem.location.latitude) > 0.001 ||
      Math.abs(userLocation.longitude - historyItem.location.longitude) > 0.001
    ) {
      setUserLocation(historyItem.location);
    }
    
    // Refetch with new parameters
    setTimeout(() => refetch(), 100);
  };

  // Delete history item
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(updatedHistory);
    localStorage.setItem("hospitalSearchHistory", JSON.stringify(updatedHistory));
    toast.success("Search removed from history");
  };

  // Clear all history
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("hospitalSearchHistory");
    toast.success("Search history cleared");
  };

  // Filter and sort hospitals
  const filteredHospitals = hospitals
    .filter((hospital: Hospital) => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hospital.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = hospitalType === "all" || hospital.type === hospitalType;
      
      const matchesEmergency = !hasEmergency || hospital.emergencyServices;
      
      return matchesSearch && matchesType && matchesEmergency;
    })
    .sort((a: Hospital, b: Hospital) => {
      if (filterType === "distance") {
        return a.distance - b.distance;
      } else if (filterType === "name") {
        return a.name.localeCompare(b.name);
      } else if (filterType === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  // Format date for history display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Render stars for rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400/50" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="search">Hospital Search</TabsTrigger>
          <TabsTrigger value="history">Search History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Find Nearby Hospitals</CardTitle>
                  <CardDescription>
                    Locate hospitals and medical centers in your area for emergency or specialized care
                  </CardDescription>
                </div>
                {selectedHistoryItem && (
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    <span>Loaded from history</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="grid gap-2">
                  <Label htmlFor="search">Search Hospitals</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, address, or specialty"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="radius">Search Radius (miles)</Label>
                  <Select
                    value={searchRadius}
                    onValueChange={setSearchRadius}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Search Radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                      <SelectItem value="100">100 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hospitalType">Hospital Type</Label>
                  <Select
                    value={hospitalType}
                    onValueChange={setHospitalType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hospital Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Specialty">Specialty</SelectItem>
                      <SelectItem value="Children's">Children&aposs</SelectItem>
                      <SelectItem value="Teaching">Teaching</SelectItem>
                      <SelectItem value="VA">Veterans (VA)</SelectItem>
                      <SelectItem value="Outpatient">Outpatient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sortBy">Sort By</Label>
                  <Select
                    value={filterType}
                    onValueChange={setFilterType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={hasEmergency}
                  onChange={(e) => setHasEmergency(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="emergency" className="text-sm font-medium">
                  Emergency Services Only
                </Label>
              </div>

              {/* Google Map */}
              <div
                id="hospital-map"
                className="w-full h-64 rounded-md mb-6 bg-gray-100"
              ></div>

              {/* Hospital List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {filteredHospitals.length} Hospitals Found
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveSearchToHistory}
                    disabled={!userLocation || isLoading || filteredHospitals.length === 0}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Save Search
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-8">Loading nearby hospitals...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    Failed to load hospitals. Please try again.
                  </div>
                ) : filteredHospitals.length === 0 ? (
                  <div className="text-center py-8">
                    No hospitals found matching your criteria. Try adjusting your filters or increasing your search radius.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHospitals.map((hospital: Hospital) => (
                      <Card key={hospital.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{hospital.name}</h3>
                                {hospital.emergencyServices && (
                                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                                    ER
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{hospital.address}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-gray-600 text-sm">{hospital.phone}</p>
                                <span className="text-gray-600 text-sm">{hospital.type}</span>
                              </div>
                              <div className="mt-1">{renderRating(hospital.rating)}</div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                                {hospital.distance} miles
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {hospital.specialties.slice(0, 3).map((specialty, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  {specialty}
                                </span>
                              ))}
                              {hospital.specialties.length > 3 && (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  +{hospital.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedHospital(hospital);
                                setShowDetailsDialog(true);
                              }}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Open Google Maps directions
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.latitude},${userLocation?.longitude}&destination=${hospital.latitude},${hospital.longitude}`,
                                  "_blank"
                                );
                              }}
                            >
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Search History</CardTitle>
                  <CardDescription>
                    View and reload your previous hospital searches
                  </CardDescription>
                </div>
                {searchHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllHistory}
                  >
                    Clear All History
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {searchHistory.length === 0 ? (
                <div className="text-center py-16">
                  <History className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Search History</h3>
                  <p className="text-gray-500">
                    Your previous searches will appear here so you can easily reload them
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchHistory.map((historyItem) => (
                    <Card 
                      key={historyItem.id} 
                      className="overflow-hidden cursor-pointer hover:bg-gray-50"
                      onClick={() => loadSearchFromHistory(historyItem)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {historyItem.searchTerm ? `"${historyItem.searchTerm}"` : "All Hospitals"}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {historyItem.results} results
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {historyItem.searchRadius} mile radius, 
                              {historyItem.hospitalType !== "all" ? ` ${historyItem.hospitalType} hospitals,` : ""}
                              {historyItem.hasEmergency ? " emergency services only," : ""} 
                              sorted by {historyItem.filterType}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              {formatDate(historyItem.timestamp)}
                            </p>
                          </div>
                          <div className="flex">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => deleteHistoryItem(historyItem.id, e)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hospital Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedHospital?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p>{selectedHospital?.address}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p>{selectedHospital?.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Hours</h4>
                <p>{selectedHospital?.hours}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Type</h4>
                <p>{selectedHospital?.type} Hospital</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Emergency Services</h4>
                <p>{selectedHospital?.emergencyServices ? "Available" : "Not Available"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                <div>{selectedHospital && renderRating(selectedHospital.rating)}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Specialties</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedHospital?.specialties.map((specialty, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Distance</h4>
                <p>{selectedHospital?.distance} miles from your location</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                className="flex-1"
                onClick={() => {
                  // Open Google Maps directions
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.latitude},${userLocation?.longitude}&destination=${selectedHospital?.latitude},${selectedHospital?.longitude}`,
                    "_blank"
                  );
                }}
              >
                Get Directions
              </Button>
              <Button
               variant="outline"
               className="flex-1"
               onClick={() => {
                window.location.href = `tel:${selectedHospital?.phone.replace(/[^0-9]/g, "")}`;
            }}
          >
            Call Hospital
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</div>
);
};

export default HospitalLocator;