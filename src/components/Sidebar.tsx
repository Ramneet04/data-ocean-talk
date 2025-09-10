import { BarChart3, Map, MessageSquare, Settings, Waves, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from "react-router-dom";

export const Sidebar = () => {
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
              <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10">
                <Map className="h-4 w-4 mr-3" />
                Float Explorer
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-3" />
                AI Chat
              </Button>
            </Link>
            <Link to="/data">
              <Button variant="ghost" className="w-full justify-start">
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
            <Button variant="ghost" className="w-full justify-start">
              <Waves className="h-4 w-4 mr-3" />
              ARGO Floats
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Database className="h-4 w-4 mr-3" />
              ERDDAP API
            </Button>
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