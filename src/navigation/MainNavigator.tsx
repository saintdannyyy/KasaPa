"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Phone, MessageSquare, Settings, Clock } from "lucide-react-native"
import { useTheme } from "../hooks/useTheme"

// Screens
import DialerScreen from "../screens/DialerScreen"
import ActiveCallScreen from "../screens/ActiveCallScreen"
import SoundboardScreen from "../screens/SoundboardScreen"
import HistoryScreen from "../screens/HistoryScreen"
import SettingsScreen from "../screens/SettingsScreen"
import VoiceTrainingScreen from "../screens/VoiceTrainingScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function DialerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dialer" component={DialerScreen} />
      <Stack.Screen
        name="ActiveCall"
        component={ActiveCallScreen}
        options={{
          gestureEnabled: false,
          animation: "fade",
        }}
      />
    </Stack.Navigator>
  )
}

function SoundboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SoundboardMain" component={SoundboardScreen} />
    </Stack.Navigator>
  )
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryMain" component={HistoryScreen} />
    </Stack.Navigator>
  )
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="VoiceTraining" component={VoiceTrainingScreen} />
    </Stack.Navigator>
  )
}

export default function MainNavigator() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="DialerTab"
        component={DialerStack}
        options={{
          tabBarLabel: "Dialer",
          tabBarIcon: ({ color, size }) => <Phone size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="SoundboardTab"
        component={SoundboardStack}
        options={{
          tabBarLabel: "Phrases",
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStack}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
