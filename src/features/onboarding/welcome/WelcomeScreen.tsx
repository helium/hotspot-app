import React from 'react'
import { View } from 'react-native'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { WelcomeScreenNavigationProp } from '../onboardingTypes'
import { t } from '../../../utils/translate'
import UserLocationMap from '../../../components/UserLocationMap'
import SafeAreaBox from '../../../components/SafeAreaBox'
import ImageBox from '../../../components/ImageBox'
import Box from '../../../components/Box'

type Props = {
  navigation: WelcomeScreenNavigationProp
}

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <View>
      <UserLocationMap />
      <SafeAreaBox
        height="100%"
        width="100%"
        paddingVertical="s"
        paddingHorizontal="xl"
      >
        <Box
          flexDirection="column"
          alignItems="center"
          width="100%"
          flex={3}
          justifyContent="flex-start"
        >
          <ImageBox
            source={require('../../../assets/images/helium-logo.png')}
            marginTop="xl"
          />
        </Box>
        <Box
          flexDirection="column"
          alignItems="center"
          width="100%"
          flex={4}
          justifyContent="center"
        >
          <Text variant="header" numberOfLines={1} adjustsFontSizeToFit>
            {t('account_setup.welcome.title')}
          </Text>
          <Text variant="body" textAlign="center" marginVertical="m">
            {t('account_setup.welcome.subtitle')}
          </Text>
          <Text variant="body" fontWeight="500" textAlign="center">
            {t('account_setup.welcome.get_started')}
          </Text>
        </Box>
        <Box
          flexDirection="column"
          alignItems="center"
          width="100%"
          flex={3}
          justifyContent="flex-end"
        >
          <Button
            mode="contained"
            variant="primary"
            width="100%"
            marginBottom="l"
            onPress={() => navigation.push('AccountDescription')}
            title={t('account_setup.welcome.create_account')}
          />
          <Button
            onPress={() => navigation.push('AccountDescription')}
            mode="text"
            variant="primary"
            title={t('account_setup.welcome.import_account')}
          />
        </Box>
      </SafeAreaBox>
    </View>
  )
}

export default WelcomeScreen
