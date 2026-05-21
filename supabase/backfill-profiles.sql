-- =============================================================================
-- BACKFILL — rode SOMENTE se você já fez login ANTES de executar schema.sql
-- Cria public.profiles para usuários que existem em auth.users sem perfil.
-- =============================================================================

insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''),
  coalesce(u.raw_user_meta_data->>'avatar_url', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
