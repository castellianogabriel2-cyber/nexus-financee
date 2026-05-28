export type Intent = 
  | "greeting"
  | "small_talk"
  | "help"
  | "report"
  | "create_expense"
  | "create_income"
  | "create_transfer"
  | "unknown"

export function detectIntent(message: string): Intent {
  console.log('[AI INTENT DETECTION]', message)
  const lowerMessage = message.toLowerCase().trim()

  // Greeting keywords
  const greetingKeywords = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'eai', 'eae', 'salve', 'fala', 'e aí', 'eaí']
  if (greetingKeywords.some(keyword => lowerMessage === keyword || lowerMessage.includes(keyword))) {
    console.log('[AI INTENT DETECTED]', 'greeting')
    return "greeting"
  }

  // Small talk / questions about the AI
  const smallTalkKeywords = [
    'tudo bem?', 'tudo bem', 'como vai', 'como você está', 'quem é você', 
    'o que você faz', 'o que voce faz', 'qual seu nome', 'seu nome', 
    'você é', 'voce é', 'ajuda', 'ajudar', 'funciona', 'como funciona',
    'o que é', 'o que voce é', 'quem é voce', 'qual e seu nome'
  ]
  if (smallTalkKeywords.some(keyword => lowerMessage.includes(keyword) || lowerMessage === keyword)) {
    console.log('[AI INTENT DETECTED]', 'small_talk')
    return "small_talk"
  }

  // Help keywords
  const helpKeywords = [
    'ajuda', 'help', 'o que posso fazer', 'o que posso perguntar', 
    'comandos', 'opções', 'funcionalidades', 'como usar', 'como te usar',
    'o que voce faz', 'o que você faz'
  ]
  if (helpKeywords.some(keyword => lowerMessage.includes(keyword) || lowerMessage === keyword)) {
    console.log('[AI INTENT DETECTED]', 'help')
    return "help"
  }

  // Report/Question keywords - these indicate the user wants to see data
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
    'reserva', 'fundo', 'caixa', 'carteira',
    'gastos da semana', 'gastos semanais', 'gastos por semana',
    'quanto recebi', 'quanto ganhei', 'quanto sobra'
  ]

  if (reportKeywords.some(keyword => lowerMessage.includes(keyword))) {
    console.log('[AI INTENT DETECTED]', 'report')
    return "report"
  }

  // Question indicators
  const questionIndicators = ['?', 'o que', 'qual', 'quanto', 'como', 'onde', 'quando', 'por que', 'porque', 'quem']
  if (questionIndicators.some(indicator => lowerMessage.includes(indicator))) {
    console.log('[AI INTENT DETECTED]', 'report (question)')
    return "report"
  }

  // Create expense keywords
  const createExpenseKeywords = [
    'gastei', 'comprei', 'paguei', 'pague', 'gastar', 'comprar', 'pagar', 
    'gasto', 'compra', 'pagamento', 'passei', 'usei', 'saiu', 'debitaram', 
    'gastou', 'paguei no', 'gastei no', 'comprei no', 'gastei com',
    'despesa', 'despes', 'saída', 'saida', 'saida de', 'saída de'
  ]

  if (createExpenseKeywords.some(keyword => lowerMessage.includes(keyword))) {
    console.log('[AI INTENT DETECTED]', 'create_expense')
    return "create_expense"
  }

  // Create income keywords
  const createIncomeKeywords = [
    'recebi', 'ganhei', 'entrou', 'receber', 'ganhar', 'receita', 'renda', 
    'salário', 'freela', 'caiu', 'cliente', 'job', 'serviço', 'servico',
    'entrada', 'entrad', 'ganhei de', 'recebi de', 'ganhei com',
    'renda extra', 'bônus', 'bonus', 'comissão', 'comissao'
  ]

  if (createIncomeKeywords.some(keyword => lowerMessage.includes(keyword))) {
    console.log('[AI INTENT DETECTED]', 'create_income')
    return "create_income"
  }

  // Transfer keywords
  const transferKeywords = [
    'transferi', 'transfer', 'enviei', 'envi', 'movimentei', 'moviment',
    'passei para', 'transferi para', 'enviei para'
  ]

  if (transferKeywords.some(keyword => lowerMessage.includes(keyword))) {
    console.log('[AI INTENT DETECTED]', 'create_transfer')
    return "create_transfer"
  }

  console.log('[AI INTENT DETECTED]', 'unknown')
  return "unknown"
}
