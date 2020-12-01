import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HotspotSetupScreen from './HotspotSetupScreen'

const HotspotSetupStack = createStackNavigator()

const HotspotSetup = () => {
  return (
    <HotspotSetupStack.Navigator headerMode="none">
      <HotspotSetupStack.Screen
        name="HotspotSetupSetupScreen"
        component={HotspotSetupScreen}
      />
    </HotspotSetupStack.Navigator>
  )
}

export default HotspotSetup
