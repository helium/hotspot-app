import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { Edge } from 'react-native-safe-area-context'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import HotspotSelectionCard from './HotspotSelectionCard'

const HotspotSetupSelectionScreen = () => {
  const { t } = useTranslation()
  const edges = useMemo((): Edge[] => ['top', 'left', 'right'], [])

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      padding="lx"
      paddingBottom="none"
      edges={edges}
    >
      <Text variant="h1" numberOfLines={2} adjustsFontSizeToFit>
        {t('hotspot_setup.selection.title')}
      </Text>
      <Text
        variant="subtitle"
        maxFontSizeMultiplier={1}
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
        <Box flexDirection="row" height={191} paddingBottom="l">
          <HotspotSelectionCard hotspotType="SYNCROBIT" />
          <HotspotSelectionCard hotspotType="Bobcat" />
        </Box>
      </ScrollView>
    </BackScreen>
  )
}

export default HotspotSetupSelectionScreen
