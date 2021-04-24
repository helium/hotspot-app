import { Platform } from 'react-native'

// noinspection JSConstantReassignment
global.document = {
  addEventListener: () => {},
}

if (Platform.OS === 'android') {
  require('number-to-locale-string-polyfill')
}
