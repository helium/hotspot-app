import 'react-native-gesture-handler'
import React, { useEffect, useCallback } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@shopify/restyle'
import { Platform, StatusBar, AppState, AppStateStatus } from 'react-native'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import { getUnixTime } from 'date-fns'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'
import { useAppDispatch } from './store/store'
import appSlice from './store/user/appSlice'
import { RootState } from './store/rootReducer'
import { fetchData } from './store/account/accountSlice'
import BluetoothProvider from './providers/BluetoothProvider'
import ConnectedHotspotProvider from './providers/ConnectedHotspotProvider'

const App = () => {
  const dispatch = useAppDispatch()

  const {
    app: {
      lastIdle,
      isPinRequired,
      authInterval,
      isRestored,
      isBackedUp,
      isRequestingPermission,
    },
  } = useSelector((state: RootState) => state)

  const handleChange = useCallback(
    (newState: AppStateStatus) => {
      if (newState === 'background') {
        dispatch(appSlice.actions.updateLastIdle())
        return
      }

      if (
        // pin is required and last idle is past user interval, lock the screen
        newState === 'active' &&
        isPinRequired &&
        !isRequestingPermission &&
        lastIdle &&
        lastIdle < getUnixTime(Date.now()) - authInterval
      ) {
        dispatch(appSlice.actions.lock(true))
      }
    },
    [dispatch, isPinRequired, lastIdle, authInterval, isRequestingPermission],
  )

  useEffect(() => {
    if (!isRestored && !isBackedUp) return

    dispatch(fetchData())
  }, [isRestored, isBackedUp, dispatch])

  useEffect(() => {
    OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID)
    MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
  }, [])

  useEffect(() => {
    AppState.addEventListener('change', handleChange)

    return () => {
      AppState.removeEventListener('change', handleChange)
    }
  }, [handleChange])

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
