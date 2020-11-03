import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@shopify/restyle';
import { Switch } from 'react-native';
import { theme, darkTheme } from './theme/theme';
import NavigationRoot from './navigation/NavigationRoot';
import Box from './components/Box';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <SafeAreaProvider>
        <NavigationRoot />
        <Box backgroundColor="mainBackground" padding="m">
          <Switch
            value={darkMode}
            onValueChange={(value: boolean) => setDarkMode(value)}
          />
        </Box>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
