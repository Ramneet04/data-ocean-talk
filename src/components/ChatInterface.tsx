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

// Helper functions stay the same
const extractParams = (query: string): string[] => {
  const lower = query.toLowerCase();
  const params: string[] = [];
  if (lower.includes("temperature")) params.push("temperature");
  if (lower.includes("salinity")) params.push("salinity");
  if (lower.includes("oxygen")) params.push("oxygen");
  return params.length ? params : ["temperature", "salinity", "oxygen"];
};

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

const extractDepth = (query: string): number | null => {
  const match = query.match(/(\d{1,4})\s?m/);
  return match ? parseInt(match[1], 10) : null;
};

export const ChatInterface = ({ onQuery }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "👋 Hello! I’m your Indian Ocean ARGO assistant.\nAsk me about temperature, salinity, oxygen or floats.\n\nExamples:\n• Show temperature at 1000m\n• Salinity near equator\n• Compare oxygen at 200m & 500m\n• Plot temperature for Bay of Bengal",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getAIResponses = (query: string, params: string[]) => {
    const responses: Message[] = [];
    const dataForViz: any = {};
    const depth = extractDepth(query);

    params.forEach((param) => {
      const mock = generateMockData(param);
      if (!mock) return;

      responses.push({
        id: crypto.randomUUID(),
        sender: "ai",
        type: "text",
        content:
          depth !== null
            ? `At ${depth}m, ${param} is ${
                mock.table.find((row) => row.Depth === `${depth}m`)
                  ? Object.values(mock.table.find((row) => row.Depth === `${depth}m`)!)[1]
                  : "N/A"
              }`
            : `Here’s the ${param} profile for the Indian Ocean:`,
        timestamp: new Date(),
      });

      responses.push({
        id: crypto.randomUUID(),
        sender: "ai",
        type: "data",
        content: `${mock.label} Table`,
        data: mock.table,
        timestamp: new Date(),
      });

      responses.push({
        id: crypto.randomUUID(),
        sender: "ai",
        type: "chart",
        content: `${mock.label} Chart`,
        data: mock.chart,
        timestamp: new Date(),
      });

      dataForViz[param] = mock;
    });

    return { responses, dataForViz };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const params = extractParams(inputValue);
    const { responses, dataForViz } = getAIResponses(inputValue, params);
    onQuery(inputValue, params, dataForViz);

    setTimeout(() => {
      setMessages((prev) => [...prev, ...responses]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-3xl mx-auto bg-background border rounded-lg shadow-sm">
      {/* Chat area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex space-x-3 max-w-[75%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={message.sender === "ai" ? "bg-primary text-primary-foreground" : "bg-accent"}>
                    {message.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 text-sm leading-relaxed ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.type === "text" && <p>{message.content}</p>}

                  {message.type === "data" && message.data && (
                    <div className="overflow-x-auto mt-2">
                      <table className="text-xs border-collapse border w-full">
                        <thead>
                          <tr>
                            {Object.keys(message.data[0]).map((col) => (
                              <th key={col} className="px-2 py-1 border-b bg-muted-foreground/10 font-medium">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {message.data.map((row: any, i: number) => (
                            <tr key={i}>
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="px-2 py-1 border-b">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {message.type === "chart" && message.data && (
                    <div className="h-40 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={message.data}>
                          <XAxis dataKey="depth" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#2563eb" />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" onClick={() => navigate("/data")}>
                          View Full Data →
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing data...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="flex space-x-2 p-3 border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about temperature, salinity, oxygen levels..."
          className="flex-1"
          disabled={isLoading}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
