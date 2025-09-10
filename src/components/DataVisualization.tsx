import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Activity } from 'lucide-react';

interface DataVisualizationProps {
  selectedFloat: string | null;
  query: string;
}

export const DataVisualization = ({ selectedFloat, query }: DataVisualizationProps) => {
  const [activeTab, setActiveTab] = useState('profiles');

  // Mock oceanographic data
  const temperatureData = [
    { depth: 0, temperature: 28.5, salinity: 34.8, oxygen: 4.8 },
    { depth: 10, temperature: 28.2, salinity: 34.9, oxygen: 4.7 },
    { depth: 25, temperature: 26.8, salinity: 35.1, oxygen: 4.5 },
    { depth: 50, temperature: 24.2, salinity: 35.3, oxygen: 4.2 },
    { depth: 75, temperature: 20.5, salinity: 35.5, oxygen: 3.8 },
    { depth: 100, temperature: 16.8, salinity: 35.4, oxygen: 3.2 },
    { depth: 150, temperature: 12.2, salinity: 35.2, oxygen: 2.1 },
    { depth: 200, temperature: 8.5, salinity: 34.8, oxygen: 1.2 },
    { depth: 300, temperature: 5.2, salinity: 34.6, oxygen: 0.8 },
    { depth: 500, temperature: 3.1, salinity: 34.5, oxygen: 1.5 },
    { depth: 1000, temperature: 2.1, salinity: 34.7, oxygen: 2.8 },
  ];

  const timeSeriesData = [
    { date: '2024-01-01', temperature: 28.2, salinity: 34.9, oxygen: 4.6 },
    { date: '2024-01-02', temperature: 28.5, salinity: 34.8, oxygen: 4.8 },
    { date: '2024-01-03', temperature: 27.8, salinity: 35.0, oxygen: 4.5 },
    { date: '2024-01-04', temperature: 28.1, salinity: 34.9, oxygen: 4.7 },
    { date: '2024-01-05', temperature: 28.3, salinity: 34.8, oxygen: 4.8 },
    { date: '2024-01-06', temperature: 27.9, salinity: 35.1, oxygen: 4.6 },
    { date: '2024-01-07', temperature: 28.0, salinity: 34.9, oxygen: 4.7 },
    { date: '2024-01-08', temperature: 28.4, salinity: 34.8, oxygen: 4.8 },
  ];

  const regionData = [
    { region: 'Arabian Sea', temperature: 27.5, salinity: 35.2, oxygen: 4.2 },
    { region: 'Bay of Bengal', temperature: 28.8, salinity: 34.1, oxygen: 4.6 },
    { region: 'Equatorial IO', temperature: 28.2, salinity: 34.8, oxygen: 4.5 },
    { region: 'Southern IO', temperature: 24.1, salinity: 35.6, oxygen: 5.1 },
  ];

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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-data-temperature" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-data-temperature">26.8°C</div>
            <p className="text-xs text-muted-foreground">Surface to 1000m depth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salinity Range</CardTitle>
            <Droplets className="h-4 w-4 text-data-salinity" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-data-salinity">34.5-35.6</div>
            <p className="text-xs text-muted-foreground">PSU (Practical Salinity Units)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oxygen Levels</CardTitle>
            <Activity className="h-4 w-4 text-data-oxygen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-data-oxygen">3.2 ml/L</div>
            <p className="text-xs text-muted-foreground">Average dissolved oxygen</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profiles">Depth Profiles</TabsTrigger>
            <TabsTrigger value="timeseries">Time Series</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>
          
          {selectedFloat && (
            <Badge variant="outline" className="text-primary border-primary">
              Viewing: {selectedFloat}
            </Badge>
          )}
        </div>

        <TabsContent value="profiles" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-data-temperature" />
                  <span>Temperature vs Depth</span>
                </CardTitle>
                <CardDescription>Vertical temperature profile</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="depth" label={{ value: 'Depth (m)', position: 'insideBottom', offset: -10 }} />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 30]} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="hsl(var(--data-temperature))" strokeWidth={3} dot={{ fill: 'hsl(var(--data-temperature))', strokeWidth: 2, r: 4 }} name="Temperature (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-data-salinity" />
                  <span>Salinity vs Depth</span>
                </CardTitle>
                <CardDescription>Vertical salinity profile</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="depth" label={{ value: 'Depth (m)', position: 'insideBottom', offset: -10 }} />
                    <YAxis yAxisId="right" orientation="left" domain={[34, 36]} label={{ value: 'Salinity (PSU)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line yAxisId="right" type="monotone" dataKey="salinity" stroke="hsl(var(--data-salinity))" strokeWidth={3} dot={{ fill: 'hsl(var(--data-salinity))', strokeWidth: 2, r: 4 }} name="Salinity (PSU)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeseries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Surface Parameter Time Series</CardTitle>
              <CardDescription>Daily measurements from selected float</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="temp" orientation="left" domain={[26, 30]} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="sal" orientation="right" domain={[34, 36]} label={{ value: 'Salinity (PSU)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="hsl(var(--data-temperature))" strokeWidth={2} name="Temperature (°C)" />
                  <Line yAxisId="sal" type="monotone" dataKey="salinity" stroke="hsl(var(--data-salinity))" strokeWidth={2} name="Salinity (PSU)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Comparison</CardTitle>
              <CardDescription>Average surface conditions by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="temperature" fill="hsl(var(--data-temperature))" name="Temperature (°C)" />
                  <Bar dataKey="salinity" fill="hsl(var(--data-salinity))" name="Salinity (PSU)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};