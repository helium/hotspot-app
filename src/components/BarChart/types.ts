export type ChartData = {
  id: string
  timestamp?: string
  up: number
  down: number
  label: string
}

export type ChartRange = 'daily' | 'weekly' | 'monthly'
