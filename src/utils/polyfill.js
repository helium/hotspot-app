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

// eslint-disable-next-line no-undef
if (!__DEV__) {
  global.console = {
    log: () => {},
    error: () => {},
    warn: () => {},
    debug: () => {},
    info: () => {},
    assert: () => {},
    clear: () => {},
    trace: () => {},
    group: () => {},
    groupCollapsed: () => {},
    groupEnd: () => {},
    timeStamp: () => {},
    time: () => {},
    profile: () => {},
    profileEnd: () => {},
    count: () => {},
    dir: () => {},
    dirxml: () => {},
    exception: () => {},
    timeEnd: () => {},
    table: () => {},
  }
}
