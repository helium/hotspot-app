import React, { useEffect, memo, useRef, useState } from 'react'
import {
  Modal,
  Animated,
  Easing,
  LayoutAnimation,
  KeyboardAvoidingView,
  Alert,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import animalName from 'angry-purple-tiger'
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

type State = 'init' | 'scan' | 'transfer'

const HotspotSettings = () => {
  const { t } = useTranslation()
  const [settingsState, setSettingsState] = useState<State>('init')
  const [title, setTitle] = useState<string>(t('hotspot_settings.title'))
  const { m } = useSpacing()
  const slideUpAnimRef = useRef(new Animated.Value(1000))
  const { getState } = useBluetoothContext()
  const dispatch = useAppDispatch()
  const { showBack, goBack, disableBack } = useHotspotSettingsContext()

  const {
    hotspotDetails: { hotspot, showSettings },
  } = useSelector((state: RootState) => state)

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

  const setNextState = (s: State) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setSettingsState(s)
  }

  const handleClose = () => {
    disableBack()
    dispatch(hotspotDetailsSlice.actions.toggleShowSettings())
  }

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

  const getTransferButtonTitle = () => {
    if (hasActiveTransfer === undefined) {
      return ''
    }
    if (hasActiveTransfer) {
      return t('transfer.cancel.button_title')
    }
    return t('hotspot_settings.transfer.begin')
  }

  const cancelTransfer = async () => {
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
  }

  const onPressTransferSetting = () => {
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
  }

  const onCloseTransfer = () => {
    setNextState('init')
  }

  useEffect(() => {
    if (!showSettings) {
      setNextState('init')
    }
  }, [showSettings])

  useEffect(() => {
    getState()
  }, [getState])

  if (!hotspot) return null

  const getFirstCard = () => {
    if (settingsState === 'scan') {
      return (
        <HotspotDiagnostics
          updateTitle={(nextTitle: string) => setTitle(nextTitle)}
        />
      )
    }
    return (
      <HotspotSettingsOption
        title={t('hotspot_settings.pairing.title')}
        subtitle={t('hotspot_settings.pairing.subtitle')}
        buttonLabel={t('hotspot_settings.pairing.scan')}
        variant="primary"
        onPress={() => setNextState('scan')}
      />
    )
  }

  const getSecondCard = () => {
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
      <HotspotSettingsOption
        title={t('hotspot_settings.transfer.title')}
        subtitle={t('hotspot_settings.transfer.subtitle')}
        buttonLabel={getTransferButtonTitle()}
        buttonDisabled={hasActiveTransfer === undefined}
        variant="secondary"
        onPress={onPressTransferSetting}
      />
    )
  }

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
        tint="dark"
        position="absolute"
        intensity={97}
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
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={220}
          >
            {settingsState !== 'transfer' && (
              <Text
                variant="h2"
                lineHeight={27}
                color="white"
                marginBottom="ms"
              >
                {title}
              </Text>
            )}

            {settingsState !== 'transfer' && (
              <Card variant="modal" backgroundColor="white">
                {getFirstCard()}
              </Card>
            )}

            {settingsState !== 'scan' && (
              <Card variant="modal" backgroundColor="white" marginTop="l">
                {getSecondCard()}
              </Card>
            )}
          </KeyboardAvoidingView>
        </AnimatedBox>
      </SafeAreaBox>
    </Modal>
  )
}

export default memo(HotspotSettings)
