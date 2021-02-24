import { useState, useRef } from 'react'
import { Device } from 'react-native-ble-plx'
import validator from 'validator'
import compareVersions from 'compare-versions'
import { Balance, CurrencyType } from '@helium/currency'
import { useSelector } from 'react-redux'
import {
  AddGatewayV1,
  AssertLocationV1,
  Transaction,
} from '@helium/transactions'
import { useBluetoothContext } from '../providers/BluetoothProvider'
import {
  FirmwareCharacteristic,
  HotspotCharacteristic,
  Service,
} from './bluetooth/bluetoothTypes'
import { getStaking, postStaking } from './stakingClient'
import {
  parseChar,
  encodeWifiConnect,
  encodeWifiRemove,
  encodeAddGateway,
  encodeAssertLoc,
} from './bluetooth/bluetoothDataParser'
import { getCurrentOraclePrice, getHotspotDetails } from './appDataClient'
import { getSecureItem } from './secureAccount'
import { makeAddGatewayTxn, makeAssertLocTxn } from './transactions'
import { calculateAddGatewayFee, calculateAssertLocFee } from './fees'
import connectedHotspotSlice, {
  fetchHotspotDetails,
  HotspotName,
  HotspotStatus,
  HotspotType,
} from '../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../store/store'
import { RootState } from '../store/rootReducer'
import * as Logger from './logger'
import useSubmitTxn from '../hooks/useSubmitTxn'

