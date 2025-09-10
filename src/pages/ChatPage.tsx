import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";

export default function ChatPage() {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState("");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Query Interface</h2>
      <ChatInterface onQuery={setChatQuery} selectedFloat={selectedFloat} />
    </div>
  );
}