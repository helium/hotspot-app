import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import animalName from 'angry-purple-tiger'
import { Hotspot, PendingTransaction, Witness } from '@helium/http'
import Toast from 'react-native-simple-toast'
import { visible } from '@shopify/restyle'
import BlurBox from '../../../components/BlurBox'
import Card from '../../../components/Card'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CloseModal from '../../../assets/images/closeModal.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { useColors, useSpacing } from '../../../theme/themeHooks'
import AnimatedBox from '../../../components/AnimatedBox'
import HotspotSettingsOption from './HotspotSettingsOption'
import HotspotDiagnostics from './HotspotDiagnostics'
import HotspotTransfer from '../transfers/HotspotTransfer'
import { useBluetoothContext } from '../../../providers/BluetoothProvider'
import {
  deleteTransfer,
  getTransfer,
  Transfer,
} from '../transfers/TransferRequests'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import hotspotDetailsSlice from '../../../store/hotspotDetails/hotspotDetailsSlice'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'
import Box from '../../../components/Box'
import BackButton from '../../../components/BackButton'
import animateTransition from '../../../utils/animateTransition'
import BluetoothIcon from '../../../assets/images/bluetooth_icon.svg'
import TransferIcon from '../../../assets/images/transfer_icon.svg'
import DiscoveryModeIcon from '../../../assets/images/discovery_mode_icon.svg'
import DiscoveryModeRoot from './discovery/DiscoveryModeRoot'
import UpdateIcon from '../../../assets/images/update_hotspot_icon.svg'
import UpdateHotspotConfig from './updateHotspot/UpdateHotspotConfig'
import { getAccountTxnsList } from '../../../utils/appDataClient'
import usePermissionManager from '../../../utils/usePermissionManager'
import useAlert from '../../../utils/useAlert'
import { getLocationPermission } from '../../../store/location/locationSlice'

type State = 'init' | 'scan' | 'transfer' | 'discoveryMode' | 'updateHotspot'

type Props = {
  hotspot?: Hotspot | Witness
}

