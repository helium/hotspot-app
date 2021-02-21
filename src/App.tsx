import 'react-native-gesture-handler'
import React, { useEffect, useCallback } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  Platform,
  StatusBar,
  AppState,
  AppStateStatus,
  UIManager,
  LogBox,
} from 'react-native'
import { ThemeProvider } from '@shopify/restyle'

import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useAsync } from 'react-async-hook'
import Portal from '@burstware/react-native-portal'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import * as SplashScreen from 'expo-splash-screen'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'
import { useAppDispatch } from './store/store'
import appSlice, { restoreUser } from './store/user/appSlice'
import { RootState } from './store/rootReducer'
import { fetchData } from './store/account/accountSlice'
import BluetoothProvider from './providers/BluetoothProvider'
import ConnectedHotspotProvider from './providers/ConnectedHotspotProvider'
import * as Logger from './utils/logger'
import { configChainVars } from './utils/appDataClient'
import {
  fetchInitialData,
  fetchBlockHeight,
} from './store/helium/heliumDataSlice'
import sleep from './utils/sleep'
import SecurityScreen from './features/security/SecurityScreen'

SplashScreen.preventAutoHideAsync()

const App = () => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  LogBox.ignoreLogs([
    'Setting a timer',
    'Calling getNode() on the ref of an Animated component',
    'Native splash screen is already hidden',
    'No Native splash screen',
    'RCTBridge required dispatch_sync to load',
  ])

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
    account: { fetchDataStatus },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state)

  useAsync(configChainVars, [])

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

  const loadInitialData = useCallback(async () => {
    if (!isRestored) {
      dispatch(restoreUser())
    }
    dispatch(fetchInitialData())

    if (!isRestored && !isBackedUp) {
      return
    }

    dispatch(fetchData())
  }, [dispatch, isBackedUp, isRestored])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const hideSplash = useCallback(async () => {
    if (isRestored && !isBackedUp) {
      // user isn't logged in
      SplashScreen.hideAsync()
    }
    if (
      isRestored &&
      isBackedUp &&
      fetchDataStatus !== 'pending' &&
      fetchDataStatus !== 'idle'
    ) {
      await sleep(300) // add a little delay for views to setup
      SplashScreen.hideAsync()
    }
  }, [fetchDataStatus, isBackedUp, isRestored])

  useEffect(() => {
    hideSplash()
  }, [hideSplash, isBackedUp])

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

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchBlockHeight())
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchData())
  }, [blockHeight, dispatch])

  return (
    <ThemeProvider theme={theme}>
      <BottomSheetModalProvider>
        <ActionSheetProvider>
          <BluetoothProvider>
            <ConnectedHotspotProvider>
              <SafeAreaProvider>
                {/* TODO: Will need to adapt status bar for light/dark modes */}
                {Platform.OS === 'ios' && (
                  <StatusBar barStyle="light-content" />
                )}
                {Platform.OS === 'android' && (
                  <StatusBar translucent backgroundColor="transparent" />
                )}
                <Portal.Host>
                  <NavigationRoot />
                </Portal.Host>
              </SafeAreaProvider>
              <SecurityScreen
                visible={
                  appStateStatus !== 'active' && appStateStatus !== 'unknown'
                }
              />
            </ConnectedHotspotProvider>
          </BluetoothProvider>
        </ActionSheetProvider>
      </BottomSheetModalProvider>
    </ThemeProvider>
  )
}

export default App
