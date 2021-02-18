// import './src/whyDidYouRender'
import React from 'react'

import { AppRegistry, Platform } from 'react-native'
import { Provider } from 'react-redux'
import App from './src/App'
import { name as appName } from './app.json'
import store from './src/store/store'

// eslint-disable-next-line no-undef
if (__DEV__) {
  import('./ReactotronConfig')
}

if (Platform.OS === 'android') {
  require('number-to-locale-string-polyfill')
}

const render = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

AppRegistry.registerComponent(appName, () => render)
