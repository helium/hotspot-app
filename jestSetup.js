import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'
import { setUpTests } from 'react-native-reanimated/src/reanimated2/jestUtils'

setUpTests()

global.window = {}
global.window = global

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
jest.mock('react-native-device-info', () => mockRNDeviceInfo)
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
