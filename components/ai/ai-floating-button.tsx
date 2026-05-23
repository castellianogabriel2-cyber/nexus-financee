"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Sparkles, Paperclip, Send } from "lucide-react"
import { useAI } from "@/hooks/use-ai"
import { ChatMessage } from "@/components/ai/chat-message"
import { TypingIndicator } from "@/components/ai/typing-indicator"
import { ChatInput } from "@/components/ai/chat-input"
import { CommandConfirmation } from "@/components/ai/command-confirmation"
import { cn } from "@/lib/utils"

export function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShownInitialMessage, setHasShownInitialMessage] = useState(false)
  const { messages, isLoading, isTyping, pendingTransaction, sendMessage, confirmTransaction, editTransaction, cancelTransaction } = useAI()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, pendingTransaction])

  // Show initial message when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasShownInitialMessage && messages.length === 0) {
      setHasShownInitialMessage(true)
      // The initial message will be shown by the useAI hook
    }
  }, [isOpen, hasShownInitialMessage, messages.length])

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50",
          "w-14 h-14 rounded-full",
          "bg-gradient-to-br from-primary to-primary/80",
          "text-primary-foreground",
          "flex items-center justify-center",
          "glow-primary shadow-2xl",
          "transition-all"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mini Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 lg:bottom-24 right-4 lg:right-8 w-[calc(100vw-2rem)] lg:w-[400px] max-h-[500px] z-50"
          >
            <div className="glass-strong rounded-3xl border border-border/30 overflow-hidden flex flex-col shadow-2xl h-[500px] max-h-[80vh]">
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-border/30 bg-card/20 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">IA Financeira</h3>
                    <p className="text-xs text-muted-foreground">Digite comandos naturais</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages with scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Experimente comandos como:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
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
                )}

                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isTyping && <TypingIndicator />}

                {/* Command Confirmation - inside messages area */}
                <AnimatePresence>
                  {pendingTransaction && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2"
                    >
                      <CommandConfirmation
                        command={pendingTransaction}
                        onConfirm={confirmTransaction}
                        onEdit={editTransaction}
                        onCancel={cancelTransaction}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input - always visible at bottom */}
              <div className="flex-shrink-0 p-3 border-t border-border/30 bg-card/20 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    disabled
                    className="w-8 h-8 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground cursor-not-allowed opacity-50"
                    title="Anexar comprovante (em breve)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-muted-foreground">Anexos em breve</span>
                </div>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  disabled={isTyping || !!pendingTransaction}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
