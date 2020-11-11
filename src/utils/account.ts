import { Keypair, Mnemonic, Address } from '@helium/crypto-react-native'
import * as SecureStore from './SecureStore'

export const createKeypair = async (givenMnemonic: Mnemonic | null = null) => {
  const mnemonic = givenMnemonic || (await Mnemonic.create())
  const { keypair: keypairRaw, address } = await Keypair.fromMnemonic(mnemonic)
  await Promise.all([
    SecureStore.setItemAsync('mnemonic', JSON.stringify(mnemonic.words)),
    SecureStore.setItemAsync('keypair', JSON.stringify(keypairRaw)),
    SecureStore.setItemAsync('address', address.b58),
  ])
}

export const getAddress = async (): Promise<Address> => {
  const addressB58 = await SecureStore.getItemAsync('address')
  return Address.fromB58(addressB58)
}

export const getMnemonic = async (): Promise<Mnemonic> => {
  const wordsStr = await SecureStore.getItemAsync('mnemonic')
  const words = JSON.parse(wordsStr)
  return new Mnemonic(words)
}

export const getKeypair = async (): Promise<Keypair> => {
  const keypairStr = await SecureStore.getItemAsync('keypair')
  const keypairRaw = JSON.parse(keypairStr)
  return new Keypair(keypairRaw)
}

export const signOut = async () => {
  await SecureStore.deleteItemAsync('mnemonic')
  await SecureStore.deleteItemAsync('keypair')
  await SecureStore.deleteItemAsync('address')
}
