/* eslint-disable */
// This file is copied from expo-secure-store's source,
// with the _scopedKey changed to match the key expo was
// setting before we ejected to a bare react native app
import { UnavailabilityError } from '@unimodules/core'
import ExpoSecureStore from 'expo-secure-store/build/ExpoSecureStore'
import { Platform } from 'react-native'

const VALUE_BYTES_LIMIT = 2048

export async function deleteItemAsync(key, options = {}) {
  _ensureValidKey(key)

  if (!ExpoSecureStore.deleteValueWithKeyAsync) {
    throw new UnavailabilityError('SecureStore', 'deleteItemAsync')
  }
  await ExpoSecureStore.deleteValueWithKeyAsync(_scopedKey(key), options)
}

export async function getItemAsync(key, options = {}) {
  _ensureValidKey(key)
  return await ExpoSecureStore.getValueWithKeyAsync(_scopedKey(key), options)
}

export async function setItemAsync(key, value, options = {}) {
  _ensureValidKey(key)
  if (!_isValidValue(value)) {
    throw new Error(
      `Invalid value provided to SecureStore. Values must be strings; consider JSON-encoding your values if they are serializable.`,
    )
  }
  if (!ExpoSecureStore.setValueWithKeyAsync) {
    throw new UnavailabilityError('SecureStore', 'setItemAsync')
  }
  await ExpoSecureStore.setValueWithKeyAsync(value, _scopedKey(key), options)
}

function _scopedKey(key) {
  if (Platform.OS === 'android') return key
  return `@helium/helium-wallet-${key}`
}

function _ensureValidKey(key) {
  if (!_isValidKey(key)) {
    throw new Error(
      `Invalid key provided to SecureStore. Keys must not be empty and contain only alphanumeric characters, ".", "-", and "_".`,
    )
  }
}

function _isValidKey(key) {
  return typeof key === 'string' && /^[\w.-]+$/.test(key)
}

function _isValidValue(value) {
  if (typeof value !== 'string') {
    return false
  }
  if (_byteCount(value) > VALUE_BYTES_LIMIT) {
    console.warn(
      'Provided value to SecureStore is larger than 2048 bytes. An attempt to store such a value will throw an error in SDK 35.',
    )
  }
  return true
}

// copy-pasted from https://stackoverflow.com/a/39488643
function _byteCount(value) {
  let bytes = 0

  for (let i = 0; i < value.length; i++) {
    const codePoint = value.charCodeAt(i)

    // Lone surrogates cannot be passed to encodeURI
    if (codePoint >= 0xd800 && codePoint < 0xe000) {
      if (codePoint < 0xdc00 && i + 1 < value.length) {
        const next = value.charCodeAt(i + 1)

        if (next >= 0xdc00 && next < 0xe000) {
          bytes += 4
          i++
          continue
        }
      }
    }

    bytes += codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : 3
  }

  return bytes
}
