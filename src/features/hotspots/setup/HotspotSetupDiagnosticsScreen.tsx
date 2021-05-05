import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import { DebouncedButton } from '../../../components/Button'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Clipboard from '../../../assets/images/clipboard.svg'
import Box from '../../../components/Box'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupDiagnosticsScreen'
>

const HotspotSetupDiagnosticsScreen = () => {
  const { params } = useRoute<Route>()
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()

  const diagnosticTextKey = () => {
    switch (params.hotspotType) {
      default:
      case 'Helium':
      case 'RAK':
        return 'hotspot_setup.diagnostics.p_1'
      case 'NEBRAIN':
      case 'NEBRAOUT':
        return 'hotspot_setup.diagnostics.nebra_p_1'
      case 'Bobcat':
        return 'hotspot_setup.diagnostics.bobcat_p_1'
      case 'SYNCROBIT':
        return 'hotspot_setup.diagnostics.syncrobit_p_1'
      case 'Finestra':
        return 'hotspot_setup.diagnostics.finestra_p_1'
      case 'LONGAPONE':
        return 'hotspot_setup.diagnostics.longap_p_1'
    }
  }

  return (
    <BackScreen backgroundColor="primaryBackground" paddingHorizontal="lx">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Box alignItems="center">
          <Clipboard />
          <Text
            variant="h1"
            numberOfLines={1}
            maxFontSizeMultiplier={1}
            adjustsFontSizeToFit
            marginVertical="l"
          >
            {t('hotspot_setup.diagnostics.title')}
          </Text>
          <TextTransform
            maxFontSizeMultiplier={1.1}
            variant="subtitle"
            marginTop="m"
            i18nKey={diagnosticTextKey()}
          />
        </Box>
      </ScrollView>
      <DebouncedButton
        variant="primary"
        mode="contained"
        title={t('generic.understand')}
        onPress={() => navigation.push('HotspotSetupPowerScreen', params)}
      />
    </BackScreen>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default HotspotSetupDiagnosticsScreen
