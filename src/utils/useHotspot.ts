import { useState, useRef } from 'react'
import { Device } from 'react-native-ble-plx'
import validator from 'validator'
import compareVersions from 'compare-versions'
import { Transaction } from '@helium/transactions'
import { Balance, CurrencyType } from '@helium/currency'
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
} from './bluetooth/bluetoothDataParser'
import {
  getCurrentOraclePrice,
  getHotspotDetails,
  submitTransaction,
} from './appDataClient'
import { getSecureItem } from './secureAccount'
import { makeAddGatewayTxn } from './transactions'
import { calculateAddGatewayFee, stakingFee } from './fees'
import accountSlice from '../store/account/accountSlice'
import connectedHotspotSlice, {
  HotspotName,
  HotspotStatus,
  HotspotType,
} from '../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../store/store'
import { RootState } from '../store/rootReducer'
import * as Logger from './logger'

type HotspotStaking = {
  batch: string
  helium_serial: string
  id: number
  mac_eth0: string
  mac_wlan0: string
  onboarding_address: string
  public_address: string
  rpi_serial: string
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

  const connectAndConfigHotspot = async (hotspotDevice: Device) => {
    const connectedDevice = await connect(hotspotDevice)
    if (!connectedDevice) return

    const deviceWithServices = await discoverAllServicesAndCharacteristics(
      connectedDevice,
    )
    if (!deviceWithServices) return

    connectedHotspot.current = deviceWithServices

    const wifi = await getDecodedStringVal(HotspotCharacteristic.WIFI_SSID_UUID)
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

    const stakingAddress = `hotspots/${onboardingAddress}`
    const feesStatus = (await getStaking(stakingAddress)) as HotspotStaking

    const details = {
      address,
      mac,
      type,
      name,
      wifi,
      freeAddHotspot: !!feesStatus,
      onboardingAddress,
    }
    dispatch(connectedHotspotSlice.actions.initConnectedHotspot(details))
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

  const checkFirmwareCurrent = async () => {
    if (!connectedHotspot.current) return

    const characteristic = FirmwareCharacteristic.FIRMWAREVERSION_UUID
    const charVal = await findAndReadCharacteristic(
      characteristic,
      connectedHotspot.current,
      Service.FIRMWARESERVICE_UUID,
    )
    if (!charVal) return

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
    if (!owner) return false
    const data = await getStaking('address')
    const payer = data?.address || ''
    const fee = calculateAddGatewayFee(owner, payer) || 0

    const encodedPayload = encodeAddGateway(owner, stakingFee, fee, payer)

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

  const loadLocationFeeData = async () => {
    const data = await getStaking('/limits')
    const locationNonceLimit = data.location_nonce
    // staking fee from Transaction
    const locationStakingFee = Transaction.stakingFeeTxnAssertLocationV1

    const isFree =
      !!connectedHotspotDetails?.freeAddHotspot &&
      (connectedHotspotDetails?.nonce || 0) + 1 < locationNonceLimit
    const noPayerByteLength = 224
    const txnFee = Transaction.calculateFee(new Uint8Array(noPayerByteLength))

    const totalStakingAmountDC = new Balance(
      locationStakingFee + txnFee,
      CurrencyType.dataCredit,
    )
    const { price: oraclePrice } = await getCurrentOraclePrice()
    const totalStakingAmount = totalStakingAmountDC.toNetworkTokens(oraclePrice)
      .integerBalance

    const balance = account?.balance?.integerBalance || 0
    const hasSufficientBalance = balance >= totalStakingAmount

    return { isFree, hasSufficientBalance, totalStakingAmount }
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
    loadLocationFeeData,
    getDiagnosticInfo,
  }
}

export default useHotspot
