/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render as rtlRender } from '@testing-library/react-native'
import { ThemeProvider } from '@shopify/restyle'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { theme } from '../theme/theme'
import i18n from './i18n'
import rootReducer from '../store/rootReducer'

const render = (ui, { initialState, ...renderOptions } = {}) => {
  function Wrapper({ children }) {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
      middleware: getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
    })
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <NavigationContainer>{children}</NavigationContainer>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// override render method
export * from '@testing-library/react-native'
export { render }
