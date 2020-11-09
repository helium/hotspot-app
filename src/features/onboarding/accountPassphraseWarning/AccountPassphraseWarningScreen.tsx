import React from 'react'
import BackButton from '../../../components/BackButton'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import Lock from '../../../assets/images/lock.svg'
import Box from '../../../components/Box'
import { t } from '../../../utils/translate'

const AccountPassphraseWarningScreen = () => {
  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box position="absolute" right={0}>
        <Lock />
      </Box>

      <SafeAreaBox flex={1} flexDirection="column" paddingHorizontal="l">
        <BackButton />
        <Text marginTop="xl" variant="header">
          {t('account_setup.warning.title')}
        </Text>
        <Text marginTop="xl" variant="body">
          {t('account_setup.warning.subtitle')}
        </Text>
      </SafeAreaBox>
    </Box>
  )
}

export default AccountPassphraseWarningScreen
