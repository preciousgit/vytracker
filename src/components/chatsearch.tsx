import { useState } from "react";
import axios from "axios";

const ChatSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const res = await axios.post("http://localhost:4992/api/chat/generate", {
        Prompt: searchQuery,
      });

      setResponse(res.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Ask a medical AI..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded-md"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 cursor-pointer">
      🔍
      </button>

      {response && (
        <div className="mt-150 mr-35 p-3 border rounded-md bg-blue-300">
          <strong>AI Response:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
