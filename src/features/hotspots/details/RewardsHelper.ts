import { Sum } from '@helium/http'
import { addMinutes } from 'date-fns'

export const getRewardChartData = (
  rewardData: Sum[] | undefined,
  numDays: number | undefined,
) => {
  if (!rewardData || !numDays) return []

  return rewardData
    .map((r) => {
      const utcOffset = new Date().getTimezoneOffset()
      const offsetDate = addMinutes(new Date(r.timestamp), utcOffset)
      return {
        up: parseFloat(r.total.toFixed(2)),
        down: 0,
        label: offsetDate.toISOString(),
        showTime: false,
        id: `reward-${r.timestamp}`,
      }
    })
    .reverse()
}
