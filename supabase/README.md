# Supabase — Finança App

## Ordem de execução

| Ordem | Arquivo | Obrigatório |
|-------|---------|-------------|
| **1º** | `schema.sql` | Sim |
| **2º** | `verify.sql` | Sim (validação) |
| **3º** | `backfill-profiles.sql` | Só se já tinha conta antes do schema |

## Onde colar

1. [supabase.com/dashboard](https://supabase.com/dashboard) → seu projeto
2. Menu **SQL Editor** → **New query**
3. Cole o conteúdo do arquivo → **Run**

## Tabelas criadas

- `profiles` — onboarding_completed, renda, saldo
- `categories`, `cards`, `transactions`, `goals`
- `installments`, `calendar_events`, `fixed_expenses`, `fund_deposits`

Analytics e onboarding **não** têm tabela própria (dados em `profiles` + `transactions`).
