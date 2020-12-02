import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Bluetooth from '../../../assets/images/bluetooth.svg'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupPairingScreen = () => {
  const { t } = useTranslation()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const subtitle1 = t(
    `hotspot_setup.pair.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_1`,
  )
  const subtitle2 = t(
    `hotspot_setup.pair.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_2`,
  )
  return (
    <BackScreen backgroundColor="mainBackground" padding="l">
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text
          variant="header"
          numberOfLines={2}
          adjustsFontSizeToFit
          marginBottom="m"
          textAlign="center"
        >
          {t('hotspot_setup.pair.title')}
        </Text>
        <Text marginBottom="s" variant="bodyLight" textAlign="center">
          {subtitle1}
        </Text>
        <Text marginBottom="s" variant="bodyLight" textAlign="center">
          {subtitle2}
        </Text>
        {hotspotType === 'Helium' && <Bluetooth />}
      </Box>

      <Button variant="secondary" mode="contained" title={t('generic.next')} />

      <Button
        marginHorizontal="m"
        variant="secondary"
        mode="text"
        title={t('generic.need_help')}
      />
    </BackScreen>
  )
}

export default HotspotSetupPairingScreen
