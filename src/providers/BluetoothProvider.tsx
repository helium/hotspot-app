import React, { createContext, ReactNode, useContext } from 'react'
import { State } from 'react-native-ble-plx'
import useBluetooth from '../utils/useBluetooth'

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => {},
  scan: async () => {},
  connect: async () => undefined,
  getAddress: async () => '',
  discoverAllServicesAndCharacteristics: async () => undefined,
  getServiceCharacteristics: async () => undefined,
  findAndReadCharacteristic: () => undefined,
}

const BleContext = createContext<ReturnType<typeof useBluetooth>>(initialState)
const { Provider } = BleContext

const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useBluetooth()}>{children}</Provider>
}

export const useBluetoothContext = () => useContext(BleContext)

export default BluetoothProvider
