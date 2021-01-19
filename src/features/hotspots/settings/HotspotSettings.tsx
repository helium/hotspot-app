import React, { useEffect, memo, useRef, useState } from 'react'
import { Modal, Animated, Easing, LayoutAnimation } from 'react-native'
import { useTranslation } from 'react-i18next'
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
import Box from '../../../components/Box'
import HotspotTransfer from './HotspotTransfer'
import { useBluetoothContext } from '../../../providers/BluetoothProvider'

type Props = {
  visible: boolean
  onClose: () => void
}

type State = 'init' | 'scan' | 'transfer'

const HotspotSettings = ({ visible, onClose }: Props) => {
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
      return <HotspotTransfer onClose={onClose} />
    }

    return (
      <HotspotSettingsOption
        title={t('hotspot_settings.transfer.title')}
        subtitle={t('hotspot_settings.transfer.subtitle')}
        buttonLabel={t('hotspot_settings.transfer.begin')}
        variant="secondary"
        onPress={() => setNextState('transfer')}
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
        onTouchStart={onClose}
      />

      <SafeAreaBox
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
      >
        <TouchableOpacityBox
          alignSelf="flex-end"
          height={22}
          padding="l"
          onPress={onClose}
        >
          <CloseModal color="white" />
        </TouchableOpacityBox>
        <Box flex={1} />
        <AnimatedBox
          margin="ms"
          style={{ transform: [{ translateY: slideUpAnimRef.current }] }}
        >
          <Text variant="h2" color="white" marginBottom="ms">
            {title}
          </Text>

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
        </AnimatedBox>
      </SafeAreaBox>
    </Modal>
  )
}

export default memo(HotspotSettings)
