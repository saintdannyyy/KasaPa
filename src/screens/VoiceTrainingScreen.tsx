"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Mic, MicOff, CheckCircle, AlertCircle } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import Card from "../components/Card"
import { useVoiceRecognition } from "../hooks/useVoiceRecognition"

export default function VoiceTrainingScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { startListening, stopListening, transcript, isRecognizing } = useVoiceRecognition()

  const [currentStep, setCurrentStep] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [completedPhrases, setCompletedPhrases] = useState<number[]>([])

  const trainingPhrases = [
    "Hello, my name is John",
    "I would like to schedule an appointment",
    "Can you please repeat that",
    "Thank you for your help",
    "I need assistance with my account",
    "What time does the store open",
    "Please call me back later",
    "I'm having trouble hearing you",
  ]

  const startRecording = () => {
    setIsRecording(true)
    startListening()
  }

  const stopRecording = () => {
    setIsRecording(false)
    stopListening()

    // In a real app, this would analyze the transcript against the expected phrase
    // For demo purposes, we'll just mark it as completed
    if (!completedPhrases.includes(currentStep)) {
      setCompletedPhrases([...completedPhrases, currentStep])
    }
  }

  const goToNextPhrase = () => {
    if (currentStep < trainingPhrases.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousPhrase = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCompletionPercentage = () => {
    return Math.round((completedPhrases.length / trainingPhrases.length) * 100)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Voice Training</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Progress */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>Training Progress</Text>
            <Text style={[styles.progressPercentage, { color: colors.primary }]}>{getCompletionPercentage()}%</Text>
          </View>

          <View style={[styles.progressBar, { backgroundColor: colors.backgroundSecondary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${getCompletionPercentage()}%`,
                },
              ]}
            />
          </View>

          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {completedPhrases.length} of {trainingPhrases.length} phrases completed
          </Text>
        </Card>

        {/* Current Phrase */}
        <Card style={styles.phraseCard}>
          <Text style={[styles.phraseLabel, { color: colors.textSecondary }]}>
            Phrase {currentStep + 1} of {trainingPhrases.length}
          </Text>
          <Text style={[styles.phraseText, { color: colors.text }]}>"{trainingPhrases[currentStep]}"</Text>

          <View style={styles.phraseNavigation}>
            <TouchableOpacity
              style={[styles.navButton, { borderColor: colors.border }]}
              onPress={goToPreviousPhrase}
              disabled={currentStep === 0}
            >
              <Text
                style={[
                  styles.navButtonText,
                  {
                    color: currentStep === 0 ? colors.textSecondary : colors.text,
                  },
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, { borderColor: colors.border }]}
              onPress={goToNextPhrase}
              disabled={currentStep === trainingPhrases.length - 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  {
                    color: currentStep === trainingPhrases.length - 1 ? colors.textSecondary : colors.text,
                  },
                ]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recording */}
        <Card style={styles.recordingCard}>
          <View style={styles.recordingStatus}>
            {isRecording ? (
              <>
                <View style={[styles.recordingIndicator, { backgroundColor: colors.error }]} />
                <Text style={[styles.recordingText, { color: colors.error }]}>Recording...</Text>
              </>
            ) : (
              <Text style={[styles.recordingText, { color: colors.textSecondary }]}>Press the microphone to start</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.micButton, { backgroundColor: isRecording ? colors.error : colors.primary }]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecognizing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : isRecording ? (
              <MicOff size={24} color="#FFFFFF" />
            ) : (
              <Mic size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <View style={[styles.transcriptContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.transcriptLabel, { color: colors.textSecondary }]}>Transcription:</Text>
            <Text style={[styles.transcriptText, { color: colors.text }]}>
              {transcript || "Your speech will appear here..."}
            </Text>
          </View>
        </Card>

        {/* Phrase List */}
        <Card style={styles.phrasesListCard}>
          <Text style={[styles.phrasesListTitle, { color: colors.text }]}>All Training Phrases</Text>

          <View style={styles.phrasesList}>
            {trainingPhrases.map((phrase, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.phraseItem,
                  {
                    backgroundColor: currentStep === index ? colors.primaryLight : "transparent",
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setCurrentStep(index)}
              >
                <Text
                  style={[
                    styles.phraseItemText,
                    {
                      color: currentStep === index ? colors.primary : colors.text,
                      fontWeight: currentStep === index ? "600" : "normal",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {phrase}
                </Text>
                {completedPhrases.includes(index) ? (
                  <CheckCircle size={16} color={colors.success} />
                ) : (
                  <AlertCircle size={16} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Help Text */}
        <Card style={[styles.helpCard, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.helpText, { color: colors.primary }]}>
            Training your voice helps improve speech recognition accuracy. Speak clearly and at a normal pace.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  progressCard: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  phraseCard: {
    padding: 16,
  },
  phraseLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  phraseText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  phraseNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 16,
  },
  recordingCard: {
    padding: 16,
    alignItems: "center",
    gap: 16,
  },
  recordingStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recordingText: {
    fontSize: 16,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  transcriptContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
  },
  transcriptLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 16,
  },
  phrasesListCard: {
    padding: 16,
  },
  phrasesListTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  phrasesList: {
    gap: 8,
  },
  phraseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  phraseItemText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  helpCard: {
    padding: 16,
  },
  helpText: {
    fontSize: 14,
    textAlign: "center",
  },
})
