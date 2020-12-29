import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import Box from '../../../components/Box'
import ImageBox from '../../../components/ImageBox'
import TextTransform from '../../../components/TextTransform'

const WelcomeScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  return (
    <Box backgroundColor="primaryBackground" flex={1}>
      <ImageBox
        alignSelf="flex-end"
        maxHeight="50%"
        resizeMode="contain"
        aspectRatio={1242 / 1340}
        width="100%"
        source={require('../../../assets/images/welcome.png')}
      />
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
          i18nKey={t('account_setup.welcome.subtitle')}
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
