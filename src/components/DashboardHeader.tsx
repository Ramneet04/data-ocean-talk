import { Activity, Database, Map, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardHeader = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary animate-pulse-ocean" />
            <h1 className="text-2xl font-bold text-foreground">FloatChat</h1>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Indian Ocean ARGO Data</span>
            <span>•</span>
            <span>PoC v1.0</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Database className="h-4 w-4 mr-2" />
            Data Status
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Map className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <MessageCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>
      </div>
    </header>
  );
};