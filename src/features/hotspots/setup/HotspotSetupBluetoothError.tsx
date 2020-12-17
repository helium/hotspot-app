import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupBluetoothScreen'
>
const HotspotSetupBluetoothError = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  return (
    <Box flex={1}>
      <Text
        margin="m"
        variant="h1"
        textAlign="center"
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {t('hotspot_setup.ble_error.title')}
      </Text>
      <Text variant="body2Light" textAlign="center">
        {t('hotspot_setup.ble_error.subtitle')}
      </Text>

      <Box flex={1} justifyContent="flex-end">
        <Button
          onPress={() => navigation.replace('HotspotScanningScreen', params)}
          mode="contained"
          variant="primary"
          title={t('generic.scan_again')}
        />
      </Box>
    </Box>
  )
}

export default HotspotSetupBluetoothError
