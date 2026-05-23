export type Intent = "create_transaction" | "report" | "question" | "insight" | "greeting" | "small_talk" | "help" | "unknown"

export interface ParsedTransaction {
  type: "expense" | "income"
  amount: number
  description: string
  category_id: string | null
  payment_method: string | null
  card_id: string | null
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
}

export interface ParseResult {
  success: boolean
  confidence: number
  transaction?: ParsedTransaction
  missingFields?: string[]
  summary?: string
}

export function detectIntent(message: string): Intent {
  const lowerMessage = message.toLowerCase()

  // Greeting keywords
  const greetingKeywords = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'eai', 'eae', 'salve', 'fala']
  if (greetingKeywords.some(keyword => lowerMessage.includes(keyword) || lowerMessage === keyword)) {
    return "greeting"
  }

  // Small talk / questions about the AI
  const smallTalkKeywords = ['tudo bem?', 'tudo bem', 'como vai', 'como você está', 'quem é você', 'o que você faz', 'o que voce faz', 'qual seu nome', 'seu nome', 'você é', 'voce é', 'ajuda', 'ajudar', 'funciona', 'como funciona']
  if (smallTalkKeywords.some(keyword => lowerMessage.includes(keyword) || lowerMessage === keyword)) {
    return "small_talk"
  }

  // Help keywords
  const helpKeywords = ['ajuda', 'help', 'o que posso fazer', 'o que posso perguntar', 'comandos', 'opções', 'funcionalidades', 'como usar']
  if (helpKeywords.some(keyword => lowerMessage.includes(keyword) || lowerMessage === keyword)) {
    return "help"
  }

  // Report/Question keywords - these indicate the user wants to see data, not create a transaction
  const reportKeywords = [
    'relatório', 'relatorio', 'relat', 'resumo', 'resum', 'mostra', 'mostre',
    'quanto gastei', 'quanto gast', 'gastei no mês', 'gastei no mes', 'gastei esse mês', 'gastei esse mes',
    'quanto entrou', 'quanto ent', 'entrou no mês', 'entrou no mes', 'entrou esse mês', 'entrou esse mes',
    'qual categoria', 'categoria gastei mais', 'gastei mais em',
    'meus gastos', 'meus gasto', 'me mostra', 'me mostre',
    'disponível', 'disponivel', 'sobra', 'sobrou', 'saldo',
    'como estão minhas metas', 'como estao minhas metas', 'minhas metas',
    'análise', 'analise', 'analise de', 'análise de',
    'estatística', 'estatistica', 'estatísticas', 'estatisticas',
    'histórico', 'historico', 'histórico de', 'historico de',
    'total gasto', 'total gast', 'total de gastos', 'total de gasto',
    'total recebido', 'total receb', 'total de receitas', 'total de receita',
    'balanço', 'balanco', 'balanço do', 'balanco do',
    'financeiro', 'financeir', 'situação financeira', 'situacao financeira',
    'overview', 'visão geral', 'visao geral',
    'dashboard', 'painel', 'painel de',
    'comparativo', 'compara', 'comparar',
    'evolução', 'evolucao', 'evolução de', 'evolucao de',
    'trend', 'tendência', 'tendencia',
    'performance', 'performanc',
    'summary', 'sumário', 'sumario',
    'breakdown', 'detalhamento', 'detalhament',
    'insight', 'insights', 'dica', 'dicas', 'sugestão', 'sugestao',
    'recomendação', 'recomendacao', 'recomenda',
    'alerta', 'alert', 'aviso', 'avis',
    'status', 'situação', 'situacao',
    'progresso', 'progress', 'acompanhamento', 'acompanhament',
    'meta', 'objetivo', 'objetiv',
    'reserva', 'fundo', 'caixa', 'carteira'
  ]

  // Check if it's a report/question
  if (reportKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return "report"
  }

  // Question indicators
  const questionIndicators = ['?', 'o que', 'qual', 'quanto', 'como', 'onde', 'quando', 'por que', 'porque', 'quem']
  if (questionIndicators.some(indicator => lowerMessage.includes(indicator))) {
    return "question"
  }

  // Create transaction keywords - these indicate the user wants to create a transaction
  const createTransactionKeywords = [
    'gastei', 'comprei', 'paguei', 'pague', 'gastar', 'comprar', 'pagar', 'gasto', 'compra', 'pagamento', 'passei', 'usei', 'saiu', 'debitaram', 'gastou',
    'recebi', 'ganhei', 'entrou', 'receber', 'ganhar', 'receita', 'renda', 'salário', 'freela', 'caiu', 'cliente', 'job', 'serviço', 'servico',
    'depositei', 'deposit', 'coloc', 'adicionei', 'adicion', 'transfer', 'enviei', 'envi'
  ]

  if (createTransactionKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return "create_transaction"
  }

  // Insight keywords
  const insightKeywords = ['dica', 'sugestão', 'sugestao', 'recomenda', 'melhorar', 'otimizar', 'otimizar', 'economizar', 'economiz']
  if (insightKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return "insight"
  }

  return "unknown"
}

