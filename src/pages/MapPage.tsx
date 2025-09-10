import { FloatMap } from "@/components/FloatMap";
import { useState } from "react";

export default function MapPage() {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [region, setRegion] = useState<[[number, number], [number, number]] | null>(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">ARGO Float Locations</h2>
      <FloatMap onFloatSelect={setSelectedFloat} onRegionSelect={setRegion} />
    </div>
  );
}