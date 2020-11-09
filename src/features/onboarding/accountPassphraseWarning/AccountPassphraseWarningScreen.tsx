import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import BackButton from '../../../components/BackButton'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import Lock from '../../../assets/images/lock.svg'
import Box from '../../../components/Box'
import TextTransform from '../../../components/TextTransform'
import WordGraph from '../../../assets/images/wordGraph.svg'
import Button from '../../../components/Button'

const AccountPassphraseWarningScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box position="absolute" right={0}>
        <Lock />
      </Box>

      <SafeAreaBox flex={1} flexDirection="column" paddingHorizontal="l">
        <BackButton onPress={() => navigation.goBack()} />
        <Text marginTop={{ smallPhone: 's', phone: 'xl' }} variant="header">
          {t('account_setup.warning.title')}
        </Text>
        <TextTransform
          marginVertical="xl"
          variant="body"
          i18nKey="account_setup.warning.subtitle"
        />
        <WordGraph />
        <Text marginTop="xl" variant="body">
          {t('account_setup.warning.recover')}
        </Text>
        <Box flex={1} justifyContent="flex-end">
          <Button
            mode="contained"
            variant="primary"
            width="100%"
            marginBottom="l"
            onPress={() => navigation.goBack()}
            title={t('account_setup.warning.understand')}
          />
        </Box>
      </SafeAreaBox>
    </Box>
  )
}

export default AccountPassphraseWarningScreen
