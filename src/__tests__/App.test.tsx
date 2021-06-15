import 'react-native'
import React from 'react'
import App from '../App'
import { render } from '../utils/testUtils'

it('renders correctly', () => {
  expect(render(<App />)).toBeDefined()
})
