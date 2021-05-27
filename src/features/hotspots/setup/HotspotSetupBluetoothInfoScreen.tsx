import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Linking, Platform } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import { DebouncedButton } from '../../../components/Button'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Bluetooth from '../../../assets/images/bluetooth.svg'
import useAlert from '../../../utils/useAlert'
import { useBluetoothContext } from '../../../providers/BluetoothProvider'
import Box from '../../../components/Box'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupBluetoothInfoScreen = () => {
  const { t } = useTranslation()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const rootNav = useNavigation<RootNavigationProp>()

  const { enable, getState } = useBluetoothContext()
  const { showOKCancelAlert } = useAlert()

  useEffect(() => {
    getState()
  }, [getState])

  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

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
      paddingHorizontal="lx"
      alignItems="center"
      justifyContent="center"
      onClose={handleClose}
    >
      <Box alignItems="center" justifyContent="center" flex={1}>
        <Bluetooth />
        <Text
          marginTop={{ phone: 'xl', smallPhone: 's' }}
          maxFontSizeMultiplier={1}
          variant="h1"
          numberOfLines={2}
          adjustsFontSizeToFit
          marginBottom="l"
          textAlign="center"
        >
          {t('hotspot_setup.pair.title')}
        </Text>
        <Text
          maxFontSizeMultiplier={1.05}
          marginBottom={{ phone: 'lx', smallPhone: 's' }}
          variant="subtitleBold"
          textAlign="center"
          color="white"
        >
          {t(`makerHotspot.${hotspotType}.bluetooth.0`)}
        </Text>
        <Text
          maxFontSizeMultiplier={1.05}
          marginBottom="xl"
          variant="subtitle"
          textAlign="center"
          numberOfLines={8}
          adjustsFontSizeToFit
        >
          {t(`makerHotspot.${hotspotType}.bluetooth.1`)}
        </Text>
      </Box>
      <DebouncedButton
        width="100%"
        variant="primary"
        mode="contained"
        title={t('hotspot_setup.pair.scan')}
        onPress={checkBluetooth}
      />
    </BackScreen>
  )
}

export default HotspotSetupBluetoothInfoScreen
