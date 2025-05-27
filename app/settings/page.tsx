"use client"

import { useState } from "react"
import { ArrowLeft, Volume2, Mic, Globe, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SettingsPage() {
  const [speechRate, setSpeechRate] = useState([1.0])
  const [voicePitch, setVoicePitch] = useState([1.0])
  const [privacyMode, setPrivacyMode] = useState(false)
  const [autoTranscribe, setAutoTranscribe] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Voice Output</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Voice Type</Label>
              <Select defaultValue="female-natural">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female-natural">Female - Natural</SelectItem>
                  <SelectItem value="male-natural">Male - Natural</SelectItem>
                  <SelectItem value="female-warm">Female - Warm</SelectItem>
                  <SelectItem value="male-professional">Male - Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Speech Rate</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow</span>
                  <span>{speechRate[0].toFixed(1)}x</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Voice Pitch</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={voicePitch}
                  onValueChange={setVoicePitch}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Lower</span>
                  <span>{voicePitch[0].toFixed(1)}x</span>
                  <span>Higher</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Volume2 className="w-4 h-4 mr-2" />
              Test Voice
            </Button>
          </CardContent>
        </Card>

        {/* Speech Recognition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>Speech Recognition</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Primary Language</Label>
              <Select defaultValue="en-US">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="tw">Twi</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Auto-transcribe incoming calls</Label>
              <Switch checked={autoTranscribe} onCheckedChange={setAutoTranscribe} />
            </div>

            <Button variant="outline" className="w-full">
              <Mic className="w-4 h-4 mr-2" />
              Train Voice Recognition
            </Button>
          </CardContent>
        </Card>

        {/* Language & Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Language & Accessibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">App Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="tw">Twi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Text Size</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy & Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Privacy Mode</Label>
                <p className="text-xs text-gray-500">Don't store transcriptions</p>
              </div>
              <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
            </div>

            <Button variant="outline" className="w-full">
              Clear All Data
            </Button>

            <Button variant="outline" className="w-full">
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardContent className="p-4 text-center text-sm text-gray-600">
            <p>Voice Proxy Assistant v1.0.0</p>
            <p className="mt-1">Empowering communication for everyone</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