export function parseFinancialCommand(message: string): ParseResult {
  const lowerMessage = message.toLowerCase()
  
  // Detect type (income vs expense)
  const expenseKeywords = ['gastei', 'comprei', 'paguei', 'pague', 'gastar', 'comprar', 'pagar', 'gasto', 'compra', 'pagamento', 'passei', 'usei', 'saiu', 'debitaram', 'gastou']
  const incomeKeywords = ['recebi', 'ganhei', 'entrou', 'receber', 'ganhar', 'receita', 'renda', 'salário', 'freela', 'caiu', 'pagamento', 'cliente', 'job', 'serviço']
  
  const hasExpenseKeyword = expenseKeywords.some(keyword => lowerMessage.includes(keyword))
  const hasIncomeKeyword = incomeKeywords.some(keyword => lowerMessage.includes(keyword))
  
  const type: "expense" | "income" = hasIncomeKeyword && !hasExpenseKeyword ? "income" : "expense"
  
  // Extract amount (Brazilian format)
  let amountText = message.replace(/\./g, '') // Remove thousands separator
  amountText = amountText.replace(/[R$]/g, '').trim()
  amountText = amountText.replace(/,/g, '.') // Replace decimal comma with dot
  
  const amountMatch = amountText.match(/\d+\.?\d*/)
  const amount = amountMatch ? parseFloat(amountMatch[0]) : 0
  
  // Extract description
  const description = extractDescription(message, amount)
  
  // Detect category
  const category = detectCategory(lowerMessage, description)
  
  // Detect payment method
  const paymentMethod = detectPaymentMethod(lowerMessage)
  
  // Extract card info
  const cardId = extractCardId(lowerMessage)
  
  // Extract installments
  const installmentsTotal = extractInstallments(lowerMessage)
  
  // Calculate confidence
  let confidence = 0.5
  if (amount > 0) confidence += 0.3
  if (description && description !== 'Transação') confidence += 0.1
  if (category !== 'Geral') confidence += 0.05
  if (paymentMethod !== 'unknown') confidence += 0.05
  
  // Identify missing fields
  const missingFields: string[] = []
  if (amount <= 0) missingFields.push('valor')
  if (!description || description === 'Transação') missingFields.push('descrição')
  
  // If confidence is too low or missing essential fields, return failure
  if (confidence < 0.5 || missingFields.length > 0) {
    return {
      success: false,
      confidence,
      missingFields
    }
  }
  
  // Build transaction object
  const transaction: ParsedTransaction = {
    type,
    amount,
    description,
    category_id: null, // Will be mapped by category name in useAI
    payment_method: paymentMethod === 'unknown' ? null : paymentMethod,
    card_id: cardId,
    notes: null,
    attachment_url: null,
    transaction_date: new Date().toISOString().split('T')[0],
    installments_total: installmentsTotal || 1,
    installment_current: 1,
    parent_installment_id: null,
    is_recurring: false,
    recurrence_frequency: null,
    recurrence_end_date: null,
    recurrence_count: null
  }
  
  // Generate summary
  const paymentMethodText = paymentMethod === 'pix' ? 'Pix' :
                           paymentMethod === 'credit_card' ? 'Cartão' :
                           paymentMethod === 'debit_card' ? 'Débito' :
                           paymentMethod === 'cash' ? 'Dinheiro' :
                           paymentMethod === 'bank_transfer' ? 'Boleto' : 'Não informado'
  
  const summary = `Entendi: ${type === 'income' ? 'receita' : 'gasto'} de R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}${installmentsTotal ? ` em ${installmentsTotal}x` : ''} em ${description}, categoria ${category}, pagamento ${paymentMethodText}. Posso salvar?`
  
  console.log('[AI PARSED]', { type, amount, description, category, paymentMethod, cardId, installmentsTotal })
  
  return {
    success: true,
    confidence,
    transaction,
    summary
  }
}

