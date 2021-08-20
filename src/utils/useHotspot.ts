import { useRef, useState } from 'react'
import { BleError, Device, Subscription } from 'react-native-ble-plx'
import compareVersions from 'compare-versions'
import { useSelector } from 'react-redux'
import { AddGatewayV1 } from '@helium/transactions'
import { decode } from 'base-64'
import { Hotspot } from '@helium/http'
import { useBluetoothContext } from '../providers/BluetoothProvider'
import {
  FirmwareCharacteristic,
  HotspotCharacteristic,
  Service,
} from './bluetooth/bluetoothTypes'
import { getStaking, getStakingSignedTransaction } from './stakingClient'
import {
  encodeAddGateway,
  encodeWifiConnect,
  encodeWifiRemove,
  parseChar,
} from './bluetooth/bluetoothDataParser'
import { getAddress } from './appDataClient'
import { getSecureItem } from './secureAccount'
import { makeAddGatewayTxn } from './transactions'
import { calculateAddGatewayFee } from './fees'
import connectedHotspotSlice, {
  AllHotspotDetails,
  fetchConnectedHotspotDetails,
  HotspotStatus,
} from '../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../store/store'
import { RootState } from '../store/rootReducer'
import * as Logger from './logger'
import useSubmitTxn from '../hooks/useSubmitTxn'

export type HotspotConnectStatus =
  | 'success'
  | 'no_device_found'
  | 'no_services_found'
  | 'invalid_onboarding_address'
  | 'no_onboarding_key'
  | 'service_unavailable'
  | 'details_fetch_failure'

export enum HotspotErrorCode {
  WAIT = 'wait',
  UNKNOWN = 'unknown',
  BAD_ARGS = 'badargs',
  ERROR = 'error',
  GATEWAY_NOT_FOUND = 'gw_not_found', // This may no longer be relevant, but it's not hurting anything check for it
}

