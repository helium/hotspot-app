import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

global.window = {}
global.window = global

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist')
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  }
})
