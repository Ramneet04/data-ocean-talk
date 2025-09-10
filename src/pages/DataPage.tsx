import { useState } from "react";
import { DataVisualization } from "@/components/DataVisualization";

export default function DataPage() {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState("");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Data Analysis</h2>
      <DataVisualization selectedFloat={selectedFloat} query={chatQuery} />
    </div>
  );
}