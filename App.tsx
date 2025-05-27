import { StatusBar, LogBox } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AppProvider } from "./src/context/AppContext"
import MainNavigator from "./src/navigation/MainNavigator"

// Ignore specific warnings
LogBox.ignoreLogs(["new NativeEventEmitter"])

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <MainNavigator />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
