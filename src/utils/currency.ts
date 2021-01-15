/* eslint-disable import/prefer-default-export */
import Balance, { DataCredits, NetworkTokens } from '@helium/currency'
import { getCurrentOraclePrice } from './appDataClient'

export const networkTokensToDataCredits = async (
  amount: Balance<NetworkTokens>,
): Promise<Balance<DataCredits>> => {
  const { price: oraclePrice } = await getCurrentOraclePrice()
  return amount.toDataCredits(oraclePrice)
}
