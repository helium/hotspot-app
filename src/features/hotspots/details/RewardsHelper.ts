import { groupBy, sumBy } from 'lodash'
import { getHotspotRewards } from '../../../utils/appDataClient'

export const calculatePercentChange = (
  value: number,
  previousValue: number,
) => {
  return (value === 0 && previousValue === 0) || previousValue === 0
    ? 0
    : ((value - previousValue) / previousValue) * 100
}

export const getRewardChartData = async (address: string, numDays: number) => {
  const rewardData = await getHotspotRewards(address, numDays)
  const chartData = []
  if (numDays === 1) {
    // chart hours
    const grouped = groupBy(rewardData, (d) => {
      return new Date(
        new Date(d.timestamp).getFullYear(),
        new Date(d.timestamp).getMonth(),
        new Date(d.timestamp).getDate(),
        new Date(d.timestamp).getHours(),
      )
    })
    const now = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      new Date().getHours(),
    )
    const start = new Date(now)
    start.setHours(now.getHours() - 24)
    for (let i = start; i <= now; i.setHours(i.getHours() + 1)) {
      const hourData = grouped[i.toString()]
      let amount = 0
      if (hourData) {
        amount = sumBy(hourData, (o) => o.amount.floatBalance)
      }
      chartData.push({
        up: parseFloat(amount.toFixed(2)),
        down: 0,
        day: i.toLocaleTimeString(),
        id: `reward-${numDays}-${i}`,
      })
    }
    return chartData
  }
  // chart days
  const grouped = groupBy(rewardData, (d) => {
    return new Date(
      new Date(d.timestamp).getFullYear(),
      new Date(d.timestamp).getMonth(),
      new Date(d.timestamp).getDate(),
    )
  })
  const now = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  )
  const start = new Date(now)
  start.setDate(now.getDate() - (numDays - 1))
  for (let i = start; i <= now; i.setDate(i.getDate() + 1)) {
    const dayData = grouped[i.toString()]
    let amount = 0
    if (dayData) {
      amount = sumBy(dayData, (o) => o.amount.floatBalance)
    }
    chartData.push({
      up: parseFloat(amount.toFixed(2)),
      down: 0,
      day: i.toDateString(),
      id: `reward-${numDays}-${i}`,
    })
  }
  return chartData
}
