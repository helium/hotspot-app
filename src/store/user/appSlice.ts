import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
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
  isFleetModeEnabled: boolean
  hasFleetModeAutoEnabled: boolean
  convertHntToCurrency: boolean
  isSettingUpHotspot: boolean
  isRestored: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
  authInterval: number
  lastIdle: number | null
  isLocked: boolean
  isRequestingPermission: boolean
}
const initialState: AppState = {
  isBackedUp: false,
  isHapticDisabled: false,
  isFleetModeEnabled: false,
  convertHntToCurrency: false,
  isSettingUpHotspot: false,
  isRestored: false,
  isPinRequired: false,
  isPinRequiredForPayment: false,
  authInterval: Intervals.IMMEDIATELY,
  lastIdle: null,
  isLocked: false,
  isRequestingPermission: false,
  hasFleetModeAutoEnabled: false,
}

type Restore = {
  isBackedUp: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
  authInterval: number
  isLocked: boolean
  isHapticDisabled: boolean
  convertHntToCurrency: boolean
}

export const restoreUser = createAsyncThunk<Restore>(
  'app/restoreUser',
  async () => {
    const vals = await Promise.all([
      getSecureItem('accountBackedUp'), // 0
      getSecureItem('requirePin'), // 1
      getSecureItem('requirePinForPayment'), // 2
      getSecureItem('authInterval'), // 3
      getSecureItem('hapticDisabled'), // 4
      getSecureItem('convertHntToCurrency'), // 5
      getSecureItem('address'), // 6
      getSecureItem('fleetModeEnabled'), // 7
      getSecureItem('hasFleetModeAutoEnabled'), // 8
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
      isFleetModeEnabled: vals[7],
      hasFleetModeAutoEnabled: vals[8],
    } as Restore
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
    updateHapticEnabled: (state, action: PayloadAction<boolean>) => {
      state.isHapticDisabled = action.payload
      setSecureItem('hapticDisabled', action.payload)
    },
    updateFleetModeEnabled: (
      state,
      action: PayloadAction<{ enabled: boolean; autoEnabled?: boolean }>,
    ) => {
      state.isFleetModeEnabled = action.payload.enabled
      setSecureItem('fleetModeEnabled', action.payload.enabled)
      if (action.payload.autoEnabled) {
        state.hasFleetModeAutoEnabled = true
        setSecureItem('hasFleetModeAutoEnabled', true)
      }
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
