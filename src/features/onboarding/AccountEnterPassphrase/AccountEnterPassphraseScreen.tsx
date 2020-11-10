import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

const AccountEnterPassphraseScreen = () => {
  const { t } = useTranslation()
  return (
    <Box
      backgroundColor="mainBackground"
      flex={1}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Text variant="header">{t('account_setup.confirm.title')}</Text>
    </Box>
  )
}

export default AccountEnterPassphraseScreen
