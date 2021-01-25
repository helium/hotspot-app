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
  HotspotSetupPickWifiScreen: {
    networks: string[]
    connectedNetworks: string[]
  }
  HotspotSetupWifiScreen: { network: string }
  HotspotSetupWifiConnectingScreen: { network: string; password: string }
  HotspotSetupLocationInfoScreen: undefined
  HotspotLocationFeeScreen: undefined
  FirmwareUpdateNeededScreen: undefined
  HotspotSetupPickLocationScreen: undefined
  HotspotTxnsProgressScreen: undefined
}

export type HotspotSetupNavigationProp = StackNavigationProp<HotspotSetupStackParamList>
