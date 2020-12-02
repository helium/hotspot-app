import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HotspotSetupSelectionScreen from './HotspotSelectionScreen'
import HotspotSetupEducationScreen from './HotspotSetupEducationScreen'
import HotspotSetupDiagnosticsScreen from './HotspotSetupDiagnosticsScreen'
import HotspotSetupPowerScreen from './HotspotSetupPowerScreen'

const HotspotSetupStack = createStackNavigator()

const HotspotSetup = () => {
  return (
    <HotspotSetupStack.Navigator headerMode="none">
      <HotspotSetupStack.Screen
        name="HotspotSetupSelectionScreen"
        component={HotspotSetupSelectionScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupEducationScreen"
        component={HotspotSetupEducationScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupDiagnosticsScreen"
        component={HotspotSetupDiagnosticsScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupPowerScreen"
        component={HotspotSetupPowerScreen}
      />
    </HotspotSetupStack.Navigator>
  )
}

export default HotspotSetup
