import { useNavigate } from "react-router-dom";
import { useState } from "react"; // ✅ ADD THIS
import { ChatInterface } from "@/components/ChatInterface";

export default function ChatPage() {
  const navigate = useNavigate();
  const [vizData, setVizData] = useState<Record<string, any>>({});
  const [chatQuery, setChatQuery] = useState("");

  const handleViewAnalytics = () => {
    navigate("/data", { state: { vizData, chatQuery } }); // ✅ pass state
  };

  return (
    <div className="p-6 space-y-6">
      <ChatInterface onQuery={(query, _, data) => {
        setChatQuery(query);
        setVizData(data);
      }} />
        {Object.keys(vizData).length > 0 && (
            <div className="mt-4 flex justify-end">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleViewAnalytics}
                >   View Analytics</button>
            </div>
        )}
    </div>
  );
}
