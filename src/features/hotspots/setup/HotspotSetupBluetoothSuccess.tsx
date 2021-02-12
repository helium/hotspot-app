import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Device } from 'react-native-ble-plx'
import { useDebouncedCallback } from 'use-debounce'
import Box from '../../../components/Box'
import HotspotPairingList from '../../../components/HotspotPairingList'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import Bluetooth from '../../../assets/images/bluetooth.svg'

const HotspotSetupBluetoothSuccess = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { availableHotspots } = useConnectedHotspotContext()

  const handleConnect = useDebouncedCallback(
    (hotspot: Device) => {
      navigation.replace('HotspotSetupConnectingScreen', {
        hotspotId: hotspot.id,
      })
    },
    1000,
    { leading: true },
  )

  return (
    <Box flex={1}>
      <Box padding="lx" backgroundColor="primaryBackground">
        <Box marginBottom="l">
          <Bluetooth />
        </Box>
        <Text
          variant="h1"
          numberOfLines={1}
          adjustsFontSizeToFit
          marginBottom="m"
        >
          {t('hotspot_setup.ble_select.hotspots_found', {
            count: Object.keys(availableHotspots).length,
          })}
        </Text>
        <Text variant="subtitleLight">
          {t('hotspot_setup.ble_select.subtitle')}
        </Text>
      </Box>
      <Box flex={1} paddingHorizontal="lx" backgroundColor="purple200">
        <HotspotPairingList
          hotspots={Object.values(availableHotspots)}
          onPress={handleConnect.callback}
        />
      </Box>
    </Box>
  )
}

export default HotspotSetupBluetoothSuccess
