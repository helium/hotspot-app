import Address, { NetTypes as NetType } from '@helium/address'
import { CurrencyType } from '@helium/currency'

export const accountCurrencyType = (address?: string) => {
  if (!address) return CurrencyType.default
  return accountNetType(address) === NetType.TESTNET
    ? CurrencyType.testNetworkToken
    : CurrencyType.default
}

export const networkCurrencyType = (netType?: NetType.NetType) => {
  return netType === NetType.TESTNET
    ? CurrencyType.testNetworkToken
    : CurrencyType.default
}

export const accountNetType = (address?: string) => {
  if (!address) return NetType.MAINNET
  return Address.fromB58(address)?.netType
}

export const getNetTypeString = (netType?: NetType.NetType) => {
  if (!netType) return 'mainnet'

  switch (netType) {
    default:
    case NetType.MAINNET: {
      return 'mainnet'
    }
    case NetType.TESTNET: {
      return 'testnet'
    }
  }
}

export const isMainnet = (address: string) => {
  return accountNetType(address) === NetType.MAINNET
}

export const isTestnet = (address: string) => {
  return accountNetType(address) === NetType.TESTNET
}

type EllipsizeOpts = {
  numChars?: number
}

export const ellipsizeAddress = (address: string, options?: EllipsizeOpts) => {
  const numChars = options?.numChars || 8
  return [address.slice(0, numChars), address.slice(-numChars)].join('...')
}
