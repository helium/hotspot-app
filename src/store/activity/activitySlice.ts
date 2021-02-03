import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PendingTransaction, AnyTransaction } from '@helium/http'
import { differenceBy, unionBy } from 'lodash'
import { initFetchers, txnFetchers } from '../../utils/appDataClient'
import { FilterType } from '../../features/wallet/root/walletTypes'

type Loading = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export type ActivityState = {
  txns: {
    all: { data: AnyTransaction[]; status: Loading }
    hotspot: { data: AnyTransaction[]; status: Loading }
    mining: { data: AnyTransaction[]; status: Loading }
    payment: { data: AnyTransaction[]; status: Loading }
    pending: { data: PendingTransaction[]; status: Loading }
  }
  filter: FilterType
  detailTxn?: AnyTransaction | PendingTransaction
}

const initialState: ActivityState = {
  txns: {
    all: { data: [], status: 'idle' },
    hotspot: { data: [], status: 'idle' },
    mining: { data: [], status: 'idle' },
    payment: { data: [], status: 'idle' },
    pending: { data: [], status: 'idle' },
  },
  filter: 'all',
}

type FetchArgs = {
  filter: FilterType
  resetLists?: boolean
}
export const fetchTxns = createAsyncThunk<
  AnyTransaction[] | PendingTransaction[],
  FetchArgs
>('activity/fetchAccountActivity', async ({ filter, resetLists = false }) => {
  if (resetLists) await initFetchers()
  const list = txnFetchers[filter]
  return list.takeJSON(30)
})

export const fetchPendingTxns = createAsyncThunk(
  'activity/fetchPendingTxns',
  async () => {
    return txnFetchers.pending.takeJSON(1000)
  },
)

export const changeFilter = createAsyncThunk<FilterType, FilterType>(
  'activity/changeFilter',
  async (filter, thunkAPI) => {
    thunkAPI.dispatch(fetchTxns({ filter }))
    return filter
  },
)

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addPendingTransaction: (
      state,
      action: PayloadAction<PendingTransaction>,
    ) => {
      state.txns.pending.data.push(action.payload)
    },
    setDetailTxn: (
      state,
      action: PayloadAction<AnyTransaction | PendingTransaction>,
    ) => {
      state.detailTxn = action.payload
    },
    clearDetailTxn: (state) => {
      return { ...state, detailTxn: undefined }
    },
    signOut: () => {
      return { ...initialState }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTxns.pending, (state, { meta: { arg } }) => {
      state.txns[arg.filter].status = 'pending'
    })
    builder.addCase(fetchTxns.rejected, (state, { meta: { arg } }) => {
      state.txns[arg.filter].status = 'rejected'
    })
    builder.addCase(
      fetchTxns.fulfilled,
      (state, { payload, meta: { arg } }) => {
        state.txns[arg.filter].status = 'fulfilled'
        const newTxns = payload as AnyTransaction[]
        // TODO: this should be unnecessary, but RN's "fast refresh" is causing duplicated items to get in
        const joined = unionBy(state.txns[arg.filter].data, newTxns, 'hash')
        state.txns[arg.filter].data = joined

        // remove any pending txns with the same hash
        state.txns.pending.data = differenceBy(
          state.txns.pending.data,
          newTxns,
          'hash',
        )
      },
    )
    builder.addCase(fetchPendingTxns.pending, (state) => {
      state.txns.pending.status = 'pending'
    })
    builder.addCase(fetchPendingTxns.rejected, (state) => {
      state.txns.pending.status = 'rejected'
    })
    builder.addCase(fetchPendingTxns.fulfilled, (state, { payload }) => {
      state.txns.pending.status = 'fulfilled'
      const pending = payload as PendingTransaction[]
      const filtered = pending.filter((txn) => txn.status === 'pending')
      const joined = unionBy(filtered, state.txns.pending.data, 'hash')
      state.txns.pending.data = joined
    })
    builder.addCase(changeFilter.fulfilled, (state, { payload }) => {
      state.filter = payload
    })
  },
})

export default activitySlice
