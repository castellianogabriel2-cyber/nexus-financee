export default function ConfirmedPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center shadow-2xl">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
          <span className="text-4xl text-emerald-400">✓</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Email confirmado
        </h1>

        <p className="text-zinc-400 mb-8 leading-relaxed">
          Sua conta foi ativada com sucesso. Agora você já pode acessar o aplicativo.
        </p>

        <a
          href="/login"
          className="w-full h-14 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all text-black font-semibold flex items-center justify-center"
        >
          Ir para login
        </a>
      </div>
    </main>
  )
}