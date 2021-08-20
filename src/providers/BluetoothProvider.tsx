import React, { createContext, ReactNode, useContext } from 'react'
import { BleManager, Characteristic, State } from 'react-native-ble-plx'
import useBluetooth from '../utils/bluetooth/useBluetooth'

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => new Promise<BleManager>((resolve) => resolve()),
  scan: async () => {},
  connect: async () => undefined,
  disconnect: async () => undefined,
  discoverAllServicesAndCharacteristics: async () => undefined,
  findAndReadCharacteristic: () =>
    new Promise<undefined>((resolve) => resolve()),
  findAndWriteCharacteristic: () =>
    new Promise<undefined>((resolve) => resolve()),
  readCharacteristic: () => new Promise<Characteristic>((resolve) => resolve()),
  writeCharacteristic: () =>
    new Promise<Characteristic>((resolve) => resolve()),
  findCharacteristic: async () => undefined,
}

const BleContext = createContext<ReturnType<typeof useBluetooth>>(initialState)
const { Provider } = BleContext

const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useBluetooth()}>{children}</Provider>
}

export const useBluetoothContext = () => useContext(BleContext)

export default BluetoothProvider
