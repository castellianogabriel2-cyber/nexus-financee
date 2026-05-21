// Centralized financial data store
export const financialData = {
  renda: 5500,
  categorias: [
    { name: "Moradia", color: "#34d399", items: [{ name: "Aluguel", value: 2020 }] },
    { name: "Contas", color: "#60a5fa", items: [{ name: "Internet", value: 50 }, { name: "Luz", value: 165 }] },
    { name: "Alimentacao", color: "#f472b6", items: [{ name: "Mercado", value: 500 }, { name: "IFood", value: 50 }, { name: "Agua filtrada", value: 30 }] },
    { name: "Saude", color: "#fb7185", items: [{ name: "Academia", value: 145.9 }, { name: "Insulina basal", value: 180 }, { name: "Insulina rapida", value: 140 }, { name: "Laminas glicose", value: 60 }] },
    { name: "Faculdade", color: "#a78bfa", items: [{ name: "Cafe faculdade", value: 139 }, { name: "Salgados", value: 80 }, { name: "Almoco na rua", value: 225 }] },
    { name: "Lazer", color: "#fbbf24", items: [{ name: "Uber futvolei", value: 120 }, { name: "Bar / cerveja", value: 72 }] },
    { name: "Transporte", color: "#38bdf8", items: [{ name: "Viagem Petropolis", value: 139.6 }] },
  ],
}

export const totalGastos = financialData.categorias.reduce(
  (acc, cat) => acc + cat.items.reduce((sum, item) => sum + item.value, 0), 0
)

export const saldo = financialData.renda - totalGastos
export const percentualUsado = (totalGastos / financialData.renda) * 100

export const evolutionData = [
  { month: "Dez", gastos: 3800, renda: 5500 },
  { month: "Jan", gastos: 4100, renda: 5500 },
  { month: "Fev", gastos: 3950, renda: 5500 },
  { month: "Mar", gastos: 4200, renda: 5500 },
  { month: "Abr", gastos: 3700, renda: 5500 },
  { month: "Mai", gastos: totalGastos, renda: 5500 },
]

export const donutData = financialData.categorias.map((cat) => ({
  name: cat.name,
  value: cat.items.reduce((sum, item) => sum + item.value, 0),
  color: cat.color,
}))

// Cards data
export const cardsData = [
  {
    id: 1,
    bank: "Nubank",
    lastDigits: "4523",
    holder: "GABRIEL CASTELIANO",
    expiry: "12/28",
    brand: "mastercard",
    color: "from-purple-600 to-purple-900",
    limite: 8000,
    usado: 2350,
    fatura: 1850,
    vencimento: "15/06",
  },
  {
    id: 2,
    bank: "Inter",
    lastDigits: "8912",
    holder: "GABRIEL CASTELIANO",
    expiry: "08/27",
    brand: "mastercard",
    color: "from-orange-500 to-orange-700",
    limite: 5000,
    usado: 1200,
    fatura: 980,
    vencimento: "10/06",
  },
  {
    id: 3,
    bank: "C6 Bank",
    lastDigits: "3301",
    holder: "GABRIEL CASTELIANO",
    expiry: "03/29",
    brand: "visa",
    color: "from-zinc-800 to-zinc-950",
    limite: 12000,
    usado: 4500,
    fatura: 3200,
    vencimento: "20/06",
  },
]

// Goals data
export const goalsData = [
  { name: "Reserva de emergencia", target: 15000, current: 8500, color: "#34d399" },
  { name: "Viagem 2026", target: 5000, current: 2800, color: "#60a5fa" },
  { name: "MacBook Pro", target: 12000, current: 3200, color: "#a78bfa" },
]

// Categories for new transaction
export const transactionCategories = [
  { id: "moradia", name: "Moradia", icon: "Home", color: "#34d399" },
  { id: "contas", name: "Contas", icon: "Receipt", color: "#60a5fa" },
  { id: "alimentacao", name: "Alimentacao", icon: "UtensilsCrossed", color: "#f472b6" },
  { id: "saude", name: "Saude", icon: "Heart", color: "#fb7185" },
  { id: "faculdade", name: "Faculdade", icon: "GraduationCap", color: "#a78bfa" },
  { id: "lazer", name: "Lazer", icon: "Gamepad2", color: "#fbbf24" },
  { id: "transporte", name: "Transporte", icon: "Car", color: "#38bdf8" },
  { id: "outros", name: "Outros", icon: "MoreHorizontal", color: "#94a3b8" },
]

// Payment methods
export const paymentMethods = [
  { id: "dinheiro", name: "Dinheiro", icon: "Banknote" },
  { id: "pix", name: "PIX", icon: "Zap" },
  { id: "debito", name: "Debito", icon: "CreditCard" },
  { id: "credito", name: "Credito", icon: "CreditCard" },
]
