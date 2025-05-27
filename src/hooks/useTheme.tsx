"use client"

import { useColorScheme } from "react-native"

interface ThemeColors {
  primary: string
  primaryLight: string
  success: string
  successLight: string
  error: string
  errorLight: string
  warning: string
  warningLight: string
  background: string
  backgroundSecondary: string
  card: string
  text: string
  textSecondary: string
  border: string
}

export function useTheme() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const lightColors: ThemeColors = {
    primary: "#4F46E5", // Indigo 600
    primaryLight: "#EEF2FF", // Indigo 50
    success: "#10B981", // Emerald 500
    successLight: "#ECFDF5", // Emerald 50
    error: "#EF4444", // Red 500
    errorLight: "#FEF2F2", // Red 50
    warning: "#F59E0B", // Amber 500
    warningLight: "#FFFBEB", // Amber 50
    background: "#F9FAFB", // Gray 50
    backgroundSecondary: "#F3F4F6", // Gray 100
    card: "#FFFFFF",
    text: "#1F2937", // Gray 800
    textSecondary: "#6B7280", // Gray 500
    border: "#E5E7EB", // Gray 200
  }

  const darkColors: ThemeColors = {
    primary: "#6366F1", // Indigo 500
    primaryLight: "#312E81", // Indigo 900
    success: "#10B981", // Emerald 500
    successLight: "#064E3B", // Emerald 900
    error: "#EF4444", // Red 500
    errorLight: "#7F1D1D", // Red 900
    warning: "#F59E0B", // Amber 500
    warningLight: "#78350F", // Amber 900
    background: "#111827", // Gray 900
    backgroundSecondary: "#1F2937", // Gray 800
    card: "#1F2937", // Gray 800
    text: "#F9FAFB", // Gray 50
    textSecondary: "#9CA3AF", // Gray 400
    border: "#374151", // Gray 700
  }

  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  }
}
