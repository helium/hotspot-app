import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

global.window = {}
global.window = global

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
jest.mock('react-native-device-info', () => mockRNDeviceInfo)
