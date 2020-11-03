import React from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeScreenNavigationProp } from '../onboardingTypes';

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <Text>Welcome</Text>
      <Button
        title="Create an Account"
        onPress={() => navigation.push('AccountDescription')}
      />
    </SafeAreaView>
  );
};

export default WelcomeScreen;
