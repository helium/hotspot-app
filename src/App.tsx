import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationRoot from './navigation/NavigationRoot';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationRoot />
    </SafeAreaProvider>
  );
};

export default App;
