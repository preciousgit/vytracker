"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/api";
import { toast } from "react-toastify";

interface Message {
  id?: string;
  sender: string;
  text: string;
  timestamp?: string;
  status?: "sending" | "sent" | "error";
}

interface ChatBoxProps {
  doctorId?: string;
  doctorName?: string;
  patientId?: string;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  doctorId = "",
  doctorName = "Doctor",
  patientId = "",
  onClose,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["chatHistory", doctorId, patientId],
    queryFn: async () => {
      try {
        const endpoint = conversationId 
          ? `/Chat/messages/${conversationId}`
          : `/Chat/conversation?doctorId=${doctorId}&patientId=${patientId}`;
        
        const response = await getRequest(endpoint);
        
        if (!conversationId && response.data?.conversationId) {
          setConversationId(response.data.conversationId);
        }  
        return response.data?.messages || [];
      } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
      }
    },
    enabled: !!doctorId && !!patientId,
  });

  useEffect(() => {
    if (!isLoadingHistory && chatHistory) {
      if (chatHistory.length === 0) {
        setMessages([
          { sender: doctorName, text: "Hello, how can I help you today?" },
        ]);
      } else {
        setMessages(chatHistory);
      }
    }
  }, [chatHistory, isLoadingHistory, doctorName]);

  // Message sending mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: { text: string; conversationId?: string }) => {
      try {
        const endpoint = "/Chats/create/submit";
        const payload = {
          text: newMessage.text,
          conversationId: newMessage.conversationId,
          senderId: patientId,
          receiverId: doctorId,
          senderType: "Patient",
        };
        
        const response = await postRequest(endpoint, payload);
        return response.data;
      } catch (error: unknown) {
        if (error && typeof error === "object" && "response" in error) {
          const errorResponse = (error as { response?: { data?: unknown } }).response;
          if (errorResponse?.data) {
            const errorData = errorResponse.data;
            throw new Error(
              typeof errorData === "string"
                ? errorData
                : typeof errorData === "object" && errorData !== null && "message" in errorData
                ? String(errorData.message)
                : "Failed to send message"
            );
          }
        }
        throw new Error("Failed to send message. Please try again later.");
      }
    },
    onSuccess: (data) => {
      // If we get a conversation ID back and don't have one yet, save it
      if (data && data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Update the temporary message with the confirmed one
      setMessages(current => 
        current.map(msg => 
          msg.status === "sending" 
            ? { ...msg, id: data?.messageId, status: "sent", timestamp: data?.timestamp } 
            : msg
        )
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while sending your message");
      
      // Mark the message as error
      setMessages(current => 
        current.map(msg => 
          msg.status === "sending" ? { ...msg, status: "error" } : msg
        )
      );
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add the message to the UI immediately with "sending" status
      const newMessage: Message = {
        sender: "Patient",
        text: message,
        status: "sending",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Clear input
      setMessage("");
      
      // Send the message via API
      sendMessageMutation.mutate({ 
        text: message, 
        conversationId 
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-full max-w-md h-[500px] bg-background rounded-lg flex flex-col shadow-xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">Chat with {doctorName}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "Patient" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === "Patient"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } relative`}
                  >
                    <div className="font-semibold text-xs mb-1">
                      {msg.sender}
                      {msg.timestamp && (
                        <span className="ml-2 font-normal text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <div>{msg.text}</div>
                    {msg.status === "sending" && (
                      <div className="absolute bottom-1 right-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                      </div>
                    )}
                    {msg.status === "error" && (
                      <div className="absolute bottom-1 right-1 text-red-500 text-xs">
                        Error
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t p-4 flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage} 
            className="shrink-0"
            disabled={sendMessageMutation.isPending || !message.trim()}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;