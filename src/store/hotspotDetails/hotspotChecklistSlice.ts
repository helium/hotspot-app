import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PocReceiptsV1 } from '@helium/http'
import { Reward, RewardsV1 } from '@helium/http/build/models/Transaction'
import { getHotspotActivityList } from '../../utils/appDataClient'
import { HotspotActivityType } from '../../features/hotspots/root/hotspotTypes'

const getTransactions = async (
  gateway: string,
  filterType: HotspotActivityType,
  count: number,
) => {
  const txnList = await getHotspotActivityList(gateway, filterType)
  return txnList?.take(count)
}

export const fetchChecklistActivity = createAsyncThunk(
  'hotspotDetails/fetchChecklistActivity',
  async (gateway: string) => {
    const data = await Promise.all([
      getTransactions(gateway, 'challenge_construction', 1),
      getTransactions(gateway, 'challenge_activity', 1),
      getTransactions(gateway, 'rewards', 200),
    ])

    const challengerTxn = data[0] as PocReceiptsV1[]
    const challengeeTxn = data[1] as PocReceiptsV1[]
    const rewardTxns = data[2] as RewardsV1[]

    // most recent witness transaction
    const witnessTxn = rewardTxns?.find((txn: RewardsV1) =>
      txn?.rewards?.find(
        (txnReward: Reward) => txnReward.type === 'poc_witnesses',
      ),
    )

    // most recent data credit transaction
    const dataTransferTxn = rewardTxns?.find((txn: RewardsV1) =>
      txn?.rewards?.find(
        (txnReward: Reward) => txnReward.type === 'data_credits',
      ),
    )

    return {
      challengerTxn: challengerTxn?.length === 1 ? challengerTxn[0] : undefined,
      challengeeTxn: challengeeTxn?.length === 1 ? challengeeTxn[0] : undefined,
      witnessTxn,
      dataTransferTxn,
    }
  },
)

type HotspotChecklistSliceState = {
  challengerTxn?: PocReceiptsV1
  challengeeTxn?: PocReceiptsV1
  witnessTxn?: RewardsV1
  dataTransferTxn?: RewardsV1
  loadingActivity: boolean
}
const initialState: HotspotChecklistSliceState = {
  loadingActivity: false,
}

const hotspotChecklistSlice = createSlice({
  name: 'hotspotChecklist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChecklistActivity.pending, (state, _action) => {
      state.loadingActivity = true
    })
    builder.addCase(fetchChecklistActivity.fulfilled, (state, action) => {
      state.loadingActivity = false
      state.challengerTxn = action.payload.challengerTxn
      state.challengeeTxn = action.payload.challengeeTxn
      state.witnessTxn = action.payload.witnessTxn
      state.dataTransferTxn = action.payload.dataTransferTxn
    })
    builder.addCase(fetchChecklistActivity.rejected, (state, _action) => {
      state.loadingActivity = false
      state.challengerTxn = undefined
      state.challengeeTxn = undefined
      state.witnessTxn = undefined
      state.dataTransferTxn = undefined
    })
  },
})

export default hotspotChecklistSlice
