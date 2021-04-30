import { StackNavigationProp } from '@react-navigation/stack'
import { Hotspot } from '@helium/http'
import { AppLink, AppLinkType } from '../../../providers/appLinkTypes'

export type SendStackParamList = {
  Send: {
    scanResult?: AppLink
    type?: AppLinkType
    hotspot?: Hotspot
    isSeller?: boolean
  }
}

export type SendNavigationProps = StackNavigationProp<SendStackParamList>
