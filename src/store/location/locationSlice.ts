import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  LOCATION,
  getAsync,
  PermissionResponse,
  PermissionStatus,
} from 'expo-permissions'
import { getCurrentPosition, LocationCoords } from '../../utils/location'

export type AppState = {
  currentLocation?: LocationCoords
  isLoadingLocation: boolean
  permissionResponse?: PermissionResponse
  locationBlocked: boolean
}
const initialState: AppState = {
  isLoadingLocation: false,
  locationBlocked: false,
}

export const getLocation = createAsyncThunk(
  'location/getLocation',
  async (_, { dispatch }) => {
    let pos: LocationCoords | null = null
    try {
      pos = await getCurrentPosition()
    } catch (e) {}
    dispatch(getLocationPermission())
    return pos
  },
)

export const getLocationPermission = createAsyncThunk(
  'location/getLocationPermission',
  async () => getAsync(LOCATION),
)

export const hasLocationPermission = (status?: PermissionStatus) =>
  status === 'granted'

// This slice contains data related to the state of the app
const appSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateLocationPermission: (
      state,
      { payload: permissionResponse }: { payload: PermissionResponse },
    ) => {
      state.permissionResponse = permissionResponse
      state.locationBlocked =
        permissionResponse &&
        !permissionResponse.granted &&
        !permissionResponse.canAskAgain
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLocation.pending, (state) => {
      state.isLoadingLocation = true
    })
    builder.addCase(getLocation.rejected, (state) => {
      state.isLoadingLocation = false
    })
    builder.addCase(getLocation.fulfilled, (state, { payload }) => {
      if (payload) {
        state.currentLocation = payload
      }
      state.isLoadingLocation = false
    })
    builder.addCase(
      getLocationPermission.fulfilled,
      (state, { payload: permissionResponse }) => {
        state.permissionResponse = permissionResponse
        state.locationBlocked =
          permissionResponse &&
          !permissionResponse.granted &&
          !permissionResponse.canAskAgain
      },
    )
  },
})

export default appSlice
