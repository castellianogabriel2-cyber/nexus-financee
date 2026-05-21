"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { AdaptiveLogo } from "@/components/adaptive-logo"
import { ArrowRight, Sparkles, Shield, Target, CreditCard, Brain, Zap, Check, ChevronRight, Star, Lock, TrendingUp, Clock, Smartphone } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 gradient-radial pointer-events-none opacity-50" />
      <div className="fixed inset-0 gradient-spotlight pointer-events-none opacity-30" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/30" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AdaptiveLogo className="w-8 h-8" />
            <span className="text-lg font-bold text-foreground">Nexus Finance</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Começar agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">IA Financeira Inteligente</span>
              </motion.div>

              <h1 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                Controle suas finanças com
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60"> inteligência</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl">
                Nexus Finance é o aplicativo financeiro premium que usa IA para transformar como você gerencia seu dinheiro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login" className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Começar agora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="px-8 py-4 rounded-2xl glass-strong border border-border/50 text-foreground font-medium hover:bg-card/50 transition-colors flex items-center justify-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Ver demo
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center gap-6 mt-8 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10.000+</span> usuários satisfeitos
                </div>
              </motion.div>
            </motion.div>

            {/* Right content - iPhone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative mx-auto w-[280px] h-[580px] bg-black rounded-[3rem] border-4 border-border/50 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-br from-background to-card/50 p-4 pt-12">
                  {/* App mockup content */}
                  <div className="space-y-4">
                    <div className="glass-strong rounded-2xl p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Saldo</span>
                        <span className="text-xs text-primary">Hoje</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">R$ 12.450,00</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-strong rounded-2xl p-3 border border-border/50">
                        <div className="text-xs text-muted-foreground mb-1">Receitas</div>
                        <div className="text-sm font-semibold text-emerald-400">+R$ 8.500</div>
                      </div>
                      <div className="glass-strong rounded-2xl p-3 border border-border/50">
                        <div className="text-xs text-muted-foreground mb-1">Despesas</div>
                        <div className="text-sm font-semibold text-rose-400">-R$ 3.200</div>
                      </div>
                    </div>

                    <div className="glass-strong rounded-2xl p-4 border border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">IA Insight</div>
                          <div className="text-xs text-muted-foreground">Oportunidade de economia</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Você pode guardar <span className="text-primary font-semibold">R$ 850</span> este mês mantendo seu ritmo atual.
                      </div>
                    </div>

                    <div className="glass-strong rounded-2xl p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Meta: Viagem</span>
                        <span className="text-xs text-primary">75%</span>
                      </div>
                      <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-4 bg-primary/20 rounded-[3.5rem] blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Por que escolher o Nexus Finance?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recursos premium que transformam sua experiência financeira
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "IA Financeira",
                description: "Insights automáticos e personalizados para otimizar suas finanças",
              },
              {
                icon: Shield,
                title: "Modo Aperto",
                description: "Controle inteligente de gastos com limites diários personalizados",
              },
              {
                icon: CreditCard,
                title: "Cartões",
                description: "Gerencie todos seus cartões em um só lugar com faturas",
              },
              {
                icon: Target,
                title: "Metas",
                description: "Crie e acompanhe suas metas financeiras com previsões",
              },
              {
                icon: Lock,
                title: "Segurança",
                description: "Proteção de nível bancário com criptografia avançada",
              },
              {
                icon: TrendingUp,
                title: "Analytics",
                description: "Gráficos e relatórios detalhados para entender seus gastos",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-strong rounded-3xl p-6 border border-border/50 hover:border-border/80 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong rounded-3xl p-8 border border-border/50"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">IA Financeira Inteligente</h3>
              <p className="text-muted-foreground mb-6">
                Nossa IA analisa seus padrões de gastos e oferece insights personalizados para economizar mais e atingir suas metas mais rápido.
              </p>
              <ul className="space-y-3">
                {[
                  "Insights automáticos diários",
                  "Alertas de gastos excessivos",
                  "Sugestões de economia",
                  "Previsão de gastos futuros",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong rounded-3xl p-8 border border-border/50"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Modo Aperto Inteligente</h3>
              <p className="text-muted-foreground mb-6">
                Ative o Modo Aperto para controlar seus gastos automaticamente com base em sua renda e metas.
              </p>
              <ul className="space-y-3">
                {[
                  "Limites diários personalizados",
                  "Alertas em tempo real",
                  "Bloqueio de gastos excessivos",
                  "Análise de padrões",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Planos Premium
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Grátis",
                price: "R$ 0",
                period: "/mês",
                features: [
                  "Transações ilimitadas",
                  "Dashboard básico",
                  "1 cartão",
                  "3 metas",
                  "Suporte por email",
                ],
                cta: "Começar grátis",
                popular: false,
              },
              {
                name: "Pro",
                price: "R$ 19",
                period: "/mês",
                features: [
                  "Tudo do Grátis",
                  "IA Financeira",
                  "Modo Aperto",
                  "Cartões ilimitados",
                  "Metas ilimitadas",
                  "Analytics avançado",
                  "Suporte prioritário",
                ],
                cta: "Assinar Pro",
                popular: true,
              },
              {
                name: "Ultra",
                price: "R$ 49",
                period: "/mês",
                features: [
                  "Tudo do Pro",
                  "IA Financeira Premium",
                  "Consultoria mensal",
                  "Exportação de dados",
                  "API access",
                  "Suporte 24/7",
                  "Funcionalidades beta",
                ],
                cta: "Assinar Ultra",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`glass-strong rounded-3xl p-6 border ${plan.popular ? 'border-primary/50' : 'border-border/50'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block w-full py-3 rounded-xl text-center font-medium transition-colors ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "glass-strong border border-border/50 text-foreground hover:bg-card/50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "O Nexus Finance é gratuito?",
                answer: "Sim! Temos um plano gratuito com recursos essenciais. Os planos Pro e Ultra oferecem funcionalidades premium para usuários avançados.",
              },
              {
                question: "Meus dados estão seguros?",
                answer: "Absolutamente! Usamos criptografia de nível bancário e seguimos as melhores práticas de segurança. Seus dados nunca são compartilhados.",
              },
              {
                question: "Como funciona a IA Financeira?",
                answer: "Nossa IA analisa seus padrões de gastos e oferece insights personalizados para ajudar você a economizar mais e atingir suas metas financeiras.",
              },
              {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass-strong rounded-2xl p-6 border border-border/50"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-3xl p-8 lg:p-12 border border-border/50 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-radial pointer-events-none opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Pronto para transformar suas finanças?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de usuários que já estão controlando suas finanças com o Nexus Finance.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Começar agora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <AdaptiveLogo className="w-8 h-8" />
                <span className="text-lg font-bold text-foreground">Nexus Finance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Controle financeiro premium com IA inteligente.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Recursos</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Segurança</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Sobre</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Carreiras</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Termos</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
            <p>© 2026 Nexus Finance. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
