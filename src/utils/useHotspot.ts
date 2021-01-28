import { useState, useRef } from 'react'
import { Device } from 'react-native-ble-plx'
import validator from 'validator'
import compareVersions from 'compare-versions'
import { Balance, CurrencyType, NetworkTokens } from '@helium/currency'
import { useSelector } from 'react-redux'
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
import {
  getCurrentOraclePrice,
  getHotspotDetails,
  submitTransaction,
} from './appDataClient'
import { getSecureItem } from './secureAccount'
import { makeAddGatewayTxn, makeAssertLocTxn } from './transactions'
import {
  calculateAddGatewayFee,
  calculateAssertLocFee,
  stakingFeeAddGateway,
  stakingFeeAssertLoc,
} from './fees'
import accountSlice from '../store/account/accountSlice'
import connectedHotspotSlice, {
  fetchHotspotDetails,
  HotspotName,
  HotspotStatus,
  HotspotType,
} from '../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../store/store'
import { RootState } from '../store/rootReducer'
import * as Logger from './logger'

type HotspotStaking = {
  batch: string
  heliumSerial: string
  id: number
  macEth0: string
  macWlan0: string
  onboardingAddress: string
  publicAddress: string
  rpiSerial: string
}

const useHotspot = () => {
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

    let retVal = ''
    if (charVal) {
      retVal = parseChar(charVal, characteristic)
    }
    return retVal
  }

  const getDecodedBoolVal = async (
    characteristic: HotspotCharacteristic.ETHERNET_ONLINE_UUID,
  ) => {
    if (!connectedHotspot.current) return

    const charVal = await findAndReadCharacteristic(
      characteristic,
      connectedHotspot.current,
    )

    let retVal = false
    if (charVal) {
      retVal = parseChar(charVal, characteristic)
    }
    return retVal
  }

  const connectAndConfigHotspot = async (hotspotDevice: Device) => {
    const connectedDevice = await connect(hotspotDevice)
    if (!connectedDevice) return

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

    const onboardingRecord = (await getStaking(
      `hotspots/${onboardingAddress}`,
    )) as HotspotStaking

    const details = {
      address,
      mac,
      type,
      name,
      wifi,
      ethernetOnline,
      validOnboarding: !!onboardingRecord,
      onboardingRecord,
      onboardingAddress,
    }
    dispatch(fetchHotspotDetails(details))
    return details
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
        console.log(error)
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
    const fee = calculateAddGatewayFee(owner, payer) || 0

    const encodedPayload = encodeAddGateway(
      owner,
      stakingFeeAddGateway,
      fee,
      payer,
    )

    await writeCharacteristic(characteristic, encodedPayload)
    const { value } = await readCharacteristic(characteristic)
    if (!value) return false

    // TODO: Is this needed? What should we do if wait is detected?
    // if (decodedValue.length < 20) {
    //   if (decodedValue === 'wait') {
    //     const message = t('hotspot_setup.add_hotspot.wait_error_body')
    //     const title = t('hotspot_setup.add_hotspot.wait_error_title')
    //     alertError(message, title)
    //   } else {
    //     alertError(`Got error code ${decodedValue} from add_gw`)
    //   }
    //   Logger.error(
    //     new Error(`Got error code ${decodedValue} from add_gw`),
    //   )
    //   return null
    // }

    const txn = await makeAddGatewayTxn(value)

    const stakingServerSignedTxn = await getStakingSignedTransaction(
      connectedHotspotDetails.onboardingAddress,
      txn,
    )

    try {
      const pendingTransaction = await submitTransaction(stakingServerSignedTxn)
      pendingTransaction.txn = { fee }
      pendingTransaction.status = 'pending'
      pendingTransaction.type = 'add_gateway_v1'
      dispatch(accountSlice.actions.addPendingTransaction(pendingTransaction))
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

    const nonce = connectedHotspotDetails?.nonce || 0
    const fee = calculateAssertLocFee(owner, payer, nonce) || 0
    const amount = stakingFeeAssertLoc

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

    const stakingServerSignedTxn = await getStakingSignedTransaction(
      connectedHotspotDetails.onboardingAddress,
      txn,
    )

    try {
      const pendingTransaction = await submitTransaction(stakingServerSignedTxn)
      pendingTransaction.txn = { fee }
      pendingTransaction.status = 'pending'
      pendingTransaction.type = 'assert_location_v1'
      dispatch(accountSlice.actions.addPendingTransaction(pendingTransaction))
      return !!pendingTransaction
    } catch (error) {
      Logger.error(error)
      return false
    }
  }

  type LocationFeeData = {
    isFree: boolean
    hasSufficientBalance: boolean
    totalStakingAmount: Balance<NetworkTokens>
  }

  const loadLocationFeeData = async (): Promise<LocationFeeData> => {
    const isFree = hasFreeLocationAssert()

    const owner = await getSecureItem('address')
    const payer = isFree
      ? connectedHotspotDetails.onboardingRecord?.maker.address
      : ''

    if (!owner || payer === undefined) {
      throw new Error('Missing payer or owner')
    }

    const nonce = connectedHotspotDetails?.nonce || 0
    const fee = calculateAssertLocFee(owner, payer, nonce) || 0

    const totalStakingAmountDC = new Balance(
      stakingFeeAssertLoc + fee,
      CurrencyType.dataCredit,
    )
    const { price: oraclePrice } = await getCurrentOraclePrice()
    const totalStakingAmount = totalStakingAmountDC.toNetworkTokens(oraclePrice)

    const balance = account?.balance?.integerBalance || 0
    const hasSufficientBalance = balance >= totalStakingAmount.integerBalance

    return {
      isFree,
      hasSufficientBalance,
      totalStakingAmount,
    }
  }

  const hasFreeLocationAssert = (): boolean => {
    if (!connectedHotspotDetails.validOnboarding) {
      return false
    }

    const locationNonceLimit =
      connectedHotspotDetails.onboardingRecord?.maker.locationNonceLimit || 0

    return (connectedHotspotDetails?.nonce || 0) < locationNonceLimit
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
