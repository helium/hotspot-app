export type ChartData = {
  id: string
  timestamp?: string
  up: number
  down: number
  label: string
  showTime?: boolean
}

export type ChartRange = 'daily' | 'weekly' | 'monthly'
