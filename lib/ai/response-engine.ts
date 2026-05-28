export type ResponseType = 'answer' | 'insight' | 'suggestion' | 'warning' | 'confirmation'

export interface AIResponse {
  message: string
  type: ResponseType
  data?: any
}

/**
 * Generates responses for different intents
 */
export class ResponseEngine {
  /**
   * Greeting response
   */
  static greeting(): AIResponse {
    return {
      type: 'answer',
      message: 'Olá, tudo bem? Eu sou o Nexus, seu assistente financeiro. Posso te ajudar a registrar gastos, receitas, analisar seu mês, ver categorias, metas e saldo. O que você quer fazer hoje?'
    }
  }

  /**
   * Small talk response
   */
  static smallTalk(): AIResponse {
    return {
      type: 'answer',
      message: 'Eu sou o Nexus, seu assistente financeiro. Posso registrar gastos e receitas, mostrar relatórios do mês, categorias, metas e saldo. Escreva algo como "gastei 50 no mercado" ou "quanto gastei esse mês?"'
    }
  }

  /**
   * Help response
   */
  static help(): AIResponse {
    return {
      type: 'answer',
      message: 'Posso ajudar você com:\n\n• Registrar gastos: "gastei 50 no mercado"\n• Registrar receitas: "recebi 1200 de cliente"\n• Ver gastos do mês: "quanto gastei esse mês?"\n• Ver categorias: "qual categoria gastei mais?"\n• Ver saldo: "quanto sobra?"\n• Ver metas: "como estão minhas metas?"\n• Resumo geral: "resumo do mês"'
    }
  }

  /**
   * Loading response
   */
  static loading(): AIResponse {
    return {
      type: 'suggestion',
      message: 'Estou carregando seus dados financeiros. Tente novamente em alguns segundos.'
    }
  }

  /**
   * Initial message when chat opens
   */
  static initial(): AIResponse {
    return {
      type: 'answer',
      message: 'Olá, eu sou o Nexus. Posso registrar gastos, receitas e te ajudar a entender suas finanças. Escreva algo como: "gastei 50 no mercado" ou "quanto gastei esse mês?"'
    }
  }

  /**
   * Confirmation message for transaction
   */
  static confirmation(transaction: any): AIResponse {
    const typeText = transaction.type === 'expense' ? 'gasto' : 'receita'
    const amountText = `R$ ${transaction.amount.toFixed(2)}`
    const categoryText = transaction.category || 'Geral'
    const descriptionText = transaction.description || categoryText

    return {
      type: 'confirmation',
      message: `Entendi: ${typeText} de ${amountText} em ${descriptionText}, categoria ${categoryText}. Posso salvar?`,
      data: transaction
    }
  }

  /**
   * Success message after saving transaction
   */
  static success(type: 'expense' | 'income'): AIResponse {
    const typeText = type === 'expense' ? 'gasto' : 'receita'
    return {
      type: 'answer',
      message: `✓ ${typeText.charAt(0).toUpperCase() + typeText.slice(1)} salvo com sucesso!`
    }
  }

  /**
   * Error message
   */
  static error(error: string): AIResponse {
    return {
      type: 'warning',
      message: `Erro ao salvar: ${error}`
    }
  }

  /**
   * Cancel message
   */
  static cancel(): AIResponse {
    return {
      type: 'answer',
      message: 'Operação cancelada.'
    }
  }

  /**
   * Unknown intent response
   */
  static unknown(): AIResponse {
    return {
      type: 'suggestion',
      message: 'Não entendi o comando. Tente algo como:\n• "gastei 50 no mercado"\n• "recebi 1200 de cliente"\n• "quanto gastei esse mês?"\n• "qual categoria gastei mais?"'
    }
  }
}
