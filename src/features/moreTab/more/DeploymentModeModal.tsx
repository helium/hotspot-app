import React, { useCallback, useEffect, useState } from 'react'
import { BoxProps } from '@shopify/restyle'
import Close from '@assets/images/close.svg'
import { useTranslation } from 'react-i18next'
import { Modal, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Font, Theme } from '../../../theme/theme'
import { HeliumActionSheetItemHeight } from '../../../components/HeliumActionSheetItem'
import appSlice from '../../../store/user/appSlice'
import { useColors } from '../../../theme/themeHooks'
import { useAppDispatch } from '../../../store/store'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import BlurBox from '../../../components/BlurBox'
import { ReAnimatedBox } from '../../../components/AnimatedBox'
import useVisible from '../../../utils/useVisible'

type Props = BoxProps<Theme> & {
  onClose?: () => void
}

const DeploymentModeModal = ({ onClose = () => {} }: Props) => {
  const insets = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(true)
  const [sheetHeight, setSheetHeight] = useState(0)
  const { t } = useTranslation()
  const colors = useColors()
  const offset = useSharedValue(0)
  const dispatch = useAppDispatch()

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value + sheetHeight }],
    }
  })

  const animate = useCallback(
    (val: number) => {
      offset.value = withSpring(val, {
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
      })
    },
    [offset],
  )

  useEffect(() => {
    const nextSheetHeight =
      HeliumActionSheetItemHeight + 176 + (insets?.bottom || 0)
    setSheetHeight(nextSheetHeight)
    animate(nextSheetHeight)
  }, [animate, insets?.bottom])

  const handleClose = useCallback(async () => {
    setModalVisible(false)
    onClose()
  }, [onClose])

  useVisible({ onDisappear: handleClose })

  useEffect(() => {
    if (modalVisible) {
      offset.value = 0
      animate(-sheetHeight)
    }
  }, [animate, modalVisible, offset, sheetHeight])

  const enableDeploymentMode = useCallback(() => {
    dispatch(appSlice.actions.enableDeploymentMode(true))
  }, [dispatch])

  return (
    <Modal
      transparent
      visible={modalVisible}
      onRequestClose={handleClose}
      animationType="fade"
    >
      <BlurBox position="absolute" top={0} bottom={0} left={0} right={0} />
      <Box flex={1}>
        <TouchableOpacityBox flex={1} onPress={handleClose} />
        <ReAnimatedBox
          style={animatedStyles}
          borderTopLeftRadius="l"
          borderTopRightRadius="l"
          height={sheetHeight}
          backgroundColor="white"
          paddingHorizontal="lx"
        >
          <Box
            flexDirection="row"
            borderBottomWidth={1}
            style={styles.divider}
            marginTop="s"
            marginBottom="m"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text color="purpleGray" variant="body2">
              {t('more.sections.security.deploymentMode.title')}
            </Text>
            <TouchableOpacityBox
              onPress={handleClose}
              height={50}
              justifyContent="center"
              paddingHorizontal="m"
              marginEnd="n_m"
            >
              <Close color={colors.purpleGray} height={14} width={14} />
            </TouchableOpacityBox>
          </Box>
          <Text>{t('more.sections.security.deploymentMode.description')}</Text>
          <Text marginTop="m" fontFamily={Font.main.semiBold}>
            {t('more.sections.security.deploymentMode.warning')}
          </Text>
          <Box
            marginBottom="xl"
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TouchableOpacityBox
              onPress={handleClose}
              style={styles.cancelContainer}
              height={49}
              marginVertical="m"
              alignItems="center"
              justifyContent="center"
              borderRadius="ms"
              width="48%"
            >
              <Text variant="medium" fontSize={18} style={styles.cancelText}>
                {t('generic.cancel')}
              </Text>
            </TouchableOpacityBox>
            <TouchableOpacityBox
              onPress={() => {
                enableDeploymentMode()
                handleClose()
              }}
              style={styles.confirmContainer}
              height={49}
              marginVertical="m"
              alignItems="center"
              justifyContent="center"
              borderRadius="ms"
              width="48%"
            >
              <Text variant="medium" fontSize={18} style={styles.confirmText}>
                {t('generic.submit')}
              </Text>
            </TouchableOpacityBox>
          </Box>
        </ReAnimatedBox>
      </Box>
    </Modal>
  )
}

const styles = StyleSheet.create({
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
  confirmContainer: { backgroundColor: '#F97570' },
  confirmText: { color: '#FFFFFF' },
  divider: { borderBottomColor: '#F0F0F5' },
})

export default DeploymentModeModal
