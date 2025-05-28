"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Phone, Mic, MicOff } from "lucide-react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import Card from "../components/Card"
import { useVoiceRecognition } from "../hooks/useVoiceRecognition"
import { useTTS } from "../hooks/useTTS"

// Example: Making a call
const twilio = require('twilio')
const client = twilio(const client = twilio(accountSid, authToken)
, 438eca6b9a68721b90832bd538bfb335)
// const client = twilio(accountSid, authToken)

client.calls.create({
  to: '+0202248817',
  from: '+0987654321',
  url: 'http://your-app.com/voice-handler'
})

export default function ActiveCallScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [callDuration, setCallDuration] = useState(0)
  // Remove this line - we'll use isRecognizing instead:
  // const [isListening, setIsListening] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [enhancedText, setEnhancedText] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const pulseAnim = new Animated.Value(1)

  // @ts-ignore - Route params typing
  const { phoneNumber } = route.params || { phoneNumber: "Unknown" }

  const { startListening, stopListening, transcript, isRecognizing, error } = useVoiceRecognition()
  const { speak } = useTTS()

  // Memoized quick phrases
  const quickPhrases = useMemo(() => [
    "Hello, how are you?", 
    "Thank you", 
    "I need help", 
    "Can you repeat that?"
  ], [])

  // Enhanced text processing
  const enhanceText = useCallback((text: string): string => {
    if (!text || text.trim().length === 0) return ""
    
    return text
      .replace(/\b(um|uh|like|you know|sort of)\b/gi, "")
      .replace(/\s+/g, " ")
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }, [])

  // Format seconds to MM:SS
  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Start call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Enhanced error handling
  useEffect(() => {
    if (error) {
      console.error("Voice recognition error:", error)
      setErrorMessage(error)
      
      // Clear error after 5 seconds
      const timer = setTimeout(() => setErrorMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Handle voice recognition updates
  useEffect(() => {
    if (transcript) {
      setTranscribedText(transcript)

      // Enhanced text processing
      const enhancedVersion = enhanceText(transcript)
      setEnhancedText(enhancedVersion)

      // Only speak if enhancement produced meaningful content
      if (enhancedVersion && enhancedVersion.trim().length > 0) {
        speak(enhancedVersion)
      }
    }
  }, [transcript, enhanceText, speak])

  // Pulse animation for the mic button when listening
  useEffect(() => {
    if (isRecognizing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      pulseAnim.setValue(1)
    }
  }, [isRecognizing]) // Changed from isListening

  // Remove this effect entirely:
  // useEffect(() => {
  //   setIsListening(isRecognizing)
  // }, [isRecognizing])

  // Simplified toggle function
  const toggleListening = useCallback(() => {
    if (isRecognizing) {
      stopListening()
    } else {
      startListening()
    }
  }, [isRecognizing, startListening, stopListening])

  // End the call
  const endCall = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  // Speak a quick phrase
  const speakPhrase = useCallback((phrase: string) => {
    setTranscribedText(phrase)
    setEnhancedText(phrase)
    speak(phrase)
  }, [speak])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.callCard}>
          <View style={styles.callHeader}>
            <Text style={[styles.callTitle, { color: colors.text }]}>Active Call</Text>
            <Text style={[styles.phoneNumber, { color: colors.text }]}>{phoneNumber}</Text>
            <View style={[styles.durationBadge, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                Connected • {formatDuration(callDuration)}
              </Text>
            </View>
          </View>

          {/* Error Message */}
          {errorMessage && (
            <Card style={[styles.errorCard, { backgroundColor: colors.errorLight }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errorMessage}
              </Text>
            </Card>
          )}

          {/* Voice Status */}
          <View style={styles.voiceStatus}>
            <Animated.View
              style={[
                styles.micCircle,
                {
                  backgroundColor: isRecognizing ? colors.errorLight : colors.backgroundSecondary,
                  borderWidth: isRecognizing ? 2 : 0,
                  borderColor: colors.error,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {isRecognizing ? (
                <Mic size={32} color={colors.error} />
              ) : (
                <MicOff size={32} color={colors.textSecondary} />
              )}
            </Animated.View>
            <Text style={[styles.voiceStatusText, { color: colors.textSecondary }]}>
              {isRecognizing ? "Listening..." : errorMessage ? "Tap to retry" : "Tap to speak"}
            </Text>
            
            {/* Processing indicator */}
            {transcript && !enhancedText && (
              <Text style={[styles.processingText, { color: colors.primary }]}>
                Processing...
              </Text>
            )}
          </View>

          {/* Live Transcription */}
          <Card style={[styles.transcriptionCard, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.transcriptionLabel, { color: colors.primary }]}>Your Speech:</Text>
            <Text style={[styles.transcriptionText, { color: colors.primary }]}>
              {transcribedText || (isRecognizing ? "Listening..." : "Tap microphone to start speaking")}
            </Text>
          </Card>

          {/* Enhanced Output */}
          <Card style={[styles.enhancedCard, { backgroundColor: colors.successLight }]}>
            <Text style={[styles.enhancedLabel, { color: colors.success }]}>Enhanced Voice Output:</Text>
            <Text style={[styles.enhancedText, { color: colors.success }]}>
              {enhancedText || "Enhanced speech will appear here"}
            </Text>
          </Card>

          {/* Quick Phrases */}
          <View style={styles.quickPhrasesContainer}>
            <Text style={[styles.quickPhrasesLabel, { color: colors.text }]}>Quick Phrases:</Text>
            <View style={styles.quickPhrasesGrid}>
              {quickPhrases.map((phrase, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickPhraseButton, { borderColor: colors.border }]}
                  onPress={() => speakPhrase(phrase)}
                >
                  <Text style={[styles.quickPhraseText, { color: colors.text }]} numberOfLines={2}>
                    {phrase}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Call Controls */}
          <View style={styles.callControls}>
            <TouchableOpacity
              style={[styles.micButton, { backgroundColor: isRecognizing ? colors.error : colors.primary }]}
              onPress={toggleListening}
            >
              {isRecognizing ? <MicOff size={24} color="#FFFFFF" /> : <Mic size={24} color="#FFFFFF" />}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.endCallButton, { backgroundColor: colors.error }]} onPress={endCall}>
              <Phone size={24} color="#FFFFFF" style={{ transform: [{ rotate: "135deg" }] }} />
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

// Add new styles for error and processing
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  callCard: {
    padding: 16,
  },
  callHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  callTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  durationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  durationText: {
    fontSize: 14,
  },
  voiceStatus: {
    alignItems: "center",
    marginBottom: 24,
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  voiceStatusText: {
    fontSize: 14,
  },
  transcriptionCard: {
    padding: 16,
    marginBottom: 16,
  },
  transcriptionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 16,
  },
  enhancedCard: {
    padding: 16,
    marginBottom: 24,
  },
  enhancedLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  enhancedText: {
    fontSize: 16,
  },
  quickPhrasesContainer: {
    marginBottom: 24,
  },
  quickPhrasesLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  quickPhrasesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickPhraseButton: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickPhraseText: {
    fontSize: 14,
  },
  callControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  errorCard: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  processingText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
})
