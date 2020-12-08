import React, { createContext, ReactNode, useContext } from 'react'
import { State } from 'react-native-ble-plx'
import useHotspot from '../utils/useHotspot'

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => {},
  scanForHotspots: async () => {},
  connectAndConfigHotspot: async () => {},
  hotspotDetails: undefined,
  connectedHotspot: undefined,
  availableHotspots: {},
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
