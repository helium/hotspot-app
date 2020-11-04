export type Stats = {
  token_supply: number
  state_channel_counts: StateChannelCounts
  fees: Fees
  election_times: Times
  counts: Counts
  challenge_counts: ChallengeCounts
  block_times: Times
}

export type ChallengeCounts = {
  last_day: number
  active: number
}

export type Counts = {
  transactions: number
  hotspots: number
  consensus_groups: number
  challenges: number
  blocks: number
}
export type Fees = {
  last_week: FeesLastDay
  last_month: FeesLastDay
  last_day: FeesLastDay
}

export type FeesLastDay = {
  transaction: number
  staking: number
}

export type StateChannelCounts = {
  last_week: StateChannelCountsLastDay
  last_month: StateChannelCountsLastDay
  last_day: StateChannelCountsLastDay
}

export type StateChannelCountsLastDay = {
  num_packets: number
  num_dcs: number
}

export type Times = {
  last_week: Time
  last_month: Time
  last_hour: Time
  last_day: Time
}

export type Time = {
  stddev: number | null
  avg: number
}
