import React, { createContext, ReactNode, useCallback, useContext } from 'react'
import { Linking } from 'react-native'
import queryString from 'query-string'
import { BarCodeScannerResult } from 'expo-barcode-scanner'
import { Address } from '@helium/crypto-react-native'
import { useSelector } from 'react-redux'
import useMount from '../utils/useMount'
import { RootState } from '../store/rootReducer'
import navigator from '../navigation/navigator'
import { AppLink, AppLinkType, AppLinkKeys } from './appLinkTypes'

const useLink = () => {
  const {
    app: { isPinRequiredForPayment },
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
    [isPinRequiredForPayment],
  )

  const parseUrl = useCallback((url: string) => {
    if (!url) return

    const parsed = queryString.parseUrl(url)
    if (parsed.url !== 'helium://app') return

    return AppLinkKeys.reduce(
      (obj, k) => ({ ...obj, [k]: parsed.query[k] }),
      {},
    ) as AppLink
  }, [])

  const parseBarCodeData = useCallback(
    (data: string, scanType: AppLinkType): AppLink => {
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
    async ({ data }: BarCodeScannerResult, scanType: AppLinkType) => {
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

const LinkContext = createContext<ReturnType<typeof useLink>>(initialState)

const { Provider } = LinkContext

const LinkProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useLink()}>{children}</Provider>
}

export const useLinkContext = () => useContext(LinkContext)

export default LinkProvider
