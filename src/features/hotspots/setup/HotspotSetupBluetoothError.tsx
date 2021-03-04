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
import Bluetooth from '../../../assets/images/bluetooth.svg'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupPickHotspotScreen'
>
const HotspotSetupBluetoothError = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  return (
    <Box flex={1}>
      <Box flex={1}>
        <Box marginBottom="l">
          <Bluetooth />
        </Box>
        <Text
          variant="h1"
          maxFontSizeMultiplier={1}
          numberOfLines={2}
          adjustsFontSizeToFit
          marginBottom="xxl"
        >
          {t('hotspot_setup.ble_error.title')} :(
        </Text>

        <Box flexDirection="row">
          <Box
            flex={3}
            backgroundColor="purple200"
            borderTopLeftRadius="m"
            borderBottomLeftRadius="m"
            padding="m"
          >
            <Text variant="body2Medium" marginBottom="xs">
              {t('hotspot_setup.ble_error.enablePairing')}
            </Text>
            <Text variant="body2Light">
              {t('hotspot_setup.ble_error.pairingInstructions')}
            </Text>
          </Box>
          <Box
            flex={1}
            backgroundColor="purple300"
            borderTopRightRadius="m"
            borderBottomRightRadius="m"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width={28}
              height={28}
              borderRadius="round"
              backgroundColor="purpleMain"
              shadowColor="purpleMain"
              shadowOpacity={1}
              shadowOffset={{ width: 0, height: 0 }}
              shadowRadius={8}
            />
          </Box>
        </Box>
      </Box>

      <Box justifyContent="flex-end">
        <Button
          onPress={() =>
            navigation.replace('HotspotSetupScanningScreen', params)
          }
          mode="contained"
          variant="primary"
          title={t('generic.scan_again')}
        />
      </Box>
    </Box>
  )
}

export default HotspotSetupBluetoothError
