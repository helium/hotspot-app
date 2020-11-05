import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'

global.window = {}
global.window = global

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
