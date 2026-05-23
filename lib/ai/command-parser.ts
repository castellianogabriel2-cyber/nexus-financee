export type ActionType = 'create_transaction' | 'create_installment' | 'create_reserve_deposit' | 'create_goal_deposit' | 'unknown'
export type TransactionType = 'income' | 'expense'
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'bank_transfer' | 'unknown'

export interface ParsedCommand {
  action: ActionType
  type: TransactionType
  amount: number
  description: string
  category: string
  paymentMethod: PaymentMethod
  cardName?: string
  cardId?: string
  installmentsTotal?: number
  date: Date
  confidence: number // 0-1
  rawText: string
  missingFields: string[]
}

export class CommandParser {
  private expenseKeywords = ['gastei', 'comprei', 'paguei', 'pague', 'gastar', 'comprar', 'pagar', 'gasto', 'compra', 'pagamento', 'passei', 'usei', 'saiu', 'debitaram', 'gastou', 'paguei']
  private incomeKeywords = ['recebi', 'ganhei', 'entrou', 'receber', 'ganhar', 'receita', 'renda', 'salário', 'freela', 'caiu', 'pagamento', 'cliente', 'job', 'serviço']
  private cardKeywords = ['cartão', 'crédito', 'credit', 'cartao']
  private pixKeywords = ['pix', 'no mix', 'pelo mix', 'cartão mix', 'mix']
  private debitKeywords = ['débito', 'debit']
  private cashKeywords = ['dinheiro', 'cash']
  private installmentKeywords = ['vezes', 'x', 'parcelado', 'parcelas']
  private reserveKeywords = ['reserva', 'reserva de emergência', 'poupança']
  private goalKeywords = ['meta', 'objetivo', 'viagem', 'carro', 'casa']

  parse(text: string): ParsedCommand {
    const lowerText = text.toLowerCase()
    const rawText = text.trim()

    // Detect type (income vs expense)
    const type = this.detectType(lowerText)

    // Detect action
    const action = this.detectAction(lowerText, type)

    // Extract amount
    const amount = this.extractAmount(lowerText)

    // Extract description
    const description = this.extractDescription(rawText, amount)

    // Detect category
    const category = this.detectCategory(lowerText, description)

    // Detect payment method
    const paymentMethod = this.detectPaymentMethod(lowerText)

    // Extract card info
    const { cardName, cardId } = this.extractCardInfo(lowerText)

    // Extract installments
    const installmentsTotal = this.extractInstallments(lowerText)

    // Calculate confidence
    const confidence = this.calculateConfidence({
      type,
      action,
      amount,
      description,
      category,
      paymentMethod,
      cardName,
      installmentsTotal
    })

    // Identify missing fields
    const missingFields = this.identifyMissingFields({
      type,
      action,
      amount,
      description,
      category,
      paymentMethod
    })

    return {
      action,
      type,
      amount,
      description,
      category,
      paymentMethod,
      cardName,
      cardId,
      installmentsTotal,
      date: new Date(),
      confidence,
      rawText,
      missingFields
    }
  }

  private detectType(text: string): TransactionType {
    const hasExpenseKeyword = this.expenseKeywords.some(keyword => text.includes(keyword))
    const hasIncomeKeyword = this.incomeKeywords.some(keyword => text.includes(keyword))

    if (hasIncomeKeyword && !hasExpenseKeyword) return 'income'
    if (hasExpenseKeyword) return 'expense'
    
    // Default to expense for most common cases
    return 'expense'
  }

  private detectAction(text: string, type: TransactionType): ActionType {
    // Check for reserve
    if (this.reserveKeywords.some(keyword => text.includes(keyword))) {
      return 'create_reserve_deposit'
    }

    // Check for goal
    if (this.goalKeywords.some(keyword => text.includes(keyword))) {
      return 'create_goal_deposit'
    }

    // Check for installments
    if (this.installmentKeywords.some(keyword => text.includes(keyword))) {
      return 'create_installment'
    }

    // Default transaction
    return 'create_transaction'
  }

  private extractAmount(text: string): number {
    // Brazilian format: 29,90 or 2.000,50 or 2.000
    // First remove dots (thousands separator in Brazilian format)
    let amountText = text.replace(/\./g, '')
    
    // Remove currency symbols
    amountText = amountText.replace(/[R$]/g, '').trim()
    
    // Replace comma with dot (decimal separator)
    amountText = amountText.replace(/,/g, '.')

    // Extract the number
    const match = amountText.match(/\d+\.?\d*/)
    if (match) {
      const value = parseFloat(match[0])
      if (!isNaN(value) && value > 0) {
        return value
      }
    }

    return 0
  }

