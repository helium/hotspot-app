import { times } from 'lodash'

export type SkeletonTxn = {
  hash: string
  status: string
  time: number
  type: string
}

export const skeletonData: SkeletonTxn[] = times(20).map((v) => ({
  hash: v.toString(),
  status: 'skeleton',
  time: 0,
  type: 'skeleton',
}))
