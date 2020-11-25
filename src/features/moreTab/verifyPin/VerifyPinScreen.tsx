import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { MoreNavigationProp, MoreStackParamList } from '../moreTypes'
import ConfirmPinView from '../../../components/ConfirmPinView'
import { getString } from '../../../utils/account'
import { RootStackParamList } from '../../../navigation/mainTabs/tabTypes'

type Route = RouteProp<
  MoreStackParamList & RootStackParamList,
  'VerifyPinScreen'
>
const VerifyPinScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
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
          subtitle={t('auth.enter_current')}
          pinSuccess={() => {
            navigation.navigate('MoreScreen', {
              pinVerifiedFor: params.requestType,
            })
          }}
          onCancel={navigation.goBack}
        />
      )}
    </SafeAreaBox>
  )
}

export default VerifyPinScreen
