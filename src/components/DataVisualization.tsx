import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Activity } from 'lucide-react';

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

export const DataVisualization = ({ selectedFloat, query, vizData }: DataVisualizationProps) => {
  const [activeTab, setActiveTab] = useState('profiles');

  // Auto-switch tabs based on query content
  useEffect(() => {
    if (query.toLowerCase().includes('time') || query.toLowerCase().includes('series') || query.toLowerCase().includes('change')) {
      setActiveTab('timeseries');
    } else if (query.toLowerCase().includes('region') || query.toLowerCase().includes('compare') || query.toLowerCase().includes('arabian') || query.toLowerCase().includes('bay')) {
      setActiveTab('regional');
    } else if (query.toLowerCase().includes('depth') || query.toLowerCase().includes('profile')) {
      setActiveTab('profiles');
    }
  }, [query]);

  // Helper to render tables for each parameter
  const renderTables = () => {
    return Object.entries(vizData).map(([param, data]) => (
      data.table && Array.isArray(data.table) && data.table.length > 0 && data.table[0] ? (
        <Card key={param + "_table"} className="mb-4">
          <CardHeader>
            <CardTitle>{data.label} Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse border w-full">
                <thead>
                  <tr>
                    {Object.keys(data.table[0]).map((col) => (
                      <th key={col} className="px-2 py-1 border-b text-left">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.table.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-2 py-1 border-b whitespace-nowrap">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null
    ));
  };

  // Helper to render charts for each parameter
  const renderCharts = () => {
    return Object.entries(vizData).map(([param, data]) => (
      data.chart && Array.isArray(data.chart) && data.chart.length > 0 ? (
        <Card key={param} className="mb-4">
          <CardHeader>
            <CardTitle>{data.label} Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chart}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="depth" label={{ value: 'Depth (m)', position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: data.label, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={data.color} strokeWidth={3} dot={{ fill: data.color, strokeWidth: 2, r: 4 }} name={data.label} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null
    ));
  };

  const hasData = vizData && Object.keys(vizData).length > 0;


  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vizData.temperature && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-data-temperature" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-data-temperature">{vizData.temperature.table[0]?.Temperature || '--'}</div>
                <p className="text-xs text-muted-foreground">Surface to 1000m depth</p>
              </CardContent>
            </Card>
          )}
          {vizData.salinity && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salinity Range</CardTitle>
                <Droplets className="h-4 w-4 text-data-salinity" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-data-salinity">{vizData.salinity.table[0]?.Salinity || '--'}</div>
                <p className="text-xs text-muted-foreground">PSU (Practical Salinity Units)</p>
              </CardContent>
            </Card>
          )}
          {vizData.oxygen && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Oxygen Levels</CardTitle>
                <Activity className="h-4 w-4 text-data-oxygen" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-data-oxygen">{vizData.oxygen.table[0]?.Oxygen || '--'}</div>
                <p className="text-xs text-muted-foreground">Average dissolved oxygen</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12 text-lg">
          No data to visualize yet. Ask a question in the chat!
        </div>
      )}

      {/* Data Visualization: show tables and charts for each param in vizData */}
      {hasData && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div>{renderTables().filter(Boolean)}</div>
          <div>{renderCharts().filter(Boolean)}</div>
        </div>
      )}
    </div>
  );
};