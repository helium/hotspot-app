import { AnyTransaction, ResourceList } from '@helium/http'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  HotspotActivityKeys,
  HotspotActivityType,
} from '../../features/hotspots/root/hotspotTypes'
import { getHotspotActivityList } from '../../utils/appDataClient'

export type HotspotStatus = 'owned' | 'global' | 'new' | 'error' | 'initial'
export type HotspotType = 'Helium' | 'RAK'
export type HotspotName = 'RAK Hotspot Miner' | 'Helium Hotspot'

type Loading = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type HotspotDetails = {
  mac?: string
  address?: string
  wifi?: string
  type?: HotspotType
  name?: HotspotName
  validOnboarding?: boolean
  onboardingRecord?: OnboardingRecord
  onboardingAddress?: string
  firmware?: {
    version: string
    minVersion: string
  }
  ethernetOnline?: boolean
  nonce?: number
  status?: HotspotStatus
}

export type OnboardingRecord = {
  id: number
  maker: {
    locationNonceLimit: number
  }
}

export type HotspotActivity = {
  activity: {
    all: { data: AnyTransaction[]; status: Loading }
    rewards: { data: AnyTransaction[]; status: Loading }
    challenge_activity: { data: AnyTransaction[]; status: Loading }
    data_transfer: { data: AnyTransaction[]; status: Loading }
    challenge_construction: { data: AnyTransaction[]; status: Loading }
    consensus_group: { data: AnyTransaction[]; status: Loading }
  }
}

const initialState: HotspotDetails & HotspotActivity = {
  status: 'initial',
  activity: {
    all: { data: [], status: 'idle' },
    rewards: { data: [], status: 'idle' },
    challenge_activity: { data: [], status: 'idle' },
    data_transfer: { data: [], status: 'idle' },
    challenge_construction: { data: [], status: 'idle' },
    consensus_group: { data: [], status: 'idle' },
  },
}

const hotspotActivityFetchers = {} as Record<
  HotspotActivityType,
  ResourceList<AnyTransaction>
>
const initHotspotActivityFetchers = async (address: string) => {
  const lists = await Promise.all(
    HotspotActivityKeys.map((key) => getHotspotActivityList(address, key)),
  )
  HotspotActivityKeys.forEach((key, index) => {
    const fetcher = lists[index]
    if (!fetcher) return
    hotspotActivityFetchers[key] = fetcher
  })
}

export const fetchHotspotActivity = createAsyncThunk<
  AnyTransaction[],
  { filter: HotspotActivityType; fetchCount?: number }
>('connectedHotspot/fetchHotspotActivity', async (opts) => {
  const list = hotspotActivityFetchers[opts.filter]
  return list.takeJSON(opts.fetchCount || 10)
})

// This slice contains data related to a connected hotspot
const connectedHotspotSlice = createSlice({
  name: 'connectedHotspot',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
    initConnectedHotspot: (state, action: PayloadAction<HotspotDetails>) => {
      Object.assign(state, action.payload)
      state.status = 'initial'

      if (action.payload.address)
        initHotspotActivityFetchers(action.payload.address)
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
  extraReducers: (builder) => {
    builder.addCase(
      fetchHotspotActivity.fulfilled,
      (state, { payload, meta: { arg } }) => {
        state.activity[arg.filter].data = [
          ...state.activity[arg.filter].data,
          ...(payload as AnyTransaction[]),
        ]
      },
    )
  },
})

export default connectedHotspotSlice
