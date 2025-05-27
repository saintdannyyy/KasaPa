"use client"

import type React from "react"
import { View, StyleSheet, type ViewProps } from "react-native"
import { useTheme } from "../hooks/useTheme"

interface CardProps extends ViewProps {
  children: React.ReactNode
}

export default function Card({ children, style, ...props }: CardProps) {
  const { colors } = useTheme()

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
})
