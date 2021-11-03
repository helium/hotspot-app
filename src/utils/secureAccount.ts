import { Address, Keypair, Mnemonic } from '@helium/crypto-react-native'
import * as SecureStore from 'expo-secure-store'
import OneSignal from 'react-native-onesignal'
import * as Logger from './logger'

type AccountStoreKey = BooleanKey | StringKey

const stringKeys = [
  'mnemonic',
  'keypair',
  'address',
  'userPin',
  'authInterval',
  'walletApiToken',
  'language',
  'permanentPaymentAddress',
  'appLinkAuthTokens',
] as const
type StringKey = typeof stringKeys[number]

const boolKeys = [
  'accountBackedUp',
  'isSettingUpHotspot',
  'requirePin',
  'requirePinForPayment',
  'hapticDisabled',
  'convertHntToCurrency',
  'deployModeEnabled',
  'fleetModeEnabled',
  'hasFleetModeAutoEnabled',
] as const
type BooleanKey = typeof boolKeys[number]

export const setSecureItem = async (
  key: AccountStoreKey,
  val: string | boolean,
) => SecureStore.setItemAsync(key, String(val))

export async function getSecureItem(key: BooleanKey): Promise<boolean>
export async function getSecureItem(key: StringKey): Promise<string | null>
export async function getSecureItem(key: AccountStoreKey) {
  const item = await SecureStore.getItemAsync(key)
  if (boolKeys.find((bk) => key === bk)) {
    return item === 'true'
  }
  return item
}

export const deleteSecureItem = async (key: AccountStoreKey) =>
  SecureStore.deleteItemAsync(key)

export const createKeypair = async (
  givenMnemonic: Mnemonic | Array<string> | null = null,
) => {
  let mnemonic: Mnemonic
  if (!givenMnemonic) {
    mnemonic = await Mnemonic.create()
  } else if ('words' in givenMnemonic) {
    mnemonic = givenMnemonic
  } else {
    mnemonic = new Mnemonic(givenMnemonic)
  }
  const { keypair: keypairRaw, address } = await Keypair.fromMnemonic(mnemonic)

  OneSignal.sendTags({ address: address.b58 })
  Logger.setUser(address.b58)

  await Promise.all([
    setSecureItem('mnemonic', JSON.stringify(mnemonic.words)),
    setSecureItem('keypair', JSON.stringify(keypairRaw)),
    setSecureItem('address', address.b58),
  ])
}

export const getAddress = async (): Promise<Address | undefined> => {
  const addressB58 = await getSecureItem('address')
  if (!addressB58) return

  return Address.fromB58(addressB58)
}

export const getMnemonic = async (): Promise<Mnemonic | undefined> => {
  const wordsStr = await getSecureItem('mnemonic')
  if (!wordsStr) return

  let words: string[] = []
  try {
    words = JSON.parse(wordsStr) // The new (v3) app uses JSON.stringify ['hello', 'one', 'two', 'etc'] => "[\"hello\",\"one\",\"two\",\"etc\"]"
  } catch (e) {
    words = wordsStr.split(' ') // The old (v2) app space separated "hello one two etc"
    setSecureItem('mnemonic', JSON.stringify(words)) // upgrade the users to the new format
  }
  return new Mnemonic(words)
}

export const getKeypair = async (): Promise<Keypair | undefined> => {
  const keypairStr = await getSecureItem('keypair')
  if (keypairStr) {
    const keypairRaw = JSON.parse(keypairStr)
    return new Keypair(keypairRaw)
  }
}

const makeSignature = async (token: { address: string; time: number }) => {
  const stringifiedToken = JSON.stringify(token)
  const keypair = await getKeypair()
  if (!keypair) return
  const buffer = await keypair.sign(stringifiedToken)

  return buffer.toString('base64')
}

export const makeDiscoverySignature = async (hotspotAddress: string) => {
  const keypair = await getKeypair()
  if (!keypair) return
  const buffer = await keypair.sign(hotspotAddress)

  return buffer.toString('base64')
}

const makeWalletApiToken = async (address: string) => {
  const time = Math.floor(Date.now() / 1000)

  const token = {
    address,
    time,
  }

  const signature = await makeSignature(token)

  const signedToken = { ...token, signature }
  return Buffer.from(JSON.stringify(signedToken)).toString('base64')
}

export const getWalletApiToken = async () => {
  const existingToken = await getSecureItem('walletApiToken')
  if (existingToken) return existingToken

  const address = await getSecureItem('address')
  if (!address) return

  const apiToken = await makeWalletApiToken(address)
  await setSecureItem('walletApiToken', apiToken)
  return apiToken
}

export const addAppLinkAuthToken = async (token: string) => {
  const tokens = await getSecureItem('appLinkAuthTokens')
  const tokenArr: string[] = tokens ? JSON.parse(tokens) : []
  const nextTokens = [token, ...tokenArr]
  return setSecureItem('appLinkAuthTokens', JSON.stringify(nextTokens))
}

export const hasAppLinkAuthToken = async (token: string) => {
  const tokens = await getSecureItem('appLinkAuthTokens')
  const tokenArr: string[] = tokens ? JSON.parse(tokens) : []
  return !!tokenArr.find((t) => t === token)
}

export const signOut = async () => {
  OneSignal.deleteTag('address')
  return Promise.all(
    [...stringKeys, ...boolKeys].map((key) => deleteSecureItem(key)),
  )
}
