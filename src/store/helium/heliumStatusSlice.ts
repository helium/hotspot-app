import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'
import { getIncidents } from '../../utils/StatusClient'
import { Incident, StatusInfo } from './StatusTypes'

const STATUS_KEY = 'statusKey'
const ONBOARDING_COMPONENT_ID = '74lkk1qwp5xq'
const APP_COMPONENT_ID = 'qfcq2xt6v0xm'
const COMPONENT_IDS = [ONBOARDING_COMPONENT_ID, APP_COMPONENT_ID]
const INCIDENT_STATUSES = [
  'investigating',
  'identified',
  'scheduled',
  'in_progress',
  'verifying',
]

type StoredIncident = {
  id: string
  status: string
}

export type HeliumStatusState = {
  page?: StatusInfo
  incidents: Incident[]
}

const initialState: HeliumStatusState = {
  incidents: [],
}

export const fetchIncidents = createAsyncThunk(
  'heliumStatus/fetchIncidents',
  async () => {
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
      storedIncidents,
      ...incidents,
    }
  },
)

const heliumStatusSlice = createSlice({
  name: 'heliumStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIncidents.fulfilled, (state, { payload }) => {
      const incidents = payload.incidents.flatMap((incident) => {
        if (
          // verify this incident belongs to at least one relevant component
          !incident.components.find(({ id }) => COMPONENT_IDS.includes(id)) ||
          // verify the status is one we want to show
          !INCIDENT_STATUSES.includes(incident.status) ||
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
