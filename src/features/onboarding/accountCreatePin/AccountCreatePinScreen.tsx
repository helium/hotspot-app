import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import EnterPin from '../../../assets/images/enter-pin.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import PinDisplay from '../../../components/PinDisplay'
import Keypad from '../../../components/Keypad'

const AccountCreatePinScreen = () => {
  const { t } = useTranslation()
  const [failedConfirmation, setFailedConfirmation] = useState(false)
  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      padding="l"
      justifyContent="center"
      alignItems="center"
    >
      <EnterPin />
      <Text marginVertical="m" variant="header" marginTop="lx">
        {t('account_setup.create_pin.title')}
      </Text>

      <Text variant="body" marginBottom="xl">
        {t(
          `account_setup.create_pin.${
            failedConfirmation ? 'failed' : 'subtitle'
          }`,
        )}
      </Text>
      <PinDisplay marginBottom="xl" />
      <Keypad
        onNumberPress={() => {
          setFailedConfirmation(true)
        }}
      />
    </SafeAreaBox>
  )
}

export default AccountCreatePinScreen
