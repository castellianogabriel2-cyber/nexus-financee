# Finança — App financeiro premium

Dashboard financeiro pessoal com Next.js 16, Supabase (auth + banco + realtime) e design fintech.

## Setup Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No **SQL Editor**, execute o arquivo `supabase/schema.sql`
3. Em **Authentication → Providers**, habilite **Google** e **Apple** (configure redirect URLs)
4. Crie o bucket **attachments** em Storage (privado; políticas por `user_id`)
5. Copie as chaves para `.env.local`:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Redirect URLs no Supabase:
- `http://localhost:3000/auth/callback`
- Sua URL de produção + `/auth/callback`

## Desenvolvimento

```bash
npm install
npm run dev
```

## Funcionalidades

- Login Google, Apple e email (cadastro + recuperação de senha)
- Onboarding zerado (sem dados fictícios)
- Transações reais com categorias, parcelas e anexos
- Dashboard, analytics e insights baseados em dados reais
- Modo Aperto, calendário financeiro, metas, cartões e reserva
- Sincronização em tempo real via Supabase Realtime
