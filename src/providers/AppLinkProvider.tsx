/* eslint-disable max-classes-per-file */
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Linking } from 'react-native'
import queryString from 'query-string'
import { useSelector } from 'react-redux'
import Address from '@helium/address'
import { BarCodeScanningResult } from 'expo-camera'
import useMount from '../utils/useMount'
import { getAddress } from '../utils/secureAccount'
import { RootState } from '../store/rootReducer'
import navigator from '../navigation/navigator'
import {
  AppLink,
  AppLinkFields,
  AppLinkCategories,
  AppLinkCategoryType,
  AppLinkPayment,
  AppLinkLocation,
  AppLinkTransfer,
  AppLinkAntenna,
  LinkWalletRequest,
  SignHotspotRequest,
} from './appLinkTypes'

const APP_LINK_PROTOCOL = 'helium://'
const UNIVERSAL_LINK_BASE = 'https://helium.com/'
const UNIVERSAL_LINK_WWW_BASE = 'https://www.helium.com/'

// Define subclasses of Error to return address-specific errors when attempting to process scanned
// payloads from QR codes
export enum AddressType {
  HotspotAddress = 'Hotspot Address',
  SenderAddress = 'Sender Address',
  ReceiverAddress = 'Receiver Address',
}
export class MissingAddressError extends Error {
  addressType: AddressType

  constructor(addressType: AddressType = AddressType.HotspotAddress) {
    super(`Missing required ${addressType}`)
    this.addressType = addressType
  }
}
export class InvalidAddressError extends Error {
  addressType: AddressType

  constructor(addressType: AddressType = AddressType.HotspotAddress) {
    super(`Invalid ${addressType}`)
    this.addressType = addressType
  }
}
export class MismatchedAddressError extends Error {
  addressType: AddressType

  constructor(addressType: AddressType) {
    super(`Mismatched ${addressType} for account`)
    this.addressType = addressType
  }
}
const assertValidAddress = (
  address: string,
  addressType: AddressType = AddressType.HotspotAddress,
) => {
  if (!address) throw new MissingAddressError(addressType)
  if (!Address.isValid(address)) throw new InvalidAddressError(addressType)
}
const assertCurrentSenderAddress = async (senderAddress: string) => {
  const current = await getAddress()
  if (current?.b58 !== senderAddress) {
    throw new MismatchedAddressError(AddressType.SenderAddress)
  }
}
async function assertPaymentAddresses(data: AppLinkPayment) {
  if (data.senderAddress) {
    // If a senderAddress is provided, ensure that it's both a valid wallet address and that
    // it matches the current wallet address
    assertValidAddress(data.senderAddress, AddressType.SenderAddress)
    await assertCurrentSenderAddress(data.senderAddress)
  }
  if (data.payees?.length > 0) {
    data.payees.forEach(({ address }) =>
      assertValidAddress(address, AddressType.ReceiverAddress),
    )
  }
}

// ScanDataType describes both the scanned data format as well as intended use.
// For example, multiple types are intended to pre-fill the payment "send" form but can provide
// varying levels of information (like single or multiple recipients, optional memo fields, etc).
enum ScanDataType {
  // Deeplink to somewhere in the app
  DEEPLINK,
  // Hotspot address update
  LOCATION_UPDATE,
  // DC burn
  DC_BURN,
  // Hotspot transfer
  TRANSFER,
  // Hotspot transfer with only address provided
  TRANSFER_ADDRESS_ONLY,
  // Payment
  PAYMENT,
  // Payment with only address provided
  PAYMENT_ADDRESS_ONLY,
  // Payment to multiple recipients
  PAYMENT_MULTI,
  // Payment to multiple recipients and optional memos
  PAYMENT_MULTI_MEMO,
  // Assert the gain/elevation of a hotspot's antenna
  ANTENNA_GAIN_ASSERT,
}

function isDeeplink(data: string) {
  try {
    const parsed = queryString.parseUrl(data)
    return (
      parsed.url.includes(APP_LINK_PROTOCOL) &&
      parsed.url.includes(UNIVERSAL_LINK_BASE) &&
      parsed.url.includes(UNIVERSAL_LINK_WWW_BASE)
    )
  } catch (err) {}
}

function isLocationUpdate(data: string) {
  try {
    const dataObj = JSON.parse(data)
    return dataObj.lat && dataObj.lng && dataObj.address
  } catch (err) {}
}

