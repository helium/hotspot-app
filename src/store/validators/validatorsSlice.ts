import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Election, Validator } from '@helium/http'
import {
  getElectedValidators,
  getElections,
  getValidators,
} from '../../utils/appDataClient'
import {
  CacheRecord,
  handleCacheFulfilled,
  hasValidCache,
} from '../../utils/cacheUtils'
import { deleteWallet, getWallet, postWallet } from '../../utils/walletClient'

export type WalletValidator = Validator & {
  geocode: {
    asn: number
    city: string
    continentCode: string
    continentName: string
    countryCode: string
    countryName: string
    datetime: string
    host: string
    ip: string
    isp: string
    latitude: number
    longitude: number
    metroCode: number
    postalCode: string
    rdns: string
    regionCode: string
    regionName: string
    timezone: string
  }
}
export type ValidatorsSliceState = {
  validators: CacheRecord<{ data: Validator[] }>
  walletValidators: Record<string, CacheRecord<WalletValidator>>
  electedValidators: CacheRecord<{ data: Validator[] }>
  elections: CacheRecord<{ data: Election[] }>
  followedValidators: CacheRecord<{ data: Validator[] }>
  followedValidatorsObj: Record<string, Validator>
  myValidatorsLoaded: boolean
  followedValidatorsLoaded: boolean
}

const initialState: ValidatorsSliceState = {
  myValidatorsLoaded: false,
  followedValidatorsLoaded: false,
  validators: { lastFetchedTimestamp: 0, loading: false, data: [] },
  walletValidators: {},
  electedValidators: { lastFetchedTimestamp: 0, loading: false, data: [] },
  elections: { lastFetchedTimestamp: 0, loading: false, data: [] },
  followedValidators: { lastFetchedTimestamp: 0, loading: false, data: [] },
  followedValidatorsObj: {},
}

export const fetchMyValidators = createAsyncThunk(
  'validators/fetchValidators',
  async (_arg, { getState }) => {
    const {
      validators: { validators },
    } = (await getState()) as {
      validators: ValidatorsSliceState
    }
    if (hasValidCache(validators)) return validators.data

    return getValidators()
  },
)

export const fetchElectedValidators = createAsyncThunk(
  'validators/fetchElectedValidators',
  async (_arg, { getState }) => {
    const {
      validators: { electedValidators },
    } = (await getState()) as {
      validators: ValidatorsSliceState
    }
    if (hasValidCache(electedValidators)) return electedValidators.data

    return getElectedValidators()
  },
)

export const fetchElections = createAsyncThunk(
  'validators/fetchElections',
  async (_arg, { getState }) => {
    const {
      validators: { elections },
    } = (await getState()) as {
      validators: ValidatorsSliceState
    }
    if (hasValidCache(elections)) return elections.data

    const electionList = await getElections()
    return electionList.take(5)
  },
)

export const fetchWalletValidator = createAsyncThunk<WalletValidator, string>(
  'validators/fetchWalletValidator',
  async (address, { getState }) => {
    const {
      validators: { walletValidators },
    } = (await getState()) as {
      validators: ValidatorsSliceState
    }
    if (hasValidCache(walletValidators[address]))
      return walletValidators[address]

    return getWallet(`validators/${address}`, null, { camelCase: true })
  },
)

export const fetchFollowedValidators = createAsyncThunk(
  'validators/fetchFollowedValidators',
  async (_arg, { getState }) => {
    const {
      validators: { followedValidators },
    } = (await getState()) as {
      validators: ValidatorsSliceState
    }
    if (hasValidCache(followedValidators)) return followedValidators.data

    return getWallet('validators/follow', null, { camelCase: true })
  },
)

export const followValidator = createAsyncThunk<Validator[], string>(
  'validators/followValidator',
  async (validator_address) => {
    const followed = await postWallet(
      `validators/follow/${validator_address}`,
      null,
      { camelCase: true },
    )
    return followed
  },
)

export const unfollowValidator = createAsyncThunk<Validator[], string>(
  'validators/unfollowValidator',
  async (validator_address) => {
    const followed = await deleteWallet(
      `validators/follow/${validator_address}`,
      null,
      { camelCase: true },
    )
    return followed
  },
)

const validatorsToObj = (validators: Validator[]) =>
  validators.reduce((obj, validator) => {
    return {
      ...obj,
      [validator.address]: validator,
    }
  }, {})

const validatorsSlice = createSlice({
  name: 'validatorDetails',
  initialState,
  reducers: {
    signOut: () => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyValidators.rejected, (state, _action) => {
      state.validators.loading = false
      state.myValidatorsLoaded = true
    })
    builder.addCase(fetchMyValidators.pending, (state, _action) => {
      state.validators.loading = true
    })
    builder.addCase(fetchMyValidators.fulfilled, (state, action) => {
      state.validators = handleCacheFulfilled({ data: action.payload })
      state.myValidatorsLoaded = true
    })
    builder.addCase(fetchWalletValidator.fulfilled, (state, action) => {
      state.walletValidators[action.meta.arg] = handleCacheFulfilled(
        action.payload,
      )
    })
    builder.addCase(fetchFollowedValidators.rejected, (state, _action) => {
      state.followedValidators.loading = false
      state.followedValidatorsLoaded = true
    })
    builder.addCase(fetchFollowedValidators.pending, (state, _action) => {
      state.followedValidators.loading = true
    })
    builder.addCase(fetchFollowedValidators.fulfilled, (state, action) => {
      state.followedValidatorsObj = validatorsToObj(action.payload)
      state.followedValidators = handleCacheFulfilled({ data: action.payload })
      state.followedValidatorsLoaded = true
    })
    builder.addCase(followValidator.fulfilled, (state, action) => {
      state.followedValidatorsObj = validatorsToObj(action.payload)
      state.followedValidators = handleCacheFulfilled({ data: action.payload })
    })
    builder.addCase(unfollowValidator.fulfilled, (state, action) => {
      state.followedValidatorsObj = validatorsToObj(action.payload)
      state.followedValidators = handleCacheFulfilled({ data: action.payload })
    })
    builder.addCase(fetchElectedValidators.fulfilled, (state, action) => {
      state.electedValidators = handleCacheFulfilled({ data: action.payload })
    })
    builder.addCase(fetchElections.fulfilled, (state, action) => {
      state.elections = handleCacheFulfilled({ data: action.payload })
    })
  },
})

export default validatorsSlice
