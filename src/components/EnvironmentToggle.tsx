import { Button } from "@/components/ui/button";
import { TestTube, Globe } from "lucide-react";

interface EnvironmentToggleProps {
  environment: "sandbox" | "production";
  onToggle: (env: "sandbox" | "production") => void;
}

export const EnvironmentToggle = ({ environment, onToggle }: EnvironmentToggleProps) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant={environment === "sandbox" ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle("sandbox")}
        className="gap-2"
      >
        <TestTube className="h-4 w-4" />
        Sandbox
      </Button>
      <Button
        variant={environment === "production" ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle("production")}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        Produção
      </Button>
    </div>
  );
};
