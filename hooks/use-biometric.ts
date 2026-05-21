"use client"

import { useCallback } from "react"

export function useBiometric() {
  const isAvailable = useCallback((): boolean => {
    if (typeof window === "undefined") return false
    
    // Verificar se Web Authentication API está disponível
    if (!("credentials" in window)) return false
    
    // Verificar se é HTTPS ou localhost
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      return false
    }
    
    return true
  }, [])

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isAvailable()) return false

    try {
      // Tentar autenticação biométrica
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: "preferred",
          timeout: 60000,
        },
      })

      return credential !== null
    } catch (error) {
      console.error("Biometric authentication error:", error)
      return false
    }
  }, [isAvailable])

  const register = useCallback(async (userId: string): Promise<boolean> => {
    if (!isAvailable()) return false

    try {
      // Registrar credencial biométrica
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "Nexus Finance",
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(userId.split("").map((c) => c.charCodeAt(0))),
            name: userId,
            displayName: userId,
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "preferred",
          },
          timeout: 60000,
          attestation: "none",
        },
      })

      return credential !== null
    } catch (error) {
      console.error("Biometric registration error:", error)
      return false
    }
  }, [isAvailable])

  const getBiometricType = useCallback((): "faceid" | "touchid" | "none" => {
    if (!isAvailable()) return "none"
    
    // Detectar tipo de biometria (simplificado)
    // Em produção, isso precisaria de detecção mais sofisticada
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      return "faceid"
    }
    
    if (userAgent.includes("mac") && userAgent.includes("arm")) {
      return "touchid"
    }
    
    if (userAgent.includes("android")) {
      return "touchid" // Android usa fingerprint
    }
    
    return "none"
  }, [isAvailable])

  return {
    isAvailable,
    authenticate,
    register,
    getBiometricType,
  }
}
