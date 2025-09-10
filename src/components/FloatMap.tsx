/*import { useState, useEffect, useRef } from 'react';
import { MapPin, Waves, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, FeatureGroup, Rectangle } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface FloatData {
  id: string;
  lat: number;
  lon: number;
  temperature: number;
  salinity: number;
  depth: number;
  lastUpdate: string;
}

interface FloatMapProps {
  onFloatSelect: (floatId: string | null) => void;
  onRegionSelect: (regionBounds: [[number, number], [number, number]]) => void;
}

export const FloatMap = ({ onFloatSelect, onRegionSelect }: FloatMapProps) => {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const drawnRegion = useRef<any>(null);
    const floatData: FloatData[] = [
    { id: 'ARGO-3901234', lat: -10.5, lon: 75.2, temperature: 28.5, salinity: 35.1, depth: 0, lastUpdate: '2024-01-08' },
    { id: 'ARGO-3901235', lat: -15.8, lon: 68.4, temperature: 26.2, salinity: 35.3, depth: 50, lastUpdate: '2024-01-08' },
    { id: 'ARGO-3901236', lat: -5.2, lon: 82.1, temperature: 29.1, salinity: 34.8, depth: 0, lastUpdate: '2024-01-08' },
    { id: 'ARGO-3901237', lat: -20.1, lon: 72.6, temperature: 24.8, salinity: 35.5, depth: 100, lastUpdate: '2024-01-07' },
    { id: 'ARGO-3901238', lat: -8.7, lon: 88.3, temperature: 28.9, salinity: 34.9, depth: 25, lastUpdate: '2024-01-08' },
  ];

  const handleFloatClick = (floatId: string) => {
    setSelectedFloat(floatId === selectedFloat ? null : floatId);
    onFloatSelect(floatId === selectedFloat ? null : floatId);
  };

  const handleCreated = (e: any) => {
    if (e.layerType === "rectangle" || e.layerType === "polygon") {
      const bounds = e.layer.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      onRegionSelect([
        [sw.lat, sw.lng],
        [ne.lat, ne.lng],
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-80 bg-gradient-to-br from-accent/20 to-primary/30 rounded-lg overflow-hidden border border-border">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary/40 animate-wave" />
        </div>
                <div className="absolute inset-0">
          {floatData.map((float) => (
            <Button
              key={float.id}
              variant="ghost"
              size="sm"
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                selectedFloat === float.id 
                  ? 'bg-primary text-primary-foreground animate-pulse-ocean' 
                  : 'bg-card/80 hover:bg-primary/20 text-primary'
              }`}
              style={{
                left: `${((float.lon + 180) / 360) * 100}%`,
                top: `${((90 - float.lat) / 180) * 100}%`,
              }}
              onClick={() => handleFloatClick(float.id)}
            >
              <Waves className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span>Active Float</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary/50 rounded-full" />
              <span>Recent Data</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Active Floats ({floatData.length})</h3>
        <div className="grid gap-2 max-h-40 overflow-y-auto">
          {floatData.map((float) => (
            <div
              key={float.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedFloat === float.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 bg-card/50'
              }`}
              onClick={() => handleFloatClick(float.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm">{float.id}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {float.lastUpdate}
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Thermometer className="h-3 w-3" />
                  <span>{float.temperature}°C</span>
                </div>
                <div>Sal: {float.salinity}</div>
                <div>Depth: {float.depth}m</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};*/
