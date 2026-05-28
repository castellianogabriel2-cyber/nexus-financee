"use client"

import { motion } from "framer-motion"
import { useFinance } from "@/providers/finance-provider"
import { useState, useEffect, memo } from "react"

/**
 * Nexus OS - Home Page (Premium Polish)
 * 
 * Philosophy:
 * - Luxurious
 * - Emotional
 * - Elegant
 * - Calm
 * - Premium
 * - Apple-level
 */

// Simple balance display
const SimpleBalance = memo(function SimpleBalance({ value }: { value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center py-12"
    >
      <p className="text-sm text-gray-500 mb-4 tracking-wide uppercase">Saldo Atual</p>
      <p className="text-6xl md:text-7xl font-bold text-white tracking-tight">
        R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </motion.div>
  )
})

export default function HomePage() {
  const { profile, renda, totalGastos, saldo, loading } = useFinance()
  const firstName = profile?.full_name?.split(" ")[0] || "Visitante"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Clean centered container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
            Olá, {firstName}
          </h1>
          <p className="text-lg text-gray-400 font-light">
            Bem-vindo de volta ao Nexus
          </p>
        </motion.div>

        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="bg-[#0F1115] rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
            <SimpleBalance value={saldo} />
          </div>
        </motion.div>

        {/* 4 Premium Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[#0F1115] rounded-2xl p-6 border border-gray-800/50 shadow-lg"
          >
            <p className="text-xs text-gray-500 mb-3 tracking-wide uppercase">Receita</p>
            <p className="text-2xl font-semibold text-white tracking-tight">R$ {renda?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[#0F1115] rounded-2xl p-6 border border-gray-800/50 shadow-lg"
          >
            <p className="text-xs text-gray-500 mb-3 tracking-wide uppercase">Gastos</p>
            <p className="text-2xl font-semibold text-white tracking-tight">R$ {totalGastos?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0,00"}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[#0F1115] rounded-2xl p-6 border border-gray-800/50 shadow-lg"
          >
            <p className="text-xs text-gray-500 mb-3 tracking-wide uppercase">Economia</p>
            <p className="text-2xl font-semibold text-[#00E5C4] tracking-tight">R$ {((renda || 0) - (totalGastos || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[#0F1115] rounded-2xl p-6 border border-gray-800/50 shadow-lg"
          >
            <p className="text-xs text-gray-500 mb-3 tracking-wide uppercase">Metas</p>
            <p className="text-2xl font-semibold text-[#4FD1FF] tracking-tight">0/3</p>
          </motion.div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="bg-[#0F1115] rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-3 tracking-tight">Insight IA</h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Seu padrão financeiro está equilibrado. Continue assim.
            </p>
          </div>
        </motion.div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="bg-[#0F1115] rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6 tracking-tight">Metas</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-base text-white font-medium">Viagem para Europa</span>
                  <span className="text-base text-gray-400">R$ 15.000 / R$ 25.000</span>
                </div>
                <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="h-full bg-gradient-to-r from-[#00E5C4] to-[#4FD1FF] rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="bg-[#0F1115] rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6 tracking-tight">Timeline</h2>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-2xl border border-gray-800/30"
              >
                <div className="w-3 h-3 rounded-full bg-[#00E5C4] shadow-lg shadow-[#00E5C4]/30" />
                <span className="text-base text-white font-medium">Janeiro</span>
                <span className="text-base text-gray-400 ml-auto">R$ 0,00</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-2xl border border-gray-800/30"
              >
                <div className="w-3 h-3 rounded-full bg-[#00E5C4] shadow-lg shadow-[#00E5C4]/30" />
                <span className="text-base text-white font-medium">Fevereiro</span>
                <span className="text-base text-gray-400 ml-auto">R$ 0,00</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-2xl border border-gray-800/30"
              >
                <div className="w-3 h-3 rounded-full bg-[#00E5C4] shadow-lg shadow-[#00E5C4]/30" />
                <span className="text-base text-white font-medium">Março</span>
                <span className="text-base text-gray-400 ml-auto">R$ 0,00</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