const useHotspot = () => {
  const submitTxn = useSubmitTxn()
  const connectedHotspot = useRef<Device | null>(null)
  const [availableHotspots, setAvailableHotspots] = useState<
    Record<string, Device>
  >({})

  const {
    scan,
    connect,
    discoverAllServicesAndCharacteristics,
    findAndReadCharacteristic,
    findAndWriteCharacteristic,
    writeCharacteristic,
    readCharacteristic,
    findCharacteristic,
  } = useBluetoothContext()
  const dispatch = useAppDispatch()
  const {
    account: { account },
    connectedHotspot: connectedHotspotDetails,
  } = useSelector((state: RootState) => state)

  // TODO: Move staking calls to redux

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
      case 'NEBRAIN':
        return 'Nebra Indoor Hotspot'
      case 'NEBRAOUT':
        return 'Nebra Indoor Hotspot'
      case 'Bobcat':
        return 'Bobcat Miner 300'
      case 'SYNCROBIT':
        return 'SyncroB.it Hotspot'
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

  const connectAndConfigHotspot = async (hotspotDevice: Device) => {
    let connectedDevice = hotspotDevice
    const connected = await hotspotDevice.isConnected()
    if (!connected) {
      const device = await connect(hotspotDevice)
      if (!device) return
      connectedDevice = device
    }

    const deviceWithServices = await discoverAllServicesAndCharacteristics(
      connectedDevice,
    )
    if (!deviceWithServices) return

    connectedHotspot.current = deviceWithServices

    const wifi = await getDecodedStringVal(HotspotCharacteristic.WIFI_SSID_UUID)
    const ethernetOnline = await getDecodedBoolVal(
      HotspotCharacteristic.ETHERNET_ONLINE_UUID,
    )
    const address = await getDecodedStringVal(HotspotCharacteristic.PUBKEY_UUID)
    const onboardingAddress = await getDecodedStringVal(
      HotspotCharacteristic.ONBOARDING_KEY_UUID,
    )

    const type = getHotspotType(onboardingAddress || '')
    const name = getHotspotName(type)
    const mac = hotspotDevice.localName?.slice(15)

    if (!onboardingAddress || onboardingAddress.length < 20) {
      Logger.error(
        new Error(`Invalid onboarding address: ${onboardingAddress}`),
      )
    }

    const details = {
      address,
      mac,
      type,
      name,
      wifi,
      ethernetOnline,
      onboardingAddress,
    }

    const response = await dispatch(fetchHotspotDetails(details))
    return !!response.payload
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

    if (!characteristic?.value) return
    const response = parseChar(characteristic.value, uuid)
    if (response) {
      dispatch(connectedHotspotSlice.actions.setConnectedHotspotWifi(undefined))
    }
    return response
  }

  const setWifiCredentials = async (
    ssid: string,
    password: string,
    callback?: (success: 'invalid' | 'error' | 'connected') => void,
  ) => {
    if (!connectedHotspot.current) return
    const uuid = HotspotCharacteristic.WIFI_CONNECT_UUID
    const encoded = encodeWifiConnect(ssid, password)

    const characteristic = await findCharacteristic(
      uuid,
      connectedHotspot.current,
    )

    if (!characteristic) return

    await writeCharacteristic(characteristic, encoded)

    const subscription = characteristic?.monitor((error, c) => {
      if (error) {
        Logger.error(error)
        subscription?.remove()
        callback?.('error')
      }

      if (!c?.value) return

      const response = parseChar(c.value, uuid)
      if (response === 'connecting') return

      if (response === 'connected') {
        dispatch(connectedHotspotSlice.actions.setConnectedHotspotWifi(ssid))
      }

      subscription?.remove()
      if (response === 'connected' || response === 'invalid') {
        callback?.(response)
        return
      }

      callback?.('error')
    })
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

  const updateHotspotStatus = async () => {
    const { address } = connectedHotspotDetails
    if (!address) return

    let status: HotspotStatus = 'new'
    try {
      const hotspot = await getHotspotDetails(address)
      if (hotspot.owner === address) {
        status = 'owned'
      } else if (hotspot && hotspot.owner !== address) {
        status = 'global'
      }
    } catch (error) {
      Logger.error(error)
      const notFound = error?.response?.status === 404
      if (!notFound) {
        status = 'error'
      }
    }
    dispatch(connectedHotspotSlice.actions.setConnectedHotspotStatus(status))
  }

  const getStakingSignedTransaction = async (
    onboardingAddress: string,
    txn: string,
  ) => {
    const { transaction } = await postStaking(
      `transactions/pay/${onboardingAddress}`,
      {
        transaction: txn,
      },
    )
    return transaction
  }

  const addGatewayTxn = async () => {
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

    if (value.length < 20) {
      Logger.error(new Error(`Got error code ${value} from add_gw`))
      return value
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
      return false
    }
  }

  const assertLocationTxn = async (lat: number, lng: number) => {
    if (!connectedHotspot.current || !connectedHotspotDetails.onboardingAddress)
      return false

    const isFree = hasFreeLocationAssert()

    const uuid = HotspotCharacteristic.ASSERT_LOC_UUID
    const characteristic = await findCharacteristic(
      uuid,
      connectedHotspot.current,
    )
    if (!characteristic) return false

    const owner = await getSecureItem('address')
    const payer = isFree
      ? connectedHotspotDetails.onboardingRecord?.maker.address
      : ''
    if (!payer || !owner) return false

    const nonce = connectedHotspotDetails?.details?.nonce || 0
    const { fee } = calculateAssertLocFee(owner, payer, nonce)
    const amount = Transaction.stakingFeeTxnAssertLocationV1

    const encodedPayload = encodeAssertLoc(
      lat,
      lng,
      nonce,
      owner,
      amount,
      fee,
      payer,
    )

    await writeCharacteristic(characteristic, encodedPayload)
    const { value } = await readCharacteristic(characteristic)
    if (!value) return false

    const txn = await makeAssertLocTxn(value)

    const stakingServerSignedTxnStr = await getStakingSignedTransaction(
      connectedHotspotDetails.onboardingAddress,
      txn.toString(),
    )

    const stakingServerSignedTxn = AssertLocationV1.fromString(
      stakingServerSignedTxnStr,
    )

    try {
      const pendingTransaction = await submitTxn(stakingServerSignedTxn)
      return !!pendingTransaction
    } catch (error) {
      Logger.error(error)
      return false
    }
  }

  const loadLocationFeeData = async () => {
    const isFree = hasFreeLocationAssert()

    const owner = await getSecureItem('address')
    const payer = isFree
      ? connectedHotspotDetails.onboardingRecord?.maker.address
      : ''

    if (!owner || payer === undefined) {
      throw new Error('Missing payer or owner')
    }

    const nonce = connectedHotspotDetails?.details?.nonce || 0
    const { stakingFee, fee } = calculateAssertLocFee(owner, payer, nonce)

    const totalStakingAmountDC = new Balance(
      stakingFee + fee,
      CurrencyType.dataCredit,
    )
    const { price: oraclePrice } = await getCurrentOraclePrice()
    const totalStakingAmount = totalStakingAmountDC.toNetworkTokens(oraclePrice)
    const totalStakingAmountUsd = totalStakingAmountDC.toUsd(oraclePrice)

    const balance = account?.balance?.integerBalance || 0
    const hasSufficientBalance = balance >= totalStakingAmount.integerBalance

    return {
      isFree,
      hasSufficientBalance,
      totalStakingAmount,
      totalStakingAmountDC,
      totalStakingAmountUsd,
      remainingFreeAsserts: remainingFreeAsserts(),
    }
  }

  const remainingFreeAsserts = () => {
    if (!connectedHotspotDetails.onboardingRecord) {
      return 0
    }

    const locationNonceLimit =
      connectedHotspotDetails.onboardingRecord?.maker.locationNonceLimit || 0

    return locationNonceLimit - (connectedHotspotDetails?.details?.nonce || 0)
  }

  const hasFreeLocationAssert = (): boolean => {
    if (!connectedHotspotDetails.onboardingRecord) {
      return false
    }

    const locationNonceLimit =
      connectedHotspotDetails.onboardingRecord?.maker.locationNonceLimit || 0

    return (connectedHotspotDetails?.details?.nonce || 0) < locationNonceLimit
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
    updateHotspotStatus,
    addGatewayTxn,
    assertLocationTxn,
    loadLocationFeeData,
    getDiagnosticInfo,
  }
}

export default useHotspot
