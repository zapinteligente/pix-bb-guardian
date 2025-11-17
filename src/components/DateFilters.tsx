import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateFilterType } from "@/pages/Index";

interface DateFiltersProps {
  dateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
  customStartDate?: Date;
  customEndDate?: Date;
  onCustomStartDateChange: (date: Date | undefined) => void;
  onCustomEndDateChange: (date: Date | undefined) => void;
}

export const DateFilters = ({
  dateFilter,
  onDateFilterChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
}: DateFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          variant={dateFilter === "today" ? "default" : "outline"}
          onClick={() => onDateFilterChange("today")}
          size="sm"
        >
          Hoje
        </Button>
        <Button
          variant={dateFilter === "yesterday" ? "default" : "outline"}
          onClick={() => onDateFilterChange("yesterday")}
          size="sm"
        >
          Ontem
        </Button>
        <Button
          variant={dateFilter === "last3days" ? "default" : "outline"}
          onClick={() => onDateFilterChange("last3days")}
          size="sm"
        >
          Últimos 3 Dias
        </Button>
        <Button
          variant={dateFilter === "custom" ? "default" : "outline"}
          onClick={() => onDateFilterChange("custom")}
          size="sm"
        >
          Período Customizado
        </Button>
      </div>

      {dateFilter === "custom" && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Data Inicial
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customStartDate ? (
                    format(customStartDate, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customStartDate}
                  onSelect={onCustomStartDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Data Final
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customEndDate ? (
                    format(customEndDate, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customEndDate}
                  onSelect={onCustomEndDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};
