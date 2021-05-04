import { StackNavigationProp } from '@react-navigation/stack'
import { Hotspot } from '@helium/http'
import { AppLink, AppLinkCategoryType } from '../../../providers/appLinkTypes'

export type SendStackParamList = {
  Send: {
    scanResult?: AppLink
    type?: AppLinkCategoryType
    hotspot?: Hotspot
    isSeller?: boolean
  }
}

export type SendNavigationProps = StackNavigationProp<SendStackParamList>
