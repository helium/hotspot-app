/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { BleManager, Device } from 'react-native-ble-plx'

const SERVICE_UUID = '0fda92b2-44a2-4af2-84f5-fa682baa2b8d'

// Warning: This hook is being provided via the context api. Don't use it directly.
const useBluetooth = () => {
  const [availableHotspots, setAvailableHotspots] = useState<
    Record<string, Device>
  >({})
  const [connectedHotspot, setConnectedHotspot] = useState<Device | null>(null)

  const [manager, setManager] = useState<BleManager | null>(null)

  const getState = async () => manager?.state()

  const enable = async () => {
    manager?.enable()
  }

  useEffect(() => {
    setManager(new BleManager())
  }, [])

  useEffect(() => {
    console.log({ hotspots: Object.keys(availableHotspots) })
    console.log({ connectedHotspot })
  }, [availableHotspots, connectedHotspot])

  const scanForHotspots = async () => {
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

    setTimeout(() => {
      manager?.stopDeviceScan()
    }, 2900)
  }

  return { getState, enable, scanForHotspots }
}

export default useBluetooth
