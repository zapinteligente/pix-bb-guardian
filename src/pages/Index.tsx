import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { DateFilters } from "@/components/DateFilters";
import { PixList } from "@/components/PixList";
import { EnvironmentToggle } from "@/components/EnvironmentToggle";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export type DateFilterType = "today" | "yesterday" | "last3days" | "custom";

const Index = () => {
  const [environment, setEnvironment] = useState<"sandbox" | "production">("sandbox");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("today");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error">("disconnected");
  const [lastSync, setLastSync] = useState<Date | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const getDateRange = () => {
    const now = new Date();
    
    switch (dateFilter) {
      case "today":
        return {
          startDate: format(startOfDay(now), "yyyy-MM-dd'T'HH:mm:ssXXX"),
          endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ssXXX")
        };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return {
          startDate: format(startOfDay(yesterday), "yyyy-MM-dd'T'HH:mm:ssXXX"),
          endDate: format(endOfDay(yesterday), "yyyy-MM-dd'T'HH:mm:ssXXX")
        };
      case "last3days":
        return {
          startDate: format(startOfDay(subDays(now, 3)), "yyyy-MM-dd'T'HH:mm:ssXXX"),
          endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ssXXX")
        };
      case "custom":
        if (!customStartDate || !customEndDate) {
          return {
            startDate: format(startOfDay(now), "yyyy-MM-dd'T'HH:mm:ssXXX"),
            endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ssXXX")
          };
        }
        return {
          startDate: format(startOfDay(customStartDate), "yyyy-MM-dd'T'HH:mm:ssXXX"),
          endDate: format(endOfDay(customEndDate), "yyyy-MM-dd'T'HH:mm:ssXXX")
        };
      default:
        return {
          startDate: format(startOfDay(now), "yyyy-MM-dd'T'HH:mm:ssXXX"),
          endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ssXXX")
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-3">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Dashboard de PIX</h2>
              <p className="text-muted-foreground mt-1">Acompanhe seus recebimentos em tempo real</p>
            </div>
            <ConnectionStatus 
              status={connectionStatus}
              lastSync={lastSync}
              errorMessage={errorMessage}
            />
          </div>
          <EnvironmentToggle 
            environment={environment} 
            onToggle={setEnvironment}
          />
        </div>

        <StatsCards 
          environment={environment}
          dateRange={getDateRange()}
          isLoading={isLoading}
        />

        <div className="bg-card rounded-xl shadow-lg border border-border p-6 space-y-6">
          <DateFilters
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomStartDateChange={setCustomStartDate}
            onCustomEndDateChange={setCustomEndDate}
          />

          <PixList
            environment={environment}
            dateRange={getDateRange()}
            onLoadingChange={setIsLoading}
            onConnectionStatusChange={(status, lastSync, error) => {
              setConnectionStatus(status);
              setLastSync(lastSync);
              setErrorMessage(error);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
