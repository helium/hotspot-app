import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import animalHash from 'angry-purple-tiger'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'

const WifiSettings = () => {
  const {
    connectedHotspot: { address },
  } = useSelector((state: RootState) => state)

  const { t } = useTranslation()
  return (
    <Box padding="l" minHeight={413}>
      <Text variant="medium" fontSize={21} color="black" marginBottom="lx">
        {animalHash(address || '')}
      </Text>

      <Text variant="medium" fontSize={15} color="black" marginBottom="lx">
        {t('hotspot_settings.wifi.connected_via')}
      </Text>
    </Box>
  )
}

export default WifiSettings
