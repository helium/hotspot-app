import { StackNavigationProp } from '@react-navigation/stack'
import { HotspotType } from '../../../store/connectedHotspot/connectedHotspotSlice'

export type HotspotSetupStackParamList = {
  HotspotSetupSelectionScreen: undefined
  HotspotSetupEducationScreen: { hotspotType: HotspotType }
  HotspotSetupDiagnosticsScreen: { hotspotType: HotspotType }
  HotspotSetupPowerScreen: { hotspotType: HotspotType }
  HotspotSetupPairingScreen: { hotspotType: HotspotType }
  HotspotScanningScreen: { hotspotType: HotspotType }
  HotspotSetupBluetoothScreen: { hotspotType: HotspotType }
  HotspotSetupScanWifiScreen: undefined
  HotspotSetupWifiScreen: { network: string }
  HotspotEthernetScreen: undefined
  HotspotGenesisScreen: undefined
  HotspotSetupAddTxnScreen: undefined
  EnableLocationScreen: undefined
  HotspotLocationFeeScreen: undefined
  FirmwareUpdateNeededScreen: undefined
  ConfirmLocationScreen: undefined
  HotspotTxnsProgressScreen: undefined
}

export type HotspotSetupNavigationProp = StackNavigationProp<HotspotSetupStackParamList>
