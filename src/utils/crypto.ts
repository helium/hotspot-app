/* eslint-disable import/prefer-default-export */
import Sodium from 'react-native-sodium'
import { getString } from './account'

export const sign = async (message: string) => {
  const keypair = await getString('keypair')
  if (!keypair) return

  const { sk } = JSON.parse(keypair)
  return Sodium.crypto_sign_detached(message, sk)
}
