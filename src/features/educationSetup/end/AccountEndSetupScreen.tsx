import React from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import HotspotFront from '../../../assets/images/hotspot-front.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Button from '../../../components/Button'
import Box from '../../../components/Box'
import userSlice from '../../../store/user/userSlice'
import { useAppDispatch } from '../../../store/store'

const AccountEndSetupScreen = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="mainBackground"
      alignItems="center"
      paddingHorizontal="l"
    >
      <Box height={{ phone: 300, smallPhone: 200 }}>
        <HotspotFront height="100%" />
      </Box>
      <Text variant="header">{t('hotspot_setup.start.title')}</Text>
      <Text variant="body" textAlign="center" marginVertical="m">
        {t('hotspot_setup.start.subtitle_1')}
      </Text>
      <Text textAlign="center" width={260} variant="body">
        {t('hotspot_setup.start.subtitle_2')}
      </Text>

      <Box width="100%" flex={1} justifyContent="flex-end">
        <Button
          mode="contained"
          variant="secondary"
          onPress={() => {
            dispatch(userSlice.actions.setupHotspot())
          }}
          title={t('hotspot_setup.start.next')}
        />
        <Button
          variant="secondary"
          onPress={() => {
            dispatch(userSlice.actions.finishEducation())
          }}
          title={t('generic.go_to_account')}
        />
      </Box>
    </SafeAreaBox>
  )
}

export default AccountEndSetupScreen
