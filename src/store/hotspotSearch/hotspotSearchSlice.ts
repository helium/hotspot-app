import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot } from '@helium/http'
import AsyncStorage from '@react-native-community/async-storage'
import { HotspotsSliceState } from '../hotspots/hotspotsSlice'
import { searchHotspots } from '../../utils/appDataClient'
import { getCities, PlacePrediction } from '../../utils/googlePlaces'

export const HotspotSearchFilterKeys = ['my_hotspots', 'all_hotspots'] as const
export type HotspotSearchFilterType = typeof HotspotSearchFilterKeys[number]
const RECENT_SEARCHES = 'recentHotspotSearches'

type HotspotSearchSliceState = {
  hotspots: Hotspot[]
  locations: PlacePrediction[]
  filter: HotspotSearchFilterType
  searchTerm: string
  recentSearches: string[]
}
const initialState: HotspotSearchSliceState = {
  hotspots: [],
  locations: [],
  filter: 'my_hotspots',
  searchTerm: '',
  recentSearches: [],
}

export const restoreRecentSearches = createAsyncThunk<string[]>(
  'hotspotSearch/restoreRecentSearches',
  async () => {
    const recentSearches = await AsyncStorage.getItem(RECENT_SEARCHES)
    if (recentSearches) {
      return JSON.parse(recentSearches) as string[]
    }
    return []
  },
)

export const fetchData = createAsyncThunk<
  { hotspots: Hotspot[]; locations: PlacePrediction[] },
  { filter: HotspotSearchFilterType; searchTerm: string }
>('hotspotSearch/fetchData', async ({ filter, searchTerm }, { getState }) => {
  if (filter === 'my_hotspots') {
    const {
      hotspots: { hotspots },
    } = getState() as { hotspots: HotspotsSliceState }
    if (!searchTerm) {
      return { hotspots, locations: [] }
    }

    const filteredHotspots = hotspots.filter((h) =>
      h.name?.includes(searchTerm),
    )
    return { hotspots: filteredHotspots, locations: [] }
  }

  // Fetch cities from google
  const locations = await getCities(searchTerm)

  // Fetch hotspots from helium js
  let hotspots: Hotspot[] = []
  if (searchTerm) {
    hotspots = await searchHotspots(searchTerm)
  }
  return { hotspots, locations }
})

const hotspotSearchSlice = createSlice({
  name: 'hotspotSearchSlice',
  initialState,
  reducers: {
    clear: (state) => {
      state.searchTerm = ''
      state.filter = 'my_hotspots'
    },
    setFilter: (state, { payload }: { payload: HotspotSearchFilterType }) => {
      state.filter = payload
    },
    setSearchTerm: (state, { payload }: { payload: string }) => {
      state.searchTerm = payload
    },
    addRecentSearchTerm: (state, { payload }: { payload: string }) => {
      const recent = [...new Set([payload, ...state.recentSearches])].slice(
        0,
        5,
      )
      state.recentSearches = recent
      AsyncStorage.setItem(RECENT_SEARCHES, JSON.stringify(recent))
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreRecentSearches.fulfilled, (state, action) => {
      state.recentSearches = action.payload
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.hotspots = action.payload.hotspots
      state.locations = action.payload.locations
    })
  },
})

export default hotspotSearchSlice
