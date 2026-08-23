import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export type RankRow = {
  id: string;
  nickname: string;
  accumulated: number;
  done_count: number;
  progress: number;
};

export async function fetchRanking(): Promise<RankRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nickname, accumulated, done_count, progress")
    .order("accumulated", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function syncProgress(input: {
  userId: string;
  nickname: string;
  accumulated: number;
  doneCount: number;
  progress: number;
}) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: input.userId,
      nickname: input.nickname,
      accumulated: input.accumulated,
      done_count: input.doneCount,
      progress: Number(input.progress.toFixed(2)),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

export async function fetchMyProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id, nickname, accumulated, done_count, progress")
    .eq("id", userId)
    .maybeSingle();
  return data as RankRow | null;
}

/** Sincroniza o progresso local com o ranking sempre que muda (só com sessão). */
export function useRankingSync(
  userId: string | null,
  stats: { accumulated: number; doneCount: number; progress: number },
  hydrated: boolean,
) {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNickname(null);
      return;
    }
    void fetchMyProfile(userId).then((p) => setNickname(p?.nickname ?? null));
  }, [userId]);

  useEffect(() => {
    if (!userId || !hydrated || !nickname) return;
    const t = window.setTimeout(() => {
      void syncProgress({
        userId,
        nickname,
        accumulated: stats.accumulated,
        doneCount: stats.doneCount,
        progress: stats.progress,
      }).catch(() => undefined);
    }, 600);
    return () => window.clearTimeout(t);
  }, [userId, nickname, hydrated, stats.accumulated, stats.doneCount, stats.progress]);

  return { nickname, setNickname };
}
