import { StackNavigationProp } from '@react-navigation/stack'
import Balance, { NetworkTokens } from '@helium/currency'
import { AppLink, AppLinkCategoryType } from '../../../providers/appLinkTypes'

export type SendRouteType = {
  scanResult?: AppLink
  type?: AppLinkCategoryType
  hotspotAddress?: string
  isSeller?: boolean
  pinVerified?: 'fail' | 'pass'
}
export type SendStackParamList = {
  Send: SendRouteType
  SendScan: {
    type?: AppLinkCategoryType
  }
  SendComplete: undefined
}

export type SendDetails = {
  id: string
  address: string
  addressAlias: string
  addressLoading: boolean
  amount: string
  balanceAmount: Balance<NetworkTokens>
  dcAmount: string
  memo: string
}

export type SendDetailsUpdate = {
  address?: string
  balanceAmount?: Balance<NetworkTokens>
  memo?: string
}

export type SendNavigationProps = StackNavigationProp<SendStackParamList>