function extractDescription(message: string, amount: number): string {
  // Try to extract location/description after prepositions
  const patterns = [
    /(?:em|no|na|com|site)\s+([a-zA-Z0-9\s]+)/i,
    /(?:pago|gastei|comprei)\s+\d+[\.,]?\d*\s+(?:em|no|na|com|site)?\s*([a-zA-Z0-9\s]+)/i,
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      let description = match[1].trim()
      description = description.replace(/\b(?:de|da|do|para|por|com|em|no|na|site)\b/gi, '').trim()
      if (description.length > 0) {
        return description.charAt(0).toUpperCase() + description.slice(1)
      }
    }
  }

  // Fallback: remove amount and common keywords
  let description = message

  if (amount > 0) {
    description = description.replace(new RegExp(amount.toString().replace('.', '\\.').replace(',', '\\.'), 'g'), '')
  }

  description = description.replace(/[R$]/g, '')

  const keywordsToRemove = [
    'gastei', 'comprei', 'paguei', 'pague', 'gastar', 'comprar', 'pagar', 'gasto', 'compra', 'pagamento',
    'recebi', 'ganhei', 'entrou', 'receber', 'ganhar', 'receita', 'renda', 'salário', 'freela',
    'cartão', 'crédito', 'credit', 'pix', 'débito', 'debit', 'dinheiro', 'cash',
    'em', 'de', 'da', 'do', 'no', 'na', 'para', 'com', 'por', 'vezes', 'x', 'hoje', 'site', 'no site', 'na', 'pelo', 'reais', 'r$'
  ]

  keywordsToRemove.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    description = description.replace(regex, '')
  })

  description = description.trim().replace(/\s+/g, ' ').replace(/^[,\s]+|[,\s]+$/g, '')

  if (description.length > 0) {
    description = description.charAt(0).toUpperCase() + description.slice(1)
  }

  return description || 'Transação'
}

