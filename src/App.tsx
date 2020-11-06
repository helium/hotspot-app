import 'react-native-gesture-handler'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@shopify/restyle'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationRoot />
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

export default App
