import { BarChart3, Map, MessageSquare, Settings, Waves, Database, Menu, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from "react-router-dom";
import { useState } from 'react';

export const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setOpen(o => !o)}>
          <Activity className="w-6 h-6" />
        </Button>
      </div>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 bg-card border-r border-border p-4 w-64 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <div className="space-y-1">
              <Link to="/dashboard">
                <Button variant={isActive("/dashboard") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/dashboard") ? "text-primary bg-primary/10" : ""}`} onClick={() => setOpen(false)}>
                  <Map className="h-4 w-4 mr-3" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant={isActive("/chat") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/chat") ? "text-primary bg-primary/10" : ""}`} onClick={() => setOpen(false)}>
                  <MessageSquare className="h-4 w-4 mr-3" />
                  AI Chat
                </Button>
              </Link>
              <Link to="/data">
                <Button variant={isActive("/data") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/data") ? "text-primary bg-primary/10" : ""}`} onClick={() => setOpen(false)}>
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
                <Button variant={isActive("/argo-floats") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/argo-floats") ? "text-primary bg-primary/10" : ""}`} onClick={() => setOpen(false)}>
                  <Waves className="h-4 w-4 mr-3" />
                  ARGO Floats
                </Button>
              </Link>
              <Link to="/erddap-api">
                <Button variant={isActive("/erddap-api") ? "secondary" : "ghost"} className={`w-full justify-start ${isActive("/erddap-api") ? "text-primary bg-primary/10" : ""}`} onClick={() => setOpen(false)}>
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
      {/* Overlay for closing sidebar on mobile */}
      {open && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
};