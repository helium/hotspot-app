import { useRef } from 'react'
import {
  Base64,
  BleManager,
  Characteristic,
  Device,
  LogLevel,
} from 'react-native-ble-plx'
import sleep from '../sleep'
import {
  FirmwareCharacteristic,
  HotspotCharacteristic,
  Service,
} from './bluetoothTypes'
import * as Logger from '../logger'

const useBluetooth = () => {
  const instanceRef = useRef<BleManager | null>(null)

  const getBleManager = () => {
    const instance = instanceRef.current
    if (instance !== null) {
      return instance
    }
    const newInstance = new BleManager()
    instanceRef.current = newInstance

    if (__DEV__) {
      console.log('setting ble log level to verbose')
      instanceRef.current.setLogLevel(LogLevel.Verbose)
    }

    return newInstance
  }

  const getState = async () => getBleManager().state()

  const enable = async () => {
    getBleManager().enable()
  }

  const connect = async (
    hotspotDevice: Device,
  ): Promise<Device | undefined> => {
    Logger.breadcrumb('Connect hotspot requested')

    try {
      const device = await hotspotDevice.connect({
        refreshGatt: 'OnConnected',
        timeout: 10000,
      })
      Logger.breadcrumb('Hotspot Connected')
      return device
    } catch (e) {
      Logger.error(e)
      throw e
    }
  }

  const scan = async (ms: number, callback: (device: Device) => void) => {
    Logger.breadcrumb('Scan for hotspots')
    getBleManager().startDeviceScan(
      [Service.MAIN_UUID],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          Logger.error(error)
          throw error
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
  ): Promise<Device | undefined> => {
    Logger.breadcrumb(
      `Discover All Services and Characteristics for device: ${hotspotDevice.id}`,
    )

    try {
      const device = await hotspotDevice.discoverAllServicesAndCharacteristics()
      Logger.breadcrumb(
        `Successfully discovered All Services and Characteristics for device: ${device.id}`,
      )
      return device
    } catch (e) {
      Logger.error(e)
      throw e
    }
  }

  const findCharacteristic = async (
    characteristicUuid: HotspotCharacteristic | FirmwareCharacteristic,
    hotspotDevice: Device,
    service: Service = Service.MAIN_UUID,
  ) => {
    Logger.breadcrumb(
      `Find Characteristic: ${characteristicUuid} for service: ${service}`,
    )
    try {
      const characteristics = await hotspotDevice.characteristicsForService(
        service,
      )
      const characteristic = characteristics.find(
        (c) => c.uuid === characteristicUuid,
      )
      Logger.breadcrumb(
        `${
          characteristic
            ? 'Found characteristic'
            : 'Did not find characteristic'
        } for service: ${service}`,
      )
      return characteristic
    } catch (e) {
      Logger.error(e)
      throw e
    }
  }

  const readCharacteristic = async (
    characteristic: Characteristic,
  ): Promise<Characteristic> => {
    Logger.breadcrumb(
      `Read Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID}`,
    )
    try {
      const charWithValue = await characteristic.read()
      if (!charWithValue.value) throw new Error('Characteristic value is empty')

      Logger.breadcrumb(
        `Successfully read Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID} with value ${charWithValue.value}`,
      )

      return charWithValue
    } catch (e) {
      Logger.error(e)
      throw e
    }
  }

  const writeCharacteristic = async (
    characteristic: Characteristic,
    payload: Base64,
  ) => {
    Logger.breadcrumb(
      `Write Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID}`,
    )
    try {
      const c = await characteristic.writeWithResponse(payload)
      Logger.breadcrumb(
        `Successfully wrote Characteristic: ${c.uuid} for service: ${c.serviceUUID} with value ${c.value}`,
      )
      return c
    } catch (e) {
      Logger.error(e)
      throw e
    }
  }

  const findAndReadCharacteristic = async (
    characteristicUuid: HotspotCharacteristic | FirmwareCharacteristic,
    hotspotDevice: Device,
    service: Service = Service.MAIN_UUID,
  ) => {
    const characteristic = await findCharacteristic(
      characteristicUuid,
      hotspotDevice,
      service,
    )
    if (!characteristic) return

    const readChar = await readCharacteristic(characteristic)
    return readChar?.value || undefined
  }

  const findAndWriteCharacteristic = async (
    characteristicUuid: HotspotCharacteristic | FirmwareCharacteristic,
    hotspotDevice: Device,
    payload: Base64,
    service: Service = Service.MAIN_UUID,
  ) => {
    const characteristic = await findCharacteristic(
      characteristicUuid,
      hotspotDevice,
      service,
    )
    if (!characteristic) return

    return writeCharacteristic(characteristic, payload)
  }

  return {
    getState,
    enable,
    scan,
    connect,
    discoverAllServicesAndCharacteristics,
    findAndReadCharacteristic,
    findAndWriteCharacteristic,
    readCharacteristic,
    writeCharacteristic,
    findCharacteristic,
  }
}

export default useBluetooth
