import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getBoolean, setItem, deleteItem, signOut } from '../../utils/account'

export type UserState = {
  isBackedUp: boolean
  isEducated: boolean
  isSettingUpHotspot: boolean
  isRestored: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
}
const initialState: UserState = {
  isBackedUp: false,
  isEducated: false,
  isSettingUpHotspot: false,
  isRestored: false,
  isPinRequired: false,
  isPinRequiredForPayment: false,
}

type Restore = {
  isBackedUp: boolean
  isEducated: boolean
  isSettingUpHotspot: boolean
  isPinRequired: boolean
  isPinRequiredForPayment: boolean
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
    ])
    return {
      isBackedUp: vals[0],
      isEducated: vals[1],
      isSettingUpHotspot: vals[2],
      isPinRequired: vals[3],
      isPinRequiredForPayment: vals[4],
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
      return state
    },
    finishEducation: (state) => {
      setItem('isEducated', true)
      state.isEducated = true
      return state
    },
    setupHotspot: (state) => {
      setItem('isEducated', true)
      setItem('isSettingUpHotspot', true)
      state.isEducated = true
      state.isSettingUpHotspot = true
      return state
    },
    signOut: (state) => {
      signOut()
      state = initialState
      state.isRestored = true
      return state
    },
    requirePinForPayment: (state, action: PayloadAction<boolean>) => {
      state.isPinRequiredForPayment = action.payload
      setItem('requirePinForPayment', action.payload)
      return state
    },
    disablePin: (state) => {
      deleteItem('requirePin')
      deleteItem('requirePinForPayment')
      deleteItem('userPin')
      state.isPinRequired = false
      state.isPinRequiredForPayment = false
      return state
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreUser.fulfilled, (state, { payload }) => {
      return { ...state, ...payload, isRestored: true }
    })
  },
})

export default userSlice
