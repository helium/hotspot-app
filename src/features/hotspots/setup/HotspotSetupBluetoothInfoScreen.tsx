import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Linking, Platform } from 'react-native'
import React, { useEffect } from 'react'
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
import { useBluetoothContext } from '../../../providers/BluetoothProvider'
import Box from '../../../components/Box'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupBluetoothInfoScreen = () => {
  const { t } = useTranslation()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { enable, getState } = useBluetoothContext()
  const { showOKCancelAlert } = useAlert()

  const subtitle1 = t(
    `hotspot_setup.pair.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_1`,
  )
  const subtitle2 = t(
    `hotspot_setup.pair.${hotspotType === 'RAK' ? 'rak_' : ''}subtitle_2`,
  )

  useEffect(() => {
    getState()
  }, [getState])

  const navNext = () =>
    navigation.push('HotspotSetupScanningScreen', { hotspotType })

  const checkBluetooth = async () => {
    const state = await getState()

    if (state === 'PoweredOn') {
      navNext()
      return
    }

    if (Platform.OS === 'ios') {
      if (state === 'PoweredOff') {
        const decision = await showOKCancelAlert({
          titleKey: 'hotspot_setup.pair.alert_ble_off.title',
          messageKey: 'hotspot_setup.pair.alert_ble_off.body',
          okKey: 'generic.go_to_settings',
        })
        if (decision) Linking.openURL('App-Prefs:Bluetooth')
      } else {
        const decision = await showOKCancelAlert({
          titleKey: 'hotspot_setup.pair.alert_ble_off.title',
          messageKey: 'hotspot_setup.pair.alert_ble_off.body',
          okKey: 'generic.go_to_settings',
        })
        if (decision) Linking.openURL('app-settings:')
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
        marginTop={{ phone: 'xl', smallPhone: 'm' }}
        variant="h1"
        numberOfLines={2}
        adjustsFontSizeToFit
        marginBottom="l"
        textAlign="center"
      >
        {t('hotspot_setup.pair.title')}
      </Text>
      <Text
        marginBottom={{ phone: 'lx', smallPhone: 'm' }}
        variant="subtitleBold"
        textAlign="center"
        color="white"
      >
        {subtitle1}
      </Text>
      <Text
        marginBottom="xl"
        variant="subtitle"
        textAlign="center"
        numberOfLines={8}
        adjustsFontSizeToFit
      >
        {subtitle2}
      </Text>
      <Box flex={1} width="100%" justifyContent="flex-end">
        <Button
          width="100%"
          variant="primary"
          mode="contained"
          title={t('hotspot_setup.pair.scan')}
          onPress={checkBluetooth}
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupBluetoothInfoScreen
