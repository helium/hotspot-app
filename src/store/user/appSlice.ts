import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppStateStatus } from 'react-native'
import OneSignal from 'react-native-onesignal'
import {
  deleteSecureItem,
  getSecureItem,
  setSecureItem,
  signOut,
} from '../../utils/secureAccount'
import { Intervals } from '../../features/moreTab/more/useAuthIntervals'

export type AppState = {
  isBackedUp: boolean
  isHapticDisabled: boolean
  isDeploymentModeEnabled: boolean
  convertHntToCurrency: boolean
  isSettingUpHotspot: boolean
  isRestored: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
  authInterval: number
  lastIdle: number | null
  isLocked: boolean
  isRequestingPermission: boolean
  appStateStatus: AppStateStatus
}
const initialState: AppState = {
  isBackedUp: false,
  isHapticDisabled: false,
  isDeploymentModeEnabled: false,
  convertHntToCurrency: false,
  isSettingUpHotspot: false,
  isRestored: false,
  isPinRequired: false,
  isPinRequiredForPayment: false,
  authInterval: Intervals.IMMEDIATELY,
  lastIdle: null,
  isLocked: false,
  isRequestingPermission: false,
  appStateStatus: 'unknown',
}

type Restore = {
  isBackedUp: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
  isDeploymentModeEnabled: boolean
  authInterval: number
  isLocked: boolean
  isHapticDisabled: boolean
  convertHntToCurrency: boolean
}

export const restoreUser = createAsyncThunk<Restore>(
  'app/restoreUser',
  async () => {
    const vals = await Promise.all([
      getSecureItem('accountBackedUp'),
      getSecureItem('requirePin'),
      getSecureItem('requirePinForPayment'),
      getSecureItem('authInterval'),
      getSecureItem('hapticDisabled'),
      getSecureItem('convertHntToCurrency'),
      getSecureItem('address'),
      getSecureItem('deploymentModeEnabled'),
    ])
    const isBackedUp = vals[0]
    const address = vals[6]
    if (isBackedUp && address) {
      OneSignal.sendTags({ address })
    }
    return {
      isBackedUp,
      isPinRequired: vals[1],
      isPinRequiredForPayment: vals[2],
      authInterval: vals[3] ? parseInt(vals[3], 10) : Intervals.IMMEDIATELY,
      isLocked: vals[1],
      isHapticDisabled: vals[4],
      convertHntToCurrency: vals[5],
      isDeploymentModeEnabled: vals[7],
    }
  },
)

// This slice contains data related to the state of the app
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    backupAccount: (state, action: PayloadAction<string>) => {
      setSecureItem('accountBackedUp', true)
      setSecureItem('requirePin', true)
      setSecureItem('userPin', action.payload)
      state.isBackedUp = true
      state.isPinRequired = true
    },
    startHotspotSetup: (state) => {
      state.isSettingUpHotspot = false
    },
    signOut: () => {
      signOut()
      return { ...initialState, isRestored: true }
    },
    requirePinForPayment: (state, action: PayloadAction<boolean>) => {
      state.isPinRequiredForPayment = action.payload
      setSecureItem('requirePinForPayment', action.payload)
    },
    enableDeploymentMode: (state, action: PayloadAction<boolean>) => {
      state.isDeploymentModeEnabled = action.payload
      setSecureItem('deploymentModeEnabled', action.payload)
    },
    updateHapticEnabled: (state, action: PayloadAction<boolean>) => {
      state.isHapticDisabled = action.payload
      setSecureItem('hapticDisabled', action.payload)
    },
    toggleConvertHntToCurrency: (state) => {
      state.convertHntToCurrency = !state.convertHntToCurrency
      setSecureItem('convertHntToCurrency', state.convertHntToCurrency)
    },
    updateConvertHntToCurrency: (state, action: PayloadAction<boolean>) => {
      state.convertHntToCurrency = action.payload
      setSecureItem('convertHntToCurrency', action.payload)
    },
    updateAuthInterval: (state, action: PayloadAction<number>) => {
      state.authInterval = action.payload
      setSecureItem('authInterval', action.payload.toString())
    },
    disablePin: (state) => {
      deleteSecureItem('requirePin')
      deleteSecureItem('requirePinForPayment')
      deleteSecureItem('userPin')
      state.isPinRequired = false
      state.isPinRequiredForPayment = false
    },
    updateLastIdle: (state) => {
      state.lastIdle = Date.now()
    },
    lock: (state, action: PayloadAction<boolean>) => {
      state.isLocked = action.payload
      if (!state.isLocked) {
        state.lastIdle = null
      }
    },
    updateAppStateStatus: (state, action: PayloadAction<AppStateStatus>) => {
      if (action.payload === state.appStateStatus) return

      state.appStateStatus = action.payload
    },
    requestingPermission: (state, action: PayloadAction<boolean>) => {
      state.isRequestingPermission = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreUser.fulfilled, (state, { payload }) => {
      return { ...state, ...payload, isRestored: true }
    })
  },
})

export default appSlice
