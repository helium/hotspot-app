import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Device } from 'react-native-ble-plx'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const HotspotSetupBluetoothSuccess = () => {
  const { t } = useTranslation()
  const [connecting, setConnecting] = useState(false)
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const {
    availableHotspots,
    connectAndConfigHotspot,
  } = useConnectedHotspotContext()

  const keys = Object.keys(availableHotspots)

  const handleConnect = async (hotspot: Device) => {
    setConnecting(true)
    await connectAndConfigHotspot(hotspot)
    setConnecting(false)
    navigation.push('HotspotSetupScanWifiScreen')
  }

  return (
    <Box>
      <Text
        variant="header"
        textAlign="center"
        numberOfLines={1}
        adjustsFontSizeToFit
        marginBottom="l"
      >
        {t('hotspot_setup.ble_select.title')}
      </Text>
      <Text variant="body2" textAlign="center">
        {t('hotspot_setup.ble_select.hotspots_found', {
          count: Object.keys(availableHotspots).length,
        })}
      </Text>
      <Text variant="body2Light" textAlign="center" marginBottom="m">
        {t('hotspot_setup.ble_select.subtitle')}
      </Text>
      {keys.map((key) => {
        const hotspot = availableHotspots[key]
        if (!hotspot || !hotspot.name) return null

        return (
          <Button
            key={hotspot.id}
            variant="secondary"
            mode="contained"
            title={hotspot.name}
            marginTop="m"
            disabled={connecting}
            onPress={() => handleConnect(hotspot)}
          />
        )
      })}
    </Box>
  )
}

export default HotspotSetupBluetoothSuccess
