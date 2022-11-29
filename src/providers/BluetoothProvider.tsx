import React, { createContext, ReactNode, useContext } from 'react'
import useBluetooth from '../utils/bluetooth/useBluetooth'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const BleContext = createContext<ReturnType<typeof useBluetooth>>({})
const { Provider } = BleContext

const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useBluetooth()}>{children}</Provider>
}

export const useBluetoothContext = () => useContext(BleContext)

export default BluetoothProvider
