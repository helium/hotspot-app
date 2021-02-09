import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import usePermissionManager from '../../../utils/usePermissionManager'
import Lightning from '../../../assets/images/lightning.svg'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupPowerScreen = () => {
  const { t } = useTranslation()
  const { requestLocationPermission } = usePermissionManager()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      padding="lx"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Lightning />
      <Text
        marginTop="xl"
        variant="h1"
        numberOfLines={2}
        adjustsFontSizeToFit
        marginBottom="l"
        textAlign="center"
      >
        {t('hotspot_setup.power.title')}
      </Text>
      <Text
        marginBottom="lx"
        variant="subtitleBold"
        textAlign="center"
        color="white"
      >
        {t(`hotspot_setup.power.${hotspotType.toLowerCase()}_subtitle_1`)}
      </Text>
      <Text marginBottom="xl" variant="subtitle" textAlign="center">
        {t(`hotspot_setup.power.${hotspotType.toLowerCase()}_subtitle_2`)}
      </Text>
      <Button
        marginTop="xxl"
        width="100%"
        variant="secondary"
        mode="contained"
        title={t('hotspot_setup.power.next')}
        onPress={() =>
          navigation.push('HotspotSetupBluetoothInfoScreen', { hotspotType })
        }
      />
    </BackScreen>
  )
}

export default HotspotSetupPowerScreen
