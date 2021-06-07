import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MakerAntenna } from '../../makers/antennas/antennaMakerTypes'
import { HotspotType } from '../../makers/hotspots'

export type HotspotOnboardingState = {
  hotspotType?: HotspotType
  elevation?: number
  gain?: number
  antenna?: MakerAntenna
  hotspotCoords?: number[]
  locationName?: string
}
const initialState: HotspotOnboardingState = {}

const hotspotOnboardingSlice = createSlice({
  name: 'hotspotOnboarding',
  initialState,
  reducers: {
    setHotspotType(state, action: PayloadAction<HotspotType>) {
      state.hotspotType = action.payload
    },
    setElevation(state, action: PayloadAction<number>) {
      state.elevation = action.payload
    },
    setGain(state, action: PayloadAction<number>) {
      state.gain = action.payload
    },
    setAntenna(state, action: PayloadAction<MakerAntenna>) {
      state.antenna = action.payload
    },
    setHotspotCoords(state, action: PayloadAction<number[]>) {
      state.hotspotCoords = action.payload
    },
    setLocationName(state, action: PayloadAction<string>) {
      state.locationName = action.payload
    },
    reset() {
      return initialState
    },
  },
})

export default hotspotOnboardingSlice
