import { StackNavigationProp } from '@react-navigation/stack'
import { Hotspot } from '@helium/http'
import Balance, { NetworkTokens } from '@helium/currency'
import { AppLink, AppLinkCategoryType } from '../../../providers/appLinkTypes'

export type SendStackParamList = {
  Send: {
    scanResult?: AppLink
    type?: AppLinkCategoryType
    hotspot?: Hotspot
    isSeller?: boolean
  }
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
