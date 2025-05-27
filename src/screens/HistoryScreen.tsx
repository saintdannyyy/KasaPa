"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Phone, ArrowLeft, ArrowRight, Clock, Calendar, Trash2 } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import Badge from "../components/Badge"

type CallRecord = {
  id: string
  phoneNumber: string
  date: Date
  duration: number
  type: "incoming" | "outgoing"
  transcription?: string
}

export default function HistoryScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedCalls, setSelectedCalls] = useState<string[]>([])

  // Mock call history data
  const [callHistory, setCallHistory] = useState<CallRecord[]>([
    {
      id: "1",
      phoneNumber: "+1 (555) 123-4567",
      date: new Date(2023, 4, 27, 14, 30),
      duration: 125,
      type: "outgoing",
      transcription: "Hello, I would like to schedule an appointment for next week.",
    },
    {
      id: "2",
      phoneNumber: "+1 (555) 987-6543",
      date: new Date(2023, 4, 26, 10, 15),
      duration: 78,
      type: "incoming",
      transcription: "Hi there, just checking in about our meeting tomorrow.",
    },
    {
      id: "3",
      phoneNumber: "+1 (555) 456-7890",
      date: new Date(2023, 4, 25, 16, 45),
      duration: 203,
      type: "outgoing",
      transcription: "I need help with my account, can you assist me?",
    },
    {
      id: "4",
      phoneNumber: "+1 (555) 234-5678",
      date: new Date(2023, 4, 25, 9, 20),
      duration: 45,
      type: "incoming",
    },
    {
      id: "5",
      phoneNumber: "+1 (555) 876-5432",
      date: new Date(2023, 4, 24, 13, 10),
      duration: 167,
      type: "outgoing",
      transcription: "Thank you for your help with the project.",
    },
    {
      id: "6",
      phoneNumber: "+1 (555) 345-6789",
      date: new Date(2023, 4, 23, 11, 5),
      duration: 92,
      type: "incoming",
    },
  ])

  // Filter calls based on selected filter
  const filteredCalls =
    selectedFilter === "all" ? callHistory : callHistory.filter((call) => call.type === selectedFilter)

  // Format duration in seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Format date to readable string
  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  // Format time to readable string
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }

  // Toggle call selection
  const toggleCallSelection = (id: string) => {
    if (selectedCalls.includes(id)) {
      setSelectedCalls(selectedCalls.filter((callId) => callId !== id))
    } else {
      setSelectedCalls([...selectedCalls, id])
    }
  }

  // Delete selected calls
  const deleteSelectedCalls = () => {
    setCallHistory(callHistory.filter((call) => !selectedCalls.includes(call.id)))
    setSelectedCalls([])
    setIsSelecting(false)
  }

  // Group calls by date
  const groupCallsByDate = () => {
    const groups: { [key: string]: CallRecord[] } = {}

    filteredCalls.forEach((call) => {
      const dateKey = formatDate(call.date)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(call)
    })

    return Object.entries(groups).map(([date, calls]) => ({
      date,
      calls,
    }))
  }

  const groupedCalls = groupCallsByDate()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          {isSelecting ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  setIsSelecting(false)
                  setSelectedCalls([])
                }}
              >
                <Text style={{ color: colors.primary }}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>{selectedCalls.length} Selected</Text>
              <TouchableOpacity onPress={deleteSelectedCalls}>
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Call History</Text>
              <TouchableOpacity onPress={() => setIsSelecting(true)}>
                <Text style={{ color: colors.primary }}>Select</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedFilter === "all" ? colors.primary : "transparent",
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedFilter("all")}
            >
              <Text style={[styles.filterText, { color: selectedFilter === "all" ? "#FFFFFF" : colors.text }]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedFilter === "incoming" ? colors.primary : "transparent",
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedFilter("incoming")}
            >
              <ArrowLeft size={16} color={selectedFilter === "incoming" ? "#FFFFFF" : colors.text} />
              <Text style={[styles.filterText, { color: selectedFilter === "incoming" ? "#FFFFFF" : colors.text }]}>
                Incoming
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedFilter === "outgoing" ? colors.primary : "transparent",
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedFilter("outgoing")}
            >
              <ArrowRight size={16} color={selectedFilter === "outgoing" ? "#FFFFFF" : colors.text} />
              <Text style={[styles.filterText, { color: selectedFilter === "outgoing" ? "#FFFFFF" : colors.text }]}>
                Outgoing
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {filteredCalls.length > 0 ? (
        <FlatList
          data={groupedCalls}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: colors.textSecondary }]}>{item.date}</Text>
              {item.calls.map((call) => (
                <TouchableOpacity
                  key={call.id}
                  style={[
                    styles.callItem,
                    {
                      backgroundColor: selectedCalls.includes(call.id) ? colors.primaryLight : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => (isSelecting ? toggleCallSelection(call.id) : null)}
                  onLongPress={() => {
                    if (!isSelecting) {
                      setIsSelecting(true)
                      setSelectedCalls([call.id])
                    }
                  }}
                >
                  <View style={styles.callInfo}>
                    <View style={styles.callHeader}>
                      <View style={styles.callTypeContainer}>
                        {call.type === "incoming" ? (
                          <ArrowLeft size={16} color={colors.success} />
                        ) : (
                          <ArrowRight size={16} color={colors.primary} />
                        )}
                        <Text style={[styles.phoneNumber, { color: colors.text }]}>{call.phoneNumber}</Text>
                      </View>
                      <Text style={[styles.callTime, { color: colors.textSecondary }]}>{formatTime(call.date)}</Text>
                    </View>

                    <View style={styles.callDetails}>
                      <View style={styles.callMetadata}>
                        <View style={styles.metadataItem}>
                          <Clock size={14} color={colors.textSecondary} />
                          <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                            {formatDuration(call.duration)}
                          </Text>
                        </View>
                        {call.transcription && <Badge text="Transcribed" variant="outline" size="small" />}
                      </View>

                      {call.transcription && (
                        <Text style={[styles.transcription, { color: colors.textSecondary }]} numberOfLines={2}>
                          "{call.transcription}"
                        </Text>
                      )}
                    </View>
                  </View>

                  {!isSelecting && (
                    <TouchableOpacity
                      style={[styles.callButton, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        // @ts-ignore - Navigation typing
                        navigation.navigate("DialerTab", {
                          screen: "Dialer",
                          params: { phoneNumber: call.phoneNumber },
                        })
                      }}
                    >
                      <Phone size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          contentContainerStyle={styles.callsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Calendar size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No calls found</Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Your call history will appear here
          </Text>
        </View>
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  callsList: {
    padding: 16,
    gap: 16,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  callItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  callInfo: {
    flex: 1,
    marginRight: 8,
  },
  callHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  callTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "500",
  },
  callTime: {
    fontSize: 12,
  },
  callDetails: {
    marginTop: 4,
  },
  callMetadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
  },
  transcription: {
    fontSize: 13,
    fontStyle: "italic",
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
  },
})
