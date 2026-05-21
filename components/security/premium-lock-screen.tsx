"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Fingerprint, Eye, EyeOff, X } from "lucide-react"
import { useSecurity } from "@/hooks/use-security"

export function PremiumLockScreen() {
  const { isLocked, verifyPin, biometricEnabled, isBiometricAvailable, unlock, hideValues, toggleHideValues, pinEnabled } = useSecurity()
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)
  const [isSetup, setIsSetup] = useState(false)
  const [setupPin, setSetupPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")

  if (!isLocked || !pinEnabled) return null

  // Verificar automaticamente quando digitar 4 dígitos
  useEffect(() => {
    if (pin.length === 4 && !isSetup) {
      const timer = setTimeout(() => {
        handlePinSubmit()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [pin, isSetup])

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit)
    }
  }

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1))
  }

  const handlePinSubmit = () => {
    if (isSetup) {
      if (setupPin.length === 4 && confirmPin.length === 4) {
        if (setupPin === confirmPin) {
          // TODO: Salvar PIN
          unlock()
        } else {
          setError(true)
          setTimeout(() => setError(false), 1000)
        }
      }
    } else {
      if (pin.length === 4) {
        if (verifyPin(pin)) {
          setPin("")
          setError(false)
        } else {
          setError(true)
          setTimeout(() => setError(false), 1000)
          setPin("")
        }
      }
    }
  }

  const handleBiometric = async () => {
    try {
      // TODO: Implementar biometria real
      unlock()
    } catch (error) {
      console.error("Biometric error:", error)
    }
  }

  const PinDot = ({ filled }: { filled: boolean }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: filled ? 1 : 0.8, opacity: filled ? 1 : 0.5 }}
      className={`w-4 h-4 rounded-full transition-all ${
        filled ? "bg-white" : "bg-white/30"
      }`}
    />
  )

  const PinButton = ({ digit }: { digit: string }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handlePinInput(digit)}
      className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-2xl font-semibold hover:bg-white/20 transition-all"
    >
      {digit}
    </motion.button>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-4"
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isSetup ? "Criar PIN" : "Desbloquear"}
          </h1>
          <p className="text-white/60 text-sm">
            {isSetup ? "Configure um PIN de 4 dígitos" : "Digite seu PIN para continuar"}
          </p>
        </motion.div>

        {/* PIN Display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-12"
        >
          {[0, 1, 2, 3].map((i) => (
            <PinDot key={i} filled={i < pin.length} />
          ))}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mb-8"
            >
              <p className="text-red-400 text-sm font-medium">PIN incorreto</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Biometric Button */}
        {biometricEnabled && isBiometricAvailable() && !isSetup && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBiometric}
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <Fingerprint className="w-8 h-8 text-white" />
            </motion.button>
          </motion.div>
        )}

        {/* PIN Pad */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <PinButton key={digit} digit={digit} />
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleHideValues()}
            className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            {hideValues ? <EyeOff className="w-6 h-6 text-white/60" /> : <Eye className="w-6 h-6 text-white/60" />}
          </motion.button>
          <PinButton digit="0" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePinDelete}
            className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <X className="w-6 h-6 text-white/60" />
          </motion.button>
        </motion.div>

        {/* Desbloquear Button */}
        {!isSetup && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePinSubmit}
            disabled={pin.length !== 4}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-lg hover:from-primary/90 hover:to-primary/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Desbloquear
          </motion.button>
        )}

        {/* Setup Mode Toggle */}
        {!isSetup && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={() => setIsSetup(true)}
              className="text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              Criar novo PIN
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
