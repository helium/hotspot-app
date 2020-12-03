import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { useBluetoothContext } from '../../../utils/BluetoothProvider'

const HotspotSetupBluetoothSuccess = () => {
  const { t } = useTranslation()
  const { availableHotspots } = useBluetoothContext()
  const keys = Object.keys(availableHotspots)

  return (
    <Box margin="l">
      <Text
        variant="header"
        textAlign="center"
        numberOfLines={1}
        adjustsFontSizeToFit
        marginBottom="l"
      >
        {t('hotspot_setup.ble_select.title')}
      </Text>
      <Text variant="body" textAlign="center">
        {t('hotspot_setup.ble_select.hotspots_found', {
          count: Object.keys(availableHotspots).length,
        })}
      </Text>
      <Text variant="bodyLight" textAlign="center" marginBottom="m">
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
          />
        )
      })}
    </Box>
  )
}

export default HotspotSetupBluetoothSuccess
