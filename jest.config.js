const expoPreset = require('jest-expo/jest-preset')

module.exports = {
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
  },
  ...expoPreset,
  setupFilesAfterEnv: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    '@testing-library/jest-native/extend-expect',
    './jestSetup',
    '@react-native-mapbox-gl/maps/setup-jest',
  ],
  transformIgnorePatterns: ['node_modules/(?!@helium)/'],
  preset: 'react-native',
}
