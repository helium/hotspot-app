import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import BackButton from '../../../components/BackButton'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'

type Route = RouteProp<OnboardingStackParamList, 'ImportAccountConfirmScreen'>
const ImportAccountConfirmScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>()
  const {
    params: { words },
  } = useRoute<Route>()

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="mainBackground"
      flexDirection="column"
      paddingHorizontal="l"
    >
      <BackButton onPress={navigation.goBack} />
      {/* TODO: Create the real component */}
      {words.map((w) => (
        <Text key={w} variant="body">
          {w}
        </Text>
      ))}
    </SafeAreaBox>
  )
}

export default ImportAccountConfirmScreen
