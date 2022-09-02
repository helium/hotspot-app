import { Keypair, Mnemonic } from '@helium/crypto-react-native'
import { LinkWalletRequest, makeAppLinkAuthToken } from '@helium/wallet-link'
import { getUnixTime } from 'date-fns'
import * as SecureStore from 'expo-secure-store'
import OneSignal from 'react-native-onesignal'
import Address, { NetTypes } from '@helium/address'

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

type KeypairParams = {
  mnemonic?: Mnemonic | Array<string>
  netType?: NetTypes.NetType
  wordCount?: 12 | 24
}
export const createKeypair = async ({
  mnemonic,
  netType,
  wordCount,
}: KeypairParams) => {
  let newMnemonic: Mnemonic
  if (!mnemonic) {
    newMnemonic = await Mnemonic.create(wordCount)
  } else if ('words' in mnemonic) {
    newMnemonic = mnemonic
  } else {
    newMnemonic = new Mnemonic(mnemonic)
  }
  const { keypair: keypairRaw, address } = await Keypair.fromMnemonic(
    newMnemonic,
    netType,
  )

  OneSignal.sendTags({ address: address.b58 })

  await Promise.all([
    setSecureItem('mnemonic', JSON.stringify(newMnemonic.words)),
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
  const signature = await keypair.sign(stringifiedToken)

  return Buffer.from(signature).toString('base64')
}

export const makeDiscoverySignature = async (hotspotAddress: string) => {
  const keypair = await getKeypair()
  if (!keypair) return
  const signature = await keypair.sign(hotspotAddress)

  return Buffer.from(signature).toString('base64')
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

export const createLinkToken = async (
  token: LinkWalletRequest & {
    signingAppId: string
    address: string
  },
) => {
  const keypair = await getKeypair()
  if (!keypair) return
  const time = getUnixTime(new Date())
  return makeAppLinkAuthToken(
    {
      time,
      ...token,
    },
    keypair,
  )
}

export const signOut = async () => {
  OneSignal.deleteTag('address')
  return Promise.all(
    [...stringKeys, ...boolKeys].map((key) => deleteSecureItem(key)),
  )
}
