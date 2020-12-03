import { BleManager } from 'react-native-ble-plx'

// This hook is being provided via the context api. Don't use it directly.
const useBluetooth = () => {
  const manager = new BleManager()

  const getState = async () => manager.state()

  const enable = async () => {
    manager.enable()
  }

  return { getState, enable }
}

export default useBluetooth
