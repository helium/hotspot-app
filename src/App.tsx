import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LogBox, Platform, StatusBar, UIManager } from 'react-native'
import useAppState from 'react-native-appstate-hook'
import { ThemeProvider } from '@shopify/restyle'
import OneSignal, { OpenedEvent } from 'react-native-onesignal'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useAsync } from 'react-async-hook'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import * as SplashScreen from 'expo-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'
import { useAppDispatch } from './store/store'
import appSlice, { restoreAppSettings } from './store/user/appSlice'
import { RootState } from './store/rootReducer'
import { fetchData } from './store/account/accountSlice'
import BluetoothProvider from './providers/BluetoothProvider'
import ConnectedHotspotProvider from './providers/ConnectedHotspotProvider'
import * as Logger from './utils/logger'
import { configChainVars } from './utils/appDataClient'
import {
  fetchBlockHeight,
  fetchInitialData,
} from './store/helium/heliumDataSlice'
import SecurityScreen from './features/security/SecurityScreen'
import { fetchFeatures } from './store/features/featuresSlice'
import usePrevious from './utils/usePrevious'
import StatusBanner from './components/StatusBanner'
import notificationSlice, {
  fetchNotifications,
} from './store/notifications/notificationSlice'
import AppLinkProvider from './providers/AppLinkProvider'
import { navigationRef } from './navigation/navigator'
import useSettingsRestore from './utils/useAccountSettings'
import useMount from './utils/useMount'

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
})

const App = () => {
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  LogBox.ignoreLogs([
    "Accessing the 'state' property of the 'route' object is not supported.",
    'Setting a timer',
    'Calling getNode() on the ref of an Animated component',
    'Native splash screen is already hidden',
    'No Native splash screen',
    'RCTBridge required dispatch_sync to load',
    'Require cycle',
  ])

  const { appState } = useAppState()
  const dispatch = useAppDispatch()

  const {
    lastIdle,
    isPinRequired,
    authInterval,
    isRestored,
    isBackedUp,
    isRequestingPermission,
    isLocked,
  } = useSelector((state: RootState) => state.app)
  const { settingsLoaded } = useSelector((state: RootState) => state.account)

  useSettingsRestore()

  const prevAppState = usePrevious(appState)

  const fetchDataStatus = useSelector(
    (state: RootState) => state.account.fetchDataStatus,
  )
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  useMount(() => {
    dispatch(restoreAppSettings())
  })

  useEffect(() => {
    if (!settingsLoaded) return

    dispatch(fetchInitialData())
    configChainVars()
  }, [dispatch, settingsLoaded])

  useEffect(() => {
    OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID)
    OneSignal.setNotificationOpenedHandler((event: OpenedEvent) => {
      // handles opening a notification
      dispatch(
        notificationSlice.actions.pushNotificationOpened(event.notification),
      )
    })
    OneSignal.setNotificationWillShowInForegroundHandler(() => {
      // handles fetching new notifications while the app is in focus
      dispatch(fetchNotifications())
    })
    MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
    Logger.init()
  }, [dispatch])

  // fetch feature flags and notifications for the app
  useEffect(() => {
    if (!isBackedUp) return
    dispatch(fetchFeatures())
    dispatch(fetchNotifications())
  }, [dispatch, isBackedUp])

  // handle app state changes
  useEffect(() => {
    if (appState === 'background' && !isLocked) {
      dispatch(appSlice.actions.updateLastIdle())
      return
    }

    const isActive = appState === 'active'
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
  }, [appState])

  // update initial data when account is restored or app comes into foreground from background
  useEffect(() => {
    if (prevAppState === 'background' && appState === 'active') {
      dispatch(fetchInitialData())
    }
  }, [appState, dispatch, prevAppState])

  // hide splash screen
  useAsync(async () => {
    const loggedOut = isRestored && !isBackedUp
    const loggedInAndLoaded =
      isRestored &&
      isBackedUp &&
      settingsLoaded &&
      fetchDataStatus !== 'pending' &&
      fetchDataStatus !== 'idle'

    if (loggedOut || loggedInAndLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fetchDataStatus, isBackedUp, isRestored, settingsLoaded])

  useEffect(() => {
    // Hide splash after 5 seconds, deal with the consequences?
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync()
    }, 5000)
    return () => clearInterval(timeout)
  }, [dispatch])

  // poll block height to update realtime data throughout the app
  useEffect(() => {
    if (!settingsLoaded) return
    const interval = setInterval(() => {
      dispatch(fetchBlockHeight())
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch, settingsLoaded])

  // fetch account data when logged in and block changes (called whenever block height updates)
  useEffect(() => {
    if (isBackedUp && blockHeight && settingsLoaded) {
      dispatch(fetchData())
    }
  }, [blockHeight, dispatch, isBackedUp, settingsLoaded])

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
                <NavigationContainer ref={navigationRef}>
                  <AppLinkProvider>
                    <NavigationRoot />
                  </AppLinkProvider>
                </NavigationContainer>
              </SafeAreaProvider>
              <StatusBanner />
              <SecurityScreen
                visible={appState !== 'active' && appState !== 'unknown'}
              />
            </ConnectedHotspotProvider>
          </BluetoothProvider>
        </ActionSheetProvider>
      </BottomSheetModalProvider>
    </ThemeProvider>
  )
}

export default App
