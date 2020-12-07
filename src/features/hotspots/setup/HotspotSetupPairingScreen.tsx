import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Linking, Platform } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Bluetooth from '../../../assets/images/bluetooth.svg'
import useAlert from '../../../utils/useAlert'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupPairingScreen = () => {
  const { t } = useTranslation()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { getState, enable } = useConnectedHotspotContext()
  const { showOKCancelAlert } = useAlert()

  const subtitle1 = t(
    `hotspot_setup.pair.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_1`,
  )
  const subtitle2 = t(
    `hotspot_setup.pair.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_2`,
  )

  const navNext = () =>
    navigation.push('HotspotScanningScreen', { hotspotType })

  const checkBluetooth = async () => {
    const state = await getState()

    if (state === 'PoweredOn') {
      navNext()
      return
    }

    if (Platform.OS === 'ios') {
      if (state === 'PoweredOff') {
        await showOKCancelAlert(
          (decision) => {
            if (decision) Linking.openURL('App-Prefs:Bluetooth')
          },
          'hotspot_setup.pair.alert_ble_off.title',
          'hotspot_setup.pair.alert_ble_off.body',
          'generic.go_to_settings',
        )
      } else {
        await showOKCancelAlert(
          (decision) => {
            if (decision) Linking.openURL('app-settings:')
          },
          'hotspot_setup.pair.alert_ble_off.title',
          'hotspot_setup.pair.alert_ble_off.body',
          'generic.go_to_settings',
        )
      }
    }
    if (Platform.OS === 'android') {
      await enable()
      navNext()
    }
  }

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      padding="lx"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Bluetooth />
      <Text
        marginTop="xl"
        variant="header"
        numberOfLines={2}
        adjustsFontSizeToFit
        marginBottom="l"
        textAlign="center"
      >
        {t('hotspot_setup.pair.title')}
      </Text>
      <Text
        marginBottom="lx"
        variant="subtitleBold"
        textAlign="center"
        color="white"
      >
        {subtitle1}
      </Text>
      <Text marginBottom="xl" variant="subtitle" textAlign="center">
        {subtitle2}
      </Text>
      <Button
        marginTop="xxl"
        width="100%"
        variant="primary"
        mode="contained"
        title={t('hotspot_setup.pair.scan')}
        onPress={checkBluetooth}
      />
    </BackScreen>
  )
}

export default HotspotSetupPairingScreen
