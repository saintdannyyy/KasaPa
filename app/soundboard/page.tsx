"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Edit, Volume2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function SoundboardPage() {
  const [phrases, setPhrases] = useState([
    { id: 1, text: "Hello, how are you?", category: "greetings", used: 15 },
    { id: 2, text: "Thank you very much", category: "gratitude", used: 8 },
    { id: 3, text: "I need help with something", category: "assistance", used: 12 },
    { id: 4, text: "Can you please repeat that?", category: "clarification", used: 20 },
    { id: 5, text: "I'll call you back later", category: "phone", used: 5 },
    { id: 6, text: "Have a great day!", category: "farewell", used: 10 },
    { id: 7, text: "I'm running late", category: "time", used: 7 },
    { id: 8, text: "What time should we meet?", category: "scheduling", used: 9 },
  ])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isEditing, setIsEditing] = useState(false)

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
    // In real app, this would trigger TTS
    console.log("Playing phrase:", phrase)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Soundboard</h1>
          </div>
          <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Done" : <Edit className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Add New Phrase */}
        {isEditing && (
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-2">
                <Input placeholder="Add new phrase..." className="flex-1" />
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-auto py-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phrases */}
        <div className="space-y-3">
          {filteredPhrases.map((phrase) => (
            <Card key={phrase.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <p className="font-medium text-gray-900">{phrase.text}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {phrase.category}
                      </Badge>
                      <span className="text-xs text-gray-500">Used {phrase.used} times</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing && (
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => playPhrase(phrase.text)}>
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{phrases.length}</p>
                <p className="text-xs text-blue-800">Total Phrases</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{phrases.reduce((sum, p) => sum + p.used, 0)}</p>
                <p className="text-xs text-blue-800">Times Used</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(phrases.reduce((sum, p) => sum + p.used, 0) / phrases.length)}
                </p>
                <p className="text-xs text-blue-800">Avg. Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
