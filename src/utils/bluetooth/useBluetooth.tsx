import { useCallback, useRef } from 'react'
import {
  Base64,
  BleManager,
  Characteristic,
  Device,
  LogLevel,
} from 'react-native-ble-plx'
import { PermissionsAndroid, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import sleep from '../sleep'
import {
  FirmwareCharacteristic,
  HotspotCharacteristic,
  Service,
} from './bluetoothTypes'
import * as Logger from '../logger'

const useBluetooth = () => {
  const instanceRef = useRef<BleManager | null>(null)
  const { t } = useTranslation()

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

  const checkAndroidPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return true

    const grantedBleScan = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: t('permissions.bluetoothPermissionTitle'),
        message: t('permissions.bluetoothPermissionMessage'),
        buttonNegative: t('permissions.bluetoothPermissionButtonNegative'),
        buttonPositive: t('permissions.bluetoothPermissionButtonPositive'),
      },
    )
    const grantedBleConnect = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: t('permissions.bluetoothPermissionTitle'),
        message: t('permissions.bluetoothPermissionMessage'),
        buttonNegative: t('permissions.bluetoothPermissionButtonNegative'),
        buttonPositive: t('permissions.bluetoothPermissionButtonPositive'),
      },
    )
    if (
      grantedBleScan !== PermissionsAndroid.RESULTS.GRANTED ||
      grantedBleConnect !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      return false
    }

    return true
  }, [t])

  const getState = async () => getBleManager().state()

  const enable = async () => getBleManager().enable()

  const connect = async (
    hotspotDevice: Device,
  ): Promise<Device | undefined> => {
    Logger.breadcrumb('Connect hotspot requested')

    try {
      const androidPermission = await checkAndroidPermissions()
      if (!androidPermission) return

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
      const androidPermission = await checkAndroidPermissions()
      if (!androidPermission) return

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
    discoverAllServicesAndCharacteristics,
    findAndReadCharacteristic,
    findAndWriteCharacteristic,
    readCharacteristic,
    writeCharacteristic,
    findCharacteristic,
  }
}

export default useBluetooth
