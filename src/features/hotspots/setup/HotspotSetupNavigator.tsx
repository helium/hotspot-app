import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HotspotSetupSelectionScreen from './HotspotSelectionScreen'
import HotspotSetupEducationScreen from './HotspotSetupEducationScreen'
import HotspotSetupDiagnosticsScreen from './HotspotSetupDiagnosticsScreen'
import HotspotSetupPowerScreen from './HotspotSetupPowerScreen'
import HotspotSetupPairingScreen from './HotspotSetupPairingScreen'
import HotspotScanningScreen from './HotspotScanningScreen'
import HotspotSetupBluetoothScreen from './HotspotSetupBluetoothScreen'
import HotspotSetupScanWifiScreen from './HotspotSetupScanWifiScreen'
import HotspotSetupWifiScreen from './HotspotSetupWifiScreen'
import HotspotEthernetScreen from './HotspotEthernetScreen'
import defaultScreenOptions from '../../../navigation/defaultScreenOptions'
import HotspotGenesisScreen from './HotspotGenesisScreen'
import HotspotSetupAddTxnScreen from './HotspotSetupAddTxnScreen'
import EnableLocationScreen from './EnableLocationScreen'
import HotspotLocationFeeScreen from './HotspotLocationFeeScreen'
import FirmwareUpdateNeededScreen from './FirmwareUpdateNeededScreen'
import ConfirmLocationScreen from './ConfirmLocationScreen'
import HotspotTxnsProgressScreen from './HotspotTxnsProgressScreen'

const HotspotSetupStack = createStackNavigator()

const HotspotSetup = () => {
  return (
    <HotspotSetupStack.Navigator
      headerMode="none"
      screenOptions={defaultScreenOptions}
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
        name="HotspotSetupDiagnosticsScreen"
        component={HotspotSetupDiagnosticsScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupPowerScreen"
        component={HotspotSetupPowerScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupPairingScreen"
        component={HotspotSetupPairingScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotScanningScreen"
        component={HotspotScanningScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupBluetoothScreen"
        component={HotspotSetupBluetoothScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupScanWifiScreen"
        component={HotspotSetupScanWifiScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupWifiScreen"
        component={HotspotSetupWifiScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotEthernetScreen"
        component={HotspotEthernetScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotGenesisScreen"
        component={HotspotGenesisScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotSetupAddTxnScreen"
        component={HotspotSetupAddTxnScreen}
      />
      <HotspotSetupStack.Screen
        name="EnableLocationScreen"
        component={EnableLocationScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotLocationFeeScreen"
        component={HotspotLocationFeeScreen}
      />
      <HotspotSetupStack.Screen
        name="FirmwareUpdateNeededScreen"
        component={FirmwareUpdateNeededScreen}
      />
      <HotspotSetupStack.Screen
        name="ConfirmLocationScreen"
        component={ConfirmLocationScreen}
      />
      <HotspotSetupStack.Screen
        name="HotspotTxnsProgressScreen"
        component={HotspotTxnsProgressScreen}
      />
    </HotspotSetupStack.Navigator>
  )
}

export default HotspotSetup
