import { useRef } from 'react'
import { BleManager, Characteristic, Device } from 'react-native-ble-plx'
import { fromBs64 } from './base64'
import sleep from './sleep'

const SERVICE_UUID = '0fda92b2-44a2-4af2-84f5-fa682baa2b8d'
export const WIFI_SSID_UUID = '7731de63-bc6a-4100-8ab1-89b2356b038b'
export const PUBKEY_UUID = '0a852c59-50d3-4492-bfd3-22fe58a24f01'
export const ONBOARDING_KEY_UUID = 'd083b2bd-be16-4600-b397-61512ca2f5ad'

export type HotspotCharacteristic =
  | typeof PUBKEY_UUID
  | typeof ONBOARDING_KEY_UUID
  | typeof WIFI_SSID_UUID

const useBluetooth = () => {
  const instanceRef = useRef<BleManager | null>(null)

  function getBleManager() {
    const instance = instanceRef.current
    if (instance !== null) {
      return instance
    }
    const newInstance = new BleManager()
    instanceRef.current = newInstance
    return newInstance
  }

  const getState = async () => getBleManager().state()

  const enable = async () => {
    getBleManager().enable()
  }

  const connect = async (hotspotDevice: Device): Promise<Device | undefined> =>
    hotspotDevice.connect({
      refreshGatt: 'OnConnected',
    })

  const scan = async (ms: number, callback: (device: Device) => void) => {
    getBleManager().startDeviceScan(
      [SERVICE_UUID],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          // Logger.sendError(error)
          return
        }

        if (device?.localName) {
          callback(device)
        }
      },
    )

    await sleep(ms)

    getBleManager().stopDeviceScan()
  }

  const readCharacteristic = async (
    hotspotDevice: Device,
    uuid: HotspotCharacteristic,
    tries = 1,
  ): Promise<string | undefined> => {
    const characteristics = await hotspotDevice.characteristicsForService(
      SERVICE_UUID,
    )
    const characteristic = characteristics.find((c) => c.uuid === uuid)
    if (!characteristic) return

    const { value } = await characteristic.read()
    if (!value) return

    const parsedValue = fromBs64(value)

    if (parsedValue === 'wait') {
      if (tries - 1 === 0) {
        // Logger.sendError(
        //   new Error(`Got wait from hotspot: parsedValue = ${parsedValue}`),
        // )
        return parsedValue
      }

      await sleep(1000)
      return readCharacteristic(hotspotDevice, uuid, tries - 1)
    }

    return parsedValue
  }

  const getAddress = async (hotspotDevice: Device) =>
    readCharacteristic(hotspotDevice, PUBKEY_UUID, 3)

  const discoverAllServicesAndCharacteristics = async (
    hotspotDevice: Device,
  ): Promise<Device | undefined> =>
    hotspotDevice.discoverAllServicesAndCharacteristics()

  const getServiceCharacteristics = async (
    hotspotDevice: Device,
  ): Promise<Characteristic[] | undefined> =>
    hotspotDevice.characteristicsForService(SERVICE_UUID)

  const findAndReadCharacteristic = (
    characteristic: HotspotCharacteristic,
    characteristics: Characteristic[],
  ): Promise<Characteristic> | undefined => {
    const found = characteristics.find((c) => c.uuid === characteristic)
    if (!found) return

    return found.read()
  }

  return {
    getState,
    enable,
    scan,
    connect,
    getAddress,
    discoverAllServicesAndCharacteristics,
    getServiceCharacteristics,
    findAndReadCharacteristic,
  }
}

export default useBluetooth
