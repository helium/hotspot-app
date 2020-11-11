import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

const AccountCreatePinScreen = () => {
  const { t } = useTranslation()
  return (
    <Box backgroundColor="mainBackground" flex={1} padding="l">
      <Text variant="header" marginTop="xxl">
        {t('account_setup.create_pin.title')}
      </Text>
    </Box>
  )
}

export default AccountCreatePinScreen