const useHotspot = () => {
  const submitTxn = useSubmitTxn()
  const connectedHotspot = useRef<Device | null>(null)
  const [availableHotspots, setAvailableHotspots] = useState<
    Record<string, Device>
  >({})

  const {
    scan,
    connect,
    disconnect,
    discoverAllServicesAndCharacteristics,
    findAndReadCharacteristic,
    findAndWriteCharacteristic,
    writeCharacteristic,
    readCharacteristic,
    findCharacteristic,
  } = useBluetoothContext()
  const dispatch = useAppDispatch()
  const connectedHotspotDetails = useSelector(
    (state: RootState) => state.connectedHotspot,
  )

  // TODO: Move staking calls to redux

  const scanForHotspots = async (ms: number) => {
    setAvailableHotspots({})
    await scan(ms, (hotspotDevice) =>
      setAvailableHotspots((hotspots) => ({
        ...hotspots,
        [hotspotDevice.id]: hotspotDevice,
      })),
    )
  }

  const getDecodedStringVal = async (
    characteristic:
      | HotspotCharacteristic.WIFI_SSID_UUID
      | HotspotCharacteristic.PUBKEY_UUID
      | HotspotCharacteristic.ONBOARDING_KEY_UUID,
  ) => {
    if (!connectedHotspot.current) return

    const charVal = await findAndReadCharacteristic(
      characteristic,
      connectedHotspot.current,
    )

    let parsedStr = ''
    if (charVal) {
      parsedStr = parseChar(charVal, characteristic)
    }
    return parsedStr
  }

  const getDecodedBoolVal = async (
    characteristic: HotspotCharacteristic.ETHERNET_ONLINE_UUID,
  ) => {
    if (!connectedHotspot.current) return

    const charVal = await findAndReadCharacteristic(
      characteristic,
      connectedHotspot.current,
    )

    let parsedStr = false
    if (charVal) {
      parsedStr = parseChar(charVal, characteristic)
    }
    return parsedStr
  }

  const handleConnectStatus = (status: HotspotConnectStatus) => {
    if (status !== 'success') {
      Logger.error(new Error(`Hotspot connect failed: ${status}`))
    }
    return status
  }

  const connectAndConfigHotspot = async (
    hotspotDevice: Device,
  ): Promise<HotspotConnectStatus> => {
    dispatch(connectedHotspotSlice.actions.reset())
    const prevDevice = connectedHotspot.current
    if (prevDevice) {
      const prevConnected = await prevDevice.isConnected()
      if (prevConnected) {
        try {
          await disconnect(prevDevice)
        } catch (e) {
          Logger.error(
            new Error(`Could not disconnect previous hotspot ${prevDevice.id}`),
          )
        }
        connectedHotspot.current = null
      }
    }

    let connectedDevice = hotspotDevice
    const connected = await hotspotDevice.isConnected()
    if (!connected) {
      const device = await connect(hotspotDevice)
      if (!device) {
        return handleConnectStatus('no_device_found')
      }
      connectedDevice = device
    }

    const deviceWithServices = await discoverAllServicesAndCharacteristics(
      connectedDevice,
    )
    if (!deviceWithServices) {
      return handleConnectStatus('no_services_found')
    }

    connectedHotspot.current = deviceWithServices

    const wifi = await getDecodedStringVal(HotspotCharacteristic.WIFI_SSID_UUID)
    const ethernetOnline = await getDecodedBoolVal(
      HotspotCharacteristic.ETHERNET_ONLINE_UUID,
    )
    const address = await getDecodedStringVal(HotspotCharacteristic.PUBKEY_UUID)
    const onboardingAddress = await getDecodedStringVal(
      HotspotCharacteristic.ONBOARDING_KEY_UUID,
    )

    const mac = hotspotDevice.localName?.slice(15)

    if (!onboardingAddress || onboardingAddress.length < 20) {
      Logger.error(
        new Error(`Invalid onboarding address: ${onboardingAddress}`),
      )
      return handleConnectStatus('invalid_onboarding_address')
    }

    const details = {
      address,
      mac,
      wifi,
      ethernetOnline,
      onboardingAddress,
    }

    Logger.breadcrumb('connectAndConfigHotspot - received details', {
      data: details,
    })
    const response = await dispatch(fetchConnectedHotspotDetails(details))
    let payload: AllHotspotDetails | null = null
    if (response.payload) {
      payload = response.payload as AllHotspotDetails
    }

    await updateHotspotStatus(payload?.hotspot)

    if (!payload?.onboardingRecord?.onboardingKey) {
      let err: HotspotConnectStatus = 'service_unavailable'
      if (payload?.onboardingRecord?.code === 404) {
        err = 'no_onboarding_key'
      }
      Logger.error(
        new Error(
          `Hotspot connect failed: ${err} - error code: ${payload?.onboardingRecord?.code}`,
        ),
      )
      return handleConnectStatus(err)
    }
    return handleConnectStatus(payload ? 'success' : 'details_fetch_failure')
  }

  const scanForWifiNetworks = async (configured = false) => {
    if (!connectedHotspot.current) return

    const characteristic = configured
      ? HotspotCharacteristic.WIFI_CONFIGURED_SERVICES
      : HotspotCharacteristic.AVAILABLE_SSIDS_UUID

    const charVal = await findAndReadCharacteristic(
      characteristic,
      connectedHotspot.current,
    )
    if (!charVal) return

    return parseChar(charVal, characteristic)
  }

  const removeConfiguredWifi = async (name: string) => {
    if (!connectedHotspot.current) return

    const uuid = HotspotCharacteristic.WIFI_REMOVE
    const encoded = encodeWifiRemove(name)

    const characteristic = await findAndWriteCharacteristic(
      uuid,
      connectedHotspot.current,
      encoded,
    )

    dispatch(connectedHotspotSlice.actions.setConnectedHotspotWifi(undefined))

    if (!characteristic?.value) return
    const response = parseChar(characteristic.value, uuid)
    return response
  }

  type CallbackType = (
    success: 'invalid' | 'error' | 'connected',
    error?: string | Error,
  ) => void
  const setWifiCredentials = async (
    ssid: string,
    password: string,
    callback?: CallbackType,
  ) => {
    if (!connectedHotspot.current) throw new Error('No device found')

    try {
      let cb: CallbackType | null | undefined = callback
      const doCallback = (
        type: 'invalid' | 'error' | 'connected',
        error?: BleError,
      ) => {
        if (error && subscription) {
          // only log the error if we're still subscribed
          Logger.error(error)
        }

        cb?.(type, error)
        cb = null // prevent multiple callbacks. Android throws an error when the subscription is removed.
        subscription?.remove()
        subscription = null
      }

      const uuid = HotspotCharacteristic.WIFI_CONNECT_UUID
      const encoded = encodeWifiConnect(ssid, password)

      const wifiChar = await findCharacteristic(uuid, connectedHotspot.current)

      if (!wifiChar) return

      await writeCharacteristic(wifiChar, encoded)

      let subscription: Subscription | null = wifiChar?.monitor((error, c) => {
        if (error) {
          doCallback('error', error)
        }

        if (!c?.value) return

        const response = parseChar(c.value, uuid)
        if (response === 'connecting') return

        if (response === 'connected') {
          dispatch(connectedHotspotSlice.actions.setConnectedHotspotWifi(ssid))
        }

        if (response === 'connected' || response === 'invalid') {
          doCallback(response)
          return
        }

        doCallback('error')
      })
    } catch (e) {
      callback?.('error', e)
    }
  }

  const checkFirmwareCurrent = async (): Promise<boolean> => {
    if (!connectedHotspot.current) return false

    const characteristic = FirmwareCharacteristic.FIRMWAREVERSION_UUID
    const charVal = await findAndReadCharacteristic(
      characteristic,
      connectedHotspot.current,
      Service.FIRMWARESERVICE_UUID,
    )
    if (!charVal) return false

    const deviceFirmwareVersion = parseChar(charVal, characteristic)

    const firmware: { version: string } = await getStaking('firmware')
    const { version: minVersion } = firmware

    dispatch(
      connectedHotspotSlice.actions.setConnectedHotspotFirmware({
        version: deviceFirmwareVersion,
        minVersion,
      }),
    )
    return compareVersions.compare(deviceFirmwareVersion, minVersion, '>=')
  }

  const updateHotspotStatus = async (hotspot?: Hotspot) => {
    const address = await getAddress()
    let status: HotspotStatus = 'new'
    if (hotspot && hotspot.owner === address) {
      status = 'owned'
    } else if (hotspot && hotspot.owner !== address) {
      status = 'global'
    }
    dispatch(connectedHotspotSlice.actions.setConnectedHotspotStatus(status))
  }

  const addGatewayTxn = async (): Promise<string | boolean> => {
    if (!connectedHotspot.current || !connectedHotspotDetails.onboardingAddress)
      return false
    const uuid = HotspotCharacteristic.ADD_GATEWAY_UUID
    const characteristic = await findCharacteristic(
      uuid,
      connectedHotspot.current,
    )
    if (!characteristic) return false

    const owner = await getSecureItem('address')
    const payer = connectedHotspotDetails.onboardingRecord?.maker.address
    if (!payer || !owner) return false
    const { fee, stakingFee } = calculateAddGatewayFee(owner, payer) || 0

    const encodedPayload = encodeAddGateway(owner, stakingFee, fee, payer)

    await writeCharacteristic(characteristic, encodedPayload)
    const { value } = await readCharacteristic(characteristic)
    if (!value) return false

    const parsedValue = decode(value)
    if (parsedValue in HotspotErrorCode || parsedValue.length < 20) {
      Logger.error(
        `Got error code ${parsedValue} from add_gateway. Raw data = ${value}`,
      )
      return parsedValue
    }

    const txn = await makeAddGatewayTxn(value)

    const stakingServerSignedTxnStr = await getStakingSignedTransaction(
      connectedHotspotDetails.onboardingAddress,
      txn.toString(),
    )

    const stakingServerSignedTxn = AddGatewayV1.fromString(
      stakingServerSignedTxnStr,
    )

    try {
      const pendingTransaction = await submitTxn(stakingServerSignedTxn)
      return !!pendingTransaction
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  const getDiagnosticInfo = async () => {
    if (!connectedHotspot.current) return

    const charVal = await findAndReadCharacteristic(
      HotspotCharacteristic.DIAGNOSTIC_UUID,
      connectedHotspot.current,
    )

    if (charVal) {
      return parseChar(charVal, HotspotCharacteristic.DIAGNOSTIC_UUID)
    }
  }

  return {
    scanForHotspots,
    connectAndConfigHotspot,
    availableHotspots,
    scanForWifiNetworks,
    removeConfiguredWifi,
    setWifiCredentials,
    checkFirmwareCurrent,
    addGatewayTxn,
    getDiagnosticInfo,
  }
}

export default useHotspot
