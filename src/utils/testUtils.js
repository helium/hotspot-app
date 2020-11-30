/* eslint-disable import/prefer-default-export */
/* eslint-disable react/prop-types */
import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@shopify/restyle'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { theme } from '../theme/theme'
import i18n from './i18n'
import store from '../store/store'

const AllTheProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </ThemeProvider>
    </Provider>
  )
}

const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export { renderWithProviders }
