import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getBoolean, setItem } from '../../utils/account'

export type UserState = {
  isBackedUp: boolean
  isEducated: boolean
  isSettingUpHotspot: boolean
  isRestored: boolean
}
const initialState: UserState = {
  isBackedUp: false,
  isEducated: false,
  isSettingUpHotspot: false,
  isRestored: false,
}

type Restore = {
  isBackedUp: boolean
  isEducated: boolean
  isSettingUpHotspot: boolean
}

export const restoreUser = createAsyncThunk<Restore>(
  'user/restore',
  async () => {
    const vals = await Promise.all([
      getBoolean('accountBackedUp'),
      getBoolean('isEducated'),
      getBoolean('isSettingUpHotspot'),
    ])
    return {
      isBackedUp: vals[0],
      isEducated: vals[1],
      isSettingUpHotspot: vals[2],
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    backupAccount: (state, action: PayloadAction<string>) => {
      setItem('accountBackedUp', true)
      setItem('userPin', action.payload)
      state.isBackedUp = true
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
  },
  extraReducers: (builder) => {
    builder.addCase(restoreUser.fulfilled, (state, { payload }) => {
      return { ...state, ...payload, isRestored: true }
    })
  },
})

export default userSlice
