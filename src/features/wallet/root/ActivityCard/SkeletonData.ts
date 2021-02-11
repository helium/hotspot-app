import { times } from 'lodash'
import { ACTIVITY_FETCH_SIZE } from '../../../../store/activity/activitySlice'

export type SkeletonTxn = {
  hash: string
  status: string
  time: number
  type: string
}

export const skeletonData = (currentDataLength: number): SkeletonTxn[] => {
  let amount = 14
  if (currentDataLength !== 0) {
    if (currentDataLength < ACTIVITY_FETCH_SIZE) {
      amount = currentDataLength
    } else {
      amount = ACTIVITY_FETCH_SIZE
    }
  }

  return times(amount).map((v) => ({
    hash: v.toString(),
    status: 'skeleton',
    time: 0,
    type: 'skeleton',
  }))
}
