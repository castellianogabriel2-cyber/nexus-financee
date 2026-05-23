"use client"

import { motion } from "framer-motion"
import { User, Bot, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Message } from "@/hooks/use-ai"

interface ChatMessageProps {
  message: Message
}

const typeIcons = {
  insight: Lightbulb,
  warning: AlertTriangle,
  suggestion: CheckCircle,
  answer: Bot,
}

const typeColors = {
  insight: "text-primary",
  warning: "text-destructive",
  suggestion: "text-success",
  answer: "text-foreground",
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const Icon = isUser ? User : (typeIcons[message.type || "answer"] || Bot)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border"
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div
        className={cn(
          "flex-1 max-w-[80%]",
          isUser ? "flex flex-col items-end" : "flex flex-col items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card/80 border border-border/50 rounded-tl-sm",
            message.type === "warning" && !isUser && "border-destructive/30 bg-destructive/5",
            message.type === "insight" && !isUser && "border-primary/30 bg-primary/5",
            message.type === "suggestion" && !isUser && "border-success/30 bg-success/5"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}
