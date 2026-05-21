"use client"

import { useState, useEffect, useCallback } from "react"

const PIN_STORAGE_KEY = "nexus_pin"
const BIOMETRIC_ENABLED_KEY = "nexus_biometric_enabled"
const SESSION_TIMEOUT_KEY = "nexus_session_timeout"
const AUTO_LOCK_KEY = "nexus_auto_lock"
const PIN_ENABLED_KEY = "nexus_pin_enabled"

const DEFAULT_SESSION_TIMEOUT = 5 * 60 * 1000 // 5 minutos
const DEFAULT_AUTO_LOCK = true

export function useSecurity() {
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState<string | null>(null)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(DEFAULT_SESSION_TIMEOUT)
  const [autoLock, setAutoLock] = useState(DEFAULT_AUTO_LOCK)
  const [pinEnabled, setPinEnabled] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [hideValues, setHideValues] = useState(false)

  // Carregar configurações do localStorage
  useEffect(() => {
    const storedPin = localStorage.getItem(PIN_STORAGE_KEY)
    const storedBiometric = localStorage.getItem(BIOMETRIC_ENABLED_KEY)
    const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY)
    const storedAutoLock = localStorage.getItem(AUTO_LOCK_KEY)
    const storedPinEnabled = localStorage.getItem(PIN_ENABLED_KEY)

    // Limpar PIN quebrado se pinEnabled não existir
    if (storedPin && !storedPinEnabled) {
      localStorage.removeItem(PIN_STORAGE_KEY)
      localStorage.removeItem(PIN_ENABLED_KEY)
      return
    }

    if (storedPin) {
      setPin(storedPin)
    }
    if (storedBiometric) {
      setBiometricEnabled(storedBiometric === "true")
    }
    if (storedTimeout) {
      setSessionTimeout(parseInt(storedTimeout))
    }
    if (storedAutoLock) {
      setAutoLock(storedAutoLock === "true")
    }
    if (storedPinEnabled) {
      setPinEnabled(storedPinEnabled === "true")
      // Só bloquear se PIN estiver ativado
      setIsLocked(storedPinEnabled === "true")
    }
  }, [])

  // Verificar timeout de sessão
  useEffect(() => {
    if (!autoLock || !pin || !pinEnabled) return

    const checkTimeout = () => {
      const now = Date.now()
      if (now - lastActivity > sessionTimeout) {
        setIsLocked(true)
      }
    }

    const interval = setInterval(checkTimeout, 1000)
    return () => clearInterval(interval)
  }, [autoLock, sessionTimeout, lastActivity, pin, pinEnabled])

  // Atualizar última atividade
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now())
  }, [])

  // Configurar PIN
  const setupPin = useCallback((newPin: string) => {
    const encryptedPin = btoa(newPin) // Criptografia básica
    localStorage.setItem(PIN_STORAGE_KEY, encryptedPin)
    setPin(encryptedPin)
  }, [])

  // Ativar PIN
  const enablePin = useCallback(() => {
    localStorage.setItem(PIN_ENABLED_KEY, "true")
    setPinEnabled(true)
    setIsLocked(true)
  }, [])

  // Desativar PIN
  const disablePin = useCallback(() => {
    localStorage.setItem(PIN_ENABLED_KEY, "false")
    setPinEnabled(false)
    setIsLocked(false)
  }, [])

  // Limpar PIN
  const clearPin = useCallback(() => {
    localStorage.removeItem(PIN_STORAGE_KEY)
    localStorage.removeItem(PIN_ENABLED_KEY)
    setPin(null)
    setPinEnabled(false)
    setIsLocked(false)
  }, [])

  // Verificar PIN
  const verifyPin = useCallback((inputPin: string): boolean => {
    if (!pin) return false
    const encryptedInput = btoa(inputPin)
    const isValid = encryptedInput === pin
    if (isValid) {
      setIsLocked(false)
      updateActivity()
    }
    return isValid
  }, [pin, updateActivity])

  // Habilitar biometria
  const enableBiometric = useCallback(() => {
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, "true")
    setBiometricEnabled(true)
  }, [])

  // Desabilitar biometria
  const disableBiometric = useCallback(() => {
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, "false")
    setBiometricEnabled(false)
  }, [])

  // Configurar timeout de sessão
  const setSessionTimeoutMinutes = useCallback((minutes: number) => {
    const timeout = minutes * 60 * 1000
    localStorage.setItem(SESSION_TIMEOUT_KEY, timeout.toString())
    setSessionTimeout(timeout)
  }, [])

  // Configurar auto lock
  const toggleAutoLock = useCallback((enabled: boolean) => {
    localStorage.setItem(AUTO_LOCK_KEY, enabled.toString())
    setAutoLock(enabled)
  }, [])

  // Lock manual
  const lock = useCallback(() => {
    setIsLocked(true)
  }, [])

  // Unlock manual
  const unlock = useCallback(() => {
    setIsLocked(false)
    updateActivity()
  }, [updateActivity])

  // Toggle ocultar valores
  const toggleHideValues = useCallback(() => {
    setHideValues((prev) => !prev)
  }, [])

  // Verificar se biometria está disponível
  const isBiometricAvailable = useCallback((): boolean => {
    return typeof window !== "undefined" && "credentials" in window
  }, [])

  return {
    isLocked,
    pin,
    biometricEnabled,
    sessionTimeout,
    autoLock,
    pinEnabled,
    hideValues,
    setupPin,
    verifyPin,
    enablePin,
    disablePin,
    clearPin,
    enableBiometric,
    disableBiometric,
    setSessionTimeoutMinutes,
    toggleAutoLock,
    lock,
    unlock,
    toggleHideValues,
    isBiometricAvailable,
    updateActivity,
  }
}
