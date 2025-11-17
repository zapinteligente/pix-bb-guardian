import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PixListProps {
  environment: "sandbox" | "production";
  dateRange: { startDate: string; endDate: string };
  onLoadingChange: (loading: boolean) => void;
  onConnectionStatusChange?: (
    status: "connected" | "disconnected" | "error",
    lastSync?: Date,
    error?: string
  ) => void;
}

interface PixTransaction {
  endToEndId: string;
  txid: string;
  valor: string;
  horario: string;
  pagador: {
    nome: string;
    cpf?: string;
    cnpj?: string;
  };
}

export const PixList = ({ environment, dateRange, onLoadingChange, onConnectionStatusChange }: PixListProps) => {
  const [transactions, setTransactions] = useState<PixTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPixTransactions = async () => {
    setIsLoading(true);
    setError(null);
    onLoadingChange(true);

    try {
      const { data, error } = await supabase.functions.invoke("get-pix-received", {
        body: {
          environment,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });

      if (error) throw error;

      if (data?.pix && Array.isArray(data.pix)) {
        setTransactions(data.pix);
        toast.success(`${data.pix.length} PIX encontrados`);
        onConnectionStatusChange?.("connected", new Date());
      } else {
        setTransactions([]);
        toast.info("Nenhum PIX encontrado no período");
        onConnectionStatusChange?.("connected", new Date());
      }
    } catch (err: any) {
      console.error("Erro ao buscar PIX:", err);
      const errorMsg = err.message || "Erro ao buscar transações PIX";
      setError(errorMsg);
      toast.error("Erro ao buscar transações");
      onConnectionStatusChange?.("error", undefined, errorMsg);
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  useEffect(() => {
    fetchPixTransactions();
  }, [environment, dateRange.startDate, dateRange.endDate]);

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(value));
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("pt-BR");
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground">Transações</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPixTransactions}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhuma transação encontrada para o período selecionado
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card
              key={transaction.endToEndId}
              className="border-border hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-lg">
                          {transaction.pagador.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.pagador.cpf
                            ? `CPF: ${transaction.pagador.cpf}`
                            : `CNPJ: ${transaction.pagador.cnpj}`}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Recebido
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">TxID:</span>
                        <p className="font-mono text-xs break-all">{transaction.txid}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End to End:</span>
                        <p className="font-mono text-xs break-all">{transaction.endToEndId}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(transaction.horario)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(transaction.valor)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
