"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Bot, Lightbulb, AlertTriangle, CheckCircle, X } from "lucide-react"
import { useAI, Message } from "@/hooks/use-ai"
import { ChatMessage } from "@/components/ai/chat-message"
import { TypingIndicator } from "@/components/ai/typing-indicator"
import { ChatInput } from "@/components/ai/chat-input"
import { CommandConfirmation } from "@/components/ai/command-confirmation"
import { FadeIn } from "@/components/ui/page-transition"

export default function AIPage() {
  const { messages, isLoading, isTyping, pendingCommand, sendMessage, generateInsights, clearMessages, confirmCommand, editCommand, cancelCommand } = useAI()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcome, setShowWelcome] = useState(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, pendingCommand])

  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false)
    }
  }, [messages])

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  const handleGenerateInsights = () => {
    generateInsights()
  }

  const handleClearChat = () => {
    clearMessages()
    setShowWelcome(true)
  }

  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center glow-primary"
            >
              <Bot className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                IA Financeira
              </h1>
              <p className="text-sm text-muted-foreground">
                Seu assistente financeiro inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="glass-strong rounded-3xl border border-border/30 overflow-hidden min-h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            <AnimatePresence mode="popLayout">
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Olá! Sou sua IA Financeira
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Posso ajudar você a entender suas finanças, analisar gastos e registrar transações em linguagem natural.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {[
                      { icon: Lightbulb, label: "Gerar insights", color: "text-primary", action: handleGenerateInsights },
                      { icon: AlertTriangle, label: "Análise de gastos", color: "text-destructive", action: () => handleSendMessage("Quanto gastei esse mês?") },
                      { icon: CheckCircle, label: "Status das metas", color: "text-success", action: () => handleSendMessage("Como estão minhas metas?") },
                      { icon: Sparkles, label: "Resumo geral", color: "text-primary", action: () => handleSendMessage("Me dê um resumo das minhas finanças") },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="flex items-center gap-3 px-4 py-3 bg-card/50 border border-border/30 rounded-xl hover:bg-card/80 hover:border-border/50 transition-all"
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Command Examples */}
                  <div className="mt-8 w-full max-w-lg">
                    <p className="text-xs text-muted-foreground mb-3">
                      Experimente comandos como:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "gastei 200 no mercado",
                        "recebi 1200 de freela",
                        "paguei 150 de internet",
                      ].map((example) => (
                        <button
                          key={example}
                          onClick={() => handleSendMessage(example)}
                          className="px-3 py-1.5 text-xs bg-primary/10 border border-primary/30 rounded-full hover:bg-primary/20 transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isTyping && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Command Confirmation */}
          <AnimatePresence>
            {pendingCommand && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border-t border-border/30 bg-card/20 backdrop-blur-xl"
              >
                <CommandConfirmation
                  command={pendingCommand}
                  onConfirm={confirmCommand}
                  onEdit={editCommand}
                  onCancel={cancelCommand}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="p-4 border-t border-border/30 bg-card/20 backdrop-blur-xl">
            {messages.length > 0 && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                  {messages.length} mensagens
                </span>
                <button
                  onClick={handleClearChat}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                  Limpar chat
                </button>
              </div>
            )}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={isTyping || !!pendingCommand}
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-card/30 border border-border/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium mb-1">
                IA Local - Sem custos
              </p>
              <p className="text-xs text-muted-foreground">
                Esta IA funciona localmente com seus dados reais. Nenhuma informação é enviada para servidores externos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
