import React, {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from 'react'
import { BleManager, Device, State } from 'react-native-ble-plx'
import sleep from './sleep'

const SERVICE_UUID = '0fda92b2-44a2-4af2-84f5-fa682baa2b8d'

const useBluetooth = () => {
  const [availableHotspots, setAvailableHotspots] = useState<
    Record<string, Device>
  >({})
  const [, setConnectedHotspot] = useState<Device | null>(null)

  const [manager, setManager] = useState<BleManager | null>(null)

  const getState = async () => manager?.state()

  const enable = async () => {
    manager?.enable()
  }

  useEffect(() => {
    setManager(new BleManager())
  }, [])

  const scanForHotspots = async (ms: number) => {
    setAvailableHotspots({})
    setConnectedHotspot(null)

    manager?.startDeviceScan(
      [SERVICE_UUID],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          // Logger.sendError(error)
          return
        }

        if (device?.localName) {
          setAvailableHotspots((prev) => ({ ...prev, [device.id]: device }))
        }
      },
    )

    await sleep(ms)

    manager?.stopDeviceScan()
  }

  return { getState, enable, scanForHotspots, availableHotspots }
}

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => {},
  scanForHotspots: async () => {},
  availableHotspots: {},
}

const BleContext = createContext<ReturnType<typeof useBluetooth>>(initialState)
const { Provider } = BleContext

const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useBluetooth()}>{children}</Provider>
}

export const useBluetoothContext = () => useContext(BleContext)

export default BluetoothProvider
