import { useState } from "react";
import { Activity, Database, Map, MessageCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DashboardHeader = () => {
  const { toast } = useToast();
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleExport = () => {
    const dummyData = {
      message: "This is just a dummy export file.",
      floats: ["Float-1", "Float-2", "Float-3"],
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dummyData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "argo-floats-export.json";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Dummy ARGO float data downloaded as JSON.",
    });
  };

  const handleHelp = () => {
    toast({
      title: "Prototype Help",
      description:
        "This is a proof-of-concept version of FloatChat. Future versions will include detailed documentation, tooltips, and guided onboarding.",
    });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <Activity className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse-ocean" />
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                FloatChat
              </h1>
              <div className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                <span>Indian Ocean ARGO Data</span>
                <span>•</span>
                <span>PoC v1.0</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => setIsStatusOpen(true)}
            >
              <Database className="h-4 w-4 mr-2" />
              Data Status
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={handleExport}
            >
              <Map className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={handleHelp}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsStatusOpen(true)}>
                  <Database className="h-4 w-4 mr-2" /> Data Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Map className="h-4 w-4 mr-2" /> Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleHelp}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Help
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Data Status Modal */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-md max-w-xs">
          <DialogHeader>
            <DialogTitle>🌊 ARGO Data Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Total Floats
              </span>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                3 Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Last Updated
              </span>
              <span className="text-xs sm:text-sm font-medium">
                {new Date().toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Available Parameters
              </span>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-orange-100 text-orange-700 text-xs sm:text-sm">
                  Temperature
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                  Salinity
                </Badge>
                <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm">
                  Oxygen
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Status
              </span>
              <span className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-medium">Live</span>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
