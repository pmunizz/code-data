create table if not exists public.snippets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  language text not null check (language in ('javascript', 'typescript', 'tsx', 'python', 'css', 'html')),
  code text not null default '',
  pattern text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.snippets enable row level security;

create policy "Allow public snippet reads"
  on public.snippets for select
  to anon, authenticated
  using (true);

create policy "Allow public snippet inserts"
  on public.snippets for insert
  to anon, authenticated
  with check (true);

create policy "Allow public snippet updates"
  on public.snippets for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Allow public snippet deletes"
  on public.snippets for delete
  to anon, authenticated
  using (true);

create or replace function public.set_snippets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists snippets_set_updated_at on public.snippets;
create trigger snippets_set_updated_at
before update on public.snippets
for each row execute function public.set_snippets_updated_at();
