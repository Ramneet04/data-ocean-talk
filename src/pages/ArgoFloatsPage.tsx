import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

// ARGO Floats Prototype — large, feature-rich single-file React component
// - Tailwind classes used for styling
// - Dummy data and simulated interactions
// - Export (JSON/ZIP) functionality (tries to use JSZip if available)
// - Map placeholder (replace with Leaflet/Mapbox in real app)
// - Charts, tables, cards, timeline, filters, and more

const dummyFloats = Array.from({ length: 12 }).map((_, i) => ({
  id: `4900${100 + i}`,
  name: `ARGO-${100 + i}`,
  lat: (Math.random() * 140 - 70).toFixed(3),
  lon: (Math.random() * 360 - 180).toFixed(3),
  lastReport: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
}));

const makeProfile = () =>
  Array.from({ length: 11 }).map((_, i) => ({ depth: i * 100, value: +(20 - i * 0.8 + (Math.random() - 0.5)).toFixed(2) }));

const dummyViz = {
  temperature: {
    label: "Temperature (°C)",
    color: "#ff7f50",
    table: [{ Temperature: "21.3", Depth: "0m" }],
    chart: makeProfile(),
  },
  salinity: {
    label: "Salinity (PSU)",
    color: "#1e90ff",
    table: [{ Salinity: "35.1", Depth: "0m" }],
    chart: makeProfile().map((d) => ({ depth: d.depth, value: +(35 - d.depth * 0.004 + (Math.random() - 0.5) * 0.1).toFixed(2) })),
  },
  oxygen: {
    label: "Dissolved O₂ (ml/L)",
    color: "#7b68ee",
    table: [{ Oxygen: "6.2", Depth: "0m" }],
    chart: makeProfile().map((d) => ({ depth: d.depth, value: +(6 + d.depth * 0.002 + (Math.random() - 0.5) * 0.2).toFixed(2) })),
  },
};

