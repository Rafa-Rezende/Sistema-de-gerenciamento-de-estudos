-- Rota de Estudos: banco no Supabase.
-- Rodar uma vez no painel do Supabase: SQL Editor → New query → colar → Run.

-- Os mesmos documentos do banco do artefato (subjects, sessions, progress, settings, tasks, days),
-- um por linha, sempre presos ao usuário logado.
create table if not exists public.documentos (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  colecao text not null check (colecao in ('subjects', 'sessions', 'progress', 'settings', 'tasks', 'days')),
  id text not null check (length(id) between 1 and 200),
  dados jsonb not null,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, colecao, id)
);

alter table public.documentos enable row level security;

drop policy if exists "ler os meus documentos" on public.documentos;
drop policy if exists "criar os meus documentos" on public.documentos;
drop policy if exists "mudar os meus documentos" on public.documentos;
drop policy if exists "apagar os meus documentos" on public.documentos;
create policy "ler os meus documentos" on public.documentos for select to authenticated using (auth.uid() = user_id);
create policy "criar os meus documentos" on public.documentos for insert to authenticated with check (auth.uid() = user_id);
create policy "mudar os meus documentos" on public.documentos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "apagar os meus documentos" on public.documentos for delete to authenticated using (auth.uid() = user_id);

-- O app aberto no computador e no iPhone ao mesmo tempo vê as mudanças um do outro.
do $$ begin
  alter publication supabase_realtime add table public.documentos;
exception when duplicate_object then null; end $$;

-- Link secreto do calendário que o iPhone assina (lido só pela função "calendario", com a chave de serviço).
create table if not exists public.calendarios (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  token text not null unique default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  criado_em timestamptz not null default now()
);

alter table public.calendarios enable row level security;

drop policy if exists "ver o meu link" on public.calendarios;
drop policy if exists "criar o meu link" on public.calendarios;
drop policy if exists "apagar o meu link" on public.calendarios;
create policy "ver o meu link" on public.calendarios for select to authenticated using (auth.uid() = user_id);
create policy "criar o meu link" on public.calendarios for insert to authenticated with check (auth.uid() = user_id);
create policy "apagar o meu link" on public.calendarios for delete to authenticated using (auth.uid() = user_id);
