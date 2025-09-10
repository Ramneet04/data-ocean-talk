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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Thermometer, Droplets, Activity, MapPin, Calendar } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("profiles");

  useEffect(() => {
    const q = query.toLowerCase();
    if (q.includes("time") || q.includes("series") || q.includes("change")) {
      setActiveTab("timeseries");
    } else if (
      q.includes("region") ||
      q.includes("compare") ||
      q.includes("Indian") ||
      q.includes("bay")
    ) {
      setActiveTab("regional");
    } else if (q.includes("depth") || q.includes("profile")) {
      setActiveTab("profiles");
    }
  }, [query]);

  const hasData = vizData && Object.keys(vizData).length > 0;

  /** Generate insight text based on data type */
  const renderInsight = (param: string, data: VizParamData) => {
    if (!data.chart?.length) return null;

    const values = data.chart.map((d) => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    let message = "";
    if (param === "temperature") {
      message =
        avg > 20
          ? "Surface waters are relatively warm — possible seasonal heating."
          : "Cooler temperatures suggest upwelling or winter conditions.";
    } else if (param === "salinity") {
      message =
        max > 36
          ? "High salinity detected — may indicate strong evaporation or restricted circulation."
          : "Salinity is within expected open-ocean range.";
    } else if (param === "oxygen") {
      message =
        avg < 2
          ? "⚠️ Low oxygen levels detected — possible oxygen minimum zone."
          : "Oxygen levels look healthy across most depths.";
    }

    return (
      <div className="text-xs text-muted-foreground mt-2 italic">
        {message}
      </div>
    );
  };

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
          className="shadow-lg border bg-gradient-to-tr from-white to-gray-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {data.label} Profile
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Depth vs {data.label.toLowerCase()} profile from float{" "}
              {selectedFloat || "N/A"}
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chart}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis
                  dataKey="depth"
                  label={{
                    value: "Depth (m)",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: data.label,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={data.color}
                  strokeWidth={3}
                  dot={{ fill: data.color, strokeWidth: 2, r: 4 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Key Statistics */}
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p><strong>Min:</strong> {min.toFixed(2)}</p>
              <p><strong>Max:</strong> {max.toFixed(2)}</p>
              <p><strong>Average:</strong> {avg.toFixed(2)}</p>
            </div>

            {/* Insight */}
            {renderInsight(param, data)}
          </CardContent>
        </Card>
      );
    });

  return (
    <div className="space-y-8">
      {hasData ? (
        <>
          {/* Metadata Section */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-md">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Region: Indian Ocean (approx.)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Period: Jan 2023 – Aug 2023</span>
            </div>
            {selectedFloat && (
              <div className="flex items-center space-x-1">
                <Activity className="h-4 w-4 text-primary" />
                <span>Float ID: {selectedFloat}</span>
              </div>
            )}
          </div>

          {/* Charts & Insights */}
          <div className="grid lg:grid-cols-2 gap-6">{renderCharts()}</div>
        </>
      ) : (
        <div className="text-center text-muted-foreground py-12 text-lg">
          No data to visualize yet. Ask a question in the chat!
        </div>
      )}
    </div>
  );
};
