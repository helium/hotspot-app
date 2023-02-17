import { differenceInDays, formatDistance } from 'date-fns'

export const fromNow = (date: Date) => {
  return formatDistance(date, new Date(), {
    addSuffix: true,
  })
}

export const hasSentinelTimePassed = (startTime?: number) => {
  if (!startTime) return true
  return differenceInDays(new Date(), startTime) >= 7
}
