import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'
import { getIncidents } from '../../utils/StatusClient'
import { Incident, StatusInfo } from './StatusTypes'
import { getWallet } from '../../utils/walletClient'

const STATUS_KEY = 'statusKey'
type StoredIncident = {
  id: string
  status: string
}

type StatusConfig = { components: string[]; incidentStatuses: string[] }
export type HeliumStatusState = {
  page?: StatusInfo
  incidents: Incident[]
  config?: StatusConfig
}

const initialState: HeliumStatusState = {
  incidents: [],
}

export const fetchStatusConfig = createAsyncThunk<StatusConfig>(
  'status/getConfig',
  async () => getWallet('status', null, { camelCase: true }),
)

export const fetchIncidents = createAsyncThunk(
  'heliumStatus/fetchIncidents',
  async (_, { getState }) => {
    const { status } = (await getState()) as { status: HeliumStatusState }
    let { config } = status
    if (!config) {
      config = await getWallet('status', null, { camelCase: true })
    }

    let storedIncidents: StoredIncident[] = []
    const storedIncidentsStr = await AsyncStorage.getItem(STATUS_KEY)
    if (storedIncidentsStr) {
      storedIncidents = JSON.parse(storedIncidentsStr) as StoredIncident[]
    }
    const incidents: {
      page: StatusInfo
      incidents: Incident[]
    } = await getIncidents()
    return {
      config,
      storedIncidents,
      ...incidents,
    }
  },
)

const heliumStatusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIncidents.fulfilled, (state, { payload }) => {
      state.config = payload.config

      const componentIds = state.config?.components || []
      const incidentStatuses = state.config?.incidentStatuses || []

      const incidents = payload.incidents.flatMap((incident) => {
        if (
          // verify this incident belongs to at least one relevant component
          !incident.components.find(({ id }) => componentIds.includes(id)) ||
          // verify the status is one we want to show
          !incidentStatuses.includes(incident.status) ||
          // make sure we haven't already shown this incident/status
          payload.storedIncidents.find(
            ({ id, status }) =>
              id === incident.id && status === incident.status,
          )
        ) {
          return []
        }
        return [incident]
      })

      const nextStoredIncidents = [
        ...incidents.map(({ id, status }) => ({ id, status })),
        ...payload.storedIncidents,
      ].slice(0, 20) // limit number of stored incidents. This is just an arbitrary number. May need adjustment.

      AsyncStorage.setItem(STATUS_KEY, JSON.stringify(nextStoredIncidents))

      state.incidents = incidents
      state.page = payload.page
    })
  },
})

export default heliumStatusSlice
