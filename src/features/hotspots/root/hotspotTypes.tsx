import { StackNavigationProp } from '@react-navigation/stack'
import { Hotspot } from '@helium/http'

export type HotspotStackParamList = {
  HotspotsScreen: undefined
  HotspotDetails: { hotspot: Hotspot }
}

export type HotspotNavigationProp = StackNavigationProp<HotspotStackParamList>
