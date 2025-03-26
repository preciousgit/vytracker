"use client";

import React, { useState } from "react";
import Link from "next/link";

// Define types for the props
interface ChatBoxProps {
  doctorName: string;
  patientName: string;
}

interface ChatMessage {
  sender: string;
  text: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ doctorName, patientName }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "Doctor", text: "Hello, how can I help you today?" },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Patient", text: message },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-[400px] h-[500px] bg-white rounded-lg flex flex-col p-5 shadow-xl">
        <div className="flex justify-between items-center border-b-2 pb-2 mb-4">
          <h3 className="text-xl m-0">Chat with {doctorName}</h3>
          <Link
            href="/appointment"
            className="bg-transparent border-none text-xl cursor-pointer"
          >
            X
          </Link>
        </div>
        <div className="flex-grow overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender.toLowerCase() === "patient" ? "justify-end" : "justify-start"} space-x-2`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-lg ${msg.sender.toLowerCase() === "patient" ? "bg-teal-100 text-right" : "bg-green-100"}`}
              >
                <span className="font-bold">{msg.sender}: </span>
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-4/5 p-2 border border-gray-300 rounded-md text-base"
          />
          <button
            onClick={handleSendMessage}
            className="w-1/5 p-3 ml-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
