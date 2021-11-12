import 'react-native-gesture-handler'
import React, { useEffect, useMemo } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  ActivityIndicator,
  LogBox,
  Platform,
  StatusBar,
  UIManager,
} from 'react-native'
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
import * as ScreenCapture from 'expo-screen-capture'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'
import { useAppDispatch } from './store/store'
import appSlice, { restoreAppSettings } from './store/user/appSlice'
import { RootState } from './store/rootReducer'
import {
  fetchAccountRewards,
  fetchAccountSettings,
  fetchData,
} from './store/account/accountSlice'
import BluetoothProvider from './providers/BluetoothProvider'
import ConnectedHotspotProvider from './providers/ConnectedHotspotProvider'
import * as Logger from './utils/logger'
import { configChainVars } from './utils/appDataClient'
import {
  fetchBlockHeight,
  fetchInitialData,
} from './store/helium/heliumDataSlice'
import SecurityScreen from './features/security/SecurityScreen'
import usePrevious from './utils/usePrevious'
import StatusBanner from './components/StatusBanner'
import notificationSlice, {
  fetchNotifications,
} from './store/notifications/notificationSlice'
import AppLinkProvider from './providers/AppLinkProvider'
import { navigationRef } from './navigation/navigator'
import useSettingsRestore from './utils/useAccountSettings'
import useMount from './utils/useMount'
import Box from './components/Box'
import { guardedClearMapCache } from './utils/mapUtils'
import { fetchFeatures } from './store/features/featuresSlice'
import { fetchIncidents } from './store/helium/heliumStatusSlice'
import { fetchHotspotsData } from './store/hotspots/hotspotsSlice'
import {
  fetchFollowedValidators,
  fetchMyValidators,
} from './store/validators/validatorsSlice'

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
    'EventEmitter.removeListener',
    '`new NativeEventEmitter()` was called with a non-null argument',
    'expo-permissions is now deprecated',
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
  const settingsLoaded = useSelector(
    (state: RootState) => state.account.settingsLoaded,
  )
  const featuresLoaded = useSelector(
    (state: RootState) => state.features.featuresLoaded,
  )

  useSettingsRestore()

  const prevAppState = usePrevious(appState)

  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  useMount(() => {
    if (Platform.OS === 'android') {
      ScreenCapture.preventScreenCaptureAsync('app') // enables security screen on Android
    }
    dispatch(restoreAppSettings())
  })

  // if user is logged in clear mapbox cache to invalidate any old vector tiles
  useAsync(async () => {
    if (isBackedUp) {
      await guardedClearMapCache()
    }
  }, [isBackedUp])

  useEffect(() => {
    if (!isBackedUp || !settingsLoaded || !featuresLoaded) return

    dispatch(fetchInitialData())
    configChainVars()
  }, [isBackedUp, dispatch, featuresLoaded, settingsLoaded])

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

  // fetch notifications for the app
  useEffect(() => {
    if (!isBackedUp) return
    dispatch(fetchNotifications())
  }, [dispatch, isBackedUp])

  // handle app state changes
  useEffect(() => {
    if (appState === 'background' || appState === 'inactive') {
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

  // update data when app comes into foreground from background and is logged in (only every 5 min)
  useEffect(() => {
    if (
      (prevAppState === 'background' || prevAppState === 'inactive') &&
      appState === 'active' &&
      isBackedUp
    ) {
      const fiveMinutesAgo = Date.now() - 300000
      if (lastIdle && fiveMinutesAgo > lastIdle) {
        dispatch(fetchInitialData())
        dispatch(fetchFeatures())
        dispatch(fetchAccountSettings())
        dispatch(fetchIncidents())
        dispatch(fetchHotspotsData())
        dispatch(fetchAccountRewards())
        dispatch(fetchMyValidators())
        dispatch(fetchFollowedValidators())
        dispatch(fetchNotifications())
      }
    }
  }, [isBackedUp, appState, dispatch, prevAppState, lastIdle, isLocked])

  // Hide splash after 1 second to prevent white screen flicker
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await SplashScreen.hideAsync()
    }, 1000)
    return () => clearInterval(timeout)
  }, [dispatch])

  // poll block height to update realtime data throughout the app
  useEffect(() => {
    if (!settingsLoaded && !featuresLoaded) return
    const interval = setInterval(() => {
      dispatch(fetchBlockHeight())
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch, featuresLoaded, settingsLoaded])

  // fetch account data when logged in and block changes (called whenever block height updates)
  useEffect(() => {
    if (isBackedUp && blockHeight && settingsLoaded && featuresLoaded) {
      dispatch(fetchData())
    }
  }, [blockHeight, dispatch, isBackedUp, settingsLoaded, featuresLoaded])

  const initialized = useMemo(() => {
    const loggedOut = isRestored && !isBackedUp
    return loggedOut || (featuresLoaded && settingsLoaded)
  }, [featuresLoaded, isBackedUp, isRestored, settingsLoaded])

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
                {initialized ? (
                  <NavigationContainer ref={navigationRef}>
                    <AppLinkProvider>
                      <NavigationRoot />
                    </AppLinkProvider>
                  </NavigationContainer>
                ) : (
                  <Box flex={1} justifyContent="center" alignItems="center">
                    <ActivityIndicator color="white" />
                  </Box>
                )}
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
