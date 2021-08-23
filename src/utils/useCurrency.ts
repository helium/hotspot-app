import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { isEqual, round } from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useDebouncedCallback } from 'use-debounce'
import CurrencyFormatter from 'react-native-currency-format'
import { OraclePrice } from '@helium/http'
import { fetchCurrentOraclePrice } from '../store/helium/heliumDataSlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { currencyType, decimalSeparator, groupSeparator, locale } from './i18n'
import { updateSetting } from '../store/account/accountSlice'

const useCurrency = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const currentPrices = useSelector(
    (state: RootState) => state.heliumData.currentPrices,
    isEqual,
  )

  const convert = useSelector(
    (state: RootState) => state.account.settings.convertHntToCurrency,
  )

  const toggle = useCallback(
    () =>
      dispatch(updateSetting({ key: 'convertHntToCurrency', value: !convert })),
    [convert, dispatch],
  )

  const formatCurrency = useCallback(async (value: number) => {
    const formattedCurrency = await CurrencyFormatter.format(
      value,
      currencyType,
    )
    return formattedCurrency
  }, [])

  const toggleConvertHntToCurrency = useDebouncedCallback(toggle, 700, {
    leading: true,
    trailing: false,
  }).callback

  const networkTokensToDataCredits = useCallback(
    async (amount: Balance<NetworkTokens>) => {
      const result = await dispatch(fetchCurrentOraclePrice())
      const currentOracle = result?.payload as OraclePrice
      return amount.toDataCredits(currentOracle.price)
    },
    [dispatch],
  )

  const hntToDisplayVal = useCallback(
    async (amount: number, maxDecimalPlaces = 2) => {
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
  ) => Promise<string>
  type PartsReturn = (
    balance: Balance<NetworkTokens>,
    split?: true,
    maxDecimalPlaces?: number,
  ) => Promise<{ integerPart: string; decimalPart: string }>
  const hntBalanceToDisplayVal = useCallback(
    async (
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
      const formattedValue: string = await formatCurrency(convertedValue)

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
