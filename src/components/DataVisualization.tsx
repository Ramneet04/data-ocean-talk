import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Activity, MapPin, Calendar, Download } from "lucide-react";
import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import { toast } from "sonner";

interface VizParamData {
  table: { [key: string]: string }[];
  chart: { [key: string]: number }[];
  label: string;
  color: string;
}

interface DataVisualizationProps {
  selectedFloat: string | null;
  query: string;
  vizData: Record<string, VizParamData>;
}

export const DataVisualization = ({
  selectedFloat,
  query,
  vizData,
}: DataVisualizationProps) => {
    const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("profiles");
  const handleExport = () => {
    const dummyData = {
      message: "This is just a dummy export file.",
      floats: ["Float-1", "Float-2", "Float-3"],
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dummyData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "argo-floats-export.json";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Dummy ARGO float data downloaded as JSON.",
    });
  };
  useEffect(() => {
    const q = query.toLowerCase();
    if (q.includes("time") || q.includes("series") || q.includes("change")) {
      setActiveTab("timeseries");
    } else if (
      q.includes("region") ||
      q.includes("compare") ||
      q.includes("indian") ||
      q.includes("bay")
    ) {
      setActiveTab("regional");
    } else if (q.includes("depth") || q.includes("profile")) {
      setActiveTab("profiles");
    }
  }, [query]);

  const hasData = vizData && Object.keys(vizData).length > 0;

  // 🔽 Download CSV tables as ZIP
  const handleDownloadZip = async () => {
    const zip = new JSZip();

    Object.entries(vizData).forEach(([param, data]) => {
      if (!data.table?.length) return;

      const headers = Object.keys(data.table[0]);
      const csvRows = [
        headers.join(","), // header row
        ...data.table.map((row) => headers.map((h) => row[h]).join(",")),
      ];
      zip.file(`${param}.csv`, csvRows.join("\n"));
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "ocean_data.zip");
  };

  const renderInsight = (param: string, data: VizParamData) => {
    if (!data.chart?.length) return null;
    const values = data.chart.map((d) => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);

    if (param === "temperature") {
      return (
        <p className="text-xs italic mt-2 text-amber-600">
          {avg > 20
            ? "🌡️ Warm surface water detected — possible seasonal heating."
            : "❄️ Cooler temperatures suggest upwelling or winter conditions."}
        </p>
      );
    }
    if (param === "salinity") {
      return (
        <p className="text-xs italic mt-2 text-blue-600">
          {max > 36
            ? "💧 High salinity — may indicate strong evaporation or restricted circulation."
            : "Salinity is within expected range."}
        </p>
      );
    }
    return null;
  };

  const renderTables = () =>
    Object.entries(vizData).map(([param, data]) => {
      if (!data.table?.length) return null;
      return (
        <Card
          key={param + "_table"}
          className="shadow-sm border hover:shadow-lg bg-white/80 backdrop-blur-md transition-all"
        >
          <CardHeader>
            <CardTitle className="text-md font-semibold">
              {data.label} Data Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data.table[0]).map((col) => (
                      <th key={col} className="px-3 py-2 border-b text-left font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.table.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-3 py-2 border-b">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      );
    });

  const renderCharts = () =>
    Object.entries(vizData).map(([param, data]) => {
      if (!data.chart?.length) return null;
      const values = data.chart.map((d) => d.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      return (
        <Card
          key={param}
          className="shadow-lg border bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{data.label} Profile</CardTitle>
            <p className="text-xs text-muted-foreground">
              Depth vs {data.label.toLowerCase()} profile from float{" "}
              {selectedFloat || "N/A"}
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.chart}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="depth" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={data.color}
                  strokeWidth={3}
                  dot={{ fill: data.color, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 text-sm space-y-1 text-gray-700">
              <p><strong>Min:</strong> {min.toFixed(2)}</p>
              <p><strong>Max:</strong> {max.toFixed(2)}</p>
              <p><strong>Average:</strong> {avg.toFixed(2)}</p>
            </div>

            {renderInsight(param, data)}
          </CardContent>
        </Card>
      );
    });

  return (
    <div className="space-y-8 bg-gradient-to-b from-blue-50 via-white to-white p-4 rounded-xl shadow-inner">
      {hasData ? (
        <>
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 items-center text-sm bg-white shadow-sm px-4 py-3 rounded-lg">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Region: Indian Ocean</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Period: Jan 2023 – Aug 2023</span>
            </div>
            {selectedFloat && (
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-primary" />
                <span>Float ID: {selectedFloat}</span>
              </div>
            )}
          </div>

          {/* Two-column Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderTables()}
              {/* Download Button */}
              <div className="flex justify-end">
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Download Data (ZIP)
                </Button>
              </div>
            </div>
            <div className="space-y-4">{renderCharts()}</div>
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground py-12 text-lg">
          No data to visualize yet. Ask a question in the chat!
        </div>
      )}
    </div>
  );
};
