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
import { BarCodeScannerResult } from 'expo-barcode-scanner'
import { Address } from '@helium/crypto-react-native'
import { useSelector } from 'react-redux'
import useMount from '../utils/useMount'
import { RootState } from '../store/rootReducer'
import navigator from '../navigation/navigator'
import {
  AppLink,
  AppLinkFields,
  AppLinkCategories,
  AppLinkCategoryType,
  AppLinkPayment,
} from './appLinkTypes'

const APP_LINK_PROTOCOL = 'helium://'

export const createAppLink = (
  resource: AppLinkCategoryType,
  resourceId: string,
) => `${APP_LINK_PROTOCOL}${resource}/${resourceId}`

const useAppLink = () => {
  const [unhandledAppLink, setUnhandledLink] = useState<
    AppLink | AppLinkPayment | null
  >(null)

  const {
    app: { isPinRequiredForPayment, isLocked, isBackedUp },
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
    (record: AppLink | AppLinkPayment) => {
      if (isLocked || !isBackedUp) {
        setUnhandledLink(record)
        return
      }

      switch (record.type) {
        case 'hotspot':
          navigator.viewHotspot((record as AppLink).address)
          break

        case 'dc_burn':
        case 'payment':
        case 'transfer': {
          if (isPinRequiredForPayment) {
            navigator.lock({
              requestType: 'send',
              scanResult: record,
            })
          } else {
            navigator.send({ scanResult: record })
          }
        }
      }
    },
    [isLocked, isPinRequiredForPayment, isBackedUp],
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
    if (!parsed.url.includes(APP_LINK_PROTOCOL)) return

    const record = AppLinkFields.reduce(
      (obj, k) => ({ ...obj, [k]: parsed.query[k] }),
      {},
    ) as AppLink

    const path = parsed.url.replace(APP_LINK_PROTOCOL, '')
    const [resourceType, resourceId] = path.split('/')
    if (resourceType && AppLinkCategories.find((k) => k === resourceType)) {
      record.type = resourceType as AppLinkCategoryType
    }
    if (resourceId) {
      record.address = resourceId
    }

    if (!record.type || !AppLinkCategories.find((k) => k === record.type)) {
      throw new Error(`Unsupported QR Type: ${record.type}`)
    }
    return record
  }, [])

  /**
   * The data scanned from the QR code is expected to be one of these possibilities:
   * (1) A helium deeplink URL
   * (2) address string
   * (3) stringified JSON object { type, address, amount?, memo? }
   * (4) stringified JSON object { type, payees: [{ address, amount?, memo? }] }
   */
  const parseBarCodeData = useCallback(
    (data: string, scanType: AppLinkCategoryType): AppLink | AppLinkPayment => {
      const assertValidAddress = (address: string) => {
        if (!address || !Address.isValid(address)) {
          throw new Error('Invalid transaction encoding')
        }
      }

      // Case (1) helium deeplink URL
      const urlParams = parseUrl(data)
      if (urlParams) {
        return urlParams
      }

      // Case (2) address string
      if (Address.isValid(data)) {
        return {
          type: scanType,
          payees: [{ address: data }],
        }
      }

      try {
        const rawScanResult = JSON.parse(data)
        const type = rawScanResult.type || scanType

        if (type === 'dc_burn') {
          // Case (3) stringified JSON { type, address, amount?, memo? }
          const scanResult: AppLink = {
            type,
            address: rawScanResult.address,
            amount: rawScanResult.amount,
            memo: rawScanResult.memo,
          }
          assertValidAddress(scanResult.address)
          return scanResult
        }

        if (type === 'payment') {
          let scanResult: AppLinkPayment
          if (rawScanResult.address) {
            // Case (3) stringified JSON { type, address, amount?, memo? }
            scanResult = {
              type,
              payees: [
                {
                  address: rawScanResult.address,
                  amount: rawScanResult.amount,
                  memo: rawScanResult.memo,
                },
              ],
            }
          } else if (rawScanResult.payees) {
            // Case (4) stringified JSON { type, payees: [{ address, amount?, memo? }] }
            scanResult = {
              type,
              payees: rawScanResult.payees,
            }
          } else {
            throw new Error('Invalid transaction encoding')
          }

          scanResult.payees.forEach(({ address }) =>
            assertValidAddress(address),
          )
          return scanResult
        }
        throw new Error('Invalid transaction encoding')
      } catch (error) {
        throw new Error('Invalid transaction encoding')
      }
    },
    [parseUrl],
  )

  const handleBarCode = useCallback(
    async ({ data }: BarCodeScannerResult, scanType: AppLinkCategoryType) => {
      const scanResult = parseBarCodeData(data, scanType)
      navToAppLink(scanResult)
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
