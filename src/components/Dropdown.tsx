"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from "react-native"
import { ChevronDown } from "lucide-react-native"
import { useTheme } from "../hooks/useTheme"

interface DropdownOption {
  label: string
  value: string
}

interface DropdownProps {
  options: DropdownOption[]
  defaultValue?: string
  onSelect: (value: string) => void
}

export default function Dropdown({ options, defaultValue, onSelect }: DropdownProps) {
  const { colors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value)

  const selectedOption = options.find((option) => option.value === selectedValue)

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.trigger, { borderColor: colors.border }]} onPress={() => setIsOpen(true)}>
        <Text style={[styles.triggerText, { color: colors.text }]}>{selectedOption?.label || "Select an option"}</Text>
        <ChevronDown size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, selectedValue === item.value && { backgroundColor: colors.primaryLight }]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: selectedValue === item.value ? colors.primary : colors.text,
                        fontWeight: selectedValue === item.value ? "600" : "normal",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  triggerText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalContent: {
    width: "90%",
    maxHeight: "70%",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  option: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  optionText: {
    fontSize: 16,
  },
})
