import { Banknote } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2.5 rounded-lg shadow-glow">
            <Banknote className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">PIX Banco do Brasil</h1>
            <p className="text-sm text-muted-foreground">Consulta de recebimentos</p>
          </div>
        </div>
      </div>
    </header>
  );
};
