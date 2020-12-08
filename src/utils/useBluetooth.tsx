import { useRef } from 'react'
import { BleManager, Characteristic, Device } from 'react-native-ble-plx'
import { decode } from 'base-64'
import sleep from './sleep'

const SERVICE_UUID = '0fda92b2-44a2-4af2-84f5-fa682baa2b8d'
export const WIFI_SSID_UUID = '7731de63-bc6a-4100-8ab1-89b2356b038b'
export const PUBKEY_UUID = '0a852c59-50d3-4492-bfd3-22fe58a24f01'
export const ONBOARDING_KEY_UUID = 'd083b2bd-be16-4600-b397-61512ca2f5ad'
export const AVAILABLE_SSIDS_UUID = 'd7515033-7e7b-45be-803f-c8737b171a29'

export type HotspotCharacteristic =
  | typeof PUBKEY_UUID
  | typeof ONBOARDING_KEY_UUID
  | typeof WIFI_SSID_UUID
  | typeof AVAILABLE_SSIDS_UUID

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

  const discoverAllServicesAndCharacteristics = async (
    hotspotDevice: Device,
  ): Promise<Device | undefined> =>
    hotspotDevice.discoverAllServicesAndCharacteristics()

  const getServiceCharacteristics = async (
    hotspotDevice: Device,
  ): Promise<Characteristic[] | undefined> =>
    hotspotDevice.characteristicsForService(SERVICE_UUID)

  const readCharacteristic = async (
    characteristicUuid: HotspotCharacteristic,
    characteristic: Characteristic,
    tries = 1,
  ): Promise<string | undefined> => {
    const value = await characteristic.read()
    if (!value) return

    const parsedValue = parseCharacteristicValue(characteristicUuid, value)

    if (parsedValue === 'wait') {
      if (tries - 1 === 0) {
        // Logger.sendError(
        //   new Error(`Got wait from hotspot: parsedValue = ${parsedValue}`),
        // )
        return parsedValue
      }

      await sleep(1000)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return readCharacteristic(characteristicUuid, characteristic, tries - 1)
    }

    return parsedValue
  }

  const findAndReadCharacteristic = async (
    characteristicUuid: HotspotCharacteristic,
    characteristics: Characteristic[],
    tries = 1,
  ): Promise<string | undefined> => {
    const characteristic = characteristics.find(
      (c) => c.uuid === characteristicUuid,
    )
    if (!characteristic) return

    return readCharacteristic(characteristicUuid, characteristic, tries)
  }

  const parseCharacteristicValue = (
    characteristicUuid: HotspotCharacteristic,
    characteristic: Characteristic,
  ): string => {
    if (!characteristic.value) return ''

    const { value } = characteristic

    const decoded = decode(value)

    // TODO: Handle specific characteristics by using characteristicUuid
    // for now this returns a string, but will return objects/arrays in the future

    if (decoded[0] === '[') {
      return JSON.parse(decoded).map((name: string) => ({ name }))
    }

    return decoded
  }

  return {
    getState,
    enable,
    scan,
    connect,
    discoverAllServicesAndCharacteristics,
    getServiceCharacteristics,
    findAndReadCharacteristic,
  }
}

export default useBluetooth
