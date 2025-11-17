import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Hash, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  environment: "sandbox" | "production";
  dateRange: { startDate: string; endDate: string };
  isLoading: boolean;
}

export const StatsCards = ({ environment, dateRange, isLoading }: StatsCardsProps) => {
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    average: 0,
    lastUpdate: new Date().toLocaleTimeString("pt-BR")
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Recebido</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.total)}</p>
            </div>
            <div className="bg-gradient-success p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-success-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Quantidade</p>
              <p className="text-2xl font-bold text-foreground">{stats.count}</p>
            </div>
            <div className="bg-gradient-primary p-3 rounded-lg">
              <Hash className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ticket Médio</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.average)}</p>
            </div>
            <div className="bg-accent/20 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Última Atualização</p>
              <p className="text-2xl font-bold text-foreground">{stats.lastUpdate}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
