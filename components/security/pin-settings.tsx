"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Shield, Unlock, AlertCircle } from "lucide-react"
import { useSecurity } from "@/hooks/use-security"
import { useRouter } from "next/navigation"

export function PinSettings() {
  const { pinEnabled, enablePin, disablePin, clearPin, setupPin, verifyPin } = useSecurity()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [newPin, setNewPin] = useState("")
  const [confirmNewPin, setConfirmNewPin] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleEnablePin = () => {
    setIsCreating(true)
    setNewPin("")
    setConfirmNewPin("")
    setError("")
    setSuccess("")
  }

  const handleDisablePin = () => {
    if (confirm("Tem certeza que deseja desativar o bloqueio por PIN?")) {
      disablePin()
      setSuccess("PIN desativado com sucesso")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleChangePin = () => {
    setIsChanging(true)
    setNewPin("")
    setConfirmNewPin("")
    setError("")
    setSuccess("")
  }

  const handleCreatePin = () => {
    if (newPin.length !== 4) {
      setError("O PIN deve ter 4 dígitos")
      return
    }
    if (newPin !== confirmNewPin) {
      setError("Os PINs não coincidem")
      return
    }
    setupPin(newPin)
    enablePin()
    setIsCreating(false)
    setSuccess("PIN ativado com sucesso")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleChangePinConfirm = () => {
    if (newPin.length !== 4) {
      setError("O PIN deve ter 4 dígitos")
      return
    }
    if (newPin !== confirmNewPin) {
      setError("Os PINs não coincidem")
      return
    }
    setupPin(newPin)
    setIsChanging(false)
    setSuccess("PIN alterado com sucesso")
    setTimeout(() => setSuccess(""), 3000)
  }

  const PinInput = ({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder: string }) => (
    <input
      type="password"
      maxLength={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
    />
  )

  if (isCreating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/30 border border-border/50 rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Criar PIN</h3>
            <p className="text-sm text-muted-foreground">Configure um PIN de 4 dígitos</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Novo PIN</label>
            <PinInput value={newPin} onChange={setNewPin} placeholder="****" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Confirmar PIN</label>
            <PinInput value={confirmNewPin} onChange={setConfirmNewPin} placeholder="****" />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreating(false)}
              className="flex-1 px-4 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground hover:bg-card/70 transition-all"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreatePin}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
            >
              Criar PIN
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (isChanging) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/30 border border-border/50 rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Alterar PIN</h3>
            <p className="text-sm text-muted-foreground">Configure um novo PIN de 4 dígitos</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Novo PIN</label>
            <PinInput value={newPin} onChange={setNewPin} placeholder="****" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Confirmar PIN</label>
            <PinInput value={confirmNewPin} onChange={setConfirmNewPin} placeholder="****" />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsChanging(false)}
              className="flex-1 px-4 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground hover:bg-card/70 transition-all"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleChangePinConfirm}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
            >
              Alterar PIN
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/30 border border-border/50 rounded-3xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Bloqueio por PIN</h3>
          <p className="text-sm text-muted-foreground">Proteja seu app com um PIN de 4 dígitos</p>
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-success/10 border border-success/20 rounded-xl text-success text-sm"
        >
          {success}
        </motion.div>
      )}

      <div className="space-y-3">
        {!pinEnabled ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEnablePin}
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary hover:bg-primary/20 transition-all"
          >
            <Lock className="w-5 h-5" />
            <span>Ativar bloqueio por PIN</span>
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleChangePin}
              className="w-full flex items-center gap-3 px-4 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground hover:bg-card/70 transition-all"
            >
              <Shield className="w-5 h-5" />
              <span>Alterar PIN</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDisablePin}
              className="w-full flex items-center gap-3 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive hover:bg-destructive/20 transition-all"
            >
              <Unlock className="w-5 h-5" />
              <span>Desativar PIN</span>
            </motion.button>
          </>
        )}
      </div>

      <div className="mt-4 p-3 bg-muted/30 border border-border/30 rounded-xl">
        <p className="text-xs text-muted-foreground">
          O PIN é opcional e complementa o login por email/Google. Se ativado, você precisará digitar o PIN ao abrir o app.
        </p>
      </div>
    </motion.div>
  )
}
