import { useCallback, useEffect, useState } from "react";

export const PRICE_EUR = 2;
const ACCESS_KEY = "desafio-1-500:access";
const CODE_KEY = "desafio-1-500:invite-code";

// Modo TESTE: pagamento simulado, sem cobrança real.
export const TEST_MODE = true;

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function useAccess() {
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [invitedBy, setInvitedBy] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const convite = params.get("convite");
    const stored = localStorage.getItem(ACCESS_KEY) === "paid";

    let code = localStorage.getItem(CODE_KEY);
    if (!code) {
      code = randomCode();
      localStorage.setItem(CODE_KEY, code);
    }
    setInviteCode(code);
    setInvitedBy(convite);
    // Só quem chega por um link de convite precisa de desbloquear.
    setUnlocked(stored || !convite);
    setHydrated(true);
  }, []);

  const unlock = useCallback(() => {
    localStorage.setItem(ACCESS_KEY, "paid");
    setUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    setUnlocked(false);
  }, []);

  return { hydrated, unlocked, unlock, lock, inviteCode, invitedBy };
}
