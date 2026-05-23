"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Calendar,
  CalendarClock,
  BarChart3,
  ShieldCheck,
  Download,
  ArrowRight,
} from "lucide-react"

const moreItems = [
  {
    href: "/calendario",
    icon: Calendar,
    title: "Calendario",
    description: "Visualize suas transacoes em formato de calendario",
    color: "from-blue-500 to-cyan-500",
  },
  {
    href: "/parcelamentos",
    icon: CalendarClock,
    title: "Parcelamentos",
    description: "Gerencie seus pagamentos parcelados",
    color: "from-purple-500 to-pink-500",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    title: "Analytics",
    description: "Analise seus dados financeiros em detalhes",
    color: "from-emerald-500 to-teal-500",
  },
  {
    href: "/admin",
    icon: ShieldCheck,
    title: "Admin",
    description: "Painel administrativo do sistema",
    color: "from-orange-500 to-red-500",
  },
  {
    href: "/exportar",
    icon: Download,
    title: "Exportar",
    description: "Exporte seus dados em formato CSV",
    color: "from-indigo-500 to-violet-500",
  },
]

export default function MaisPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 lg:mb-12"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
          Mais Opcoes
        </h1>
        <p className="text-muted-foreground mt-2 text-base lg:text-lg">
          Funcionalidades adicionais do Nexus Finance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {moreItems.map((item, index) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-3xl p-6 bg-card/50 border border-border/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 group-hover:to-black/10 transition-all duration-300" />
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  <span>Acessar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
