import 'react-native'
import React from 'react'
import App from '../App'
import { renderWithProviders } from '../utils/testUtils'

it('renders correctly', () => {
  expect(renderWithProviders(<App />)).toBeDefined()
})
