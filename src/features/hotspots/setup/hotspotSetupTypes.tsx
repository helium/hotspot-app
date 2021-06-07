import { StackNavigationProp } from '@react-navigation/stack'
import { HotspotType } from '../../../makers'
import { HotspotConnectStatus } from '../../../utils/useHotspot'

export type HotspotSetupStackParamList = {
  HotspotSetupSelectionScreen: undefined
  HotspotSetupEducationScreen: { hotspotType: HotspotType }
  HotspotSetupDiagnosticsScreen: { hotspotType: HotspotType }
  HotspotSetupPowerScreen: { hotspotType: HotspotType }
  HotspotSetupBluetoothInfoScreen: { hotspotType: HotspotType }
  HotspotSetupScanningScreen: { hotspotType: HotspotType }
  HotspotSetupPickHotspotScreen: { hotspotType: HotspotType }
  HotspotSetupConnectingScreen: { hotspotId: string }
  OnboardingErrorScreen: { connectStatus: HotspotConnectStatus }
  HotspotSetupPickWifiScreen: {
    networks: string[]
    connectedNetworks: string[]
  }
  FirmwareUpdateNeededScreen: undefined
  HotspotSetupWifiScreen: { network: string }
  HotspotSetupWifiConnectingScreen: { network: string; password: string }
  HotspotSetupLocationInfoScreen: undefined
  HotspotSetupPickLocationScreen: undefined
  AntennaSetupScreen: undefined
  HotspotSetupConfirmLocationScreen: undefined
  HotspotSetupSkipLocationScreen: undefined
  HotspotTxnsProgressScreen: undefined
  NotHotspotOwnerErrorScreen: undefined
  OwnedHotspotErrorScreen: undefined
}

export type HotspotSetupNavigationProp = StackNavigationProp<HotspotSetupStackParamList>
