import type { ParsedTransaction } from './sanitize-transaction'

export interface ConfirmationState {
  pendingTransaction: ParsedTransaction | null
  isWaitingConfirmation: boolean
}

/**
 * Manages the confirmation flow for transactions
 */
export class ConfirmationEngine {
  private pendingTransaction: ParsedTransaction | null = null
  private isWaitingConfirmation: boolean = false

  /**
   * Sets a transaction waiting for confirmation
   */
  setPending(transaction: ParsedTransaction): void {
    console.log('[AI CONFIRMATION SET PENDING]', transaction)
    this.pendingTransaction = transaction
    this.isWaitingConfirmation = true
  }

  /**
   * Gets the pending transaction
   */
  getPending(): ParsedTransaction | null {
    return this.pendingTransaction
  }

  /**
   * Checks if waiting for confirmation
   */
  isWaiting(): boolean {
    return this.isWaitingConfirmation
  }

  /**
   * Confirms the pending transaction
   */
  confirm(): ParsedTransaction | null {
    console.log('[AI CONFIRMATION CONFIRM]', this.pendingTransaction)
    const transaction = this.pendingTransaction
    this.clear()
    return transaction
  }

  /**
   * Cancels the pending transaction
   */
  cancel(): void {
    console.log('[AI CONFIRMATION CANCEL]')
    this.clear()
  }

  /**
   * Clears the confirmation state
   */
  clear(): void {
    this.pendingTransaction = null
    this.isWaitingConfirmation = false
  }

  /**
   * Gets the current state
   */
  getState(): ConfirmationState {
    return {
      pendingTransaction: this.pendingTransaction,
      isWaitingConfirmation: this.isWaitingConfirmation
    }
  }

  /**
   * Checks if a user message is a confirmation response
   */
  isConfirmationResponse(message: string): boolean {
    const lowerMessage = message.toLowerCase().trim()
    const confirmKeywords = ['sim', 's', 'yes', 'y', 'ok', 'pode', 'salvar', 'confirmar', 'confirm']
    return confirmKeywords.some(keyword => lowerMessage === keyword || lowerMessage.includes(keyword))
  }

  /**
   * Checks if a user message is a cancellation response
   */
  isCancellationResponse(message: string): boolean {
    const lowerMessage = message.toLowerCase().trim()
    const cancelKeywords = ['não', 'nao', 'n', 'no', 'cancelar', 'cancel', 'não', 'nao', 'parar', 'desistir']
    return cancelKeywords.some(keyword => lowerMessage === keyword || lowerMessage.includes(keyword))
  }
}
