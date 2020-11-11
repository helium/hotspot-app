import 'react-native-gesture-handler'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@shopify/restyle'
import { Platform, StatusBar } from 'react-native'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'

// eslint-disable-next-line @typescript-eslint/no-var-requires
global.Buffer = require('safe-buffer').Buffer

const App = () => {
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
