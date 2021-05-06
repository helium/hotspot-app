import React, { createContext, ReactNode, useContext } from 'react'
import { State } from 'react-native-ble-plx'
import useHotspot, { HotspotConnectStatus } from '../utils/useHotspot'

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => {},
  scanForHotspots: async () => {},
  getDiagnosticInfo: async () => undefined,
  connectAndConfigHotspot: async () => 'success' as HotspotConnectStatus,
  availableHotspots: {},
  scanForWifiNetworks: async () => undefined,
  removeConfiguredWifi: async () => undefined,
  setWifiCredentials: async () => undefined,
  checkFirmwareCurrent: async () => false,
  addGatewayTxn: async () => false,
}

const ConnectedHotspotContext = createContext<ReturnType<typeof useHotspot>>(
  initialState,
)
const { Provider } = ConnectedHotspotContext

const ConnectedHotspotProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useHotspot()}>{children}</Provider>
}

export const useConnectedHotspotContext = () =>
  useContext(ConnectedHotspotContext)

export default ConnectedHotspotProvider
