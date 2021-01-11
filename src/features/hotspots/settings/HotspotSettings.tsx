import React, { useEffect, useRef } from 'react'
import { Modal, Animated, Easing } from 'react-native'
import { useTranslation } from 'react-i18next'
import BlurBox from '../../../components/BlurBox'
import Card from '../../../components/Card'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CloseModal from '../../../assets/images/closeModal.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { useSpacing } from '../../../theme/themeHooks'
import AnimatedBox from '../../../components/AnimatedBox'
import Button from '../../../components/Button'

type Props = { visible: boolean; onClose: () => void }
const HotspotSettings = ({ visible, onClose }: Props) => {
  const { m } = useSpacing()
  const { t } = useTranslation()

  const slideUpAnimRef = useRef(new Animated.Value(120))

  useEffect(() => {
    Animated.timing(slideUpAnimRef.current, {
      toValue: visible ? m : 500,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.elastic(0.7),
    }).start()
  }, [visible, m])

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
        <AnimatedBox
          margin="ms"
          style={{ transform: [{ translateY: slideUpAnimRef.current }] }}
        >
          <Text variant="h2" color="white" marginBottom="ms">
            {t('hotspot_settings.title')}
          </Text>
          <Card
            variant="modal"
            backgroundColor="white"
            minHeight={40}
            padding="l"
          >
            <Text variant="h4" color="black" marginBottom="ms">
              {t('hotspot_settings.pairing.title')}
            </Text>
            <Text variant="body2" color="grayText">
              {t('hotspot_settings.pairing.subtitle')}
            </Text>
            <Button
              marginTop="l"
              width="100%"
              variant="primary"
              mode="contained"
              title={t('hotspot_setup.pair.scan')}
            />
          </Card>
          <Card
            variant="modal"
            backgroundColor="white"
            minHeight={40}
            marginTop="l"
            padding="l"
          >
            <Text variant="h4" color="black" marginBottom="ms">
              {t('hotspot_settings.transfer.title')}
            </Text>
            <Text variant="body2" color="grayText">
              {t('hotspot_settings.transfer.subtitle')}
            </Text>
            <Button
              marginTop="l"
              width="100%"
              variant="secondary"
              mode="contained"
              title={t('hotspot_settings.transfer.action')}
            />
          </Card>
        </AnimatedBox>
      </SafeAreaBox>
    </Modal>
  )
}

export default HotspotSettings
