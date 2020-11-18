import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@shopify/restyle'
import { Platform, StatusBar } from 'react-native'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'

const App = () => {
  useEffect(() => {
    OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        {/* Will need to adapt status bar for light/dark modes */}
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        {Platform.OS === 'android' && (
          <StatusBar translucent backgroundColor="transparent" />
        )}
        <NavigationRoot />
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

export default App
