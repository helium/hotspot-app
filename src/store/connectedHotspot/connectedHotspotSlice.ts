import { AnyTransaction, Hotspot, ResourceList } from '@helium/http'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  HotspotActivityKeys,
  HotspotActivityType,
} from '../../features/hotspots/root/hotspotTypes'
import {
  getHotspotActivityList,
  getHotspotDetails,
} from '../../utils/appDataClient'
import {
  getOnboardingRecord,
  OnboardingRecord,
} from '../../utils/stakingClient'
import * as Logger from '../../utils/logger'

export type HotspotStatus = 'owned' | 'global' | 'new' | 'error' | 'initial'
type Loading = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type HotspotDetails = {
  mac?: string
  address?: string
  wifi?: string
  onboardingRecord?: OnboardingRecord
  onboardingAddress?: string
  firmware?: {
    version: string
    minVersion: string
  }
  ethernetOnline?: boolean
  status?: HotspotStatus
  details?: Hotspot
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

export type AllHotspotDetails = {
  hotspot?: Hotspot
  onboardingRecord?: OnboardingRecord
}
export const fetchConnectedHotspotDetails = createAsyncThunk<
  AllHotspotDetails,
  HotspotDetails
>(
  'connectedHotspot/fetchConnectedHotspotDetails',
  async (details, thunkAPI) => {
    thunkAPI.dispatch(
      connectedHotspotSlice.actions.initConnectedHotspot(details),
    )

    if (!details.address) {
      throw new Error('fetchConnectedHotspotDetails address is missing')
    }
    if (!details.onboardingAddress) {
      throw new Error(
        'fetchConnectedHotspotDetails onboardingAddress is missing',
      )
    }

    const [hotspot, onboardingRecord] = await Promise.all([
      getHotspotDetails(details.address).catch(() => {
        // Hotspot may not yet exist on the chain, let it fail silently
        Logger.breadcrumb('failed to get hotspot details')
      }),
      getOnboardingRecord(details.onboardingAddress),
    ])

    return {
      hotspot,
      onboardingRecord,
    } as AllHotspotDetails
  },
)

// This slice contains data related to a connected hotspot
const connectedHotspotSlice = createSlice({
  name: 'connectedHotspot',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
    reset: () => {
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
    builder.addCase(
      fetchConnectedHotspotDetails.fulfilled,
      (state, { payload }) => {
        state.onboardingRecord = payload.onboardingRecord
        state.details = payload.hotspot
      },
    )
    builder.addCase(fetchConnectedHotspotDetails.rejected, (state) => {
      state.details = undefined
    })
  },
})

export default connectedHotspotSlice
