"use client"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../hooks/useTheme"

interface StatusBadgeProps {
  status: "ready" | "connecting" | "error"
  message: string
  detail?: string
}

export default function StatusBadge({ status, message, detail }: StatusBadgeProps) {
  const { colors } = useTheme()

  const getStatusColor = () => {
    switch (status) {
      case "ready":
        return colors.success
      case "connecting":
        return colors.warning
      case "error":
        return colors.error
      default:
        return colors.success
    }
  }

  const getBackgroundColor = () => {
    switch (status) {
      case "ready":
        return colors.successLight
      case "connecting":
        return colors.warningLight
      case "error":
        return colors.errorLight
      default:
        return colors.successLight
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{message}</Text>
        </View>
        {detail && <Text style={[styles.detailText, { color: getStatusColor() }]}>{detail}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
  },
  content: {
    padding: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
})
