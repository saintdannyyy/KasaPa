"use client"

import { useState, useEffect, useRef } from "react"
import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"

const API_BASE_URL = "http://192.168.5.214:8000" // Add the port number!

export function useVoiceRecognition() {
  const [transcript, setTranscript] = useState<string>("")
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recordingRef = useRef<Audio.Recording | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup
      recordingRef.current?.stopAndUnloadAsync()
      recordingRef.current = null
    }
  }, [])

  const startListening = async () => {
    try {
      setIsRecognizing(true)
      setError(null)
      setTranscript("") // Clear previous transcript

      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== "granted") {
        throw new Error("Audio permission not granted")
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      // Start recording with better settings for your API
      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync({
        android: {
          extension: ".wav", // Changed to .wav for better compatibility
          outputFormat: 2, // DEFAULT format
          audioEncoder: 1, // DEFAULT encoder
          sampleRate: 16000, // Match your API's SAMPLE_RATE
          numberOfChannels: 1, // Mono, as expected by your API
          bitRate: 128000,
        },
        ios: {
          extension: ".wav", // Changed to .wav
          outputFormat: 'lpcm', // Linear PCM format
          audioQuality: 2, // HIGH quality
          sampleRate: 16000, // Match your API's SAMPLE_RATE
          numberOfChannels: 1, // Mono, as expected by your API
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/wav",
          bitsPerSecond: 128000,
        },
      })

      await recording.startAsync()
      recordingRef.current = recording
    } catch (err) {
      console.error("Failed to start recording:", err)
      setError(err instanceof Error ? err.message : "Failed to start recording")
      setIsRecognizing(false)
    }
  }

  const stopListening = async () => {
    try {
      if (!recordingRef.current) return

      setIsRecognizing(false)

      // Stop recording
      await recordingRef.current.stopAndUnloadAsync()
      const uri = recordingRef.current.getURI()
      recordingRef.current = null

      if (uri) {
        // Send audio to FastAPI transcribe endpoint
        await transcribeAudio(uri)
      }
    } catch (err) {
      console.error("Failed to stop recording:", err)
      setError(err instanceof Error ? err.message : "Failed to stop recording")
    }
  }

  const transcribeAudio = async (audioUri: string) => {
    try {
      console.log('Transcribing audio from:', audioUri)
      
      // Create FormData for file upload
      const formData = new FormData()

      // Add the audio file with proper format
      formData.append("audio", {
        uri: audioUri,
        type: "audio/wav", // Match the file extension
        name: "recording.wav",
      } as any)
      
      // Add optional parameters to match your API
      formData.append("language", "yo")
      formData.append("enable_noise_reduction", "true")

      // Send to FastAPI transcribe endpoint
      console.log('Sending request to:', `${API_BASE_URL}/transcribe`)
      
      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        body: formData,
        // Remove Content-Type header - let the browser set it for FormData
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('API Response:', result)

      // Update transcript with the result (your API returns 'text' field)
      setTranscript(result.text || "")
      
    } catch (err) {
      console.error("Failed to transcribe audio:", err)
      setError(err instanceof Error ? err.message : "Failed to transcribe audio")
    }
  }

  return {
    startListening,
    stopListening,
    transcript,
    isRecognizing,
    error,
  }
}
