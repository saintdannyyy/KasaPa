"use client"

import { useState } from "react"
import { Phone, Settings, MessageSquare, History, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [currentCall, setCurrentCall] = useState<string | null>(null)

  const dialNumber = (digit: string) => {
    if (digit === "clear") {
      setPhoneNumber("")
    } else if (digit === "call") {
      if (phoneNumber) {
        setCurrentCall(phoneNumber)
      }
    } else {
      setPhoneNumber((prev) => prev + digit)
    }
  }

  const quickPhrases = ["Hello, how are you?", "Thank you", "I need help", "Can you repeat that?", "Goodbye"]

  if (currentCall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Active Call</CardTitle>
              <p className="text-lg font-mono">{currentCall}</p>
              <Badge variant="secondary" className="w-fit mx-auto">
                Connected • 00:45
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Status */}
              <div className="text-center">
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                    isListening ? "bg-red-100 animate-pulse" : "bg-gray-100"
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-8 h-8 text-red-600" />
                  ) : (
                    <MicOff className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{isListening ? "Listening..." : "Tap to speak"}</p>
              </div>

              {/* Live Transcription */}
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Your Speech:</p>
                  <p className="text-blue-700">
                    {isListening ? "Hello, I would like to..." : "Tap microphone to start speaking"}
                  </p>
                </CardContent>
              </Card>

              {/* Enhanced Output */}
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-green-800 mb-2">Enhanced Voice Output:</p>
                  <p className="text-green-700">"Hello, I would like to schedule an appointment."</p>
                </CardContent>
              </Card>

              {/* Quick Phrases */}
              <div>
                <p className="text-sm font-medium mb-2">Quick Phrases:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPhrases.slice(0, 4).map((phrase, index) => (
                    <Button key={index} variant="outline" size="sm" className="text-xs h-auto py-2 px-3">
                      {phrase}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={() => setIsListening(!isListening)}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={() => setCurrentCall(null)}
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Voice Proxy</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <History className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Phone Number Display */}
        <Card>
          <CardContent className="p-6">
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="text-center text-xl font-mono"
              readOnly
            />
          </CardContent>
        </Card>

        {/* Dialer */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                ["*", "0", "#"],
              ].map((row, rowIndex) =>
                row.map((digit, colIndex) => (
                  <Button
                    key={`${rowIndex}-${colIndex}`}
                    variant="outline"
                    size="lg"
                    className="h-16 text-xl font-semibold"
                    onClick={() => dialNumber(digit)}
                  >
                    {digit}
                  </Button>
                )),
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => dialNumber("clear")}>
                Clear
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => dialNumber("call")}
                disabled={!phoneNumber}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-5 h-5 mr-3" />
              Soundboard & Phrases
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mic className="w-5 h-5 mr-3" />
              Voice Training
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-5 h-5 mr-3" />
              Voice Settings
            </Button>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-800">Voice Proxy Ready</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Your proxy number: +1 (555) 123-4567</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
