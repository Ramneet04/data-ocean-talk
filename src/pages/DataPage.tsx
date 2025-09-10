import { useLocation } from "react-router-dom";
import { DataVisualization } from "@/components/DataVisualization";

export default function DataPage() {
  const { state } = useLocation();
  const vizData = state?.vizData || {};
  const chatQuery = state?.chatQuery || "";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>

      <DataVisualization
        selectedFloat={null}
        query={chatQuery}
        vizData={vizData}
      />
    </div>
  );
}
