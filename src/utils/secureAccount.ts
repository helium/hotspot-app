import { Keypair, Mnemonic, Address } from '@helium/crypto-react-native'
import * as SecureStore from 'expo-secure-store'

type AccountStoreKey = BooleanKey | StringKey

const stringKeys = [
  'mnemonic',
  'keypair',
  'address',
  'userPin',
  'authInterval',
] as const
type StringKey = typeof stringKeys[number]

const boolKeys = [
  'accountBackedUp',
  'isEducated',
  'isSettingUpHotspot',
  'requirePin',
  'requirePinForPayment',
] as const
type BooleanKey = typeof boolKeys[number]

export const setSecureItem = async (
  key: AccountStoreKey,
  val: string | boolean,
) => SecureStore.setItemAsync(key, String(val))

export async function getSecureItem(key: BooleanKey): Promise<boolean>
export async function getSecureItem(key: StringKey): Promise<string>
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

  await Promise.all([
    setSecureItem('mnemonic', JSON.stringify(mnemonic.words)),
    setSecureItem('keypair', JSON.stringify(keypairRaw)),
    setSecureItem('address', address.b58),
  ])
}

export const getAddress = async (): Promise<Address | undefined> => {
  const addressB58 = await getSecureItem('address')
  if (addressB58) {
    return Address.fromB58(addressB58)
  }
}

export const getMnemonic = async (): Promise<Mnemonic | undefined> => {
  const wordsStr = await getSecureItem('mnemonic')
  if (wordsStr) {
    const words = JSON.parse(wordsStr)
    return new Mnemonic(words)
  }
}

export const getKeypair = async (): Promise<Keypair | undefined> => {
  const keypairStr = await getSecureItem('keypair')
  if (keypairStr) {
    const keypairRaw = JSON.parse(keypairStr)
    return new Keypair(keypairRaw)
  }
}

export const signOut = async () =>
  Promise.all([...stringKeys, ...boolKeys].map((key) => deleteSecureItem(key)))
