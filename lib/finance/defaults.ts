export const DEFAULT_CATEGORIES = [
  { slug: "moradia", name: "Moradia", icon: "Home", color: "#34d399", is_essential: true },
  { slug: "contas", name: "Contas", icon: "Receipt", color: "#60a5fa", is_essential: true },
  { slug: "alimentacao", name: "Alimentacao", icon: "UtensilsCrossed", color: "#f472b6", is_essential: true },
  { slug: "saude", name: "Saude", icon: "Heart", color: "#fb7185", is_essential: true },
  { slug: "faculdade", name: "Faculdade", icon: "GraduationCap", color: "#a78bfa", is_essential: false },
  { slug: "lazer", name: "Lazer", icon: "Gamepad2", color: "#fbbf24", is_essential: false },
  { slug: "transporte", name: "Transporte", icon: "Car", color: "#38bdf8", is_essential: false },
  { slug: "outros", name: "Outros", icon: "MoreHorizontal", color: "#94a3b8", is_essential: false },
] as const

export const PAYMENT_METHODS = [
  { id: "dinheiro", name: "Dinheiro", icon: "Banknote" },
  { id: "pix", name: "PIX", icon: "Zap" },
  { id: "debito", name: "Debito", icon: "CreditCard" },
  { id: "credito", name: "Credito", icon: "CreditCard" },
] as const

export const CARD_GRADIENTS = [
  "from-purple-600 to-purple-900",
  "from-orange-500 to-orange-700",
  "from-zinc-800 to-zinc-950",
  "from-cyan-600 to-blue-900",
] as const
