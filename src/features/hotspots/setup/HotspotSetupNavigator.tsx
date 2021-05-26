import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HotspotSetupSelectionScreen from './HotspotSetupSelectionScreen'
import HotspotSetupEducationScreen from './HotspotSetupEducationScreen'
import HotspotSetupDiagnosticsScreen from './HotspotSetupDiagnosticsScreen'
import HotspotSetupPowerScreen from './HotspotSetupPowerScreen'
import HotspotSetupBluetoothInfoScreen from './HotspotSetupBluetoothInfoScreen'
import HotspotSetupScanningScreen from './HotspotSetupScanningScreen'
import HotspotSetupPickHotspotScreen from './HotspotSetupPickHotspotScreen'
import HotspotSetupConnectingScreen from './HotspotSetupConnectingScreen'
import HotspotSetupWifiScreen from './HotspotSetupWifiScreen'
import defaultScreenOptions from '../../../navigation/defaultScreenOptions'
import HotspotSetupLocationInfoScreen from './HotspotSetupLocationInfoScreen'
import FirmwareUpdateNeededScreen from './FirmwareUpdateNeededScreen'
import HotspotSetupPickLocationScreen from './HotspotSetupPickLocationScreen'
import HotspotTxnsProgressScreen from './HotspotTxnsProgressScreen'
import HotspotSetupWifiConnectingScreen from './HotspotSetupWifiConnectingScreen'
import HotspotSetupConfirmLocationScreen from './HotspotSetupConfirmLocationScreen'
import HotspotSetupPickWifiScreen from './HotspotSetupPickWifiScreen'
import OnboardingErrorScreen from './OnboardingErrorScreen'
import HotspotSetupSkipLocationScreen from './HotspotSetupSkipLocationScreen'
import NotHotspotOwnerError from './NotHotspotOwnerError'
import OwnedHotspotError from './OwnedHotspotError'
import AntennaSetupScreen from './AntennaSetupScreen'
import HotspotSetupScanQrScreen from './HotspotSetupScanQrScreen'
import HotspotSetupQrConfirmScreen from './HotspotSetupQrConfirmScreen'

const HotspotSetupStack = createStackNavigator()

const HotspotSetup = () => {
  return (
    <HotspotSetupStack.Navigator
      headerMode="none"
      screenOptions={{ ...defaultScreenOptions, gestureEnabled: false }}
    >
      <HotspotSetupStack.Screen
        name="HotspotSetupSelectionScreen"
        component={HotspotSetupSelectionScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupEducationScreen"
        component={HotspotSetupEducationScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupScanQrScreen"
        component={HotspotSetupScanQrScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupQrConfirmScreen"
        component={HotspotSetupQrConfirmScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupDiagnosticsScreen"
        component={HotspotSetupDiagnosticsScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupPowerScreen"
        component={HotspotSetupPowerScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupBluetoothInfoScreen"
        component={HotspotSetupBluetoothInfoScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupScanningScreen"
        component={HotspotSetupScanningScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupPickHotspotScreen"
        component={HotspotSetupPickHotspotScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupConnectingScreen"
        component={HotspotSetupConnectingScreen}
      />
      <HotspotSetupStack.Screen
        name="OnboardingErrorScreen"
        component={OnboardingErrorScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupPickWifiScreen"
        component={HotspotSetupPickWifiScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupWifiScreen"
        component={HotspotSetupWifiScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupWifiConnectingScreen"
        component={HotspotSetupWifiConnectingScreen}
      />
      <HotspotSetupStack.Screen
        name="FirmwareUpdateNeededScreen"
        component={FirmwareUpdateNeededScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupLocationInfoScreen"
        component={HotspotSetupLocationInfoScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupPickLocationScreen"
        component={HotspotSetupPickLocationScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupConfirmLocationScreen"
        component={HotspotSetupConfirmLocationScreen}
      />
      <HotspotSetupStack.Screen
        name="AntennaSetupScreen"
        component={AntennaSetupScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupSkipLocationScreen"
        component={HotspotSetupSkipLocationScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotTxnsProgressScreen"
        component={HotspotTxnsProgressScreen}
        options={{ gestureEnabled: false }}
      />
      <HotspotSetupStack.Screen
        name="NotHotspotOwnerErrorScreen"
        component={NotHotspotOwnerError}
      />
      <HotspotSetupStack.Screen
        name="OwnedHotspotErrorScreen"
        component={OwnedHotspotError}
      />
    </HotspotSetupStack.Navigator>
  )
}

export default HotspotSetup
