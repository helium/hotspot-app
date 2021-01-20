import React, { createContext, ReactNode, useContext } from 'react'
import { State } from 'react-native-ble-plx'
import useHotspot from '../utils/useHotspot'

// {"31D15CD5-2508-0949-B731-BB6B6180FCCC": {"_manager": {"_activePromises": [Object], "_activeSubscriptions": [Object], "_errorCodesToMessagesMapping": [Object], "_eventEmitter": [NativeEventEmitter], "_scanEventSubscription": null, "_uniqueId": 1}, "id": "31D15CD5-2508-0949-B731-BB6B6180FCCC", "isConnectable": true, "localName": "Helium Hotspot A15B", "manufacturerData": null, "mtu": 23, "name": "Helium Hotspot", "overflowServiceUUIDs": null, "rssi": -60, "serviceData": null, "serviceUUIDs": ["0fda92b2-44a2-4af2-84f5-fa682baa2b8d"], "solicitedServiceUUIDs": null, "txPowerLevel": null}}

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => {},
  scanForHotspots: async () => {},
  getDiagnosticInfo: async () => undefined,
  connectAndConfigHotspot: async () => {},
  availableHotspots: {},
  scanForWifiNetworks: async () => undefined,
  removeConfiguredWifi: async () => undefined,
  setWifiCredentials: async () => undefined,
  checkFirmwareCurrent: async () => undefined,
  updateHotspotStatus: async () => undefined,
  addGatewayTxn: async () => false,
  loadLocationFeeData: async () => ({
    isFree: false,
    hasSufficientBalance: false,
    totalStakingAmount: 0,
  }),
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
