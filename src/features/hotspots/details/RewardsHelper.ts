import { groupBy, sumBy } from 'lodash'
import { Reward } from '@helium/http'

export const calculatePercentChange = (
  value: number,
  previousValue: number,
) => {
  return (value === 0 && previousValue === 0) || previousValue === 0
    ? 0
    : ((value - previousValue) / previousValue) * 100
}

export const getRewardChartData = (
  rewardData: Reward[] | undefined,
  numDays: number | undefined,
) => {
  if (!rewardData || !numDays) return []
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
    for (let date = start; date <= now; date.setHours(date.getHours() + 1)) {
      const hourData = grouped[date.toString()]
      let amount = 0
      if (hourData) {
        amount = sumBy(hourData, (o) => o.amount.floatBalance)
      }
      chartData.push({
        up: parseFloat(amount.toFixed(2)),
        down: 0,
        label: date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
        }),
        id: `reward-${numDays}-${date}`,
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
  start.setDate(now.getDate() - numDays)
  for (let date = start; date <= now; date.setDate(date.getDate() + 1)) {
    const dayData = grouped[date.toString()]
    let amount = 0
    if (dayData) {
      amount = sumBy(dayData, (o) => o.amount.floatBalance)
    }
    chartData.push({
      up: parseFloat(amount.toFixed(2)),
      down: 0,
      label: date.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      id: `reward-${numDays}-${date}`,
    })
  }
  return chartData
}
