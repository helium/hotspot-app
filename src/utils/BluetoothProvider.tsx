import React, { createContext, ReactNode, useContext } from 'react'
import { State } from 'react-native-ble-plx'
import useBluetooth from './bluetooth/useBluetooth'

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => {},
  scanForHotspots: async () => {},
}

const BleContext = createContext<ReturnType<typeof useBluetooth>>(initialState)
const { Provider } = BleContext

const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useBluetooth()}>{children}</Provider>
}

export const useBluetoothContext = () => useContext(BleContext)

export default BluetoothProvider
