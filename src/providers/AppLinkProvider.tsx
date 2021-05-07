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
} from './appLinkTypes'

const APP_LINK_PROTOCOL = 'helium://'

export const createAppLink = (
  resource: AppLinkCategoryType,
  resourceId: string,
) => `${APP_LINK_PROTOCOL}${resource}/${resourceId}`

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

  const parseBarCodeData = useCallback(
    (data: string, scanType: AppLinkCategoryType): AppLink => {
      const urlParams = parseUrl(data)
      if (urlParams) {
        return urlParams
      }

      if (Address.isValid(data)) {
        return {
          type: scanType,
          address: data,
        }
      }

      try {
        const scanResult: AppLink = JSON.parse(data)

        if (
          !['payment', 'dc_burn'].includes(scanResult.type) ||
          !scanResult.address ||
          !Address.isValid(scanResult.address)
        ) {
          throw new Error('Invalid transaction encoding')
        }

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
