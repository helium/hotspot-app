import 'react-native-gesture-handler'
import React, { useEffect, useCallback } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@shopify/restyle'
import { Platform, StatusBar, AppState, AppStateStatus } from 'react-native'
import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import { getUnixTime } from 'date-fns'
import { theme } from './theme/theme'
import NavigationRoot from './navigation/NavigationRoot'
import { useAppDispatch } from './store/store'
import appSlice from './store/app/appSlice'
import { RootState } from './store/rootReducer'

const App = () => {
  const dispatch = useAppDispatch()

  const {
    app: { lastIdle },
    user: { isPinRequired, authInterval },
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
        lastIdle &&
        lastIdle < getUnixTime(Date.now()) - authInterval
      ) {
        dispatch(appSlice.actions.lock(true))
      }
    },
    [dispatch, isPinRequired, lastIdle, authInterval],
  )

  useEffect(() => {
    OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID)
  }, [])

  useEffect(() => {
    AppState.addEventListener('change', handleChange)

    return () => {
      AppState.removeEventListener('change', handleChange)
    }
  }, [handleChange])

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        {/* TODO: Will need to adapt status bar for light/dark modes */}
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        {Platform.OS === 'android' && (
          <StatusBar translucent backgroundColor="transparent" />
        )}
        <NavigationRoot />
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

export default App
