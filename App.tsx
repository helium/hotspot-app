import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

const App = () => {
  return (
    <SafeAreaView>
      <Text style={styles.welcome}>Helium App</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
  },
});

export default App;
