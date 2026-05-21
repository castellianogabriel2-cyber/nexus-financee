-- =============================================================================
-- FINANÇA APP — Schema Supabase
-- Execute este arquivo INTEIRO no SQL Editor do Supabase (projeto correto).
-- Ordem: 1º schema.sql  →  2º verify.sql  →  3º backfill-profiles.sql (se já tinha login)
-- =============================================================================

-- Extensão UUID (já existe no Supabase, mas garantimos)
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PROFILES — perfil + onboarding (onboarding_completed)
--    id = auth.users.id
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  monthly_income numeric not null default 0,
  current_balance numeric not null default 0,
  cash_balance numeric not null default 0,
  emergency_reserve_target numeric not null default 0,
  emergency_reserve_current numeric not null default 0,
  onboarding_completed boolean not null default false,
  modo_aperto boolean not null default false,
  next_payday date,
  plan text not null default 'premium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil financeiro do usuário; onboarding_completed controla redirect';
comment on column public.profiles.onboarding_completed is 'true após concluir wizard de onboarding';

-- -----------------------------------------------------------------------------
-- 2. CATEGORIES — categorias de gasto (criadas no onboarding)
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text,
  name text not null,
  color text not null,
  icon text not null default 'MoreHorizontal',
  is_essential boolean not null default false,
  is_fixed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_user_id on public.categories (user_id);

-- -----------------------------------------------------------------------------
-- 3. CARDS — cartões de crédito
-- -----------------------------------------------------------------------------
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  bank text not null,
  last_digits text,
  holder text,
  expiry text,
  brand text not null default 'mastercard',
  color text not null default 'from-purple-600 to-purple-900',
  credit_limit numeric not null default 0,
  amount_used numeric not null default 0,
  current_invoice numeric not null default 0,
  due_day int not null default 10,
  created_at timestamptz not null default now()
);

create index if not exists idx_cards_user_id on public.cards (user_id);

-- -----------------------------------------------------------------------------
-- 4. TRANSACTIONS — gastos e entradas (dashboard, gastos, analytics)
-- -----------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('expense', 'income')),
  amount numeric not null check (amount > 0),
  category_id uuid references public.categories (id) on delete set null,
  payment_method text,
  card_id uuid references public.cards (id) on delete set null,
  description text,
  notes text,
  attachment_url text,
  transaction_date date not null default (current_date),
  installments_total int not null default 1,
  installment_current int not null default 1,
  parent_installment_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_transactions_user_id on public.transactions (user_id);
create index if not exists idx_transactions_user_date on public.transactions (user_id, transaction_date desc);
create index if not exists idx_transactions_category on public.transactions (category_id);

-- -----------------------------------------------------------------------------
-- 5. GOALS — metas financeiras + reserva de emergência
-- -----------------------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target_amount numeric not null,
  current_amount numeric not null default 0,
  color text not null default '#34d399',
  deadline date,
  priority text not null default 'medium',
  monthly_target numeric,
  is_emergency_fund boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_goals_user_id on public.goals (user_id);

-- -----------------------------------------------------------------------------
-- 6. INSTALLMENTS — parcelamentos
-- -----------------------------------------------------------------------------
create table if not exists public.installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  total_amount numeric not null,
  installments_total int not null,
  installment_current int not null default 1,
  monthly_amount numeric not null,
  card_id uuid references public.cards (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  next_due_date date,
  status text not null default 'active' check (status in ('active', 'completed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_installments_user_id on public.installments (user_id);

-- -----------------------------------------------------------------------------
-- 7. CALENDAR_EVENTS — calendário financeiro
-- -----------------------------------------------------------------------------
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  event_type text not null check (
    event_type in ('bill', 'income', 'freelance', 'installment', 'other')
  ),
  amount numeric,
  event_date date not null,
  is_recurring boolean not null default false,
  notes text,
  card_id uuid references public.cards (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_calendar_events_user_id on public.calendar_events (user_id);
create index if not exists idx_calendar_events_date on public.calendar_events (user_id, event_date);

-- -----------------------------------------------------------------------------
-- 8. FIXED_EXPENSES — gastos fixos (onboarding, opcional)
-- -----------------------------------------------------------------------------
create table if not exists public.fixed_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  amount numeric not null,
  category_id uuid references public.categories (id) on delete set null,
  due_day int not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_fixed_expenses_user_id on public.fixed_expenses (user_id);

-- -----------------------------------------------------------------------------
-- 9. FUND_DEPOSITS — depósitos na reserva de emergência
-- -----------------------------------------------------------------------------
create table if not exists public.fund_deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric not null,
  deposit_date date not null default (current_date),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_fund_deposits_user_id on public.fund_deposits (user_id);

-- -----------------------------------------------------------------------------
-- NOTA: Analytics NÃO usa tabela própria — calculado em tempo real a partir de
--       transactions + profiles + categories no app.
--       Onboarding NÃO usa tabela própria — usa profiles + inserts opcionais.
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- Trigger: criar profile automaticamente no cadastro (auth.users)
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- updated_at automático (profiles + transactions)
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
  before update on public.transactions
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.cards enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.installments enable row level security;
alter table public.calendar_events enable row level security;
alter table public.fixed_expenses enable row level security;
alter table public.fund_deposits enable row level security;

-- Profiles: id = auth.uid()
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Demais tabelas: user_id = auth.uid()
drop policy if exists "categories_all_own" on public.categories;
drop policy if exists "cards_all_own" on public.cards;
drop policy if exists "transactions_all_own" on public.transactions;
drop policy if exists "goals_all_own" on public.goals;
drop policy if exists "installments_all_own" on public.installments;
drop policy if exists "calendar_all_own" on public.calendar_events;
drop policy if exists "fixed_all_own" on public.fixed_expenses;
drop policy if exists "deposits_all_own" on public.fund_deposits;

create policy "categories_all_own"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "cards_all_own"
  on public.cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "transactions_all_own"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "goals_all_own"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "installments_all_own"
  on public.installments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "calendar_all_own"
  on public.calendar_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "fixed_all_own"
  on public.fixed_expenses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "deposits_all_own"
  on public.fund_deposits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- REALTIME (sync ao vivo no app)
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
  tables text[] := array[
    'profiles', 'categories', 'cards', 'transactions', 'goals',
    'installments', 'calendar_events', 'fund_deposits'
  ];
begin
  foreach t in array tables loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception
      when duplicate_object then null;
    end;
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- STORAGE (opcional — anexos em nova transação)
-- Crie o bucket "attachments" no Dashboard: Storage → New bucket → attachments (private)
-- Depois rode storage-policies.sql se existir, ou configure policies na UI.
-- -----------------------------------------------------------------------------
