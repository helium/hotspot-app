import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import Onboarding from '../onboarding/OnboardingNavigator';
import SplashScreen from '../splash/SplashScreen';

const RootStack = createStackNavigator();

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const NavigationRoot = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1500);
  }, []);

  const currentScreen = useCallback(() => {
    if (showSplash)
      return <RootStack.Screen name="Splash" component={SplashScreen} />;

    return <RootStack.Screen name="Onboarding" component={Onboarding} />;
  }, [showSplash]);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyleInterpolator: forFade,
        }}
      >
        {currentScreen()}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationRoot;
