import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { MoreNavigationProp } from '../moreTypes'
import ConfirmPinView from '../../../components/ConfirmPinView'
import { getString } from '../../../utils/account'

const VerifyPinScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<MoreNavigationProp>()
  const { result: pin } = useAsync(getString, ['userPin'])

  return (
    <SafeAreaBox
      backgroundColor="secondaryBackground"
      flex={1}
      padding="l"
      paddingBottom="none"
    >
      {pin && (
        <ConfirmPinView
          originalPin={pin}
          title={t('auth.title')}
          pinSuccess={() => {
            navigation.navigate('MoreScreen', { pinVerified: true })
          }}
          onCancel={navigation.goBack}
        />
      )}
    </SafeAreaBox>
  )
}

export default VerifyPinScreen
