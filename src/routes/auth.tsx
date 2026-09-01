import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyProfile, syncProgress } from "@/lib/ranking";
import { useChallenge } from "@/lib/challenge";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — DESAFIO 1 → 500" },
      {
        name: "description",
        content:
          "Cria conta ou entra para guardares o progresso do desafio na nuvem e apareceres no ranking universal.",
      },
      { property: "og:title", content: "Entrar no DESAFIO 1 → 500" },
      {
        property: "og:description",
        content: "Guarda o progresso em qualquer dispositivo e entra no ranking universal.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { stats, hydrated } = useChallenge();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [profileNick, setProfileNick] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void fetchMyProfile(user.id).then((p) => {
      setProfileNick(p?.nickname ?? null);
      if (!p) {
        const meta = (user.user_metadata?.["nickname"] as string | undefined) ?? "";
        const fallback = meta || user.email?.split("@")[0] || "jogador";
        setNickname(fallback);
      }
    });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    const nick = nickname.trim();
    if (nick.length < 2) {
      toast.error("Escolhe uma alcunha com pelo menos 2 letras");
      return;
    }
    setBusy(true);
    try {
      await syncProgress({
        userId: user.id,
        nickname: nick,
        accumulated: hydrated ? stats.accumulated : 0,
        doneCount: hydrated ? stats.doneCount : 0,
        progress: hydrated ? stats.progress : 0,
      });
      setProfileNick(nick);
      toast.success("Progresso sincronizado com o ranking");
      void navigate({ to: "/ranking" });
    } catch {
      toast.error("Não foi possível guardar a alcunha");
    } finally {
      setBusy(false);
    }
  };

  const withEmail = async () => {
    const mail = email.trim().toLowerCase();
    if (!mail.includes("@")) {
      toast.error("Escreve um email válido");
      return;
    }
    if (password.length < 6) {
      toast.error("A palavra-passe precisa de pelo menos 6 caracteres");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: mail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { nickname: nickname.trim() || mail.split("@")[0] },
          },
        });
        if (error) throw error;
        if (data.session) toast.success("Conta criada. Já podes definir a alcunha.");
        else toast.success("Conta criada. Confirma o email para entrares.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: mail, password });
        if (error) throw error;
        toast.success("Sessão iniciada");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (/invalid login credentials/i.test(msg)) toast.error("Email ou palavra-passe incorretos");
      else if (/email not confirmed/i.test(msg))
        toast.error("Confirma primeiro o email que te enviámos");
      else if (/already registered|user already/i.test(msg))
        toast.error("Este email já tem conta. Escolhe “Entrar”.");
      else toast.error(msg || "Erro de autenticação");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão terminada");
  };


  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pt-10 md:max-w-lg md:px-8 safe-bottom">
      <Link
        to="/app"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground"
      >
        <ArrowLeft className="size-3.5" /> Voltar
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-foreground">Conta &amp; Ranking</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A app funciona sem conta. Cria conta só para guardares o progresso em qualquer dispositivo e
        entrares no ranking universal.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">A carregar…</p>
      ) : user ? (
        <section className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Sessão: <span className="text-foreground">{user.email ?? "conta Google"}</span>
          </p>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Alcunha no ranking
            </label>
            <Input
              value={nickname || profileNick || ""}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="A tua alcunha"
              className="h-12 rounded-2xl"
            />
          </div>
          <Button className="w-full rounded-full" disabled={busy} onClick={saveProfile}>
            <Trophy className="mr-2 size-4" /> Guardar e sincronizar
          </Button>
          <Button variant="secondary" className="w-full rounded-full" onClick={signOut}>
            <LogOut className="mr-2 size-4" /> Terminar sessão
          </Button>
        </section>
      ) : (
        <section className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-5">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["signup", "Criar conta"],
                ["login", "Entrar"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={
                  mode === key
                    ? "rounded-full border border-primary bg-primary/15 py-2 text-xs font-semibold text-primary"
                    : "rounded-full border border-border bg-secondary/50 py-2 text-xs font-semibold text-muted-foreground"
                }
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Alcunha (aparece no ranking)"
              className="h-12 rounded-2xl"
            />
          )}
          <Input
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-12 rounded-2xl"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Palavra-passe"
            className="h-12 rounded-2xl"
          />
          <Button className="w-full rounded-full" disabled={busy} onClick={withEmail}>
            {mode === "signup" ? "Criar conta" : "Entrar"}
          </Button>
          <Button variant="secondary" className="w-full rounded-full" onClick={withGoogle}>
            Continuar com Google
          </Button>
        </section>
      )}

      <div className="mt-6 pb-10 text-center">
        <Link to="/ranking" className="text-xs uppercase tracking-[0.25em] text-primary">
          Ver ranking
        </Link>
      </div>
    </main>
  );
}