function detectCategory(text: string, description: string): string {
  const combinedText = `${text} ${description}`.toLowerCase()

  const categories = [
    // Saúde - PRIORIDADE ALTA (deve vir antes de Moradia)
    { 
      keywords: ['remédio', 'remedio', 'farmácia', 'farmacia', 'medicamento', 'consulta', 'exame', 'médico', 'medico', 'hospital', 'insulina', 'glicose', 'sensor', 'libre', 'saúde', 'saude', 'dental', 'dentista', 'psicólogo', 'psicologo', 'psiquiatra', 'terapia', 'vacina', 'laboratório', 'laboratorio', 'clínica', 'clinica'], 
      name: 'Saúde' 
    },
    // Transporte - PRIORIDADE ALTA
    { 
      keywords: ['uber', '99', 'táxi', 'taxi', 'ônibus', 'onibus', 'metro', 'metrô', 'gasolina', 'combustível', 'combustivel', 'estacionamento', 'pedágio', 'pedagio', 'posto', 'viagem', 'passagem', 'bicicleta'], 
      name: 'Transporte' 
    },
    // Assinaturas - PRIORIDADE ALTA
    { 
      keywords: ['netflix', 'spotify', 'prime', 'disney', 'disney+', 'hbo', 'hbo max', 'globoplay', 'assinatura', 'mensalidade', 'streaming', 'apple music', 'youtube premium'], 
      name: 'Assinaturas' 
    },
    // Delivery - PRIORIDADE ALTA
    { 
      keywords: ['ifood', 'rappi', 'delivery', 'uber eats', 'pizza', 'hamburguer', 'hambúrguer', 'sushi', 'japonesa', 'chinesa', 'a domicilio'], 
      name: 'Delivery' 
    },
    { keywords: ['alimentação', 'comida', 'restaurante', 'mercado', 'supermercado', 'lanchonete', 'almoço', 'lanche', 'café', 'padaria', 'açougue', 'hortifruti', 'feira', 'carne', 'fruta', 'verdura'], name: 'Alimentação' },
    // Moradia - PRIORIDADE BAIXA (após Saúde)
    { keywords: ['aluguel', 'condomínio', 'condominio', 'luz', 'internet', 'gás', 'gas', 'energia', 'saneamento'], name: 'Moradia' },
    { keywords: ['educação', 'educacao', 'faculdade', 'curso', 'livro', 'material', 'aula', 'escola', 'colégio', 'colegio', 'universidade', 'pós', 'pos', 'mestrado', 'doutorado'], name: 'Educação' },
    { keywords: ['lazer', 'bar', 'festa', 'cinema', 'praia', 'jogo', 'passeio', 'teatro', 'show', 'concerto', 'parque', 'clube', 'feriado'], name: 'Lazer' },
    { keywords: ['compras', 'roupa', 'roupas', 'tênis', 'tenis', 'sapato', 'calçado', 'calcado', 'eletrônico', 'eletronico', 'celular', 'iphone', 'computador', 'notebook', 'tv', 'amazon', 'mercado livre', 'shopping', 'loja'], name: 'Compras' },
    { keywords: ['beleza', 'corte', 'cabelo', 'barba', 'salão', 'salao', 'estética', 'estetica', 'manicure', 'pedicure', 'maquiagem', 'perfume', 'creme'], name: 'Beleza' },
    { keywords: ['trabalho', 'cliente', 'freela', 'job', 'serviço', 'servico', 'produção', 'producao', 'filmagem', 'projeto', 'consultoria', 'design', 'desenvolvimento'], name: 'Trabalho' },
    { keywords: ['freela', 'trabalho', 'salário', 'salario', 'renda', 'pagamento', 'cliente', 'job', 'serviço', 'servico'], name: 'Renda' },
  ]

  for (const category of categories) {
    if (category.keywords.some(keyword => combinedText.includes(keyword))) {
      return category.name
    }
  }

  return 'Geral'
}

function detectPaymentMethod(text: string): string {
  if (text.includes('pix') || text.includes('no mix') || text.includes('pelo mix') || text.includes('cartão mix') || text.includes('mix')) {
    return 'pix'
  }
  if (text.includes('débito') || text.includes('debit')) {
    return 'debit_card'
  }
  if (text.includes('crédito') || text.includes('credit') || text.includes('cartão') || text.includes('cartao')) {
    return 'credit_card'
  }
  if (text.includes('dinheiro') || text.includes('cash')) {
    return 'cash'
  }
  if (text.includes('boleto')) {
    return 'bank_transfer'
  }
  
  return 'unknown'
}

function extractCardId(text: string): string | null {
  // This would need to match against actual cards in the system
  // For now, return null and let the user select manually if needed
  return null
}

function extractInstallments(text: string): number | undefined {
  const patterns = [
    /(\d+)\s*vezes/i,
    /(\d+)x/i,
    /parcelado\s+em\s+(\d+)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const installments = parseInt(match[1])
      if (!isNaN(installments) && installments > 1) {
        return installments
      }
    }
  }

  return undefined
}
