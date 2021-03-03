import { StackNavigationProp } from '@react-navigation/stack'
import { HotspotType } from '../../../store/connectedHotspot/connectedHotspotSlice'

export type HotspotSetupStackParamList = {
  HotspotSetupSelectionScreen: undefined
  HotspotSetupEducationScreen: { hotspotType: HotspotType }
  HotspotSetupDiagnosticsScreen: { hotspotType: HotspotType }
  HotspotSetupPowerScreen: { hotspotType: HotspotType }
  HotspotSetupBluetoothInfoScreen: { hotspotType: HotspotType }
  HotspotSetupScanningScreen: { hotspotType: HotspotType }
  HotspotSetupPickHotspotScreen: { hotspotType: HotspotType }
  HotspotSetupConnectingScreen: { hotspotId: string }
  OnboardingErrorScreen: undefined
  HotspotSetupPickWifiScreen: {
    networks: string[]
    connectedNetworks: string[]
  }
  FirmwareUpdateNeededScreen: undefined
  HotspotSetupWifiScreen: { network: string }
  HotspotSetupWifiConnectingScreen: { network: string; password: string }
  HotspotSetupLocationInfoScreen: undefined
  HotspotSetupPickLocationScreen: undefined
  HotspotSetupConfirmLocationScreen: {
    hotspotCoords: number[]
    locationName: string
  }
  HotspotTxnsProgressScreen: {
    hotspotCoords: number[]
  }
  NotHotspotOwnerErrorScreen: undefined
  OwnedHotspotErrorScreen: undefined
}

export type HotspotSetupNavigationProp = StackNavigationProp<HotspotSetupStackParamList>
