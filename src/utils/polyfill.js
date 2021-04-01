import { Platform } from 'react-native'

// noinspection JSConstantReassignment
global.document = {}

if (Platform.OS === 'android') {
  require('number-to-locale-string-polyfill')
}
