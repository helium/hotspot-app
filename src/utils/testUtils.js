/* eslint-disable import/prefer-default-export */
/* eslint-disable react/prop-types */
import React from 'react'
import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@shopify/restyle'
import { theme } from '../theme/theme'

const AllTheProviders = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export { renderWithProviders }