function isDcBurn(data: string, scanType?: AppLinkCategoryType) {
  try {
    const dataObj = JSON.parse(data)
    const type = dataObj.type || scanType
    return type === 'dc_burn' && dataObj.address
  } catch (err) {}
}

function isTransfer(data: string, scanType?: AppLinkCategoryType) {
  try {
    const dataObj = JSON.parse(data)
    const type = dataObj.type || scanType
    return type === 'transfer' && dataObj.newOwnerAddress
  } catch (err) {}
}

function isTransferAddressOnly(data: string, scanType?: AppLinkCategoryType) {
  return scanType === 'transfer' && Address.isValid(data)
}

function isPayment(data: string, scanType?: AppLinkCategoryType) {
  try {
    const dataObj = JSON.parse(data)
    const type = dataObj.type || scanType
    return type === 'payment' && dataObj.address
  } catch (err) {}
}

function isPaymentAddressOnly(data: string, scanType?: AppLinkCategoryType) {
  return scanType === 'payment' && Address.isValid(data)
}

function isPaymentMulti(data: string, scanType?: AppLinkCategoryType) {
  // data = { payees: { [payeeAddress]: amount } }
  type Payees = Record<string, number>

  try {
    const dataObj = JSON.parse(data)
    const type = dataObj.type || scanType
    return (
      type === 'payment' &&
      dataObj.payees &&
      typeof Object.values(dataObj.payees as Payees)[0] === 'number'
    )
  } catch (err) {}
}

function isPaymentMultiMemo(data: string, scanType?: AppLinkCategoryType) {
  // data = { payees: { [payeeAddress]: { amount: number, memo?: string } } }
  type Payees = Record<string, { amount: number; memo?: string }>

  try {
    const dataObj = JSON.parse(data)
    const type = dataObj.type || scanType
    return (
      type === 'payment' &&
      dataObj.payees &&
      typeof Object.values(dataObj.payees as Payees)[0]?.amount === 'number'
    )
  } catch (err) {}
}

function isAntennaGainAssert(data: string, scanType?: AppLinkCategoryType) {
  try {
    const dataObj = JSON.parse(data)
    const type = dataObj.type || scanType
    return type === 'hotspot_antenna'
  } catch (err) {}
}

function getDataScanType(
  data: string,
  scanType?: AppLinkCategoryType,
): ScanDataType | undefined {
  if (isDeeplink(data)) return ScanDataType.DEEPLINK
  if (isLocationUpdate(data)) return ScanDataType.LOCATION_UPDATE
  if (isDcBurn(data, scanType)) return ScanDataType.DC_BURN
  if (isTransfer(data, scanType)) return ScanDataType.TRANSFER
  if (isTransferAddressOnly(data, scanType))
    return ScanDataType.TRANSFER_ADDRESS_ONLY
  if (isPayment(data, scanType)) return ScanDataType.PAYMENT
  if (isPaymentAddressOnly(data, scanType))
    return ScanDataType.PAYMENT_ADDRESS_ONLY
  if (isPaymentMulti(data, scanType)) return ScanDataType.PAYMENT_MULTI
  if (isPaymentMultiMemo(data, scanType)) return ScanDataType.PAYMENT_MULTI_MEMO
  if (isAntennaGainAssert(data, scanType))
    return ScanDataType.ANTENNA_GAIN_ASSERT
}

export const createAppLink = (
  resource: AppLinkCategoryType,
  resourceId: string,
) => `${APP_LINK_PROTOCOL}${resource}/${resourceId}`