import { useState, useRef, useMemo } from 'react';
import { MapPin, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Rectangle,
  CircleMarker,
  Tooltip,
  Pane
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

interface FloatData {
  id: string;
  lat: number;
  lon: number;
  temperature: number;
  salinity: number;
  depth: number;
  lastUpdate: string;
}

interface FloatMapProps {
  onFloatSelect: (floatId: string | null) => void;
  onRegionSelect: (regionBounds: [[number, number], [number, number]]) => void;
}

export const FloatMap = ({ onFloatSelect, onRegionSelect }: FloatMapProps) => {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const drawnRegion = useRef<any>(null);

  const floatData: FloatData[] = [
    { id: 'ARGO-3901234', lat: -10.5, lon: 75.2,  temperature: 28.5, salinity: 35.1, depth: 0,   lastUpdate: '2024-01-08' },
    { id: 'ARGO-3901235', lat: -15.8, lon: 68.4,  temperature: 26.2, salinity: 35.3, depth: 50,  lastUpdate: '2024-01-08' },
    { id: 'ARGO-3901236', lat: -5.2,  lon: 82.1,  temperature: 29.1, salinity: 34.8, depth: 0,   lastUpdate: '2024-01-08' },
    { id: 'ARGO-3901237', lat: -20.1, lon: 72.6,  temperature: 24.8, salinity: 35.5, depth: 100, lastUpdate: '2024-01-07' },
    { id: 'ARGO-3901238', lat: -8.7,  lon: 88.3,  temperature: 28.9, salinity: 34.9, depth: 25,  lastUpdate: '2024-01-08' },
  ];

  const handleFloatClick = (floatId: string) => {
    const next = floatId === selectedFloat ? null : floatId;
    setSelectedFloat(next);
    onFloatSelect(next);
  };

  const handleCreated = (e: any) => {
    if (e.layerType === 'rectangle' || e.layerType === 'polygon') {
      const bounds = e.layer.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      onRegionSelect([[sw.lat, sw.lng], [ne.lat, ne.lng]]);
    }
  };

  // (Optional) compute bounds to keep all floats in view initially
  const mapBounds = useMemo(() => {
    const lats = floatData.map(f => f.lat);
    const lons = floatData.map(f => f.lon);
    const latMin = Math.min(...lats), latMax = Math.max(...lats);
    const lonMin = Math.min(...lons), lonMax = Math.max(...lons);
    return [[latMin - 5, lonMin - 5], [latMax + 5, lonMax + 5]] as [[number, number],[number, number]];
  }, [floatData]);

  return (
    <div className="space-y-4">
      {/* MAP WITH FLOATS */}
      <div className="relative h-80 rounded-lg overflow-hidden border border-border">
        <MapContainer
          bounds={mapBounds}
          worldCopyJump
          className="h-full w-full"
          zoomControl={false}
        >
          {/* Base map */}
          <TileLayer
            // You can swap this URL for a different tile provider if you have one
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Optional pane to keep markers above drawings */}
          <Pane name="floats" style={{ zIndex: 500 }}>
            {floatData.map((float) => {
              const isSelected = selectedFloat === float.id;
              return (
                <CircleMarker
                  key={float.id}
                  center={[float.lat, float.lon]}
                  pathOptions={{
                    color: isSelected ? '#2563eb' : '#0ea5e9',
                    fillColor: isSelected ? '#2563eb' : '#0ea5e9',
                    fillOpacity: isSelected ? 0.7 : 0.5,
                  }}
                  radius={isSelected ? 8 : 6}
                  eventHandlers={{ click: () => handleFloatClick(float.id) }}
                  className={isSelected ? 'leaflet-pulse' : ''}
                >
                  <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
                    <div className="text-xs">
                      <div className="font-mono">{float.id}</div>
                      <div>T: {float.temperature}°C</div>
                      <div>Sal: {float.salinity}</div>
                      <div>Depth: {float.depth} m</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </Pane>

          {/* If you want to enable drawing on THIS map too, uncomment below */}
          {/* 
          <FeatureGroup ref={drawnRegion}>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: true,
                polygon: false,
                circle: false,
                marker: false,
                polyline: false,
                circlemarker: false,
              }}
            />
          </FeatureGroup>
          */}
        </MapContainer>

        {/* Map legend overlay */}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-md border border-border rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#2563eb' }} />
              <span>Selected Float</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#0ea5e9' }} />
              <span>Active Float</span>
            </div>
          </div>
        </div>
      </div>

      {/* FLOAT INFORMATION PANEL WITH SUBTLE BACKGROUND */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Active Floats ({floatData.length})</h3>
        <div className="grid gap-2 max-h-40 overflow-y-auto rounded-lg border border-border bg-gradient-to-br from-muted/40 via-background/40 to-muted/30 backdrop-blur-sm p-2">
          {floatData.map((float) => (
            <div
              key={float.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedFloat === float.id
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border hover:border-primary/50 bg-card/50'
              }`}
              onClick={() => handleFloatClick(float.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm">{float.id}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {float.lastUpdate}
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Thermometer className="h-3 w-3" />
                  <span>{float.temperature}°C</span>
                </div>
                <div>Sal: {float.salinity}</div>
                <div>Depth: {float.depth}m</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OPTIONAL: Separate region selection map (kept commented as in your original) */}
      {/*
      <div className="rounded-lg border">
        <MapContainer
          center={[0, 80]}
          zoom={2}
          style={{ height: '400px', width: '100%' }}
          worldCopyJump
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <FeatureGroup ref={drawnRegion}>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: true,
                polygon: false,
                circle: false,
                marker: false,
                polyline: false,
                circlemarker: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
        <div className="text-xs mt-2 text-muted-foreground">
          Draw a rectangle to select an ocean region.
        </div>
      </div>
      */}
      <style jsx global>{`
        /* pulse for selected float */
        .leaflet-pulse {
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
