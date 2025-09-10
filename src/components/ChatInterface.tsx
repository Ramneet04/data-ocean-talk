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

// ---- Helper to extract parameters from query ----
const extractParams = (query: string): string[] => {
  const lower = query.toLowerCase();
  const params: string[] = [];
  if (lower.includes("temperature")) params.push("temperature");
  if (lower.includes("salinity")) params.push("salinity");
  if (lower.includes("oxygen")) params.push("oxygen");
  return params.length ? params : ["temperature", "salinity", "oxygen"];
};

// ---- Helper to generate mock data ----
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

// ---- Helper to extract depth from query ----
const extractDepth = (query: string): number | null => {
  const match = query.match(/(\d{1,4})\s?m/);
  return match ? parseInt(match[1], 10) : null;
};

export const ChatInterface = ({ onQuery, selectedFloat }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I’m your Indian Ocean ARGO data assistant. Ask me anything about Indian Ocean ARGO float data.\n\nExamples:\n• 'Show temperature at 1000m in the Indian Ocean'\n• 'What is the salinity profile near the equator?'\n• 'Compare oxygen levels at 200m and 500m depth in the India Ocean'\n• 'Plot temperature and salinity for the Bay of Bengal'",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ---- Generate AI-like responses ----
  const getAIResponses = (query: string, params: string[]) => {
    const lower = query.toLowerCase();
    const responses: Message[] = [];
    const dataForViz: any = {};
    const depth = extractDepth(query);

    // Greetings
    if (["hi", "hello", "hey"].some((greet) => lower.startsWith(greet))) {
      responses.push({
        id: crypto.randomUUID(),
        sender: "ai",
        type: "text",
        content: "Hi there! 👋 What Indian Ocean parameter would you like to explore today?",
        timestamp: new Date(),
      });
      return { responses, dataForViz };
    }

    params.forEach((param) => {
      const mock = generateMockData(param);
      if (!mock) return;

      // Add text summary
      if (depth !== null) {
        const valueAtDepth = mock.table.find(
          (row) => row.Depth.replace("m", "") === String(depth)
        );
        responses.push({
          id: crypto.randomUUID(),
          sender: "ai",
          type: "text",
          content: valueAtDepth
            ? `In the Indian Ocean at ${depth}m, ${param} is ${Object.values(valueAtDepth)[1]}.`
            : `No exact match for ${depth}m depth in the Indian Ocean, showing full ${param} profile.`,
          timestamp: new Date(),
        });
      } else {
        responses.push({
          id: crypto.randomUUID(),
          sender: "ai",
          type: "text",
          content: `Here is the Indian Ocean ${param} profile you requested:`,
          timestamp: new Date(),
        });
      }

      // Add table
      responses.push({
        id: crypto.randomUUID(),
        sender: "ai",
        type: "data",
        content: `${mock.label} Table`,
        data: mock.table,
        timestamp: new Date(),
      });

      // Add chart
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

    if (responses.length === 0) {
      responses.push({
        id: crypto.randomUUID(),
        sender: "ai",
        type: "text",
        content:
          "I'm not sure what you mean. Try specifying an Indian Ocean region, time period, depth, or parameter (temperature, salinity, oxygen).",
        timestamp: new Date(),
      });
    }

    return { responses, dataForViz };
  };

  // ---- Handle Send ----
  const handleSendMessage = async () => {
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
    }, 1000);
  };

  return (
    <div className="flex flex-col h-96">
      <ScrollArea className="flex-1 p-4 border rounded-lg mb-4">
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
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
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
                    {message.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {/* Different message types */}
                  {message.type === "text" && (
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  )}

                  {message.type === "data" && message.data && (
                    <div className="overflow-x-auto">
                      <table className="text-sm border-collapse border w-full">
                        <thead>
                          <tr>
                            {Object.keys(message.data[0]).map((col) => (
                              <th key={col} className="px-2 py-1 border-b text-left bg-muted-foreground/10 font-semibold">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {message.data.map((row: any, i: number) => (
                            <tr key={i}>
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="px-2 py-1 border-b whitespace-nowrap">
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
                          <Line type="monotone" dataKey="value" stroke="#2563eb" />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("/data")}
                        >
                          
                          Here's the Data
                        </Button>
                      </div>
                    </div>
                  )}
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
                <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing data...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about temperature, salinity, oxygen levels, or specific floats..."
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