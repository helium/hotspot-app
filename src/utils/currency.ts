/* eslint-disable import/prefer-default-export */
import Balance, { DataCredits, NetworkTokens } from '@helium/currency'
import Client from '@helium/http'

export const networkTokensToDataCredits = async (
  amount: Balance<NetworkTokens>,
): Promise<Balance<DataCredits>> => {
  const client = new Client()
  const { price: oraclePrice } = await client.oracle.getCurrentPrice()
  return amount.toDataCredits(oraclePrice)
}
