import Balance, {
  CurrencyType,
  DataCredits,
  NetworkTokens,
} from '@helium/currency'
import { isEqual, round } from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { fetchCurrentOraclePrice } from '../store/helium/heliumDataSlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import appSlice from '../store/user/appSlice'
import {
  currencyType,
  decimalSeparator,
  groupSeparator,
  useLanguage,
  locale,
} from './i18n'

const useCurrency = () => {
  const { t } = useTranslation()
  const { formatCurrency } = useLanguage()
  const dispatch = useAppDispatch()
  const currentPrices = useSelector(
    (state: RootState) => state.heliumData.currentPrices,
    isEqual,
  )
  const oraclePrice = useSelector(
    (state: RootState) => state.heliumData.currentOraclePrice?.price,
    isEqual,
  )

  const convert = useSelector(
    (state: RootState) => state.app.convertHntToCurrency,
    isEqual,
  )

  const toggleConvertHntToCurrency = useCallback(() => {
    dispatch(appSlice.actions.toggleConvertHntToCurrency())
  }, [dispatch])

  const networkTokensToDataCredits = useCallback(
    (amount: Balance<NetworkTokens>): Balance<DataCredits> | null => {
      if (!oraclePrice) {
        dispatch(fetchCurrentOraclePrice())
        return null
      }
      return amount.toDataCredits(oraclePrice)
    },
    [dispatch, oraclePrice],
  )

  const hntToDisplayVal = useCallback(
    (amount: number, maxDecimalPlaces = 2) => {
      const multiplier = currentPrices?.[currencyType.toLowerCase()] || 0
      const showAsHnt = !convert || !multiplier

      if (showAsHnt) {
        return round(amount, maxDecimalPlaces).toLocaleString(locale)
      }

      const convertedValue = multiplier * amount
      return formatCurrency(convertedValue)
    },
    [convert, currentPrices, formatCurrency],
  )

  type StringReturn = (
    balance: Balance<NetworkTokens>,
    split?: false | undefined,
    maxDecimalPlaces?: number,
  ) => string
  type PartsReturn = (
    balance: Balance<NetworkTokens>,
    split?: true,
    maxDecimalPlaces?: number,
  ) => { integerPart: string; decimalPart: string }
  const hntBalanceToDisplayVal = useCallback(
    (
      balance: Balance<NetworkTokens>,
      split?: boolean,
      maxDecimalPlaces = 2,
    ) => {
      const multiplier = currentPrices?.[currencyType.toLowerCase()] || 0

      const showAsHnt = !convert || !multiplier
      if (showAsHnt) {
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

        return `${balance.toString(maxDecimalPlaces, {
          groupSeparator,
          decimalSeparator,
        })}`
      }

      const convertedValue = multiplier * balance.floatBalance
      const formattedValue = formatCurrency(convertedValue)

      if (split) {
        const decimalPart = t('generic.hnt_to_currency', { currencyType })
        return { integerPart: formattedValue, decimalPart }
      }
      return formattedValue
    },
    [convert, currentPrices, formatCurrency, t],
  ) as StringReturn & PartsReturn

  return {
    networkTokensToDataCredits,
    hntBalanceToDisplayVal,
    toggleConvertHntToCurrency,
    hntToDisplayVal,
  }
}

export default useCurrency
