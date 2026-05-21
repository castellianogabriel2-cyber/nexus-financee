export type Profile = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  monthly_income: number
  current_balance: number
  cash_balance: number
  emergency_reserve_target: number
  emergency_reserve_current: number
  onboarding_completed: boolean
  modo_aperto: boolean
  notifications_enabled: boolean
  next_payday: string | null
  plan: string
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  user_id: string
  slug: string | null
  name: string
  color: string
  icon: string
  is_essential: boolean
  is_fixed: boolean
  created_at: string
}

export type Card = {
  id: string
  user_id: string
  bank: string
  last_digits: string | null
  holder: string | null
  expiry: string | null
  brand: string
  color: string
  credit_limit: number
  amount_used: number
  current_invoice: number
  due_day: number
  created_at: string
}

export type Transaction = {
  id: string
  user_id: string
  type: "expense" | "income"
  amount: number
  category_id: string | null
  payment_method: string | null
  card_id: string | null
  description: string | null
  notes: string | null
  attachment_url: string | null
  transaction_date: string
  installments_total: number
  installment_current: number
  parent_installment_id: string | null
  is_recurring: boolean
  recurrence_frequency: "daily" | "weekly" | "monthly" | "yearly" | null
  recurrence_end_date: string | null
  recurrence_count: number | null
  created_at: string
  updated_at: string
}

export type Goal = {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  color: string
  deadline: string | null
  priority: string
  monthly_target: number | null
  is_emergency_fund: boolean
  created_at: string
}

export type Installment = {
  id: string
  user_id: string
  name: string
  total_amount: number
  installments_total: number
  installment_current: number
  monthly_amount: number
  card_id: string | null
  category_id: string | null
  next_due_date: string | null
  status: "active" | "completed"
  created_at: string
}

export type CalendarEvent = {
  id: string
  user_id: string
  title: string
  event_type: "bill" | "income" | "freelance" | "installment" | "other"
  amount: number | null
  event_date: string
  is_recurring: boolean
  notes: string | null
  card_id: string | null
  created_at: string
}

export type FixedExpense = {
  id: string
  user_id: string
  name: string
  amount: number
  category_id: string | null
  due_day: number
  created_at: string
}

export type FundDeposit = {
  id: string
  user_id: string
  amount: number
  deposit_date: string
  notes: string | null
  created_at: string
}
