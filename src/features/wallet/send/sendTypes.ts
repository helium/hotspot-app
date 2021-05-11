import { StackNavigationProp } from '@react-navigation/stack'
import { Hotspot } from '@helium/http'
import { AppLink, AppLinkCategoryType } from '../../../providers/appLinkTypes'

export type SendStackParamList = {
  Send: {
    scanResult?: AppLink
    type?: AppLinkCategoryType
    hotspot?: Hotspot
    isSeller?: boolean
    pinVerified?: 'fail' | 'pass'
  }
  SendScan: {
    type?: AppLinkCategoryType
  }
  SendComplete: undefined
}

export type SendNavigationProps = StackNavigationProp<SendStackParamList>
