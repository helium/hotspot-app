import { Keypair, Mnemonic, Address } from '@helium/crypto-react-native'
import * as SecureStore from 'expo-secure-store'

type AccountStoreKey = BooleanKey | StringKey

const stringKeys = ['mnemonic', 'keypair', 'address', 'userPin'] as const
type StringKey = typeof stringKeys[number]

const boolKeys = [
  'accountBackedUp',
  'isEducated',
  'isSettingUpHotspot',
  'requirePin',
] as const
type BooleanKey = typeof boolKeys[number]

export const setItem = async (key: AccountStoreKey, val: string | boolean) => {
  return SecureStore.setItemAsync(key, String(val))
}

export const getBoolean = async (key: BooleanKey) => {
  const val = await SecureStore.getItemAsync(key)
  return val === 'true'
}

export const getString = async (key: StringKey) => SecureStore.getItemAsync(key)

export const deleteItem = async (key: AccountStoreKey) =>
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
    setItem('mnemonic', JSON.stringify(mnemonic.words)),
    setItem('keypair', JSON.stringify(keypairRaw)),
    setItem('address', address.b58),
  ])
}

export const getAddress = async (): Promise<Address | undefined> => {
  const addressB58 = await getString('address')
  if (addressB58) {
    return Address.fromB58(addressB58)
  }
}

export const getMnemonic = async (): Promise<Mnemonic | undefined> => {
  const wordsStr = await getString('mnemonic')
  if (wordsStr) {
    const words = JSON.parse(wordsStr)
    return new Mnemonic(words)
  }
}

export const getKeypair = async (): Promise<Keypair | undefined> => {
  const keypairStr = await getString('keypair')
  if (keypairStr) {
    const keypairRaw = JSON.parse(keypairStr)
    return new Keypair(keypairRaw)
  }
}

export const signOut = async () =>
  Promise.all([...stringKeys, ...boolKeys].map((key) => deleteItem(key)))