const HotspotSettings = ({ hotspot }: Props) => {
  const { t } = useTranslation()
  const [settingsState, setSettingsState] = useState<State>('init')
  const [title, setTitle] = useState<string>(t('hotspot_settings.title'))
  const { m } = useSpacing()
  const slideUpAnimRef = useRef(new Animated.Value(1000))
  const { getState, enable } = useBluetoothContext()
  const dispatch = useAppDispatch()
  const {
    showBack,
    goBack,
    disableBack,
    enableBack,
  } = useHotspotSettingsContext()
  const { purpleMain } = useColors()
  const { account } = useSelector((state: RootState) => state.account)
  const discoveryEnabled = useSelector(
    (state: RootState) => state.features.discoveryEnabled,
  )
  const { showSettings } = useSelector(
    (state: RootState) => state.hotspotDetails,
  )
  const { requestLocationPermission } = usePermissionManager()
  const { permissionResponse, locationBlocked } = useSelector(
    (state: RootState) => state.location,
  )
  const { showOKCancelAlert } = useAlert()

  useEffect(() => {
    getState()
    dispatch(getLocationPermission())
  }, [dispatch, getState])

  useEffect(() => {
    Animated.timing(slideUpAnimRef.current, {
      toValue: showSettings ? m : 1000,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.elastic(0.8),
      delay: showSettings ? 100 : 0,
    }).start()

    if (showSettings) {
      setTitle(t('hotspot_settings.title'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSettings])

  const setNextState = useCallback(
    (s: State) => {
      if (!visible || s === settingsState) return

      animateTransition('HotspotSettings.SetNextState')
      setSettingsState(s)
    },
    [settingsState],
  )

  const handleClose = useCallback(() => {
    disableBack()
    dispatch(hotspotDetailsSlice.actions.toggleShowSettings())
  }, [disableBack, dispatch])

  const [hasActiveTransfer, setHasActiveTransfer] = useState<boolean>()
  const [activeTransfer, setActiveTransfer] = useState<Transfer>()
  useEffect(() => {
    const fetchTransfer = async () => {
      if (!hotspot) return
      try {
        const transfer = await getTransfer(hotspot.address)
        setHasActiveTransfer(transfer !== undefined)
        setActiveTransfer(transfer)
      } catch (e) {
        setHasActiveTransfer(false)
      }
    }
    fetchTransfer()
  }, [hotspot])

  const transferButtonTitle = useMemo(() => {
    if (hasActiveTransfer === undefined) {
      return ''
    }
    if (hasActiveTransfer) {
      return t('transfer.cancel.button_title')
    }
    return t('hotspot_settings.transfer.subtitle')
  }, [hasActiveTransfer, t])

  const cancelTransfer = useCallback(async () => {
    if (!hotspot) return
    const deleteResponse = await deleteTransfer(hotspot.address, false)
    if (deleteResponse) {
      setHasActiveTransfer(false)
      setActiveTransfer(undefined)
    } else {
      Alert.alert(
        t('transfer.cancel.failed_alert_title'),
        t('transfer.cancel.failed_alert_body'),
      )
    }
  }, [hotspot, t])

  const onPressDiscoveryMode = useCallback(() => {
    setNextState('discoveryMode')
  }, [setNextState])

  const onPressUpdateHotspot = useCallback(async () => {
    // Check for pending assert
    const pendingTxns = await getAccountTxnsList('pending')
    const txns = (await pendingTxns?.take(20)) as PendingTransaction[]
    const hasPending = txns?.find(
      (tnx: PendingTransaction) =>
        tnx.txn.type === 'assert_location_v2' &&
        tnx.status === 'pending' &&
        tnx.txn.gateway === hotspot?.address,
    )
    if (hasPending) {
      Toast.show(t('hotspot_settings.reassert.already_pending'), Toast.LONG)
    } else {
      setNextState('updateHotspot')
    }
  }, [hotspot?.address, setNextState, t])

  const onPressTransferSetting = useCallback(() => {
    if (hasActiveTransfer) {
      Alert.alert(
        t('transfer.cancel.alert_title'),
        t('transfer.cancel.alert_body', {
          buyer: activeTransfer?.buyer,
          gateway: animalName(activeTransfer?.gateway || ''),
        }),
        [
          {
            text: t('transfer.cancel.alert_back'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: t('transfer.cancel.alert_confirm'),
            onPress: cancelTransfer,
          },
        ],
      )
    } else {
      setNextState('transfer')
    }
  }, [
    activeTransfer?.buyer,
    activeTransfer?.gateway,
    cancelTransfer,
    hasActiveTransfer,
    setNextState,
    t,
  ])

  const onCloseOwnerSettings = useCallback(() => {
    setNextState('init')
    disableBack()
  }, [disableBack, setNextState])

  useEffect(() => {
    if (!showSettings) {
      setNextState('init')
    }
  }, [setNextState, showSettings])

  const updateTitle = useCallback(
    (nextTitle: string) => setTitle(nextTitle),
    [],
  )

  const startScan = useCallback(() => {
    enableBack(() => {
      onCloseOwnerSettings()
    })
    setNextState('scan')
  }, [enableBack, onCloseOwnerSettings, setNextState])

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

    startScan()
  }, [checkBluetooth, checkLocation, startScan])

  const pairingCard = useMemo(() => {
    if (settingsState === 'scan') {
      return <HotspotDiagnostics updateTitle={updateTitle} />
    }
    return (
      <HotspotSettingsOption
        title={t('hotspot_settings.pairing.title')}
        subtitle={t('hotspot_settings.pairing.subtitle')}
        buttonLabel={t('hotspot_settings.pairing.scan')}
        variant="primary"
        onPress={handleScanRequest}
        buttonIcon={<BluetoothIcon color="white" height={18} width={18} />}
      />
    )
  }, [handleScanRequest, settingsState, t, updateTitle])

  const ownerSettings = useMemo(() => {
    const isOwned = hotspot && hotspot.owner === account?.address
    if (!hotspot || !isOwned) return null

    if (settingsState === 'transfer') {
      return (
        <HotspotTransfer
          hotspot={hotspot}
          onCloseTransfer={onCloseOwnerSettings}
          onCloseSettings={handleClose}
        />
      )
    }

    if (settingsState === 'discoveryMode') {
      return (
        <DiscoveryModeRoot onClose={onCloseOwnerSettings} hotspot={hotspot} />
      )
    }

    if (settingsState === 'updateHotspot') {
      return (
        <UpdateHotspotConfig
          onClose={onCloseOwnerSettings}
          onCloseSettings={handleClose}
          hotspot={hotspot}
        />
      )
    }

    return (
      <Box>
        <HotspotSettingsOption
          title={t('hotspot_settings.transfer.title')}
          subtitle={transferButtonTitle}
          buttonDisabled={hasActiveTransfer === undefined}
          onPress={onPressTransferSetting}
          compact
          buttonIcon={<TransferIcon />}
        />
        {discoveryEnabled && (
          <>
            <Box backgroundColor="black" height={0.5} />
            <HotspotSettingsOption
              title={t('hotspot_settings.discovery.title')}
              subtitle={t('hotspot_settings.discovery.subtitle')}
              onPress={onPressDiscoveryMode}
              compact
              buttonIcon={<DiscoveryModeIcon color={purpleMain} />}
            />
          </>
        )}
        <Box backgroundColor="black" height={0.5} />
        <HotspotSettingsOption
          title={t('hotspot_settings.update.title')}
          subtitle={t('hotspot_settings.update.subtitle')}
          onPress={onPressUpdateHotspot}
          compact
          buttonIcon={<UpdateIcon />}
        />
      </Box>
    )
  }, [
    account?.address,
    discoveryEnabled,
    handleClose,
    hasActiveTransfer,
    hotspot,
    onCloseOwnerSettings,
    onPressDiscoveryMode,
    onPressTransferSetting,
    onPressUpdateHotspot,
    purpleMain,
    settingsState,
    t,
    transferButtonTitle,
  ])

  return (
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={showSettings}
      onRequestClose={handleClose}
      animationType="fade"
    >
      <BlurBox
        top={0}
        left={0}
        bottom={0}
        right={0}
        blurAmount={70}
        blurType="dark"
        position="absolute"
      />

      <SafeAreaBox flex={1} flexDirection="column" marginBottom="m">
        <Box
          flexDirection="row-reverse"
          justifyContent="space-between"
          alignItems="center"
        >
          <TouchableOpacityBox
            height={22}
            padding="l"
            alignItems="flex-end"
            justifyContent="center"
            marginEnd={settingsState === 'discoveryMode' ? 'n_s' : undefined}
            onPress={handleClose}
          >
            <CloseModal color="white" />
          </TouchableOpacityBox>
          {showBack && (
            <BackButton
              alignSelf="center"
              onPress={goBack}
              marginStart={settingsState === 'discoveryMode' ? 'n_m' : 'n_s'}
            />
          )}
        </Box>
        <AnimatedBox
          marginTop="none"
          marginBottom="ms"
          justifyContent="flex-end"
          flex={1}
          marginHorizontal={settingsState === 'discoveryMode' ? 'none' : 'ms'}
          style={{ transform: [{ translateY: slideUpAnimRef.current }] }}
        >
          <TouchableOpacityBox
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            onPress={handleClose}
          />
          <Box alignSelf="flex-start">
            {(settingsState === 'init' || settingsState === 'scan') && (
              <Text
                variant="h2"
                lineHeight={27}
                color="white"
                marginBottom="ms"
              >
                {title}
              </Text>
            )}
          </Box>

          {settingsState !== 'scan' && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <Card variant="modal" backgroundColor="white" overflow="hidden">
                {ownerSettings}
              </Card>
            </KeyboardAvoidingView>
          )}

          {(settingsState === 'init' || settingsState === 'scan') && (
            <Card
              variant="modal"
              backgroundColor="white"
              marginTop="m"
              overflow="hidden"
            >
              {pairingCard}
            </Card>
          )}
        </AnimatedBox>
      </SafeAreaBox>
    </Modal>
  )
}

export default memo(HotspotSettings)
