import React from 'react'
import Button from '../../../components/Button'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { WelcomeScreenNavigationProp } from '../onboardingTypes'

type Props = {
  navigation: WelcomeScreenNavigationProp
}

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      justifyContent="space-evenly"
      alignContent="center"
      padding="xl"
      flexDirection="column"
    >
      <Text variant="body">Welcome</Text>
      <Button
        title="Create an Account"
        onPress={() => navigation.push('AccountDescription')}
      />
    </SafeAreaBox>
  )
}

export default WelcomeScreen
