import { StackNavigationProp } from '@react-navigation/stack'
import { HotspotType } from '../../../utils/useHotspot'

export type HotspotSetupStackParamList = {
  HotspotSetupSelectionScreen: undefined
  HotspotSetupEducationScreen: { hotspotType: HotspotType }
  HotspotSetupDiagnosticsScreen: { hotspotType: HotspotType }
  HotspotSetupPowerScreen: { hotspotType: HotspotType }
  HotspotSetupPairingScreen: { hotspotType: HotspotType }
  HotspotScanningScreen: { hotspotType: HotspotType }
  HotspotSetupBluetoothScreen: { hotspotType: HotspotType }
  HotspotSetupScanWifiScreen: undefined
}

export type HotspotSetupNavigationProp = StackNavigationProp<
  HotspotSetupStackParamList
>
