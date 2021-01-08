import { useRef } from 'react'
import {
  Base64,
  BleManager,
  Characteristic,
  Device,
  LogLevel,
} from 'react-native-ble-plx'
import { decode } from 'base-64'
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
      return hotspotDevice
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
      return hotspotDevice
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
    }
  }

  const readCharacteristic = async (
    characteristic: Characteristic,
    tries = 1,
  ): Promise<Characteristic> => {
    Logger.breadcrumb(
      `Read Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID}`,
    )
    try {
      const value = await characteristic.read()
      if (!value.value) return value

      const parsedValue = decode(value.value)

      if (parsedValue === 'wait') {
        if (tries - 1 === 0) {
          Logger.error(
            new Error(`Got wait from hotspot: parsedValue = ${parsedValue}`),
          )
          return value
        }

        await sleep(1000)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return await readCharacteristic(characteristic, tries - 1)
      }

      Logger.breadcrumb(
        `Successfully read Characteristic: ${characteristic.uuid} for service: ${characteristic.serviceUUID}`,
      )

      return value
    } catch (e) {
      Logger.error(e)
    }
    return characteristic
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
        `Successfully wrote Characteristic: ${c.uuid} for service: ${c.serviceUUID}`,
      )
      return c
    } catch (e) {
      Logger.error(e)
    }
  }

  const findAndReadCharacteristic = async (
    characteristicUuid: HotspotCharacteristic | FirmwareCharacteristic,
    hotspotDevice: Device,
    service: Service = Service.MAIN_UUID,
    tries = 1,
  ) => {
    const characteristic = await findCharacteristic(
      characteristicUuid,
      hotspotDevice,
      service,
    )
    if (!characteristic) return

    const readChar = await readCharacteristic(characteristic, tries)
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
