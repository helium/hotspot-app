import { differenceInHours, formatDistance } from 'date-fns'

export const fromNow = (date: Date) => {
  return formatDistance(date, new Date(), {
    addSuffix: true,
  })
}

export const hasTimePassed = (startTime?: number, hoursPassed = 24) => {
  if (!startTime) return true
  return differenceInHours(new Date(), startTime) > hoursPassed
}
