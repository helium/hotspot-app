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
      // eslint-disable-next-line no-console
      console.log('setting ble log level to verbose')
      instanceRef.current.setLogLevel(LogLevel.Verbose)
    }

    return newInstance
  }

  const getState = async () => getBleManager().state()

  const enable = async () => getBleManager().enable()

  const disconnect = async (
    hotspotDevice: Device,
  ): Promise<Device | undefined> => {
    Logger.breadcrumb('Disconnect hotspot requested')

    try {
      const device = await hotspotDevice.cancelConnection()
      Logger.breadcrumb('Hotspot Disconnected')
      return device
    } catch (e) {
      Logger.error(e)
      throw e
    }
  }

  const connect = async (
    hotspotDevice: Device,
  ): Promise<Device | undefined> => {
    Logger.breadcrumb('Connect hotspot requested')

    try {
      const device = await hotspotDevice.connect({ refreshGatt: 'OnConnected' })
      Logger.breadcrumb('Hotspot Connected')
      return device
    } catch (e) {
      Logger.error(e)
      throw e
    }
  }

  const scan = async (ms: number, callback: (device: Device) => void) => {
    Logger.breadcrumb('Scan for hotspots')
    try {
      getBleManager().startDeviceScan(
        [Service.MAIN_UUID],
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            throw error
          }

          if (device?.localName) {
            callback(device)
          }
        },
      )

      await sleep(ms)

      getBleManager().stopDeviceScan()
    } catch (e) {
      Logger.error(e)
    }
  }

  const discoverAllServicesAndCharacteristics = async (
    hotspotDevice: Device,
  ): Promise<Device | undefined> => {
    Logger.breadcrumb(
      `Discover All Services and Characteristics for device: ${hotspotDevice.id}`,
    )

    const device = await hotspotDevice.discoverAllServicesAndCharacteristics()
    Logger.breadcrumb(
      `Successfully discovered All Services and Characteristics for device: ${device.id}`,
    )
    return device
  }

  const findCharacteristic = async (
    characteristicUuid: HotspotCharacteristic | FirmwareCharacteristic,
    hotspotDevice: Device,
    service: Service = Service.MAIN_UUID,
  ) => {
    Logger.breadcrumb(
      `Find Characteristic: ${characteristicUuid} for service: ${service}`,
    )
    const characteristics = await hotspotDevice.characteristicsForService(
      service,
    )
    const characteristic = characteristics.find(
      (c) => c.uuid === characteristicUuid,
    )
    Logger.breadcrumb(
      `${
        characteristic ? 'Found characteristic' : 'Did not find characteristic'
      } for service: ${service}`,
    )
    return characteristic
  }

  const readCharacteristic = async (
    characteristic: Characteristic,
  ): Promise<Characteristic> => {
    Logger.breadcrumb(
      `Read Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID}`,
    )
    const readChar = await characteristic.read()

    Logger.breadcrumb(
      `Successfully read Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID} with value ${readChar.value}`,
    )

    return readChar
  }

  const writeCharacteristic = async (
    characteristic: Characteristic,
    payload: Base64,
  ) => {
    Logger.breadcrumb(
      `Write Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID}`,
    )
    const writeChar = await characteristic.writeWithResponse(payload)
    Logger.breadcrumb(
      `Successfully wrote Characteristic: ${writeChar.uuid} for service: ${writeChar.serviceUUID} with value ${writeChar.value}`,
    )
    return writeChar
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
    disconnect,
    discoverAllServicesAndCharacteristics,
    findAndReadCharacteristic,
    findAndWriteCharacteristic,
    readCharacteristic,
    writeCharacteristic,
    findCharacteristic,
  }
}

export default useBluetooth
