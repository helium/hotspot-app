import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Hotspot, Validator } from '@helium/http'
import AsyncStorage from '@react-native-community/async-storage'
import { uniqBy } from 'lodash'
import Fuse from 'fuse.js'
import { HotspotsSliceState } from '../hotspots/hotspotsSlice'
import { searchHotspots, searchValidators } from '../../utils/appDataClient'
import { PlacePrediction } from '../../utils/googlePlaces'

export const HotspotSearchFilterKeys = ['all_hotspots', 'my_hotspots'] as const
export type HotspotSearchFilterType = typeof HotspotSearchFilterKeys[number]
const RECENT_SEARCHES = 'recentHotspotSearches'

type HotspotSearchSliceState = {
  results: (Hotspot | Validator | PlacePrediction)[]
  filter: HotspotSearchFilterType
  searchTerm: string
  recentSearches: string[]
}
const initialState: HotspotSearchSliceState = {
  results: [],
  filter: 'all_hotspots',
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
  (Hotspot | Validator | PlacePrediction)[],
  { filter: HotspotSearchFilterType; searchTerm: string }
>('hotspotSearch/fetchData', async ({ filter, searchTerm }, { getState }) => {
  if (filter === 'my_hotspots') {
    const {
      hotspots: { hotspots, followedHotspots },
    } = getState() as { hotspots: HotspotsSliceState }
    const unique = uniqBy([...hotspots, ...followedHotspots], (h) => h.address)
    if (!searchTerm) {
      return unique
    }

    const results = new Fuse(unique, {
      keys: ['name', 'geocode.longCity', 'geocode.longState'],
      threshold: 0.3, // TODO: Might need to adjust this value
    })
      .search(searchTerm)
      .map(({ item }) => item)

    return results
  }

  // Note: City search was removed because google is expensive
  // TODO: Bring back city search when the helium api adds geography to it
  // https://api.helium.io/v1/cities?search=chicago
  // const locations = await getCities(searchTerm)

  let hotspots: Hotspot[] = []
  let validators: Validator[] = []
  if (searchTerm) {
    // Fetch hotspots from helium js
    hotspots = await searchHotspots(searchTerm)
    // Fetch hotspots from helium js
    validators = await searchValidators(searchTerm)
  }
  const sortedResults = new Fuse(
    [
      // ...locations,
      ...hotspots,
      ...validators,
    ],
    {
      keys: ['name', 'description'],
      shouldSort: true,
      threshold: 1.0, // We're not filtering anything out - just sorting by match score
    },
  )
    .search(searchTerm)
    .map(({ item }) => item)

  return sortedResults
})

const hotspotSearchSlice = createSlice({
  name: 'hotspotSearch',
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
      state.results = action.payload
    })
  },
})

export default hotspotSearchSlice
