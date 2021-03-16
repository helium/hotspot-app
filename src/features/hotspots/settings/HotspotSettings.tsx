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
  Modal,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import animalName from 'angry-purple-tiger'
import { Hotspot } from '@helium/http'
import BlurBox from '../../../components/BlurBox'
import Card from '../../../components/Card'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CloseModal from '../../../assets/images/closeModal.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { useSpacing } from '../../../theme/themeHooks'
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
// import DiscoveryModeIcon from '../../../assets/images/discovery_mode_icon.svg'
// import UpdateIcon from '../../../assets/images/update_hotspot_icon.svg'

type State = 'init' | 'scan' | 'transfer'

type Props = {
  hotspot?: Hotspot
}

const HotspotSettings = ({ hotspot }: Props) => {
  const { t } = useTranslation()
  const [settingsState, setSettingsState] = useState<State>('init')
  const [title, setTitle] = useState<string>(t('hotspot_settings.title'))
  const { m } = useSpacing()
  const slideUpAnimRef = useRef(new Animated.Value(1000))
  const { getState } = useBluetoothContext()
  const dispatch = useAppDispatch()
  const { showBack, goBack, disableBack } = useHotspotSettingsContext()

  const { account } = useSelector((state: RootState) => state.account)
  const { showSettings } = useSelector(
    (state: RootState) => state.hotspotDetails,
  )

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

  const setNextState = useCallback((s: State) => {
    animateTransition()
    setSettingsState(s)
  }, [])

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

  const onCloseTransfer = useCallback(() => {
    setNextState('init')
  }, [setNextState])

  useEffect(() => {
    if (!showSettings) {
      setNextState('init')
    }
  }, [setNextState, showSettings])

  useEffect(() => {
    getState()
  }, [getState])

  const updateTitle = useCallback(
    (nextTitle: string) => setTitle(nextTitle),
    [],
  )

  const startScan = useCallback(() => setNextState('scan'), [setNextState])

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
        onPress={startScan}
        buttonIcon={<BluetoothIcon color="white" height={18} width={18} />}
      />
    )
  }, [settingsState, startScan, t, updateTitle])

  const ownerSettings = useMemo(() => {
    const isOwned = hotspot && hotspot.owner === account?.address
    if (!hotspot || !isOwned) return null

    if (settingsState === 'transfer') {
      return (
        <HotspotTransfer
          hotspot={hotspot}
          onCloseTransfer={onCloseTransfer}
          onCloseSettings={handleClose}
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
        {/* // TODO: Discovery Mode
        <Box backgroundColor="black" height={0.5} />
        <HotspotSettingsOption
          title={t('hotspot_settings.discovery.title')}
          subtitle={t('hotspot_settings.discovery.subtitle')}
          onPress={() => undefined}
          compact
          buttonIcon={<DiscoveryModeIcon />}
        />
        */}
        {/* // TODO: Assert V2
        <Box backgroundColor="black" height={0.5} />
        <HotspotSettingsOption
          title={t('hotspot_settings.update.title')}
          subtitle={t('hotspot_settings.update.subtitle')}
          onPress={() => undefined}
          compact
          buttonIcon={<UpdateIcon />}
        />
        */}
      </Box>
    )
  }, [
    account?.address,
    handleClose,
    hasActiveTransfer,
    hotspot,
    onCloseTransfer,
    onPressTransferSetting,
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

      <SafeAreaBox
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        marginBottom="m"
      >
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
            onPress={handleClose}
          >
            <CloseModal color="white" />
          </TouchableOpacityBox>
          {showBack && <BackButton alignSelf="center" onPress={goBack} />}
        </Box>
        <Box flex={1} onTouchStart={handleClose} />
        <AnimatedBox
          marginTop="none"
          margin="ms"
          style={{ transform: [{ translateY: slideUpAnimRef.current }] }}
        >
          {settingsState !== 'transfer' && (
            <Text variant="h2" lineHeight={27} color="white" marginBottom="ms">
              {title}
            </Text>
          )}

          {settingsState !== 'scan' && (
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={220}
            >
              <Card variant="modal" backgroundColor="white">
                {ownerSettings}
              </Card>
            </KeyboardAvoidingView>
          )}

          {settingsState !== 'transfer' && (
            <Card variant="modal" backgroundColor="white" marginTop="m">
              {pairingCard}
            </Card>
          )}
        </AnimatedBox>
      </SafeAreaBox>
    </Modal>
  )
}

export default memo(HotspotSettings)
