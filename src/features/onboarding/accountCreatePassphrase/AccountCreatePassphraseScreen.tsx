import React from 'react'
import { useTranslation } from 'react-i18next'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'

const AccountCreatePassphraseScreen = () => {
  const { t } = useTranslation()
  return (
    <SafeAreaBox
      height="100%"
      width="100%"
      paddingVertical={{ phone: 'xxl', smallPhone: 'l' }}
      paddingHorizontal="l"
      backgroundColor="mainBackground"
      alignItems="center"
    >
      <Text textAlign="center" variant="header">
        {t('account_setup.passphrase.title')}
      </Text>
    </SafeAreaBox>
  )
}

export default AccountCreatePassphraseScreen
