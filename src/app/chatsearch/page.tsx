"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Define the type for search results
interface SearchResponse {
  response: string;
}

// Define the type for search history entries
interface SearchHistoryEntry {
  id: string;
  query: string;
  response: string;
  timestamp: string;
}

const ChatSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const router = useRouter();

  // Fetch search history from the backend
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const { data: searchHistory = [], error, isLoading: isQueryLoading } = useQuery<SearchHistoryEntry[], Error>({
  queryKey: ["searchHistory"],
  queryFn: async () => {
    const res = await axios.get("/chat/history/userId");
    return res.data;
  },
});

if (error) {
  toast.error(error.message || "Failed to load search history.");
};

  // Mutation for submitting a new search query
  const { mutate: submitSearch, isPending } = useMutation<SearchResponse, Error, { Prompt: string }>({
    mutationFn: async ({ Prompt }) => {
      const res = await axios.post("/chat/Generate/Fetch", { Prompt });
      return res.data;
    },
    onSuccess: (data) => {
      setResponse(data.response);
      toast.success("Search completed successfully.");
    },
    onError: (error) => {

      toast.error(error.message || "An error occurred while processing your request.");
    },
  });

  // Handle form submission
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.warn("Please enter a valid search query.");
      return;
    }

    submitSearch({ Prompt: searchQuery });
  };

  // Navigate to the search history page
  const navigateToHistory = () => {
    router.push("/search-history");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask a medical AI..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
       
        <Button onClick={handleSearch} disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Display Response */}
      {response && (
        <Card>
          <CardContent className="p-4">
            <strong>AI Response:</strong> {response}
          </CardContent>
        </Card>
      )}

      {/* View Search History Button */}
      <Button
        variant="outline"
        onClick={navigateToHistory}
        className="w-full"
      >
        View Search History
      </Button>
    </div>
  );
};

export default ChatSearch;