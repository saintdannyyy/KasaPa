"use client"

import { useState } from "react"
import Tts from "react-native-tts"

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Initialize TTS
  const initTTS = async () => {
    try {
      await Tts.setDefaultLanguage("en-US")
      await Tts.setDefaultRate(0.5)
      await Tts.setDefaultPitch(1.0)

      Tts.addEventListener("tts-start", () => setIsSpeaking(true))
      Tts.addEventListener("tts-finish", () => setIsSpeaking(false))
      Tts.addEventListener("tts-cancel", () => setIsSpeaking(false))

      const availableVoices = await Tts.voices()
      setVoices(availableVoices)

      return true
    } catch (e) {
      console.error(e)
      setError("Failed to initialize TTS")
      return false
    }
  }

  // Speak text
  const speak = async (text: string) => {
    try {
      if (!isSpeaking) {
        setError(null)
        await Tts.speak(text)
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      setError("Failed to speak")
      return false
    }
  }

  // Stop speaking
  const stop = async () => {
    try {
      await Tts.stop()
      return true
    } catch (e) {
      console.error(e)
      setError("Failed to stop TTS")
      return false
    }
  }

  // Set voice
  const setVoice = async (voiceId: string) => {
    try {
      await Tts.setDefaultVoice(voiceId)
      return true
    } catch (e) {
      console.error(e)
      setError("Failed to set voice")
      return false
    }
  }

  // Set speech rate
  const setRate = async (rate: number) => {
    try {
      await Tts.setDefaultRate(rate)
      return true
    } catch (e) {
      console.error(e)
      setError("Failed to set rate")
      return false
    }
  }

  // Set speech pitch
  const setPitch = async (pitch: number) => {
    try {
      await Tts.setDefaultPitch(pitch)
      return true
    } catch (e) {
      console.error(e)
      setError("Failed to set pitch")
      return false
    }
  }

  return {
    isSpeaking,
    voices,
    error,
    initTTS,
    speak,
    stop,
    setVoice,
    setRate,
    setPitch,
  }
}
