import * as Logger from './logger'

const breadcrumbOpts = { type: 'HTTP Request', category: 'coinGeckoClient' }

// eslint-disable-next-line import/prefer-default-export
export const getCurrentPrices = async () => {
  Logger.breadcrumb('getCurrentPrices', breadcrumbOpts)
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/helium?localization=false&tickers=false&community_data=false&developer_data=false',
  )
  const json = await response.json()
  if (json?.market_data?.current_price) {
    return json?.market_data?.current_price as Record<string, number>
  }
  return undefined
}
