import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import Box from '../../../components/Box'
import ImageBox from '../../../components/ImageBox'
import TextTransform from '../../../components/TextTransform'
import { isTablet } from 'react-native-device-info'

const WelcomeScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  return (
    <Box backgroundColor="primaryBackground" flex={1} >
      <Box
        flex={2}
        height={"100%"}
      >
      <ImageBox
        flex={1}
        alignSelf={isTablet() ? "flex-end" : "auto"}
        maxHeight="100%"
        resizeMode="contain"
        aspectRatio={1242 / 1340}
        width="50%"
        source={require('../../../assets/images/welcome.png')}
      />
      </Box>
      <Box
        flex={1}
        paddingVertical="l"
        paddingHorizontal="lx"
        justifyContent="flex-end"
      >
        <Text variant="h1">{t('account_setup.welcome.title')}</Text>
        <TextTransform
          variant="subtitle"
          marginVertical="lx"
          i18nKey="account_setup.welcome.subtitle"
        />
        <Button
          mode="contained"
          variant="primary"
          width="100%"
          marginBottom="s"
          onPress={() => navigation.push('AccountPassphraseWarning')}
          title={t('account_setup.welcome.create_account')}
        />
        <Button
          onPress={() => navigation.push('AccountImportScreen')}
          mode="text"
          variant="primary"
          title={t('account_setup.welcome.import_account')}
        />
      </Box>
    </Box>
  )
}

export default WelcomeScreen
