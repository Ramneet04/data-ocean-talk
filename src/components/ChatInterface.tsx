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
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "data" | "chart" | "map";
  content: string;
  data?: any;
}

interface ChatInterfaceProps {
  onQuery: (query: string, params: string[], data: any) => void;
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

// Helper to generate mock data for each parameter
const generateMockData = (param: string) => {
  if (param === "temperature") {
    return {
      table: [
        { Depth: "0m", Temperature: "28.5°C" },
        { Depth: "50m", Temperature: "22.1°C" },
        { Depth: "200m", Temperature: "12.3°C" },
        { Depth: "1000m", Temperature: "3.8°C" },
      ],
      chart: [
        { depth: 0, value: 28.5 },
        { depth: 50, value: 22.1 },
        { depth: 200, value: 12.3 },
        { depth: 1000, value: 3.8 },
      ],
      label: "Temperature (°C)",
      color: "#f59e42",
    };
  }
  if (param === "salinity") {
    return {
      table: [
        { Depth: "0m", Salinity: "34.7 PSU" },
        { Depth: "50m", Salinity: "34.9 PSU" },
        { Depth: "200m", Salinity: "35.1 PSU" },
        { Depth: "1000m", Salinity: "35.3 PSU" },
      ],
      chart: [
        { depth: 0, value: 34.7 },
        { depth: 50, value: 34.9 },
        { depth: 200, value: 35.1 },
        { depth: 1000, value: 35.3 },
      ],
      label: "Salinity (PSU)",
      color: "#2563eb",
    };
  }
  if (param === "oxygen") {
    return {
      table: [
        { Depth: "0m", Oxygen: "5.1 ml/L" },
        { Depth: "50m", Oxygen: "4.2 ml/L" },
        { Depth: "200m", Oxygen: "2.0 ml/L" },
        { Depth: "1000m", Oxygen: "3.0 ml/L" },
      ],
      chart: [
        { depth: 0, value: 5.1 },
        { depth: 50, value: 4.2 },
        { depth: 200, value: 2.0 },
        { depth: 1000, value: 3.0 },
      ],
      label: "Oxygen (ml/L)",
      color: "#10b981",
    };
  }
  return null;
};

// Helper to extract depth from query
const extractDepth = (query: string): number | null => {
  const match = query.match(/(\d{2,4})\s?m/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

export const ChatInterface = ({
  onQuery,
  selectedFloat,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        id: "1",
        content:
          "Hello! I’m your AI oceanography assistant. Ask me anything about ARGO float data. For example:\n\n• 'Show salinity near equator in March 2023'\n• 'Compare oxygen levels at 100m vs 500m depth'\n• 'Plot temperature changes in Arabian Sea'",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      },
    ]
  );
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ---- DEMO AI RESPONSES ----
  const getAIResponses = (query: string, params: string[]) => {
    const lower = query.toLowerCase();
    const responses: Message[] = [];
    const dataForViz: any = {};
    const depth = extractDepth(query);

    // Handle greetings
    if (
      ["hi", "hello", "hey", "hola", "greetings"].some((greet) =>
        lower.trim().startsWith(greet)
      )
    ) {
      responses.push({
        id: Date.now().toString(),
        sender: "ai",
        type: "text",
        content: "Hello! How can I assist you with ARGO float data today?",
        timestamp: new Date(),
      });
      return { responses, dataForViz };
    }

    params.forEach((param) => {
      const mock = generateMockData(param);
      if (mock) {
        // If a depth is specified, find the value at that depth
        let valueAtDepth = null;
        if (depth !== null) {
          const found = mock.table.find(
            (row: any) =>
              row.Depth.replace("m", "").replace(" ", "") === String(depth)
          );
          if (found) {
            valueAtDepth = found[param.charAt(0).toUpperCase() + param.slice(1)];
          }
        }
        if (valueAtDepth) {
          responses.push({
            id: Date.now().toString() + param + "_text_depth",
            sender: "ai",
            type: "text",
            content: `The ${param} at ${depth}m in the Indian Ocean is ${valueAtDepth}.`,
            timestamp: new Date(),
          });
        } else {
          responses.push({
            id: Date.now().toString() + param + "_text",
            sender: "ai",
            type: "text",
            content: `Here is the ${param} profile:`,
            timestamp: new Date(),
          });
        }
        responses.push({
          id: Date.now().toString() + param + "_table",
          sender: "ai",
          type: "data",
          content: `${mock.label} Table`,
          data: mock.table,
          timestamp: new Date(),
        });
        responses.push({
          id: Date.now().toString() + param + "_chart",
          sender: "ai",
          type: "chart",
          content: `${mock.label} Chart`,
          data: mock.chart,
          timestamp: new Date(),
        });
        dataForViz[param] = mock;
      }
    });

    if (responses.length === 0 && /[a-zA-Z]/.test(query)) {
      responses.push({
        id: Date.now().toString(),
        sender: "ai",
        type: "text",
        content: `I'm not sure what you mean. Try specifying:\n\n• Geographic region\n• Time period\n• Depth range\n• Parameters of interest`,
        timestamp: new Date(),
      });
    }
    return { responses, dataForViz };
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
    const { responses, dataForViz } = getAIResponses(inputValue, params);
    onQuery(inputValue, params, dataForViz); // Pass data to parent

    setTimeout(() => {
      setMessages((prev) => [...prev, ...responses]);
      setIsLoading(false);
    }, 1000);
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
                                className="px-2 py-1 border-b text-left bg-muted-foreground/10 font-semibold"
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
                                  className="px-2 py-1 border-b whitespace-nowrap text-foreground"
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
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" onClick={() => navigate('/data')}>
                          View Analytics
                        </Button>
                      </div>
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
