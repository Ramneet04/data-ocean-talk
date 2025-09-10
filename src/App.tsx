import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import MapPage from "@/pages/MapPage";
import ChatPage from "@/pages/ChatPage";
import DataPage from "@/pages/DataPage";
import NotFound from "@/pages/NotFound";
import ArgoFloatsPage from "@/pages/ArgoFloatsPage";
import ErddapApiPage from "@/pages/ErddapApiPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <DashboardHeader />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<MapPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/argo-floats" element={<ArgoFloatsPage />} />
              <Route path="/erddap-api" element={<ErddapApiPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
