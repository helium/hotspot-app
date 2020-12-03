import { StackNavigationProp } from '@react-navigation/stack'

export type HotspotType = 'Helium' | 'RAK'

export type HotspotSetupStackParamList = {
  HotspotSetupSelectionScreen: undefined
  HotspotSetupEducationScreen: { hotspotType: HotspotType }
  HotspotSetupDiagnosticsScreen: { hotspotType: HotspotType }
  HotspotSetupPowerScreen: { hotspotType: HotspotType }
  HotspotSetupPairingScreen: { hotspotType: HotspotType }
  HotspotScanningScreen: { hotspotType: HotspotType }
}

export type HotspotSetupNavigationProp = StackNavigationProp<
  HotspotSetupStackParamList
>
