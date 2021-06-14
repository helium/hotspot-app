import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Linking, Platform } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
import { RootState } from '../../../store/rootReducer'
import { getLocationPermission } from '../../../store/location/locationSlice'
import { useAppDispatch } from '../../../store/store'
import usePermissionManager from '../../../utils/usePermissionManager'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPowerScreen'>

const HotspotSetupBluetoothInfoScreen = () => {
  const { t } = useTranslation()
  const {
    params: { hotspotType },
  } = useRoute<Route>()
  const dispatch = useAppDispatch()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { requestLocationPermission } = usePermissionManager()
  const rootNav = useNavigation<RootNavigationProp>()
  const { permissionResponse, locationBlocked } = useSelector(
    (state: RootState) => state.location,
  )
  const { enable, getState } = useBluetoothContext()
  const { showOKCancelAlert } = useAlert()

  useEffect(() => {
    getState()

    dispatch(getLocationPermission())
  }, [dispatch, getState])

  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

  const navNext = useCallback(
    () => navigation.push('HotspotSetupScanningScreen', { hotspotType }),
    [hotspotType, navigation],
  )

  const checkBluetooth = useCallback(async () => {
    const state = await getState()

    if (state === 'PoweredOn') {
      return true
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
      return true
    }
  }, [enable, getState, showOKCancelAlert])

  const checkLocation = useCallback(async () => {
    if (Platform.OS === 'ios') return true

    if (permissionResponse?.granted) {
      return true
    }

    if (!locationBlocked) {
      const response = await requestLocationPermission()
      if (response && response.granted) {
        return true
      }
    } else {
      const decision = await showOKCancelAlert({
        titleKey: 'permissions.location.title',
        messageKey: 'permissions.location.message',
        okKey: 'generic.go_to_settings',
      })
      if (decision) Linking.openSettings()
    }
  }, [
    locationBlocked,
    permissionResponse?.granted,
    requestLocationPermission,
    showOKCancelAlert,
  ])

  const handleScanRequest = useCallback(async () => {
    const bluetoothReady = await checkBluetooth()
    if (!bluetoothReady) return

    const locationReady = await checkLocation()
    if (!locationReady) return

    navNext()
  }, [checkBluetooth, checkLocation, navNext])

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
          numberOfLines={9}
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
        onPress={handleScanRequest}
      />
    </BackScreen>
  )
}

export default HotspotSetupBluetoothInfoScreen
