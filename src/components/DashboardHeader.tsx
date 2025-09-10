import { useState } from "react";
import { Activity, Database, Map, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
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

          {/* Right Section */}
          <div className="flex items-center space-x-2">
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
        </div>
      </header>

      {/* Data Status Modal */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>🌊 ARGO Data Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Floats</span>
              <Badge variant="secondary">3 Active</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm font-medium">
                {new Date().toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Available Parameters</span>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-orange-100 text-orange-700">Temperature</Badge>
                <Badge className="bg-blue-100 text-blue-700">Salinity</Badge>
                <Badge className="bg-green-100 text-green-700">Oxygen</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium">Live</span>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
