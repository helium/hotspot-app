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
import { Address } from '@helium/crypto-react-native'
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
  Payee,
  AppLinkLocation,
  LinkWalletRequest,
  SignHotspotRequest,
  AppLinkAntenna,
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
        | LinkWalletRequest
        | SignHotspotRequest
        | AppLinkAntenna,
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
          navigator.send({ scanResult: record as AppLink | AppLinkPayment })
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

  /**
   * The data scanned from the QR code is expected to be one of these possibilities:
   * (1) A helium deeplink URL
   * (2) stringified JSON object { address, lat, lng } (for hotspot location updates)
   * (3) address string
   * (4) stringified JSON object { type, senderAddress?, address, amount?, memo? }
   * (5) stringified JSON object { type, senderAddress?, payees: {[payeeAddress]: amount} }
   * (6) stringified JSON object { type, senderAddress?, payees: {[payeeAddress]: { amount, memo? }} }
   * (7) stringified JSON object { type: "antenna_update", hotspot_address, elevation, gain }
   */
  const parseBarCodeData = useCallback(
    async (
      data: string,
      scanType: AppLinkCategoryType,
    ): Promise<AppLink | AppLinkPayment | AppLinkLocation | AppLinkAntenna> => {
      // Case (1) helium deeplink URL
      const urlParams = parseUrl(data)
      if (urlParams) {
        return urlParams
      }

      // Case (2) lat/lng pair
      const location = parseLocation(data)
      if (location) {
        assertValidAddress(location.hotspotAddress)
        return location
      }

      // Case (3) address string
      if (Address.isValid(data)) {
        if (scanType === 'transfer') {
          return {
            type: scanType,
            address: data,
          }
        }
        return {
          type: scanType,
          payees: [{ address: data }],
        }
      }

      const rawScanResult = JSON.parse(data)
      const type = rawScanResult.type || scanType

      if (type === 'dc_burn') {
        // Case (4) stringified JSON { type, address, amount?, memo? }
        const scanResult: AppLink = {
          type,
          address: rawScanResult.address,
          amount: rawScanResult.amount,
          memo: rawScanResult.memo,
        }
        assertValidAddress(scanResult.address, AddressType.SenderAddress)
        return scanResult
      }

      if (type === 'payment') {
        let scanResult: AppLinkPayment
        if (rawScanResult.address) {
          // Case (4) stringified JSON { type, senderAddress?, address, amount?, memo? }
          scanResult = {
            type,
            senderAddress: rawScanResult.senderAddress,
            payees: [
              {
                address: rawScanResult.address,
                amount: rawScanResult.amount,
                memo: rawScanResult.memo,
              },
            ],
          }
        } else if (rawScanResult.payees) {
          scanResult = {
            type,
            senderAddress: rawScanResult.senderAddress,
            payees: Object.entries(rawScanResult.payees).map((entries) => {
              let amount
              let memo
              if (entries[1]) {
                if (typeof entries[1] === 'number') {
                  // Case (5) stringified JSON object { type, senderAddress?, payees: {[payeeAddress]: amount} }
                  amount = entries[1] as number
                } else if (typeof entries[1] === 'object') {
                  // Case (6) stringified JSON object { type, senderAddress?, payees: {[payeeAddress]: { amount, memo? }} }
                  const scanData = entries[1] as {
                    amount: string
                    memo?: string
                  }
                  amount = scanData.amount
                  memo = scanData.memo
                }
              }
              return {
                address: entries[0],
                amount: `${amount}`,
                memo,
              } as Payee
            }),
          }
        } else {
          throw new Error('Unrecognized payload for payment scan')
        }

        if (scanResult.senderAddress) {
          // If a senderAddress is provided, ensure that it's both a valid wallet address and that
          // it matches the current wallet address
          assertValidAddress(
            scanResult.senderAddress,
            AddressType.SenderAddress,
          )
          await assertCurrentSenderAddress(scanResult.senderAddress)
        }
        scanResult.payees.forEach(({ address }) =>
          assertValidAddress(address, AddressType.ReceiverAddress),
        )
        return scanResult
      }

      if (type === 'antenna_update') {
        const {
          hotspot_address: hotspotAddress,
          gain,
          elevation,
        } = rawScanResult
        assertValidAddress(hotspotAddress)
        return {
          type: 'hotspot_antenna',
          hotspotAddress,
          gain,
          elevation,
        }
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
        scanResult: AppLink | AppLinkPayment | AppLinkLocation | AppLinkAntenna,
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
