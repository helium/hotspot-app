import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AppStateStatus } from 'react-native'
import {
  getSecureItem,
  setSecureItem,
  deleteSecureItem,
  signOut,
} from '../../utils/secureAccount'
import { getCurrentPosition } from '../../utils/location'

type Location = { latitude: number; longitude: number }

export type AppState = {
  isBackedUp: boolean
  isEducated: boolean
  isSettingUpHotspot: boolean
  isRestored: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
  authInterval: number
  lastIdle: number | null
  isLocked: boolean
  isRequestingPermission: boolean
  currentLocation?: Location
  isLoadingLocation: boolean
  appStateStatus: AppStateStatus
}
const initialState: AppState = {
  isBackedUp: false,
  isEducated: false,
  isSettingUpHotspot: false,
  isRestored: false,
  isPinRequired: false,
  isPinRequiredForPayment: false,
  authInterval: 0,
  lastIdle: null,
  isLocked: false,
  isRequestingPermission: false,
  isLoadingLocation: false,
  appStateStatus: 'unknown',
}

type Restore = {
  isBackedUp: boolean
  isEducated: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
  authInterval: number
  isLocked: boolean
}

export const restoreUser = createAsyncThunk<Restore>(
  'app/restoreUser',
  async () => {
    const vals = await Promise.all([
      getSecureItem('accountBackedUp'),
      getSecureItem('isEducated'),
      getSecureItem('requirePin'),
      getSecureItem('requirePinForPayment'),
      getSecureItem('authInterval'),
    ])
    return {
      isBackedUp: vals[0],
      isEducated: vals[1],
      isPinRequired: vals[2],
      isPinRequiredForPayment: vals[3],
      authInterval: vals[4] ? parseInt(vals[4], 10) : 0,
      isLocked: vals[2],
    }
  },
)

export const getLocation = createAsyncThunk<Location>(
  'app/location',
  async () => getCurrentPosition(),
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
    finishEducation: (state) => {
      setSecureItem('isEducated', true)
      state.isEducated = true
    },
    setupHotspot: (state) => {
      setSecureItem('isEducated', true)
      state.isEducated = true
      state.isSettingUpHotspot = true
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
    builder.addCase(getLocation.pending, (state) => {
      state.isLoadingLocation = true
    })
    builder.addCase(getLocation.rejected, (state) => {
      state.isLoadingLocation = false
    })
    builder.addCase(getLocation.fulfilled, (state, { payload }) => {
      state.currentLocation = payload
      state.isLoadingLocation = false
    })
  },
})

export default appSlice
