import { StackNavigationProp } from '@react-navigation/stack'
import { HotspotType } from '../../../makers'
import { HotspotConnectStatus } from '../../../utils/useHotspot'

export type HotspotSetupStackParamList = {
  HotspotSetupSelectionScreen: undefined
  HotspotSetupEducationScreen: { hotspotType: HotspotType }
  HotspotSetupScanQrScreen: undefined
  HotspotSetupQrConfirmScreen: {
    addGatewayTxn: string
  }
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
  HotspotSetupLocationInfoScreen:
    | { addGatewayTxn: string; hotspotAddress: string }
    | undefined
  HotspotSetupPickLocationScreen:
    | { addGatewayTxn: string; hotspotAddress: string }
    | undefined
  AntennaSetupScreen:
    | { addGatewayTxn: string; hotspotAddress: string }
    | undefined
  HotspotSetupConfirmLocationScreen:
    | { addGatewayTxn: string; hotspotAddress: string }
    | undefined
  HotspotSetupSkipLocationScreen:
    | { addGatewayTxn: string; hotspotAddress: string }
    | undefined
  HotspotTxnsProgressScreen:
    | { addGatewayTxn: string; hotspotAddress: string }
    | undefined
  NotHotspotOwnerErrorScreen: undefined
  OwnedHotspotErrorScreen: undefined
}

export type HotspotSetupNavigationProp = StackNavigationProp<HotspotSetupStackParamList>
