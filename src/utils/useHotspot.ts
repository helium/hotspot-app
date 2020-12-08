import { useState } from 'react'
import { Device } from 'react-native-ble-plx'
import validator from 'validator'
import { useBluetoothContext } from '../providers/BluetoothProvider'
import {
  WIFI_SSID_UUID,
  ONBOARDING_KEY_UUID,
  PUBKEY_UUID,
} from './useBluetooth'
import { getStaking } from './stakingClient'

export type HotspotDetails = {
  mac: string | undefined
  address: string | undefined
  wifi: string | undefined
  type: HotspotType
  name: HotspotName
  freeAddHotspot?: boolean
  onboardingAddress?: string
}
export type HotspotType = 'Helium' | 'RAK'
export type HotspotName = 'RAK Hotspot Miner' | 'Helium Hotspot'
type HotspotStaking = {
  batch: string
  helium_serial: string
  id: number
  mac_eth0: string
  mac_wlan0: string
  onboarding_address: string
  public_address: string
  rpi_serial: string
}

const useHotspot = () => {
  const {
    getState,
    enable,
    scan,
    connect,
    discoverAllServicesAndCharacteristics,
    getServiceCharacteristics,
    findAndReadCharacteristic,
  } = useBluetoothContext()
  const [availableHotspots, setAvailableHotspots] = useState<
    Record<string, Device>
  >({})
  const [connectedHotspot, setConnectedHotspot] = useState<Device | undefined>()
  const [hotspotDetails, setHotspotDetails] = useState<
    HotspotDetails | undefined
  >()

  // helium hotspot uses b58 onboarding address and RAK is uuid v4
  const getHotspotType = (onboardingAddress: string): HotspotType =>
    validator.isUUID(addUuidDashes(onboardingAddress)) ? 'RAK' : 'Helium'

  const addUuidDashes = (s = '') =>
    `${s.substr(0, 8)}-${s.substr(8, 4)}-${s.substr(12, 4)}-${s.substr(
      16,
      4,
    )}-${s.substr(20)}`

  const getHotspotName = (type: HotspotType): HotspotName => {
    switch (type) {
      case 'RAK':
        return 'RAK Hotspot Miner'
      default:
      case 'Helium':
        return 'Helium Hotspot'
    }
  }

  const scanForHotspots = async (ms: number) => {
    setAvailableHotspots({})
    await scan(ms, (hotspotDevice) =>
      setAvailableHotspots((hotspots) => ({
        ...hotspots,
        [hotspotDevice.id]: hotspotDevice,
      })),
    )
  }

  const connectAndConfigHotspot = async (hotspotDevice: Device) => {
    const connectedDevice = await connect(hotspotDevice)
    if (!connectedDevice) return

    const deviceWithServices = await discoverAllServicesAndCharacteristics(
      connectedDevice,
    )
    if (!deviceWithServices) return

    setConnectedHotspot(deviceWithServices)

    const serviceCharacteristics = await getServiceCharacteristics(
      deviceWithServices,
    )
    if (!serviceCharacteristics) return

    const wifi = await findAndReadCharacteristic(
      WIFI_SSID_UUID,
      serviceCharacteristics,
    )

    const address = await findAndReadCharacteristic(
      PUBKEY_UUID,
      serviceCharacteristics,
    )

    const onboardingAddress = await findAndReadCharacteristic(
      ONBOARDING_KEY_UUID,
      serviceCharacteristics,
    )

    if (!onboardingAddress) return

    const type = getHotspotType(onboardingAddress)
    const name = getHotspotName(type)
    const mac = hotspotDevice.localName?.slice(15)

    if (onboardingAddress.length < 20) {
      // Logger.sendError(
      //   new Error(`Invalid onboarding address: ${onboardingAddress}`),
      // )
    }

    const freeAddHotspot = !!((await getStaking(
      `hotspots/${onboardingAddress}`,
    )) as HotspotStaking)

    const details = {
      address,
      mac,
      type,
      name,
      wifi,
      freeAddHotspot,
      onboardingAddress,
    }
    setHotspotDetails(details)
  }

  return {
    getState,
    enable,
    scanForHotspots,
    connectAndConfigHotspot,
    availableHotspots,
    connectedHotspot,
    hotspotDetails,
  }
}

export default useHotspot
