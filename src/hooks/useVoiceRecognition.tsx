"use client"

import { useState, useEffect } from "react"
import Voice, {
  type SpeechRecognizedEvent,
  type SpeechResultsEvent,
  type SpeechErrorEvent,
} from "@react-native-voice/voice"

export function useVoiceRecognition() {
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize voice recognition
    function onSpeechResults(e: SpeechResultsEvent) {
      if (e.value && e.value.length > 0) {
        setTranscript(e.value[0])
      }
    }

    function onSpeechRecognized(e: SpeechRecognizedEvent) {
      setIsRecognizing(e.isFinal)
    }

    function onSpeechError(e: SpeechErrorEvent) {
      setError(e.error?.message || "Unknown error")
      setIsRecognizing(false)
    }

    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechRecognized = onSpeechRecognized
    Voice.onSpeechError = onSpeechError

    return () => {
      // Cleanup
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const startListening = async (language = "en-US") => {
    try {
      setError(null)
      setTranscript("")
      setIsRecognizing(true)
      await Voice.start(language)
    } catch (e) {
      console.error(e)
      setError("Failed to start voice recognition")
      setIsRecognizing(false)
    }
  }

  const stopListening = async () => {
    try {
      await Voice.stop()
      setIsRecognizing(false)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    isRecognizing,
    transcript,
    error,
    startListening,
    stopListening,
  }
}
