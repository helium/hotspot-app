import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type HotspotStatus = 'owned' | 'global' | 'new' | 'error' | 'initial'
export type HotspotType = 'Helium' | 'RAK'
export type HotspotName = 'RAK Hotspot Miner' | 'Helium Hotspot'

export type HotspotDetails = {
  mac?: string
  address?: string
  wifi?: string
  type?: HotspotType
  name?: HotspotName
  freeAddHotspot?: boolean
  onboardingAddress?: string
  firmware?: {
    version: string
    minVersion: string
  }
  nonce?: number
  status?: HotspotStatus
}

const initialState: HotspotDetails = {
  status: 'initial',
}

// This slice contains data related to a connected hotspot
const connectedHotspotSlice = createSlice({
  name: 'connectedHotspot',
  initialState,
  reducers: {
    initConnectedHotspot: (state, action: PayloadAction<HotspotDetails>) => {
      Object.assign(state, action.payload)
      state.status = 'initial'
    },
    setConnectedHotspotWifi: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.wifi = action.payload
    },
    setConnectedHotspotStatus: (
      state,
      action: PayloadAction<HotspotStatus>,
    ) => {
      state.status = action.payload
    },
    setConnectedHotspotFirmware: (
      state,
      action: PayloadAction<{
        version: string
        minVersion: string
      }>,
    ) => {
      state.firmware = action.payload
    },
  },
})

export default connectedHotspotSlice
