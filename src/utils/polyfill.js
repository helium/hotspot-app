import { Platform } from 'react-native'
import buffer from 'buffer'

// noinspection JSConstantReassignment
global.document = {
  addEventListener: () => {},
}

if (Platform.OS === 'android') {
  require('number-to-locale-string-polyfill')
}

global.Buffer = global.Buffer || buffer.Buffer
