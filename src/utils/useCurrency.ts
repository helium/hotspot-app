/* eslint-disable import/prefer-default-export */
import Balance, {
  CurrencyType,
  DataCredits,
  NetworkTokens,
} from '@helium/currency'
import { isEqual } from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../store/rootReducer'
import { getCurrentOraclePrice } from './appDataClient'
import {
  currencyType,
  decimalSeparator,
  groupSeparator,
  useLanguage,
} from './i18n'

const useCurrency = () => {
  const { t } = useTranslation()
  const { formatCurrency } = useLanguage()
  const currentPrices = useSelector(
    (state: RootState) => state.heliumData.currentPrices,
    isEqual,
  )

  const convert = useSelector(
    (state: RootState) => state.app.convertHntToCurrency,
    isEqual,
  )

  const networkTokensToDataCredits = useCallback(
    async (amount: Balance<NetworkTokens>): Promise<Balance<DataCredits>> => {
      const { price: oraclePrice } = await getCurrentOraclePrice()
      return amount.toDataCredits(oraclePrice)
    },
    [],
  )

  type StringReturn = (balance: Balance<NetworkTokens>, split: false) => string
  type PartsReturn = (
    balance: Balance<NetworkTokens>,
    split: true,
  ) => { integerPart: string; decimalPart: string }

  const displayValue = useCallback(
    (balance: Balance<NetworkTokens>, split: boolean) => {
      const localeCurrency = currencyType
      const multiplier = currentPrices?.[localeCurrency.toLowerCase()] || 0

      const showHNT = !convert || !multiplier
      if (showHNT) {
        if (split) {
          const [intStr, decStr] = balance
            .toString(undefined, {
              decimalSeparator,
              groupSeparator,
              showTicker: false,
            })
            .split(decimalSeparator)

          const decimalPart = [
            decimalSeparator,
            decStr,
            ' ',
            CurrencyType.networkToken.ticker,
          ].join('')

          return { integerPart: intStr, decimalPart }
        }
        return balance.toString(8)
      }

      const convertedValue = formatCurrency(multiplier * balance.floatBalance)

      if (split) {
        const decimalPart = t('generic.hnt_to_currency', { currencyType })
        return { integerPart: convertedValue, decimalPart }
      }
      return convertedValue
    },
    [convert, currentPrices, formatCurrency, t],
  ) as StringReturn & PartsReturn

  return { networkTokensToDataCredits, displayValue }
}

export default useCurrency
