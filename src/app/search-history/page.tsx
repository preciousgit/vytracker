"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";

// Define the type for search history entries
interface SearchHistoryEntry {
  id: string;
  query: string;
  response: string;
  timestamp: string;
}

const SearchHistoryPage = () => {
  const router = useRouter();

  // Fetch search history from the backend
  const { 
    data: searchHistory = [], 
    error, 
    isLoading 
  } = useQuery<SearchHistoryEntry[], Error>({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      try {
        const res = await axios.get("/chat/history/userId");
        return res.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Failed to load search history");
        }
        throw err;
      }
    },
    retry: 1
  });

  // Handle error with useEffect to avoid updating during render
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred";
      toast.error(errorMessage);
    }
  }, [error]);

  // Render loading state
  if (isLoading) {
    return <div>Loading search history...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Search History</CardTitle>
        </CardHeader>
        <CardContent>
          {searchHistory.length === 0 ? (
            <div className="text-center text-gray-500">
              No search history available.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.query}</TableCell>
                    <TableCell>{entry.response}</TableCell>
                    <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Return to Search Button */}
      <Button onClick={() => router.push("/chatsearch")} className="w-full">
        Return to Search
      </Button>
    </div>
  );
};

export default SearchHistoryPage;