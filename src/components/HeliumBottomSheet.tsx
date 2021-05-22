/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { BoxProps } from '@shopify/restyle'
import Close from '@assets/images/close.svg'
import { useTranslation } from 'react-i18next'
import { Modal, StyleSheet } from 'react-native'
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Theme } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import Text from './Text'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'
import BlurBox from './BlurBox'
import { ReAnimatedBox } from './AnimatedBox'
import useVisible from '../utils/useVisible'

type Props = BoxProps<Theme> & {
  body?: React.Component
  confirmText?: string
  isVisible: boolean
  onConfirm?: () => void
  onClose?: () => void
  sheetHeight?: number
  title: string
}

const HeliumBottomSheet = ({
  body,
  confirmText,
  isVisible,
  onConfirm,
  onClose,
  sheetHeight = 260,
  title,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()
  const offset = useSharedValue(0)

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

  const handleConfirm = useCallback(async () => {
    if (onConfirm) onConfirm()
  }, [onConfirm])

  const handleClose = useCallback(async () => {
    if (onClose) onClose()
  }, [onClose])

  useVisible({ onDisappear: handleClose })

  useEffect(() => {
    if (isVisible) {
      offset.value = 0
      animate(-sheetHeight)
    }
  }, [animate, isVisible, offset, sheetHeight])

  const footer = useMemo(() => {
    const commonButtonProps = {
      height: 49,
      marginVertical: 'm',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'ms',
      width: onConfirm ? '48%' : '100%',
    }
    const cancelButton = (
      <TouchableOpacityBox
        {...commonButtonProps}
        onPress={handleClose}
        style={styles.cancelContainer}
      >
        <Text variant="medium" fontSize={18} style={styles.cancelText}>
          {t('generic.cancel')}
        </Text>
      </TouchableOpacityBox>
    )
    const confirmButton = onConfirm ? (
      <TouchableOpacityBox
        {...commonButtonProps}
        onPress={handleConfirm}
        style={styles.confirmContainer}
      >
        <Text variant="medium" fontSize={18} style={styles.confirmText}>
          {confirmText || t('generic.submit')}
        </Text>
      </TouchableOpacityBox>
    ) : null

    return (
      <Box marginBottom="xl" style={styles.footerContainer}>
        {cancelButton}
        {confirmButton}
      </Box>
    )
  }, [handleClose, handleConfirm, confirmText, onConfirm, t])

  return (
    <Modal
      transparent
      visible={isVisible}
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
              {title}
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
          {body}
          {footer}
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
  footerContainer: { flexDirection: 'row', justifyContent: 'space-between' },
})

export default memo(HeliumBottomSheet)
