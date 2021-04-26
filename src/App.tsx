import 'react-native-gesture-handler'
import React, { useCallback, useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  AppState,
  AppStateStatus,
  LogBox,
  Platform,
  StatusBar,
  UIManager,
} from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import OneSignal, { OpenedEvent } from 'react-native-onesignal'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useAsync } from 'react-async-hook'
import Portal from '@burstware/react-native-portal'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import * as SplashScreen from 'expo-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
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
  fetchBlockHeight,
  fetchInitialData,
} from './store/helium/heliumDataSlice'
import SecurityScreen from './features/security/SecurityScreen'
import { fetchFeatures } from './store/features/featuresSlice'
import usePrevious from './utils/usePrevious'
import StatusBanner from './components/StatusBanner'
import { fetchStatus } from './store/helium/heliumStatusSlice'
import notificationSlice, {
  fetchNotifications,
} from './store/notifications/notificationSlice'
import LinkProvider from './providers/LinkProvider'
import { navigationRef } from './navigation/navigator'

SplashScreen.preventAutoHideAsync()

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
  ])

  const dispatch = useAppDispatch()

  const {
    lastIdle,
    isPinRequired,
    authInterval,
    isRestored,
    isBackedUp,
    isRequestingPermission,
    isLocked,
    appStateStatus,
  } = useSelector((state: RootState) => state.app)
  const prevAppStateStatus = usePrevious(appStateStatus)

  const fetchDataStatus = useSelector(
    (state: RootState) => state.account.fetchDataStatus,
  )
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  const loadInitialData = useCallback(() => {
    dispatch(fetchBlockHeight())
    dispatch(fetchInitialData())
    dispatch(fetchStatus())
    dispatch(fetchNotifications())
  }, [dispatch])

  // initialize external libraries
  useAsync(configChainVars, [])
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

  // setup and listen for app state changes
  const handleChange = useCallback(
    (newState: AppStateStatus) => {
      dispatch(appSlice.actions.updateAppStateStatus(newState))
    },
    [dispatch],
  )

  // fetch feature flags for the app
  useEffect(() => {
    dispatch(fetchFeatures())
  }, [dispatch])

  useEffect(() => {
    AppState.addEventListener('change', handleChange)
    return () => {
      AppState.removeEventListener('change', handleChange)
    }
  }, [handleChange])

  // handle app state changes
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

  // restore user and then fetch initial data
  useEffect(() => {
    if (!isRestored) {
      dispatch(restoreUser())
    } else {
      loadInitialData()
    }
  }, [dispatch, loadInitialData, isRestored])

  // update initial data when app comes into foreground from background
  useEffect(() => {
    if (prevAppStateStatus === 'background' && appStateStatus === 'active') {
      loadInitialData()
    }
  }, [dispatch, appStateStatus, prevAppStateStatus, loadInitialData])

  // hide splash screen
  useAsync(async () => {
    const loggedOut = isRestored && !isBackedUp
    const loggedInAndLoaded =
      isRestored &&
      isBackedUp &&
      fetchDataStatus !== 'pending' &&
      fetchDataStatus !== 'idle'

    if (loggedOut || loggedInAndLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fetchDataStatus, isBackedUp, isRestored])

  useEffect(() => {
    // Hide splash after 5 seconds, deal with the consequences?
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync()
    }, 5000)
    return () => clearInterval(timeout)
  }, [dispatch])

  // poll block height to update realtime data throughout the app
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchBlockHeight())
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch])

  // fetch account data when logged in and block changes (called whenever block height updates)
  useEffect(() => {
    if (isBackedUp && blockHeight) {
      dispatch(fetchData())
    }
  }, [blockHeight, dispatch, isBackedUp])

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
                  <NavigationContainer ref={navigationRef}>
                    <LinkProvider>
                      <NavigationRoot />
                    </LinkProvider>
                  </NavigationContainer>
                </Portal.Host>
              </SafeAreaProvider>
              <StatusBanner />
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
