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
  fetchBlockHeight,
  fetchInitialData,
} from './store/helium/heliumDataSlice'
import SecurityScreen from './features/security/SecurityScreen'
import { fetchFeatures } from './store/features/featuresSlice'

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
  const fetchDataStatus = useSelector(
    (state: RootState) => state.account.fetchDataStatus,
  )
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  // initialize external libraries
  useAsync(configChainVars, [])
  useEffect(() => {
    OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID)
    MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
    Logger.init()
  }, [])

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
      dispatch(fetchBlockHeight())
      dispatch(fetchInitialData())
    }
  }, [dispatch, isRestored])

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
