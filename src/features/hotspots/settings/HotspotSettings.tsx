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
import { Hotspot } from '@helium/http'
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

type Props = {
  visible: boolean
  onClose: () => void
  hotspot: Hotspot
}

type State = 'init' | 'scan' | 'transfer'

const HotspotSettings = ({ visible, onClose, hotspot }: Props) => {
  const { t } = useTranslation()
  const [state, setState] = useState<State>('init')
  const [title, setTitle] = useState<string>(t('hotspot_settings.title'))
  const { m } = useSpacing()
  const slideUpAnimRef = useRef(new Animated.Value(1000))
  const { getState } = useBluetoothContext()

  useEffect(() => {
    Animated.timing(slideUpAnimRef.current, {
      toValue: visible ? m : 1000,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.elastic(0.8),
      delay: visible ? 100 : 0,
    }).start()

    if (visible) {
      setTitle(t('hotspot_settings.title'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const setNextState = (s: State) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setState(s)
  }

  const [hasActiveTransfer, setHasActiveTransfer] = useState<boolean>()
  const [activeTransfer, setActiveTransfer] = useState<Transfer>()
  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        const transfer = await getTransfer(hotspot.address)
        setHasActiveTransfer(transfer !== undefined)
        setActiveTransfer(transfer)
      } catch (e) {
        setHasActiveTransfer(false)
      }
    }
    fetchTransfer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    if (!visible) {
      setNextState('init')
    }
  }, [visible])

  useEffect(() => {
    getState()
  }, [getState])

  const getFirstCard = () => {
    if (state === 'scan') {
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
    if (state === 'transfer') {
      return (
        <HotspotTransfer
          hotspot={hotspot}
          onCloseTransfer={onCloseTransfer}
          onCloseSettings={onClose}
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
      visible={visible}
      onRequestClose={onClose}
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
      >
        <TouchableOpacityBox
          alignSelf="flex-end"
          height={22}
          flex={1}
          padding="l"
          width="100%"
          alignItems="flex-end"
          onPress={onClose}
        >
          <CloseModal color="white" />
        </TouchableOpacityBox>
        <AnimatedBox
          margin="ms"
          style={{ transform: [{ translateY: slideUpAnimRef.current }] }}
        >
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={220}
          >
            {state !== 'transfer' && (
              <Text variant="h2" color="white" marginBottom="ms">
                {title}
              </Text>
            )}

            {state !== 'transfer' && (
              <Card variant="modal" backgroundColor="white">
                {getFirstCard()}
              </Card>
            )}

            {state !== 'scan' && (
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
