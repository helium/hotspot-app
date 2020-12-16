import { useRef } from 'react'
import {
  Base64,
  BleManager,
  Characteristic,
  Device,
  LogLevel,
  State,
} from 'react-native-ble-plx'
import { decode } from 'base-64'
import sleep from '../sleep'
import {
  FirmwareCharacteristic,
  HotspotCharacteristic,
  Service,
} from './bluetoothTypes'

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

  const subscribeToState = (callback: (state: State) => void) =>
    getBleManager().onStateChange(callback, true)

  const enable = async () => {
    getBleManager().enable()
  }

  const connect = async (hotspotDevice: Device): Promise<Device | undefined> =>
    hotspotDevice.connect({
      refreshGatt: 'OnConnected',
    })

  const scan = async (ms: number, callback: (device: Device) => void) => {
    getBleManager().startDeviceScan(
      [Service.MAIN_UUID],
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

  const findCharacteristic = async (
    characteristicUuid: HotspotCharacteristic | FirmwareCharacteristic,
    hotspotDevice: Device,
    service: Service = Service.MAIN_UUID,
  ) => {
    const characteristics = await hotspotDevice.characteristicsForService(
      service,
    )

    return characteristics.find((c) => c.uuid === characteristicUuid)
  }

  const readCharacteristic = async (
    characteristic: Characteristic,
    tries = 1,
  ): Promise<Characteristic> => {
    try {
      const value = await characteristic.read()
      if (!value.value) return value

      const parsedValue = decode(value.value)

      if (parsedValue === 'wait') {
        console.log('WAIT!')
        if (tries - 1 === 0) {
          // Logger.sendError(
          //   new Error(`Got wait from hotspot: parsedValue = ${parsedValue}`),
          // )
          return value
        }

        await sleep(1000)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return await readCharacteristic(characteristic, tries - 1)
      }

      return value
    } catch (e) {
      console.log('readCharacteristic ***** ERROR ***** - ', e)
    }
    return characteristic
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

  const writeCharacteristic = async (
    characteristic: Characteristic,
    payload: Base64,
  ) => {
    try {
      return characteristic.writeWithResponse(payload)
    } catch (e) {
      console.log('writeCharacteristic ***** ERROR ***** - ', e)
    }
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
    subscribeToState,
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
