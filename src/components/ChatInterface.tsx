import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Message {
  id: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "data" | "chart" | "map";
  content: string;
  data?: any;
}

interface ChatInterfaceProps {
  onQuery: (query: string, params: string[]) => void; // changed
  selectedFloat: string | null;
}

// Helper to extract parameters from query
const extractParams = (query: string): string[] => {
  const lower = query.toLowerCase();
  const params: string[] = [];
  if (lower.includes("temperature")) params.push("temperature");
  if (lower.includes("salinity")) params.push("salinity");
  if (lower.includes("oxygen")) params.push("oxygen");
  return params.length ? params : ["temperature", "salinity", "oxygen"];
};

export const ChatInterface = ({
  onQuery,
  selectedFloat,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I’m your AI oceanography assistant. Ask me anything about ARGO float data. For example:\n\n• 'Show salinity near equator in March 2023'\n• 'Compare oxygen levels at 100m vs 500m depth'\n• 'Plot temperature changes in Arabian Sea'",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ---- DEMO AI RESPONSES ----
  const getAIResponses = (query: string): Message[] => {
    const lower = query.toLowerCase();

    // Handle greetings
    if (
      ["hi", "hello", "hey", "hola", "greetings"].some((greet) =>
        lower.trim().startsWith(greet)
      )
    ) {
      return [
        {
          id: Date.now().toString(),
          sender: "ai",
          type: "text",
          content: "Hello! How can I assist you with ARGO float data today?",
          timestamp: new Date(),
        },
      ];
    }

    if (lower.includes("temperature") && lower.includes("salinity")) {
      return [
        {
          id: Date.now().toString(),
          sender: "ai",
          type: "text",
          content:
            "I found both temperature and salinity data for your region. Here's a summary:",
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: "data",
          content: "Combined temperature and salinity data",
          data: [
            { Depth: "0m", Temp: "27°C", Salinity: "34.5 PSU" },
            { Depth: "100m", Temp: "18°C", Salinity: "34.8 PSU" },
            { Depth: "500m", Temp: "4°C", Salinity: "35.2 PSU" },
          ],
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 2).toString(),
          sender: "ai",
          type: "chart",
          content: "Temperature and Salinity profile chart",
          data: [
            { depth: 0, temp: 27, sal: 34.5 },
            { depth: 100, temp: 18, sal: 34.8 },
            { depth: 500, temp: 4, sal: 35.2 },
          ],
          timestamp: new Date(),
        },
      ];
    }

    if (lower.includes("salinity")) {
      return [
        {
          id: Date.now().toString(),
          sender: "ai",
          type: "text",
          content:
            "I found salinity data for your region. Here’s a quick summary:",
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: "data",
          content: "Tabular salinity data",
          data: [
            { Depth: "0m", Salinity: "34.5 PSU" },
            { Depth: "100m", Salinity: "34.8 PSU" },
            { Depth: "500m", Salinity: "35.2 PSU" },
          ],
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 2).toString(),
          sender: "ai",
          type: "chart",
          content: "Salinity profile chart",
          data: [
            { depth: 0, sal: 34.5 },
            { depth: 100, sal: 34.8 },
            { depth: 500, sal: 35.2 },
          ],
          timestamp: new Date(),
        },
      ];
    }

    if (lower.includes("temperature")) {
      return [
        {
          id: Date.now().toString(),
          sender: "ai",
          type: "text",
          content:
            "Temperature analysis complete! The ocean shows a clear stratification:",
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: "data",
          content: "Temperature table",
          data: [
            { Depth: "Surface", Temp: "27°C" },
            { Depth: "Thermocline (~100m)", Temp: "18°C" },
            { Depth: "Deep (1000m+)", Temp: "4°C" },
          ],
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 2).toString(),
          sender: "ai",
          type: "chart",
          content: "Temperature vs Depth",
          data: [
            { depth: 0, temp: 27 },
            { depth: 100, temp: 18 },
            { depth: 1000, temp: 4 },
          ],
          timestamp: new Date(),
        },
      ];
    }

    if (lower.includes("oxygen")) {
      return [
        {
          id: Date.now().toString(),
          sender: "ai",
          type: "text",
          content: "Oxygen levels indicate a strong oxygen minimum zone:",
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          type: "data",
          content: "Oxygen levels table",
          data: [
            { Depth: "Surface", Oxygen: "5.0 ml/L" },
            { Depth: "500m", Oxygen: "0.3 ml/L" },
            { Depth: "1000m", Oxygen: "2.5 ml/L" },
          ],
          timestamp: new Date(),
        },
      ];
    }

    if (selectedFloat) {
      return [
        {
          id: Date.now().toString(),
          sender: "ai",
          type: "text",
          content: `Based on float ${selectedFloat}, I can provide specific data analysis. Available parameters:\n\n• Temperature profiles\n• Salinity measurements\n• Oxygen concentrations\n• Pressure/depth readings\n• Time series data`,
          timestamp: new Date(),
        },
      ];
    }

    // Only fallback for actual data queries, not greetings
    if (/[a-zA-Z]/.test(query)) {
      return [
        {
          id: Date.now().toString(),
          sender: "ai",
          type: "text",
          content: `I'm not sure what you mean. Try specifying:\n\n• Geographic region\n• Time period\n• Depth range\n• Parameters of interest`,
          timestamp: new Date(),
        },
      ];
    }

    // Otherwise, no response
    return [];
  };

  // ---- SENDING ----
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Extract parameters and pass to onQuery
    const params = extractParams(inputValue);
    onQuery(inputValue, params);

    // Simulated AI response
    setTimeout(() => {
      const aiResponses = getAIResponses(inputValue);
      setMessages((prev) => [...prev, ...aiResponses]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 border border-border rounded-lg mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex space-x-3 max-w-[80%] ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className={
                      message.sender === "ai"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                    }
                  >
                    {message.sender === "ai" ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {/* Render Different Message Types */}
                  {message.type === "text" && (
                    <p className="text-sm whitespace-pre-line">
                      {message.content}
                    </p>
                  )}

                  {message.type === "data" && message.data && (
                    <div className="overflow-x-auto">
                      <table className="text-sm border-collapse border w-full">
                        <thead>
                          <tr>
                            {Object.keys(message.data[0]).map((col) => (
                              <th
                                key={col}
                                className="px-2 py-1 border-b text-left"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {message.data.map((row: any, i: number) => (
                            <tr key={i}>
                              {Object.values(row).map((val, j) => (
                                <td
                                  key={j}
                                  className="px-2 py-1 border-b whitespace-nowrap"
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {message.type === "chart" && message.data && (
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={message.data}>
                          <XAxis dataKey="depth" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey={Object.keys(message.data[0])[1]} // auto pick 2nd column
                            stroke="#2563eb"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {message.type === "map" && (
                    <div className="h-40 w-full bg-gray-200 flex items-center justify-center text-xs">
                      [Map visualization placeholder]
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[80%]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing data...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about temperature, salinity, oxygen levels, or specific floats..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
