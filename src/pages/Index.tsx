import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FloatMap } from '@/components/FloatMap';
import { ChatInterface } from '@/components/ChatInterface';
import { DataVisualization } from '@/components/DataVisualization';
import { Sidebar } from '@/components/Sidebar';

const Index = () => {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState('');
  const [vizData, setVizData] = useState<Record<string, {table: any[]; chart: any[]; label: string; color: string}>>({});

  // Handler to synchronize chat and data viz
  const handleChatQuery = (query: string, params: string[], data: Record<string, {table: any[]; chart: any[]; label: string; color: string}>) => {
    setChatQuery(query);
    setVizData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-lg ocean-gradient p-8 text-white">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4 animate-float">
                FloatChat
              </h1>
              <p className="text-xl opacity-90 mb-6">
                AI-Powered Oceanographic Data Explorer
              </p>
              <p className="text-lg opacity-80">
                Query ARGO float data from the Indian Ocean using natural language
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="dashboard-panel p-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                ARGO Float Locations
              </h2>
              <FloatMap onFloatSelect={setSelectedFloat} onRegionSelect={() => {}} />
            </div>

            {/* Chat Interface */}
            <div className="dashboard-panel p-6">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                AI Query Interface
              </h2>
              <ChatInterface 
                onQuery={handleChatQuery}
                selectedFloat={selectedFloat}
              />
            </div>
          </div>

          {/* Data Visualization */}
          <div className="dashboard-panel p-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Data Analysis
            </h2>
            <DataVisualization 
              selectedFloat={selectedFloat}
              query={chatQuery}
              vizData={vizData}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;