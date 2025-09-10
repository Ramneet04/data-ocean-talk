import { BarChart3, Map, MessageSquare, Settings, Waves, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <aside className="w-64 bg-card border-r border-border p-4">
      <div className="space-y-6">
        {/* Navigation */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <div className="space-y-1">
            <Link to="/">
              <Button variant={isActive("/") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/") ? "text-primary bg-primary/10" : ""}`}>
                <Map className="h-4 w-4 mr-3" />
                Float Explorer
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant={isActive("/chat") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/chat") ? "text-primary bg-primary/10" : ""}`}>
                <MessageSquare className="h-4 w-4 mr-3" />
                AI Chat
              </Button>
            </Link>
            <Link to="/data">
              <Button variant={isActive("/data") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/data") ? "text-primary bg-primary/10" : ""}`}>
                <BarChart3 className="h-4 w-4 mr-3" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        <Separator />

        {/* Data Sources */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Data Sources
          </h3>
          <div className="space-y-1">
            <Link to="/argo-floats">
              <Button variant={isActive("/argo-floats") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/argo-floats") ? "text-primary bg-primary/10" : ""}`}>
                <Waves className="h-4 w-4 mr-3" />
                ARGO Floats
              </Button>
            </Link>
            <Link to="/erddap-api">
              <Button variant={isActive("/erddap-api") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/erddap-api") ? "text-primary bg-primary/10" : ""}`}>
                <Database className="h-4 w-4 mr-3" />
                ERDDAP API
              </Button>
            </Link>
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            System Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Floats Active</span>
              <span className="text-primary font-medium">3,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Update</span>
              <span className="text-foreground">2h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Data Quality</span>
              <span className="text-green-600 font-medium">98.5%</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Settings */}
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </Button>
      </div>
    </aside>
  );
};