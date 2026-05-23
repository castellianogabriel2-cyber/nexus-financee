"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px"
    }
  }, [input])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-3 bg-card/50 border border-border/50 rounded-2xl p-3 backdrop-blur-xl">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre suas finanças..."
            disabled={isLoading || disabled}
            rows={1}
            className={cn(
              "w-full bg-transparent border-0 outline-none resize-none text-sm placeholder:text-muted-foreground/50",
              "max-h-[120px] min-h-[24px] py-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>
        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
            "bg-primary text-primary-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </div>
      
      {/* Quick suggestions */}
      {!input && !isLoading && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {[
            "Quanto gastei esse mês?",
            "Qual categoria gasto mais?",
            "Quanto sobra até o fim do mês?",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="px-3 py-1.5 text-xs bg-card/50 border border-border/30 rounded-full hover:bg-card/80 hover:border-border/50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </form>
  )
}
