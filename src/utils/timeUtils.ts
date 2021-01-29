import { formatDistance } from 'date-fns'

// eslint-disable-next-line import/prefer-default-export
export const fromNow = (date: Date) => {
  return formatDistance(date, new Date(), {
    addSuffix: true,
  })
}
