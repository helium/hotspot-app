import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import usePermissionManager from '../../../utils/usePermissionManager'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const EnableLocationScreen = () => {
  const { t } = useTranslation()
  const { requestLocationPermission } = usePermissionManager()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const checkLocationPermissions = async () => {
    const enabled = await requestLocationPermission()
    if (enabled) {
      navigation.push('HotspotLocationFeeScreen')
    }
  }

  return (
    <BackScreen justifyContent="space-between">
      <Text variant="header">{t('hotspot_setup.enable_location.title')}</Text>
      <Text variant="subtitle">
        {t('hotspot_setup.enable_location.subtitle')}
      </Text>
      <Text variant="body1Light">{t('hotspot_setup.enable_location.p_1')}</Text>
      <Text variant="body1Light">{t('hotspot_setup.enable_location.p_2')}</Text>
      <Button
        onPress={checkLocationPermissions}
        variant="primary"
        mode="contained"
        title={t('hotspot_setup.enable_location.next')}
      />
    </BackScreen>
  )
}

export default EnableLocationScreen