function ArgoFloatsPage() {
  const [floats, setFloats] = useState(dummyFloats);
  const [selectedFloat, setSelectedFloat] = useState(floats[0].id);
  const [query, setQuery] = useState("");
  const [vizData, setVizData] = useState(dummyViz);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [searchText, setSearchText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // simulate fetching new data when selectedFloat or timeRange changes
    const id = selectedFloat;
    setLogs((l) => [`Fetching data for ${id} (${timeRange})`, ...l].slice(0, 50));

    const t = setTimeout(() => {
      // randomize viz slightly
      setVizData((prev) => {
        const next = { ...prev } as any;
        Object.keys(next).forEach((k) => {
          next[k] = {
            ...next[k],
            chart: next[k].chart.map((d: any) => ({ ...d, value: +(d.value + (Math.random() - 0.5) * 0.2).toFixed(3) })),
          };
        });
        return next;
      });
      setLogs((l) => [`Updated viz for ${id} @ ${new Date().toLocaleTimeString()}`, ...l].slice(0, 50));
    }, 900);

    return () => clearTimeout(t);
  }, [selectedFloat, timeRange]);

  const filteredFloats = useMemo(() => {
    if (!searchText) return floats;
    return floats.filter((f) => f.id.includes(searchText) || f.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [floats, searchText]);

  const downloadJSON = async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      floats: floats,
      vizData,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `argo-export-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setLogs((l) => [`Exported JSON at ${new Date().toLocaleTimeString()}`, ...l].slice(0, 50));
  };

  const downloadZip = async () => {
    setLogs((l) => [`Starting ZIP export...`, ...l].slice(0, 50));
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      zip.file("floats.json", JSON.stringify(floats, null, 2));
      zip.file("viz.json", JSON.stringify(vizData, null, 2));
      zip.file("README.txt", `ARGO export generated at ${new Date().toISOString()}`);
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `argo-export-${new Date().toISOString().slice(0, 19)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setLogs((l) => [`ZIP export finished`, ...l].slice(0, 50));
    } catch (err) {
      setLogs((l) => [`ZIP export failed (JSZip not available) — falling back to JSON`, ...l].slice(0, 50));
      await downloadJSON();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">ARGO Floats — Data Explorer (Prototype)</h1>
        <p className="text-muted-foreground mt-2">Interactive prototype showing what a production ARGO floats dashboard could include.</p>
      </header>

      {/* Controls and quick stats */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-muted-foreground">Active Floats</div>
            <div className="text-2xl font-bold">{floats.length}</div>
            <div className="text-xs text-muted-foreground">Updated: {new Date().toLocaleDateString()}</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-muted-foreground">Avg Surface Temperature</div>
            <div className="text-2xl font-bold">{vizData.temperature.table[0]?.Temperature ?? "--"} °C</div>
            <div className="text-xs text-muted-foreground">Surface to 1000 m</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-muted-foreground">Avg Salinity</div>
            <div className="text-2xl font-bold">{vizData.salinity.table[0]?.Salinity ?? "--"}</div>
            <div className="text-xs text-muted-foreground">Practical Salinity Units</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Selected Float</div>
              <div className="font-bold text-lg">{selectedFloat}</div>
              <div className="text-xs text-muted-foreground">Click a float on the left list to change</div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setShowAdvanced((s) => !s);
                  setLogs((l) => [`Toggled advanced: ${!showAdvanced}`, ...l].slice(0, 50));
                }}
                className="px-3 py-2 bg-slate-800 text-white rounded text-sm"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced
              </button>
              <button onClick={downloadZip} className="px-3 py-2 border rounded text-sm">
                Export ZIP
              </button>
            </div>
          </div>

          {showAdvanced && (
            <div className="mt-4 text-xs text-muted-foreground">
              <div>GitHub Sync: <strong>Not connected</strong></div>
              <div className="mt-2">Permissions required to push: <code>repo (read/write)</code></div>
              <div className="mt-2">Tip: Limit access to a single repository when connecting.</div>
            </div>
          )}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Float list */}
        <aside className="col-span-1 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Floats</h3>
            <input
              placeholder="Search by id or name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="text-sm px-2 py-1 border rounded"
            />
          </div>

          <ul className="space-y-2 max-h-[360px] overflow-auto">
            {filteredFloats.map((f) => (
              <li key={f.id} className={`p-2 rounded cursor-pointer hover:bg-slate-50 border ${f.id === selectedFloat ? "bg-slate-100" : ""}`} onClick={() => setSelectedFloat(f.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.id} • {f.lat}, {f.lon}</div>
                  </div>
                  <div className="text-xs">{new Date(f.lastReport).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-xs text-muted-foreground">
            <div>Tip: Click a float to preview its profile and time series.</div>
            <div className="mt-2">Try adding floats to favorites (not implemented in this prototype).</div>
          </div>
        </aside>

        {/* Map & quick visual */}
        <main className="col-span-2 grid grid-cols-1 gap-6">
          <div className="h-64 bg-gradient-to-tr from-sky-50 to-white rounded-lg border p-4 shadow relative">
            <div className="absolute top-3 left-3 bg-white/80 px-3 py-1 rounded text-xs">Map placeholder — integrate Leaflet or Mapbox</div>
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">[Interactive map goes here — floats plotted with markers]</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="font-semibold mb-2">Vertical Profile — Temperature</h4>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={vizData.temperature.chart.map((d) => ({ depth: d.depth, value: d.value }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="depth" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke={vizData.temperature.color} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="font-semibold mb-2">Time-series (surface) — last {timeRange}</h4>
              <div className="flex space-x-2 items-center mb-3">
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="text-sm px-2 py-1 border rounded">
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                  <option value="90d">90 days</option>
                </select>
                <button onClick={() => setVizData(dummyViz)} className="px-2 py-1 text-sm border rounded">Reset</button>
              </div>

              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={Array.from({ length: 20 }).map((_, i) => ({ t: i, temp: 20 + Math.sin(i / 3) + (Math.random() - 0.5) }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="t" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="temp" stroke="#ff7f50" fillOpacity={0.2} fill="#ff7f50" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Detailed tables & charts */}
      <section className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-3">Parameter Tables</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 border-b">Float</th>
                    <th className="p-2 border-b">Parameter</th>
                    <th className="p-2 border-b">Value</th>
                    <th className="p-2 border-b">Depth</th>
                    <th className="p-2 border-b">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {floats.flatMap((f) => [
                    { float: f.id, param: "Temperature", value: (18 + Math.random() * 4).toFixed(2), depth: "0m", ts: new Date().toISOString() },
                    { float: f.id, param: "Salinity", value: (34 + Math.random()).toFixed(2), depth: "0m", ts: new Date().toISOString() },
                  ]).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 border-b">{r.float}</td>
                      <td className="p-2 border-b">{r.param}</td>
                      <td className="p-2 border-b">{r.value}</td>
                      <td className="p-2 border-b">{r.depth}</td>
                      <td className="p-2 border-b">{new Date(r.ts).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex justify-end space-x-2">
              <button onClick={downloadJSON} className="px-3 py-2 border rounded text-sm">Download JSON</button>
              <button onClick={downloadZip} className="px-3 py-2 bg-slate-800 text-white rounded text-sm">Download ZIP</button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-3">Comparative Charts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                  <BarChart data={[{ name: "T", val: 21 }, { name: "S", val: 35 }, { name: "O2", val: 6 }]}> 
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="val" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                  <LineChart data={vizData.salinity.chart.map((d) => ({ depth: d.depth, value: d.value }))}>
                    <XAxis dataKey="depth" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke={vizData.salinity.color} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-1 space-y-4">
          <div className="p-3 bg-white rounded-lg shadow">
            <h4 className="font-semibold">Quick Actions</h4>
            <div className="mt-3 flex flex-col space-y-2">
              <button className="px-3 py-2 border rounded text-sm" onClick={() => alert("Simulate alert: Float out of range")}>Simulate Alert</button>
              <button className="px-3 py-2 border rounded text-sm" onClick={() => setFloats((f) => [...f, { id: `4900${Math.floor(Math.random()*900)}`, name: `ARGO-${Math.floor(Math.random()*900)}`, lat: "0.000", lon: "0.000", lastReport: new Date().toISOString() }])}>Add Random Float</button>
              <button className="px-3 py-2 border rounded text-sm" onClick={() => setFloats(dummyFloats)}>Reset Floats</button>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg shadow">
            <h4 className="font-semibold">Activity Log</h4>
            <div className="mt-2 max-h-48 overflow-auto text-xs text-muted-foreground">
              {logs.length === 0 ? <div className="text-center py-4">No activity yet</div> : logs.map((l, i) => <div key={i} className="py-1 border-b">{l}</div>)}
            </div>
          </div>
        </aside>
      </section>

      {/* Footer & extra prototype features */}
      <footer className="mt-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h4 className="font-semibold">Prototype notes & future features</h4>
          <ul className="list-inside list-disc text-sm mt-2">
            <li>Real-time streaming from Argo DACs (replace polling with WebSocket)</li>
            <li>Interactive map with marker clustering, popups and swimlane filtering</li>
            <li>Profile comparison mode: overlay multiple floats' vertical profiles</li>
            <li>Auto-generated methods: anomaly detection, climatology baseline, and trend analysis</li>
            <li>Export connectors: GitHub, S3, BigQuery, THREDDS / OPeNDAP</li>
            <li>Permissions: fine-grained repo access (only allow single repo) and read/write controls</li>
            <li>Mobile optimization & accessibility review</li>
          </ul>

          <div className="mt-4 text-sm text-muted-foreground">This prototype contains mock data. Replace dummy APIs with real Argo/ARGO DAC endpoints to power live behavior.</div>
        </div>
      </footer>
    </div>
  );
}
export default ArgoFloatsPage;
