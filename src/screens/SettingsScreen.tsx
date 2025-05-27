"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Volume2, Mic, Globe, Shield } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import Card from "../components/Card"
import Slider from "../components/Slider"
import Dropdown from "../components/Dropdown"
import { useTTS } from "../hooks/useTTS"

export default function SettingsScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { speak } = useTTS()

  const [speechRate, setSpeechRate] = useState(1.0)
  const [voicePitch, setVoicePitch] = useState(1.0)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [autoTranscribe, setAutoTranscribe] = useState(true)

  const voiceOptions = [
    { label: "Female - Natural", value: "female-natural" },
    { label: "Male - Natural", value: "male-natural" },
    { label: "Female - Warm", value: "female-warm" },
    { label: "Male - Professional", value: "male-professional" },
  ]

  const languageOptions = [
    { label: "English (US)", value: "en-US" },
    { label: "English (UK)", value: "en-GB" },
    { label: "Twi", value: "tw" },
    { label: "Spanish", value: "es-ES" },
  ]

  const appLanguageOptions = [
    { label: "English", value: "en" },
    { label: "Twi", value: "tw" },
    { label: "Spanish", value: "es" },
  ]

  const textSizeOptions = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "Extra Large", value: "extra-large" },
  ]

  const testVoice = () => {
    speak("This is a test of the voice output. How does it sound?")
  }

  const navigateToVoiceTraining = () => {
    // @ts-ignore - Navigation typing
    navigation.navigate("VoiceTraining")
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Voice Settings */}
        <Card style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Volume2 size={20} color={colors.text} />
            <Text style={[styles.settingsTitle, { color: colors.text }]}>Voice Output</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Voice Type</Text>
            <Dropdown options={voiceOptions} defaultValue="female-natural" onSelect={(value) => console.log(value)} />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Speech Rate</Text>
            <Slider value={speechRate} onValueChange={setSpeechRate} minimumValue={0.5} maximumValue={2} step={0.1} />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>Slow</Text>
              <Text style={[styles.sliderValue, { color: colors.textSecondary }]}>{speechRate.toFixed(1)}x</Text>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>Fast</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Voice Pitch</Text>
            <Slider value={voicePitch} onValueChange={setVoicePitch} minimumValue={0.5} maximumValue={2} step={0.1} />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>Lower</Text>
              <Text style={[styles.sliderValue, { color: colors.textSecondary }]}>{voicePitch.toFixed(1)}x</Text>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>Higher</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]} onPress={testVoice}>
            <Volume2 size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Test Voice</Text>
          </TouchableOpacity>
        </Card>

        {/* Speech Recognition */}
        <Card style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Mic size={20} color={colors.text} />
            <Text style={[styles.settingsTitle, { color: colors.text }]}>Speech Recognition</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Primary Language</Text>
            <Dropdown options={languageOptions} defaultValue="en-US" onSelect={(value) => console.log(value)} />
          </View>

          <View style={styles.switchItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-transcribe incoming calls</Text>
            <Switch
              value={autoTranscribe}
              onValueChange={setAutoTranscribe}
              trackColor={{ false: colors.backgroundSecondary, true: colors.primaryLight }}
              thumbColor={autoTranscribe ? colors.primary : colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            onPress={navigateToVoiceTraining}
          >
            <Mic size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Train Voice Recognition</Text>
          </TouchableOpacity>
        </Card>

        {/* Language & Accessibility */}
        <Card style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Globe size={20} color={colors.text} />
            <Text style={[styles.settingsTitle, { color: colors.text }]}>Language & Accessibility</Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>App Language</Text>
            <Dropdown options={appLanguageOptions} defaultValue="en" onSelect={(value) => console.log(value)} />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Text Size</Text>
            <Dropdown options={textSizeOptions} defaultValue="medium" onSelect={(value) => console.log(value)} />
          </View>
        </Card>

        {/* Privacy & Data */}
        <Card style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <Shield size={20} color={colors.text} />
            <Text style={[styles.settingsTitle, { color: colors.text }]}>Privacy & Data</Text>
          </View>

          <View style={styles.switchItem}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Don't store transcriptions
              </Text>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              trackColor={{ false: colors.backgroundSecondary, true: colors.primaryLight }}
              thumbColor={privacyMode ? colors.primary : colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            onPress={() => console.log("Clear data")}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Clear All Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            onPress={() => console.log("Export data")}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Export Data</Text>
          </TouchableOpacity>
        </Card>

        {/* About */}
        <Card style={styles.aboutCard}>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>Voice Proxy Assistant v1.0.0</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>Empowering communication for everyone</Text>
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
  settingsCard: {
    padding: 16,
    gap: 16,
  },
  settingsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  settingItem: {
    gap: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
  },
  sliderValue: {
    fontSize: 12,
    fontWeight: "500",
  },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  aboutCard: {
    padding: 16,
    alignItems: "center",
  },
  aboutText: {
    fontSize: 14,
    textAlign: "center",
  },
})