  private extractDescription(rawText: string, amount: number): string {
    // Try to extract location/description after prepositions
    const patterns = [
      /(?:em|no|na|com|site)\s+([a-zA-Z0-9\s]+)/i,
      /(?:pago|gastei|comprei)\s+\d+[\.,]?\d*\s+(?:em|no|na|com|site)?\s*([a-zA-Z0-9\s]+)/i,
    ]

    for (const pattern of patterns) {
      const match = rawText.match(pattern)
      if (match && match[1]) {
        let description = match[1].trim()
        // Remove common words from description
        description = description.replace(/\b(?:de|da|do|para|por|com|em|no|na|site)\b/gi, '').trim()
        if (description.length > 0) {
          return description.charAt(0).toUpperCase() + description.slice(1)
        }
      }
    }

    // Fallback: remove amount and common keywords to get description
    let description = rawText

    // Remove amount
    if (amount > 0) {
      description = description.replace(new RegExp(amount.toString().replace('.', '\\.').replace(',', '\\.'), 'g'), '')
    }

    // Remove currency symbols
    description = description.replace(/[R$]/g, '')

    // Remove common keywords
    const keywordsToRemove = [
      ...this.expenseKeywords,
      ...this.incomeKeywords,
      ...this.cardKeywords,
      ...this.pixKeywords,
      ...this.debitKeywords,
      ...this.cashKeywords,
      ...this.installmentKeywords,
      ...this.reserveKeywords,
      ...this.goalKeywords,
      'em', 'de', 'da', 'do', 'no', 'na', 'para', 'com', 'por', 'vezes', 'x', 'hoje', 'site', 'no site', 'na', 'pelo', 'reais', 'r$'
    ]

    keywordsToRemove.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      description = description.replace(regex, '')
    })

    // Clean up
    description = description.trim()
      .replace(/\s+/g, ' ')
      .replace(/^[,\s]+|[,\s]+$/g, '')

    // Capitalize first letter
    if (description.length > 0) {
      description = description.charAt(0).toUpperCase() + description.slice(1)
    }

    return description || 'Transação'
  }

  private detectCategory(text: string, description: string): string {
    const combinedText = `${text} ${description}`.toLowerCase()

    // Robust category mapping with extensive keywords
    const categories = [
      {
        keywords: ['alimentação', 'comida', 'restaurante', 'mercado', 'supermercado', 'lanchonete', 'ifood', 'rappi', 'almoço', 'lanche', 'café', 'padaria', 'açougue', 'hortifruti', 'feira', 'carne', 'fruta', 'verdura'],
        name: 'Alimentação'
      },
      {
        keywords: ['delivery', 'ifood', 'rappi', 'uber eats', 'delivery', 'pizza', 'hamburguer', 'hambúrguer', 'sushi', 'japonesa', 'chinesa', 'a domicilio'],
        name: 'Delivery'
      },
      {
        keywords: ['transporte', 'uber', '99', 'taxi', 'ônibus', 'onibus', 'metro', 'metrô', 'gasolina', 'combustível', 'estacionamento', 'pedágio', 'combustivel', 'posto', 'viagem', 'passagem', 'bicicleta'],
        name: 'Transporte'
      },
      {
        keywords: ['moradia', 'aluguel', 'condomínio', 'condominio', 'luz', 'água', 'internet', 'gás', 'gas', 'telefone', 'celular', 'net', 'wifi', 'energia', 'saneamento'],
        name: 'Moradia'
      },
      {
        keywords: ['saúde', 'farmácia', 'farmacia', 'remédio', 'remedio', 'consulta', 'exame', 'médico', 'medico', 'hospital', 'dentista', 'psicólogo', 'psicologo', 'insulina', 'glicose', 'vitamina'],
        name: 'Saúde'
      },
      {
        keywords: ['assinaturas', 'assinatura', 'mensalidade', 'streaming', 'netflix', 'spotify', 'prime video', 'disney', 'disney+', 'apple music', 'youtube premium', 'hbo max', 'globoplay', 'prime', 'canal'],
        name: 'Assinaturas'
      },
      {
        keywords: ['educação', 'educacao', 'faculdade', 'curso', 'livro', 'material', 'aula', 'escola', 'colégio', 'colegio', 'universidade', 'pós', 'pos', 'mestrado', 'doutorado'],
        name: 'Educação'
      },
      {
        keywords: ['lazer', 'bar', 'festa', 'cinema', 'praia', 'jogo', 'passeio', 'teatro', 'show', 'concerto', 'parque', 'clube', 'viagem', 'feriado'],
        name: 'Lazer'
      },
      {
        keywords: ['compras', 'roupa', 'roupas', 'tênis', 'tenis', 'sapato', 'calçado', 'calcado', 'eletrônico', 'eletronico', 'celular', 'iphone', 'computador', 'notebook', 'tv', 'televisão', 'televisao', 'amazon', 'mercado livre', 'shopping', 'loja', 'magazine', 'casas bahia'],
        name: 'Compras'
      },
      {
        keywords: ['beleza', 'corte', 'cabelo', 'barba', 'salão', 'salao', 'estética', 'estetica', 'manicure', 'pedicure', 'maquiagem', 'perfume', 'creme'],
        name: 'Beleza'
      },
      {
        keywords: ['trabalho', 'cliente', 'freela', 'job', 'serviço', 'servico', 'produção', 'producao', 'filmagem', 'projeto', 'consultoria', 'design', 'desenvolvimento'],
        name: 'Trabalho'
      },
      {
        keywords: ['freela', 'trabalho', 'salário', 'salario', 'renda', 'pagamento', 'cliente', 'job', 'serviço', 'servico'],
        name: 'Renda'
      },
    ]

    for (const category of categories) {
      if (category.keywords.some(keyword => combinedText.includes(keyword))) {
        return category.name
      }
    }

    return 'Geral'
  }

  private detectPaymentMethod(text: string): PaymentMethod {
    if (this.cardKeywords.some(keyword => text.includes(keyword))) {
      return 'credit_card'
    }
    if (this.pixKeywords.some(keyword => text.includes(keyword))) {
      return 'pix'
    }
    if (this.debitKeywords.some(keyword => text.includes(keyword))) {
      return 'debit_card'
    }
    if (this.cashKeywords.some(keyword => text.includes(keyword))) {
      return 'cash'
    }
    if (text.includes('boleto')) {
      return 'bank_transfer'
    }
    
    return 'unknown'
  }

  private extractCardInfo(text: string): { cardName?: string; cardId?: string } {
    // Common card names
    const cardNames = ['nubank', 'itau', 'bradesco', 'santander', 'inter', 'neon', 'c6', 'picpay', 'nubank', 'nu']

    for (const cardName of cardNames) {
      if (text.toLowerCase().includes(cardName)) {
        return { cardName: cardName.charAt(0).toUpperCase() + cardName.slice(1) }
      }
    }

    return {}
  }

  private extractInstallments(text: string): number | undefined {
    // Match patterns like "10 vezes", "10x", "parcelado em 10"
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

  private calculateConfidence(data: {
    type: TransactionType
    action: ActionType
    amount: number
    description: string
    category: string
    paymentMethod: PaymentMethod
    cardName?: string
    installmentsTotal?: number
  }): number {
    let confidence = 0.5 // Base confidence

    // Amount detection
    if (data.amount > 0) confidence += 0.2
    else confidence -= 0.3

    // Description
    if (data.description && data.description !== 'Transação') confidence += 0.1
    else confidence -= 0.1

    // Category
    if (data.category !== 'Geral') confidence += 0.1

    // Payment method
    if (data.paymentMethod !== 'unknown') confidence += 0.1

    // Card info (if applicable)
    if (data.paymentMethod === 'credit_card' && data.cardName) confidence += 0.1
    else if (data.paymentMethod === 'credit_card' && !data.cardName) confidence -= 0.1

    // Installments
    if (data.action === 'create_installment' && data.installmentsTotal) confidence += 0.1
    else if (data.action === 'create_installment' && !data.installmentsTotal) confidence -= 0.2

    return Math.min(Math.max(confidence, 0), 1)
  }

  private identifyMissingFields(data: {
    type: TransactionType
    action: ActionType
    amount: number
    description: string
    category: string
    paymentMethod: PaymentMethod
  }): string[] {
    const missing: string[] = []

    // Only require these essential fields
    if (data.amount <= 0) missing.push('valor')
    if (!data.description || data.description === 'Transação') missing.push('descrição')

    // Don't require category or payment method - they can be inferred
    // Category will be auto-detected from keywords
    // Payment method can default to 'unknown' and won't block saving

    return missing
  }
}
