"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useTTS } from "../hooks/useTTS"

interface AppContextType {
  isReady: boolean
  proxyNumber: string
  setProxyNumber: (number: string) => void
  voiceSettings: {
    voice: string
    rate: number
    pitch: number
    language: string
  }
  updateVoiceSettings: (settings: Partial<AppContextType["voiceSettings"]>) => void
  privacySettings: {
    storeTranscriptions: boolean
    autoTranscribe: boolean
  }
  updatePrivacySettings: (settings: Partial<AppContextType["privacySettings"]>) => void
}

const defaultContext: AppContextType = {
  isReady: false,
  proxyNumber: "+1 (555) 123-4567",
  setProxyNumber: () => {},
  voiceSettings: {
    voice: "female-natural",
    rate: 1.0,
    pitch: 1.0,
    language: "en-US",
  },
  updateVoiceSettings: () => {},
  privacySettings: {
    storeTranscriptions: true,
    autoTranscribe: true,
  },
  updatePrivacySettings: () => {},
}

const AppContext = createContext<AppContextType>(defaultContext)

export const useAppContext = () => useContext(AppContext)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const [proxyNumber, setProxyNumber] = useState(defaultContext.proxyNumber)
  const [voiceSettings, setVoiceSettings] = useState(defaultContext.voiceSettings)
  const [privacySettings, setPrivacySettings] = useState(defaultContext.privacySettings)

  const { initTTS } = useTTS()

  useEffect(() => {
    // Initialize app
    const initialize = async () => {
      // Initialize TTS
      await initTTS()

      // Load settings from storage (would be implemented in a real app)

      // Set app as ready
      setIsReady(true)
    }

    initialize()
  }, [])

  const updateVoiceSettings = (settings: Partial<AppContextType["voiceSettings"]>) => {
    setVoiceSettings((prev) => ({ ...prev, ...settings }))
    // In a real app, save to storage
  }

  const updatePrivacySettings = (settings: Partial<AppContextType["privacySettings"]>) => {
    setPrivacySettings((prev) => ({ ...prev, ...settings }))
    // In a real app, save to storage
  }

  return (
    <AppContext.Provider
      value={{
        isReady,
        proxyNumber,
        setProxyNumber,
        voiceSettings,
        updateVoiceSettings,
        privacySettings,
        updatePrivacySettings,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
