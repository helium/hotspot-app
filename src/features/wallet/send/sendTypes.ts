import { StackNavigationProp } from '@react-navigation/stack'
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

export type SendNavigationProps = StackNavigationProp<SendStackParamList>
