import 'react-native-gesture-handler'
import React, { useEffect, useCallback } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@shopify/restyle'
import {
  Platform,
  StatusBar,
  AppState,
  AppStateStatus,
  UIManager,
} from 'react-native'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { Transaction } from '@helium/transactions'
import Client from '@helium/http'
import { useAsync } from 'react-async-hook'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'
import { useAppDispatch } from './store/store'
import appSlice from './store/user/appSlice'
import { RootState } from './store/rootReducer'
import { fetchData } from './store/account/accountSlice'
import BluetoothProvider from './providers/BluetoothProvider'
import ConnectedHotspotProvider from './providers/ConnectedHotspotProvider'
import * as Logger from './utils/logger'
import { initFetchers } from './utils/appDataClient'

const App = () => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  const dispatch = useAppDispatch()

  const {
    app: {
      lastIdle,
      isPinRequired,
      authInterval,
      isRestored,
      isBackedUp,
      isRequestingPermission,
      isLocked,
      appStateStatus,
    },
  } = useSelector((state: RootState) => state)

  useEffect(() => {
    if (appStateStatus === 'background' && !isLocked) {
      dispatch(appSlice.actions.updateLastIdle())
      return
    }

    const isActive = appStateStatus === 'active'
    const now = Date.now()
    const expiration = now - authInterval
    const lastIdleExpired = lastIdle && expiration > lastIdle

    // pin is required and last idle is past user interval, lock the screen
    const shouldLock =
      isActive && isPinRequired && !isRequestingPermission && lastIdleExpired

    if (shouldLock) {
      dispatch(appSlice.actions.lock(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStateStatus])

  const handleChange = useCallback(
    (newState: AppStateStatus) => {
      dispatch(appSlice.actions.updateAppStateStatus(newState))
    },
    [dispatch],
  )

  useEffect(() => {
    if (!isRestored && !isBackedUp) return

    dispatch(fetchData())
  }, [isRestored, isBackedUp, dispatch])

  useEffect(() => {
    if (isBackedUp) {
      initFetchers()
    }
  }, [isBackedUp])

  useEffect(() => {
    OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID)
    MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
    Logger.init()
  }, [])

  useEffect(() => {
    AppState.addEventListener('change', handleChange)

    return () => {
      AppState.removeEventListener('change', handleChange)
    }
  }, [handleChange])

  useAsync(async () => {
    const client = new Client()
    const vars = await client.vars.get()
    Transaction.config(vars)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <BluetoothProvider>
        <ConnectedHotspotProvider>
          <SafeAreaProvider>
            {/* TODO: Will need to adapt status bar for light/dark modes */}
            {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
            {Platform.OS === 'android' && (
              <StatusBar translucent backgroundColor="transparent" />
            )}
            <NavigationRoot />
          </SafeAreaProvider>
        </ConnectedHotspotProvider>
      </BluetoothProvider>
    </ThemeProvider>
  )
}

export default App
