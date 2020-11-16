import { StackNavigationProp } from '@react-navigation/stack'

export type EducationStackParamList = {
  HotspotEducationScreen: { showButton: boolean } | undefined
  AccountEndSetupScreen: undefined
}

export type EducationNavigationProp = StackNavigationProp<
  EducationStackParamList
>
