"use client"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../hooks/useTheme"

interface BadgeProps {
  text: string
  variant?: "default" | "outline" | "secondary" | "light"
  size?: "default" | "small"
}

export default function Badge({ text, variant = "default", size = "default" }: BadgeProps) {
  const { colors } = useTheme()

  const getBackgroundColor = () => {
    switch (variant) {
      case "outline":
        return "transparent"
      case "secondary":
        return colors.backgroundSecondary
      case "light":
        return "rgba(255, 255, 255, 0.3)"
      default:
        return colors.primary
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "outline":
        return colors.textSecondary
      case "secondary":
        return colors.textSecondary
      case "light":
        return "#FFFFFF"
      default:
        return "#FFFFFF"
    }
  }

  const getBorderColor = () => {
    return variant === "outline" ? colors.border : "transparent"
  }

  return (
    <View
      style={[
        styles.badge,
        size === "small" && styles.badgeSmall,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <Text style={[styles.text, size === "small" && styles.textSmall, { color: getTextColor() }]}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  textSmall: {
    fontSize: 10,
  },
})
