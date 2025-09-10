import React from "react";

const ErddapApiPage = () => (
  <div className="p-8 max-w-3xl mx-auto">
    {/* Page Title */}
    <h1 className="text-3xl font-bold mb-4">🌊 ERDDAP API Data Source</h1>

    {/* Intro Section */}
    <p className="text-lg text-muted-foreground mb-6">
      ERDDAP (Environmental Research Division’s Data Access Program) is a powerful
      server that provides easy, consistent access to a wide variety of scientific
      datasets, including ARGO float measurements. It lets you search, filter, and
      download oceanographic and environmental data in multiple formats using simple
      URLs or a REST-style API.
    </p>

    {/* Key Features */}
    <h2 className="text-2xl font-semibold mb-2">🔑 Key Features</h2>
    <ul className="list-disc ml-6 space-y-1 text-base mb-6">
      <li>Unified access to diverse ocean datasets (ARGO, satellite, glider, model output)</li>
      <li>Supports custom queries by time, latitude, longitude, depth, and variables</li>
      <li>Data available in multiple formats: CSV, NetCDF, JSON, OPeNDAP</li>
      <li>Used by oceanographers, researchers, and developers worldwide</li>
      <li>Integrates seamlessly with visualization dashboards and AI assistants</li>
    </ul>

    {/* Example Query */}
    <h2 className="text-2xl font-semibold mb-2">📡 Example API Query</h2>
    <p className="text-base mb-2">
      A typical ERDDAP query might look like this:
    </p>
    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-6">
      https://data.ioos.us/erddap/tabledap/argo_prof.json?time,latitude,longitude,temp,salinity
      &time&gt;=2023-01-01T00:00:00Z
      &time&lt;=2023-03-31T23:59:59Z
      &latitude&gt;=10&latitude&lt;=20
      &longitude&gt;=60&longitude&lt;=80
    </pre>
    <p className="text-sm text-muted-foreground mb-6">
      This query fetches temperature and salinity profiles for the Indian Ocean between
      January and March 2023, filtered by latitude and longitude.
    </p>

    {/* Why It Matters */}
    <h2 className="text-2xl font-semibold mb-2">🌐 Why We Use ERDDAP</h2>
    <p className="text-base mb-6">
      In our FloatChat platform, ERDDAP acts as the data backbone. It allows us to:
    </p>
    <ul className="list-disc ml-6 space-y-1 text-base">
      <li>Fetch ARGO float profiles dynamically based on user-selected regions</li>
      <li>Access historical and real-time ocean data for trend analysis</li>
      <li>Support CSV and NetCDF downloads directly from chat results</li>
      <li>Guarantee reproducible queries with shareable URLs</li>
    </ul>

    {/* Closing */}
    <p className="mt-6 text-base text-muted-foreground">
      ERDDAP is a crucial bridge between raw ocean data and user-friendly tools like
      our interactive chatbot and map interface. It ensures that scientists and
      developers can access the same trusted data programmatically and visually.
    </p>
  </div>
);

export default ErddapApiPage;
