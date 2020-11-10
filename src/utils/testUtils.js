/* eslint-disable import/prefer-default-export */
/* eslint-disable react/prop-types */
import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@shopify/restyle'
import { I18nextProvider } from 'react-i18next'
import { theme } from '../theme/theme'
import i18n from './i18n'

const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </ThemeProvider>
  )
}

const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export { renderWithProviders }
