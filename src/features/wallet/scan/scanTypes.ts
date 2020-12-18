import { StackNavigationProp } from '@react-navigation/stack'

export type ScanStackParamList = {
  Scan: {
    fromSend?: boolean
  }
}

export type ScanNavigationProps = StackNavigationProp<ScanStackParamList>
