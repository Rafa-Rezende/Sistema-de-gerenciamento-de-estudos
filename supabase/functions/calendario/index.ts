// Função "calendario": o link que o iPhone assina (webcal://…/functions/v1/calendario?t=TOKEN).
// Publicar com a checagem de JWT desligada: o app Calendário não manda login, o token secreto é a chave.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { gerarIcs } from "./ics.mjs";

const vazio = (status: number, texto: string) =>
  new Response(texto, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

Deno.serve(async (req) => {
  if (req.method !== "GET" && req.method !== "HEAD") return vazio(405, "Use GET.");
  const token = new URL(req.url).searchParams.get("t") ?? "";
  if (!/^[0-9a-f]{64}$/.test(token)) return vazio(404, "Link de calendário inválido.");

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: cal, error: e1 } = await sb.from("calendarios").select("user_id").eq("token", token).maybeSingle();
  if (e1) return vazio(500, "Não consegui ler o calendário agora.");
  if (!cal) return vazio(404, "Link de calendário inválido.");

  const { data: docs, error: e2 } = await sb
    .from("documentos")
    .select("colecao,id,dados")
    .eq("user_id", cal.user_id)
    .in("colecao", ["sessions", "progress", "subjects"])
    .limit(5000);
  if (e2) return vazio(500, "Não consegui ler o calendário agora.");

  const sessions: Record<string, unknown>[] = [];
  const progress: Record<string, unknown> = {};
  const subjects: Record<string, unknown> = {};
  for (const d of docs ?? []) {
    const v = { ...(d.dados as Record<string, unknown>), id: d.id };
    if (d.colecao === "sessions") sessions.push(v);
    else if (d.colecao === "progress") progress[d.id] = v;
    else subjects[d.id] = v;
  }

  // Um dia para trás cobre qualquer fuso: o que já passou some sozinho na próxima atualização.
  const ontem = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const ics = gerarIcs({ sessions, progress, subjects, desde: ontem, agora: new Date() });
  return new Response(req.method === "HEAD" ? null : ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'inline; filename="estudos.ics"',
      "cache-control": "no-cache",
    },
  });
});
