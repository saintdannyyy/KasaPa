"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Edit, Plus, Volume2, Trash2 } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import Card from "../components/Card"
import Badge from "../components/Badge"
import { useTTS } from "../hooks/useTTS"

type Phrase = {
  id: number
  text: string
  category: string
  used: number
}

export default function SoundboardScreen() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { speak } = useTTS()

  const [isEditing, setIsEditing] = useState(false)
  const [newPhrase, setNewPhrase] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [phrases, setPhrases] = useState<Phrase[]>([
    { id: 1, text: "Hello, how are you?", category: "greetings", used: 15 },
    { id: 2, text: "Thank you very much", category: "gratitude", used: 8 },
    { id: 3, text: "I need help with something", category: "assistance", used: 12 },
    { id: 4, text: "Can you please repeat that?", category: "clarification", used: 20 },
    { id: 5, text: "I'll call you back later", category: "phone", used: 5 },
    { id: 6, text: "Have a great day!", category: "farewell", used: 10 },
    { id: 7, text: "I'm running late", category: "time", used: 7 },
    { id: 8, text: "What time should we meet?", category: "scheduling", used: 9 },
  ])

  const categories = [
    { id: "all", name: "All", count: phrases.length },
    { id: "greetings", name: "Greetings", count: phrases.filter((p) => p.category === "greetings").length },
    { id: "gratitude", name: "Gratitude", count: phrases.filter((p) => p.category === "gratitude").length },
    { id: "assistance", name: "Help", count: phrases.filter((p) => p.category === "assistance").length },
    { id: "phone", name: "Phone", count: phrases.filter((p) => p.category === "phone").length },
  ]

  const filteredPhrases =
    selectedCategory === "all" ? phrases : phrases.filter((phrase) => phrase.category === selectedCategory)

  const playPhrase = (phrase: string) => {
    speak(phrase)

    // Update usage count
    setPhrases((prev) => prev.map((p) => (p.text === phrase ? { ...p, used: p.used + 1 } : p)))
  }

  const addPhrase = () => {
    if (newPhrase.trim()) {
      const newId = Math.max(...phrases.map((p) => p.id)) + 1
      setPhrases([
        ...phrases,
        {
          id: newId,
          text: newPhrase,
          category: selectedCategory === "all" ? "general" : selectedCategory,
          used: 0,
        },
      ])
      setNewPhrase("")
    }
  }

  const deletePhrase = (id: number) => {
    setPhrases(phrases.filter((phrase) => phrase.id !== id))
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Soundboard</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: isEditing ? colors.primary : "transparent", borderColor: colors.border },
            ]}
            onPress={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <Text style={{ color: isEditing ? "#FFFFFF" : colors.text }}>Done</Text>
            ) : (
              <Edit size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Add New Phrase */}
        {isEditing && (
          <Card style={styles.addPhraseCard}>
            <View style={styles.addPhraseContainer}>
              <TextInput
                style={[styles.addPhraseInput, { color: colors.text, borderColor: colors.border }]}
                value={newPhrase}
                onChangeText={setNewPhrase}
                placeholder="Add new phrase..."
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={addPhrase}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Categories */}
        <Card style={styles.categoriesCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selectedCategory === category.id ? colors.primary : "transparent",
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    style={[styles.categoryText, { color: selectedCategory === category.id ? "#FFFFFF" : colors.text }]}
                  >
                    {category.name}
                  </Text>
                  <Badge
                    text={category.count.toString()}
                    variant={selectedCategory === category.id ? "light" : "secondary"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card>

        {/* Phrases */}
        <View style={styles.phrasesContainer}>
          {filteredPhrases.map((phrase) => (
            <Card key={phrase.id} style={styles.phraseCard}>
              <View style={styles.phraseContent}>
                <View style={styles.phraseTextContainer}>
                  <Text style={[styles.phraseText, { color: colors.text }]}>{phrase.text}</Text>
                  <View style={styles.phraseMetaContainer}>
                    <Badge text={phrase.category} variant="outline" />
                    <Text style={[styles.usageText, { color: colors.textSecondary }]}>Used {phrase.used} times</Text>
                  </View>
                </View>
                <View style={styles.phraseActions}>
                  {isEditing && (
                    <TouchableOpacity onPress={() => deletePhrase(phrase.id)}>
                      <Trash2 size={20} color={colors.error} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.playButton, { borderColor: colors.border }]}
                    onPress={() => playPhrase(phrase.text)}
                  >
                    <Volume2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Stats */}
        <Card style={[styles.statsCard, { backgroundColor: colors.primaryLight }]}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{phrases.length}</Text>
              <Text style={[styles.statLabel, { color: colors.primary }]}>Total Phrases</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {phrases.reduce((sum, p) => sum + p.used, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.primary }]}>Times Used</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {Math.round(phrases.reduce((sum, p) => sum + p.used, 0) / phrases.length) || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.primary }]}>Avg. Usage</Text>
            </View>
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  addPhraseCard: {
    padding: 16,
  },
  addPhraseContainer: {
    flexDirection: "row",
    gap: 8,
  },
  addPhraseInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesCard: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  categoriesScroll: {
    marginHorizontal: -8,
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  phrasesContainer: {
    gap: 12,
  },
  phraseCard: {
    padding: 16,
  },
  phraseContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  phraseTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  phraseText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  phraseMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  usageText: {
    fontSize: 12,
  },
  phraseActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsCard: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
})
