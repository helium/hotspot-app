import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'

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
      backgroundColor="mainBackground"
      paddingBottom="s"
      paddingHorizontal="xl"
      justifyContent="space-between"
    >
      <Text
        variant="header"
        textAlign="center"
        numberOfLines={1}
        adjustsFontSizeToFit
        marginVertical="l"
      >
        {t('hotspot_setup.diagnostics.title')}
      </Text>
      <ScrollView>
        <Text variant="bodyLight">{t('hotspot_setup.diagnostics.p_1')}</Text>
        <Text variant="bodyLight" marginTop="m">
          {t('hotspot_setup.diagnostics.p_2')}
        </Text>
        <Text variant="bodyLight" marginTop="m">
          {t('hotspot_setup.diagnostics.p_3')}
        </Text>
        <TextTransform
          variant="bodyLight"
          marginTop="m"
          i18nKey={t('hotspot_setup.diagnostics.p_4')}
        />
      </ScrollView>
      <Button
        variant="secondary"
        mode="contained"
        title={t('generic.next')}
        onPress={() => navigation.push('HotspotSetupPowerScreen', params)}
      />
    </BackScreen>
  )
}

export default HotspotSetupDiagnosticsScreen
