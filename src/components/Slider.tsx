"use client"
import { View, StyleSheet } from "react-native"
import Slider from "@react-native-community/slider"
import { useTheme } from "../hooks/useTheme"

interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
}

export default function CustomSlider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.1,
}: SliderProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.backgroundSecondary}
        thumbTintColor={colors.primary}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
})