const useAppLink = () => {
  const [unhandledAppLink, setUnhandledLink] = useState<
    AppLink | AppLinkPayment | null
  >(null)

  const {
    app: { isLocked, isBackedUp },
  } = useSelector((state: RootState) => state)

  useMount(() => {
    Linking.addEventListener('url', ({ url: nextUrl }) => {
      if (!nextUrl) return

      const link = parseUrl(nextUrl)
      if (!link) return
      navToAppLink(link)
    })
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL()
      if (!initialUrl) return

      const link = parseUrl(initialUrl)
      if (!link) return
      navToAppLink(link)
    }

    getUrlAsync()
  })

  const navToAppLink = useCallback(
    (
      record:
        | AppLink
        | AppLinkPayment
        | AppLinkLocation
        | AppLinkAntenna
        | AppLinkTransfer
        | LinkWalletRequest
        | SignHotspotRequest,
    ) => {
      if (isLocked || !isBackedUp) {
        setUnhandledLink(record as AppLink)
        return
      }

      switch (record.type) {
        case 'hotspot':
          navigator.viewHotspot((record as AppLink).address)
          break

        case 'validator':
          navigator.viewValidator((record as AppLink).address)
          break

        case 'dc_burn':
        case 'payment':
        case 'transfer':
          navigator.send({
            scanResult: record as AppLink | AppLinkPayment | AppLinkTransfer,
          })
          break

        case 'add_gateway': {
          const { address: txnStr } = record as AppLink
          if (!txnStr) return

          navigator.confirmAddGateway(txnStr)
          break
        }

        case 'hotspot_location': {
          const {
            hotspotAddress,
            longitude,
            latitude,
          } = record as AppLinkLocation
          navigator.updateHotspotLocation({
            hotspotAddress,
            location: { latitude, longitude },
          })
          break
        }
        case 'link_wallet':
          navigator.linkWallet(record as LinkWalletRequest)
          break
        case 'sign_hotspot':
          navigator.signHotspot(record as SignHotspotRequest)
          break
        case 'hotspot_antenna': {
          const { hotspotAddress, gain, elevation } = record as AppLinkAntenna
          navigator.updateHotspotAntenna({
            hotspotAddress,
            gain,
            elevation,
          })
          break
        }
      }
    },
    [isLocked, isBackedUp],
  )

  useEffect(() => {
    // Links will be handled once the app is unlocked
    if (!unhandledAppLink || isLocked || !isBackedUp) return

    navToAppLink(unhandledAppLink)
    setUnhandledLink(null)
  }, [isLocked, navToAppLink, unhandledAppLink, isBackedUp])

  const parseUrl = useCallback((url: string) => {
    if (!url) return

    const parsed = queryString.parseUrl(url)
    if (
      !parsed.url.includes(APP_LINK_PROTOCOL) &&
      !parsed.url.includes(UNIVERSAL_LINK_BASE) &&
      !parsed.url.includes(UNIVERSAL_LINK_WWW_BASE)
    ) {
      return
    }

    const params = queryString.parse(queryString.extract(url))
    const record = AppLinkFields.reduce(
      (obj, k) => ({ ...obj, [k]: parsed.query[k] }),
      params,
    ) as AppLink

    const path = parsed.url
      .replace(APP_LINK_PROTOCOL, '')
      .replace(UNIVERSAL_LINK_BASE, '')
      .replace(UNIVERSAL_LINK_WWW_BASE, '')
    const [resourceType, ...rest] = path.split('/')
    if (resourceType && AppLinkCategories.find((k) => k === resourceType)) {
      record.type = resourceType as AppLinkCategoryType
    }
    if (rest?.length) {
      record.address = rest.join('/')
    }

    if (!record.type || !AppLinkCategories.find((k) => k === record.type)) {
      throw new Error(`Unsupported QR Type: ${record.type}`)
    }
    return record
  }, [])

  const parseLocation = (data: string): AppLinkLocation | undefined => {
    try {
      const dataObj = JSON.parse(data)
      if (dataObj.lat && dataObj.lng && dataObj.address) {
        return {
          type: 'hotspot_location',
          hotspotAddress: dataObj.address,
          latitude: dataObj.lat,
          longitude: dataObj.lng,
        }
      }
    } catch (err) {}
  }

  const parseBarCodeData = useCallback(
    async (
      data: string,
      scanType: AppLinkCategoryType,
    ): Promise<
      | AppLink
      | AppLinkPayment
      | AppLinkLocation
      | AppLinkAntenna
      | AppLinkTransfer
    > => {
      if (!data) throw new Error('Missing required data')
      const scanDataType = getDataScanType(data, scanType)

      if (scanDataType === ScanDataType.DEEPLINK) {
        return parseUrl(data) as AppLink
      }

      if (scanDataType === ScanDataType.LOCATION_UPDATE) {
        const location = parseLocation(data) as AppLinkLocation
        assertValidAddress(location.hotspotAddress, AddressType.HotspotAddress)
        return location
      }

      if (scanDataType === ScanDataType.DC_BURN) {
        const rawScanResult = JSON.parse(data)
        const scanResult: AppLink = {
          type: 'dc_burn',
          address: rawScanResult.address,
          amount: rawScanResult.amount,
          memo: rawScanResult.memo,
        }
        // TODO: Validate sender ownership?
        assertValidAddress(scanResult.address, AddressType.SenderAddress)
        return scanResult
      }

      if (scanDataType === ScanDataType.TRANSFER) {
        const rawScanResult = JSON.parse(data)
        const scanResult: AppLinkTransfer = {
          type: 'transfer',
          newOwnerAddress: rawScanResult.newOwnerAddress,
          hotspotAddress: rawScanResult.hotspotAddress,
          skipActivityCheck: rawScanResult.skipActivityCheck,
          isSeller: rawScanResult.isSeller,
        }
        // TODO: Validate sender ownership?
        assertValidAddress(
          scanResult.newOwnerAddress,
          AddressType.ReceiverAddress,
        )
        if (scanResult.hotspotAddress) {
          assertValidAddress(
            scanResult.hotspotAddress,
            AddressType.HotspotAddress,
          )
        }
        return scanResult
      }

      if (scanDataType === ScanDataType.TRANSFER_ADDRESS_ONLY) {
        const scanResult: AppLinkTransfer = {
          type: 'transfer',
          newOwnerAddress: data,
        }
        // TODO: Validate sender ownership?
        assertValidAddress(
          scanResult.newOwnerAddress,
          AddressType.ReceiverAddress,
        )
        return scanResult
      }

      if (scanDataType === ScanDataType.PAYMENT) {
        const rawScanResult = JSON.parse(data)
        const scanResult: AppLinkPayment = {
          type: 'payment',
          senderAddress: rawScanResult.senderAddress,
          payees: [
            {
              address: rawScanResult.address,
              amount: rawScanResult.amount,
              memo: rawScanResult.memo,
            },
          ],
        }
        await assertPaymentAddresses(scanResult)
        return scanResult
      }

      if (scanDataType === ScanDataType.PAYMENT_ADDRESS_ONLY) {
        const scanResult: AppLinkPayment = {
          type: scanType,
          payees: [{ address: data }],
        }
        await assertPaymentAddresses(scanResult)
        return scanResult
      }

      if (scanDataType === ScanDataType.PAYMENT_MULTI) {
        const rawScanResult = JSON.parse(data)
        const scanResult: AppLinkPayment = {
          type: 'payment',
          senderAddress: rawScanResult.senderAddress,
          payees: Object.entries(rawScanResult.payees).map((entries) => ({
            address: entries[0],
            amount: entries[1] as number,
          })),
        }
        await assertPaymentAddresses(scanResult)
        return scanResult
      }

      if (scanDataType === ScanDataType.PAYMENT_MULTI_MEMO) {
        const rawScanResult = JSON.parse(data)
        const scanResult: AppLinkPayment = {
          type: 'payment',
          senderAddress: rawScanResult.senderAddress,
          payees: Object.entries(rawScanResult.payees).map((entries) => ({
            address: entries[0],
            amount: (entries[1] as { amount?: number; memo?: string }).amount,
            memo: (entries[1] as { amount?: number; memo?: string }).memo,
          })),
        }
        await assertPaymentAddresses(scanResult)
        return scanResult
      }

      if (scanDataType === ScanDataType.ANTENNA_GAIN_ASSERT) {
        const rawScanResult = JSON.parse(data)
        const scanResult: AppLinkAntenna = {
          type: 'hotspot_antenna',
          hotspotAddress: rawScanResult.hotspotAddress,
          gain: rawScanResult.gain,
          elevation: rawScanResult.elevation,
        }
        assertValidAddress(scanResult.hotspotAddress)
        return scanResult
      }

      throw new Error('Unknown scan type')
    },
    [parseUrl],
  )

  const handleBarCode = useCallback(
    async (
      { data }: BarCodeScanningResult,
      scanType: AppLinkCategoryType,
      opts?: Record<string, string>,
      assertScanResult?: (
        scanResult:
          | AppLink
          | AppLinkPayment
          | AppLinkLocation
          | AppLinkAntenna
          | AppLinkTransfer,
      ) => void,
    ) => {
      const scanResult = await parseBarCodeData(data, scanType)
      if (assertScanResult) assertScanResult(scanResult)

      navToAppLink({ ...scanResult, ...opts })
    },
    [navToAppLink, parseBarCodeData],
  )

  return { handleBarCode }
}

const initialState = {
  handleBarCode: () => new Promise<void>((resolve) => resolve()),
}

const LinkContext = createContext<ReturnType<typeof useAppLink>>(initialState)

const { Provider } = LinkContext

const AppLinkProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useAppLink()}>{children}</Provider>
}

export const useAppLinkContext = () => useContext(LinkContext)

export default AppLinkProvider
