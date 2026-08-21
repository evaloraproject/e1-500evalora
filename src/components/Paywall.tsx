import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PRICE_EUR, TEST_MODE } from "@/lib/access";

export function Paywall({ invitedBy, onUnlock }: { invitedBy: string | null; onUnlock: () => void }) {
  const [loading, setLoading] = useState(false);

  const pay = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onUnlock();
      toast.success("Acesso desbloqueado", {
        description: TEST_MODE ? "Pagamento simulado (modo teste)" : undefined,
      });
    }, 900);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 text-center safe-bottom">
      {TEST_MODE && (
        <span className="mb-6 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
          Modo teste
        </span>
      )}

      <div className="flex size-16 items-center justify-center rounded-3xl border border-primary/30 bg-primary/10">
        <Lock className="size-7 text-primary" />
      </div>

      <h1 className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
        Desafio 1 <span className="text-primary">→</span> 500
      </h1>

      <p className="mt-4 text-2xl font-bold text-foreground">
        Desbloquear por <span className="text-gradient-gold">{PRICE_EUR} €</span>
      </p>

      <p className="mt-3 text-sm text-muted-foreground">
        {invitedBy ? `Foste convidado por ${invitedBy}. ` : ""}
        Pagamento único, sem login. Depois de desbloqueares, a app fica disponível offline neste
        dispositivo.
      </p>

      <ul className="mt-6 w-full space-y-2 rounded-3xl border border-border bg-card p-4 text-left text-sm text-muted-foreground">
        <li>• Grelha completa de 1 a 500</li>
        <li>• Estatísticas e gráfico de evolução</li>
        <li>• Exportar / importar o teu progresso</li>
      </ul>

      <Button size="lg" className="mt-8 w-full rounded-full" onClick={pay} disabled={loading}>
        <Sparkles className="mr-2 size-4" />
        {loading ? "A processar…" : `PAGAR ${PRICE_EUR} €`}
      </Button>

      {TEST_MODE && (
        <p className="mt-3 text-xs text-muted-foreground">
          Nenhum valor é cobrado — pagamento simulado para testes.
        </p>
      )}
    </main>
  );
}
