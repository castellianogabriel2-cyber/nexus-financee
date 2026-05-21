-- =============================================================================
-- FINANÇA APP — Verificação do banco
-- Execute DEPOIS de schema.sql no mesmo projeto Supabase.
-- Leia cada resultado: status deve ser OK / true / 3 policies.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1) TODAS AS TABELAS EXISTEM?
-- ─────────────────────────────────────────────────────────────────────────────
select
  required.table_name,
  case
    when t.table_name is not null then 'OK'
    else 'FALTA — rode schema.sql'
  end as status
from (
  values
    ('profiles'),
    ('categories'),
    ('cards'),
    ('transactions'),
    ('goals'),
    ('installments'),
    ('calendar_events'),
    ('fixed_expenses'),
    ('fund_deposits')
) as required(table_name)
left join information_schema.tables t
  on t.table_schema = 'public'
  and t.table_name = required.table_name
order by required.table_name;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2) TABELA profiles EXISTE + COLUNA onboarding_completed?
-- ─────────────────────────────────────────────────────────────────────────────
select
  column_name,
  data_type,
  is_nullable,
  column_default,
  'OK' as status
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name in (
    'id', 'email', 'full_name', 'monthly_income', 'current_balance',
    'onboarding_completed', 'created_at', 'updated_at'
  )
order by column_name;

-- Confirmação explícita onboarding_completed
select
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'onboarding_completed'
  ) as onboarding_completed_exists;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3) FOREIGN KEYS (profiles → auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
select
  tc.table_name,
  kcu.column_name,
  ccu.table_schema || '.' || ccu.table_name as references_table,
  'OK' as status
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.table_name = 'profiles';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4) RLS ATIVO EM TODAS AS TABELAS?
-- ─────────────────────────────────────────────────────────────────────────────
select
  tablename,
  rowsecurity as rls_enabled,
  case when rowsecurity then 'OK' else 'FALTA RLS' end as status
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles', 'categories', 'cards', 'transactions', 'goals',
    'installments', 'calendar_events', 'fixed_expenses', 'fund_deposits'
  )
order by tablename;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5) POLICIES EM profiles (select, update, insert)
-- ─────────────────────────────────────────────────────────────────────────────
select
  tablename,
  policyname,
  cmd,
  'OK' as status
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by policyname;

-- Contagem esperada: 3 policies em profiles
select
  count(*) as profiles_policy_count,
  case when count(*) >= 3 then 'OK' else 'FALTA POLICY' end as status
from pg_policies
where schemaname = 'public' and tablename = 'profiles';

-- Policies em transactions (insert do app)
select
  count(*) as transactions_policy_count,
  case when count(*) >= 1 then 'OK' else 'FALTA POLICY' end as status
from pg_policies
where schemaname = 'public' and tablename = 'transactions';

-- ─────────────────────────────────────────────────────────────────────────────
-- 6) TRIGGER novo usuário (cria profile no signup)
-- ─────────────────────────────────────────────────────────────────────────────
select
  tgname as trigger_name,
  case when tgname is not null then 'OK' else 'FALTA TRIGGER' end as status
from pg_trigger
where tgname = 'on_auth_user_created';

-- ─────────────────────────────────────────────────────────────────────────────
-- 7) CONTAGEM DE DADOS (pode ser 0 — estrutura OK)
-- ─────────────────────────────────────────────────────────────────────────────
select 'profiles' as tabela, count(*)::int as registros from public.profiles
union all
select 'categories', count(*)::int from public.categories
union all
select 'transactions', count(*)::int from public.transactions
union all
select 'goals', count(*)::int from public.goals
order by tabela;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8) TESTE DE INSERT (estrutural — roda como postgres no SQL Editor)
--     Insere perfil fake e remove; prova que a tabela aceita writes.
--     NÃO use em produção com dados reais; só validação de schema.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare
  test_id uuid := gen_random_uuid();
  insert_ok boolean := false;
begin
  -- Simula linha mínima (sem auth.users — pode falhar por FK; nesse caso pule)
  begin
    insert into public.profiles (
      id, email, full_name, onboarding_completed, monthly_income, current_balance
    ) values (
      test_id, 'verify@test.local', 'Verify Test', false, 0, 0
    );
    insert_ok := true;
    delete from public.profiles where id = test_id;
  exception
    when foreign_key_violation then
      raise notice 'Insert test skipped: FK to auth.users (normal). Test inserts via app login.';
    when others then
      raise notice 'Insert test error: %', sqlerrm;
  end;

  if insert_ok then
    raise notice 'INSERT/DELETE em profiles: OK';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- RESUMO FINAL
-- ─────────────────────────────────────────────────────────────────────────────
select
  (select count(*) from information_schema.tables
   where table_schema = 'public'
     and table_name in (
       'profiles','categories','cards','transactions','goals',
       'installments','calendar_events','fixed_expenses','fund_deposits'
     )) as tabelas_encontradas,
  9 as tabelas_esperadas,
  case
    when (select count(*) from information_schema.tables
          where table_schema = 'public' and table_name = 'profiles') = 1
    then 'profiles OK'
    else 'profiles FALTA'
  end as check_profiles,
  case
    when exists (
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name = 'profiles'
        and column_name = 'onboarding_completed'
    )
    then 'onboarding_completed OK'
    else 'onboarding_completed FALTA'
  end as check_onboarding_flag;
