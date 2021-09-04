import React, { memo, useCallback, useEffect } from 'react'
import { BoxProps } from '@shopify/restyle'
import Close from '@assets/images/close.svg'
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
  children?: React.ReactNode
  hideHeaderBorder?: boolean
  isVisible: boolean
  onClose: () => void
  sheetHeight?: number
  title?: string
}

const HeliumBottomSheet = ({
  children,
  hideHeaderBorder = false,
  isVisible,
  onClose,
  sheetHeight = 260,
  title,
}: Props) => {
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

  const handleClose = useCallback(async () => {
    onClose()
  }, [onClose])

  useVisible({ onDisappear: handleClose })

  useEffect(() => {
    if (isVisible) {
      offset.value = 0
      animate(-sheetHeight)
    }
  }, [animate, isVisible, offset, sheetHeight])

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
            borderBottomWidth={hideHeaderBorder ? 0 : 1}
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
              <Close color={colors.purpleLightText} height={14} width={14} />
            </TouchableOpacityBox>
          </Box>
          {children}
        </ReAnimatedBox>
      </Box>
    </Modal>
  )
}

const styles = StyleSheet.create({
  divider: { borderBottomColor: '#F0F0F5' },
})

export default memo(HeliumBottomSheet)
