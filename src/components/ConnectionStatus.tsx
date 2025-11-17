import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConnectionStatusProps {
  status: "connected" | "disconnected" | "error";
  lastSync?: Date;
  errorMessage?: string;
}

export const ConnectionStatus = ({ status, lastSync, errorMessage }: ConnectionStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          label: "Conectado",
          variant: "default" as const,
          className: "bg-green-500 hover:bg-green-600 text-white",
        };
      case "error":
        return {
          icon: AlertCircle,
          label: "Erro",
          variant: "destructive" as const,
          className: "",
        };
      case "disconnected":
      default:
        return {
          icon: WifiOff,
          label: "Desconectado",
          variant: "secondary" as const,
          className: "",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} className={config.className}>
          <Icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
        {lastSync && status === "connected" && (
          <span className="text-sm text-muted-foreground">
            Última sincronização:{" "}
            {formatDistanceToNow(lastSync, { addSuffix: true, locale: ptBR })}
          </span>
        )}
      </div>
      {errorMessage && status === "error" && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};
