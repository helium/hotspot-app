import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { showMessage } from 'react-native-flash-message'
import { formatDistanceToNow } from 'date-fns'
import { getIncidents, getStatus } from '../../utils/StatusClient'
import { Incident, Status, StatusInfo } from './StatusTypes'
import shortLocale from '../../utils/formatDistance'

export type HeliumStatusState = {
  status: {
    page?: StatusInfo
    status?: Status
  }
  incidents: {
    page?: StatusInfo
    incidents?: Incident[]
  }
}
const initialState: HeliumStatusState = {
  status: {},
  incidents: {},
}

const getAlertDescription = (timestamp: string) => {
  return `Last updated ${formatDistanceToNow(new Date(timestamp), {
    locale: shortLocale,
    addSuffix: true,
  })}. Tap for info.`
}

export const fetchStatus = createAsyncThunk<{
  page: StatusInfo
  status: Status
}>('heliumStatus/fetchStatus', async () => getStatus())

export const fetchIncidents = createAsyncThunk<{
  page: StatusInfo
  incidents: Incident[]
}>('heliumStatus/fetchIncidents', async () => getIncidents())

const heliumStatusSlice = createSlice({
  name: 'heliumStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStatus.fulfilled, (state, { payload }) => {
      state.status = payload
      if (payload?.status?.indicator && payload?.status?.indicator !== 'none') {
        showMessage({
          type: payload.status.indicator === 'critical' ? 'danger' : 'warning',
          message: payload.status.description,
          description: getAlertDescription(payload.page.updated_at),
        })
      }
    })
    builder.addCase(fetchIncidents.fulfilled, (state, { payload }) => {
      state.incidents = payload
      const lastIncident = payload?.incidents[0]
      if (lastIncident?.impact && lastIncident?.impact !== 'none') {
        showMessage({
          type: lastIncident.impact === 'critical' ? 'danger' : 'warning',
          message: lastIncident.name,
          description: getAlertDescription(lastIncident.updated_at),
        })
      }
    })
  },
})

export default heliumStatusSlice
