import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotSelectionCard from './HotspotSelectionCard'

const HotspotSetupSelectionScreen = () => {
  const { t } = useTranslation()
  return (
    <BackScreen backgroundColor="primaryBackground" padding="lx">
      <Text variant="h1">{t('hotspot_setup.selection.title')}</Text>
      <Text
        variant="subtitle"
        numberOfLines={2}
        adjustsFontSizeToFit
        marginVertical="l"
      >
        {t('hotspot_setup.selection.subtitle')}
      </Text>
      <ScrollView>
        <Box flexDirection="row" height={191}>
          <HotspotSelectionCard hotspotType="Helium" />
          <HotspotSelectionCard hotspotType="RAK" />
        </Box>
        <Box flexDirection="row" height={191}>
          <HotspotSelectionCard hotspotType="NEBRAIN" />
          <HotspotSelectionCard hotspotType="NEBRAOUT" />
        </Box>
        <Box flexDirection="row" width="50%" height={191}>
          <HotspotSelectionCard hotspotType="SYNCROBIT" />
        </Box>
      </ScrollView>
    </BackScreen>
  )
}

export default HotspotSetupSelectionScreen
