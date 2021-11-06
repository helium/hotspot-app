export type ChartData = {
  id: string
  timestamp?: string
  up: number
  down: number
  label: string
  showTime?: boolean
}

export const ChartRangeKeys = ['daily', 'weekly', 'monthly'] as const
export type ChartRange = typeof ChartRangeKeys[number]
