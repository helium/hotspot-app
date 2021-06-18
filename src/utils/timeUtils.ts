import { formatDistance } from 'date-fns'

export const fromNow = (date: Date) => {
  return formatDistance(date, new Date(), {
    addSuffix: true,
  })
}
