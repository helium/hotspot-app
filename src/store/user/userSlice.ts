import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import getUnixTime from 'date-fns/getUnixTime'
import {
  getBoolean,
  setItem,
  deleteItem,
  signOut,
  getString,
} from '../../utils/account'

export type UserState = {
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
}
const initialState: UserState = {
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
}

type Restore = {
  isBackedUp: boolean
  isEducated: boolean
  isSettingUpHotspot: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
  authInterval: number
  isLocked: boolean
}

export const restoreUser = createAsyncThunk<Restore>(
  'user/restore',
  async () => {
    const vals = await Promise.all([
      getBoolean('accountBackedUp'),
      getBoolean('isEducated'),
      getBoolean('isSettingUpHotspot'),
      getBoolean('requirePin'),
      getBoolean('requirePinForPayment'),
      getString('authInterval'),
    ])
    return {
      isBackedUp: vals[0],
      isEducated: vals[1],
      isSettingUpHotspot: vals[2],
      isPinRequired: vals[3],
      isPinRequiredForPayment: vals[4],
      authInterval: vals[5] ? parseInt(vals[5], 10) : 0,
      isLocked: vals[3],
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    backupAccount: (state, action: PayloadAction<string>) => {
      setItem('accountBackedUp', true)
      setItem('requirePin', true)
      setItem('userPin', action.payload)
      state.isBackedUp = true
      state.isPinRequired = true
    },
    finishEducation: (state) => {
      setItem('isEducated', true)
      state.isEducated = true
    },
    setupHotspot: (state) => {
      setItem('isEducated', true)
      setItem('isSettingUpHotspot', true)
      state.isEducated = true
      state.isSettingUpHotspot = true
    },
    signOut: () => {
      signOut()
      return { ...initialState, isRestored: true }
    },
    requirePinForPayment: (state, action: PayloadAction<boolean>) => {
      state.isPinRequiredForPayment = action.payload
      setItem('requirePinForPayment', action.payload)
    },
    updateAuthInterval: (state, action: PayloadAction<number>) => {
      state.authInterval = action.payload
      setItem('authInterval', action.payload.toString())
    },
    disablePin: (state) => {
      deleteItem('requirePin')
      deleteItem('requirePinForPayment')
      deleteItem('userPin')
      state.isPinRequired = false
      state.isPinRequiredForPayment = false
    },
    updateLastIdle: (state) => {
      state.lastIdle = getUnixTime(Date.now())
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

export default userSlice
