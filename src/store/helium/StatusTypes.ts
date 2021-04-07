export type StatusInfo = {
  id: string
  name: string
  url: string
  time_zone: string
  updated_at: string
}

export type Status = {
  indicator: 'none' | 'minor' | 'major' | 'critical'
  description: string
}

export type AffectedComponent = {
  code: string
  name: string
  old_status: string
  new_status: string
}

export type IncidentUpdate = {
  id: string
  status: string
  body: string
  incident_id: string
  created_at: string
  updated_at: string
  displayed_at: string
  affected_components: AffectedComponent[]
  deliver_notifications: boolean
  custom_tweet?: string
  tweet_id?: string
}

export type Component = {
  id: string
  name: string
  status: string
  created_at: string
  updated_at: string
  position: number
  description?: string
  showcase: boolean
  start_date?: string
  group_id?: string
  page_id: string
  group: boolean
  only_show_if_degraded: boolean
}

export type Incident = {
  id: string
  name: string
  status: string
  created_at: string
  updated_at: string
  monitoring_at: string
  resolved_at: string
  impact: 'none' | 'minor' | 'major' | 'critical'
  shortlink: string
  started_at: string
  page_id: string
  incident_updates?: IncidentUpdate[]
  components: Component[]
}
