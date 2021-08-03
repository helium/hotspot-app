import { Colors } from '../theme/theme'

export const generateRewardScaleColor = (rewardScale: number): Colors => {
  if (rewardScale >= 0.75) {
    return 'greenOnline'
  }
  if (rewardScale >= 0.5) {
    return 'yellow'
  }
  if (rewardScale >= 0.25) {
    return 'orangeDark'
  }
  return 'redMain'
}

export const isRelay = (listenAddrs: string[] | undefined) => {
  if (!listenAddrs) return false
  const IP = /ip4/g
  return listenAddrs.length > 0 && !listenAddrs.find((a) => a.match(IP))
}

export const HELIUM_OLD_MAKER_ADDRESS =
  '14fzfjFcHpDR1rTH8BNPvSi5dKBbgxaDnmsVPbCjuq9ENjpZbxh'
