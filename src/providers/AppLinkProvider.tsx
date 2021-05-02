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
import { get } from 'lodash'
import useMount from '../utils/useMount'
import { RootState } from '../store/rootReducer'
import navigator from '../navigation/navigator'
import {
  AppLink,
  AppLinkFields,
  AppLinkCategories,
  AppLinkCategoryType,
} from './appLinkTypes'

const useAppLink = () => {
  const [unhandledAppLink, setUnhandledLink] = useState<AppLink | null>(null)

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
    (record: AppLink) => {
      if (isLocked || !isBackedUp) {
        setUnhandledLink(record)
        return
      }

      switch (record.type) {
        case 'hotspot':
          navigator.viewHotspot(record.address)
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
    if (parsed.url !== 'helium://app') return

    const record = AppLinkFields.reduce((obj, k) => {
      if (k === 'type') return { ...obj, type: parsed.query.type }
      // Only one payee per URL is currently supported, so embed subsequent fields on single
      // payee object
      return {
        ...obj,
        payees: [{ ...get(obj, 'payees[0]', {}), [k]: parsed.query[k] }],
      }
    }, {}) as AppLink
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
    (data: string, scanType: AppLinkCategoryType): AppLink => {
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
        let scanResult: AppLink
        const rawScanResult = JSON.parse(data)

        if (rawScanResult.address) {
          // Case (3) stringified JSON { type, address, amount?, memo? }
          scanResult = {
            type: rawScanResult.type || scanType,
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
            type: rawScanResult.type || scanType,
            payees: rawScanResult.payees,
          }
        } else {
          // Unknown encoding
          throw new Error('Invalid transaction encoding')
        }

        // Validate attributes before returning
        if (!['payment', 'dc_burn'].includes(scanResult.type)) {
          throw new Error('Invalid transaction encoding')
        }
        scanResult.payees.forEach(({ address }) => {
          if (!address || !Address.isValid(address)) {
            throw new Error('Invalid transaction encoding')
          }
        })

        return scanResult
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
