import { StackNavigationProp } from '@react-navigation/stack'
import { HotspotType } from '../../../utils/hotspot'

export type HotspotSetupStackParamList = {
  HotspotSetupSelectionScreen: undefined
  HotspotSetupEducationScreen: { hotspotType: HotspotType }
  HotspotSetupDiagnosticsScreen: { hotspotType: HotspotType }
  HotspotSetupPowerScreen: { hotspotType: HotspotType }
  HotspotSetupPairingScreen: { hotspotType: HotspotType }
  HotspotScanningScreen: { hotspotType: HotspotType }
  HotspotSetupBluetoothScreen: { hotspotType: HotspotType }
}

export type HotspotSetupNavigationProp = StackNavigationProp<
  HotspotSetupStackParamList
>
