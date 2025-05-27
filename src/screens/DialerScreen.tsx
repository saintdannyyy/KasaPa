"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Phone, X, MessageSquare, Mic, Settings } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import Card from "../components/Card"
import StatusBadge from "../components/StatusBadge"

export default function DialerScreen() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const navigation = useNavigation()
  const { colors } = useTheme()

  const handleNumberPress = (digit: string) => {
    setPhoneNumber((prev) => prev + digit)
  }

  const handleClear = () => {
    if (phoneNumber.length > 0) {
      setPhoneNumber((prev) => prev.slice(0, -1))
    }
  }

  const handleClearLongPress = () => {
    setPhoneNumber("")
  }

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      // @ts-ignore - Navigation typing
      navigation.navigate("ActiveCall", { phoneNumber })
    } else {
      Alert.alert("Error", "Please enter a phone number")
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "soundboard":
        // @ts-ignore - Navigation typing
        navigation.navigate("SoundboardTab")
        break
      case "voice":
        // @ts-ignore - Navigation typing
        navigation.navigate("SettingsTab", { screen: "VoiceTraining" })
        break
      case "settings":
        // @ts-ignore - Navigation typing
        navigation.navigate("SettingsTab")
        break
      default:
        break
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Voice Proxy</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Phone Number Display */}
        <Card style={styles.phoneNumberCard}>
          <TextInput
            style={[styles.phoneNumberInput, { color: colors.text }]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            editable={true}
          />
        </Card>

        {/* Dialer */}
        <Card style={styles.dialerCard}>
          <View style={styles.dialerGrid}>
            {[
              ["1", "2", "3"],
              ["4", "5", "6"],
              ["7", "8", "9"],
              ["*", "0", "#"],
            ].map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.dialerRow}>
                {row.map((digit) => (
                  <TouchableOpacity
                    key={`digit-${digit}`}
                    style={[styles.dialerButton, { borderColor: colors.border }]}
                    onPress={() => handleNumberPress(digit)}
                  >
                    <Text style={[styles.dialerButtonText, { color: colors.text }]}>{digit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.border }]}
              onPress={handleClear}
              onLongPress={handleClearLongPress}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.callButton, { backgroundColor: colors.success }]}
              onPress={handleCall}
              disabled={phoneNumber.length === 0}
            >
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickActionButton, { borderColor: colors.border }]}
              onPress={() => handleQuickAction("soundboard")}
            >
              <MessageSquare size={20} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Soundboard & Phrases</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, { borderColor: colors.border }]}
              onPress={() => handleQuickAction("voice")}
            >
              <Mic size={20} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Voice Training</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, { borderColor: colors.border }]}
              onPress={() => handleQuickAction("settings")}
            >
              <Settings size={20} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Voice Settings</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Status */}
        <StatusBadge status="ready" message="Voice Proxy Ready" detail="Your proxy number: +1 (555) 123-4567" />
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
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  phoneNumberCard: {
    padding: 16,
  },
  phoneNumberInput: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "monospace",
  },
  dialerCard: {
    padding: 16,
  },
  dialerGrid: {
    gap: 8,
  },
  dialerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  dialerButton: {
    flex: 1,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialerButtonText: {
    fontSize: 24,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  clearButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callButton: {
    flex: 2,
    height: 48,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActionsCard: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  quickActions: {
    gap: 12,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  quickActionText: {
    fontSize: 16,
  },
})
