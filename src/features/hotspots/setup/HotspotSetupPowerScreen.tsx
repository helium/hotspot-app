import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as Permissions from 'expo-permissions'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Power from '../../../assets/images/power.svg'
import RakFront from '../../../assets/images/rakFront.svg'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupPowerScreen = () => {
  const { t } = useTranslation()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const subtitle1 = t(
    `hotspot_setup.power.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_1`,
  )
  const subtitle2 = t(
    `hotspot_setup.power.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_2`,
  )
  const [, askForPermission] = Permissions.usePermissions(
    Permissions.LOCATION,
    {
      ask: true,
    },
  )

  useEffect(() => {
    askForPermission()
    // TODO: On Android after the permissions dialog closes the pin entry screen shows.
    // This happens because the dialog puts our app into background mode.
    // I think the best way to fix this is to have a permissions hook that is passed
    // down via the context api. That hook will have a flag that says when a request
    // is being made. The `App.tsx` file can monitor that flag when deciding to show pin.
    // Could possibly create an `<AppStateProvider>` that handles background/lock/permissions

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          {t('hotspot_setup.power.title')}
        </Text>
        <Text marginBottom="s" variant="bodyLight" textAlign="center">
          {subtitle1}
        </Text>
        <Text marginBottom="s" variant="bodyLight" textAlign="center">
          {subtitle2}
        </Text>
        {hotspotType === 'Helium' && <Power />}
        {hotspotType === 'RAK' && <RakFront />}
      </Box>

      <Button
        variant="secondary"
        mode="contained"
        title={t('generic.next')}
        onPress={() =>
          navigation.push('HotspotSetupPairingScreen', { hotspotType })
        }
      />

      <Button
        marginHorizontal="m"
        variant="secondary"
        mode="text"
        title={t('generic.need_help')}
      />
    </BackScreen>
  )
}

export default HotspotSetupPowerScreen
