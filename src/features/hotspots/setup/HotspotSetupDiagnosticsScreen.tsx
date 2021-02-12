import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import { DebouncedButton } from '../../../components/Button'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Clipboard from '../../../assets/images/clipboard.svg'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupDiagnosticsScreen'
>

const HotspotSetupDiagnosticsScreen = () => {
  const { params } = useRoute<Route>()
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  return (
    <BackScreen
      backgroundColor="primaryBackground"
      paddingBottom="s"
      paddingHorizontal="lx"
    >
      <ScrollView>
        <Clipboard />
        <Text
          variant="h1"
          numberOfLines={1}
          adjustsFontSizeToFit
          marginVertical="l"
        >
          {t('hotspot_setup.diagnostics.title')}
        </Text>
        <TextTransform
          variant="subtitle"
          marginTop="m"
          i18nKey="hotspot_setup.diagnostics.p_1"
        />
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

export default HotspotSetupDiagnosticsScreen
