/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { BoxProps } from '@shopify/restyle'
import Close from '@assets/images/close.svg'
import CarotDown from '@assets/images/carot-down.svg'
import Kabob from '@assets/images/kabob.svg'
import { useTranslation } from 'react-i18next'
import { Modal, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { FlatList } from 'react-native-gesture-handler'
import { Colors, Theme } from '../theme/theme'
import HeliumActionSheetItem, {
  HeliumActionSheetItemHeight,
  HeliumActionSheetItemType,
} from './HeliumActionSheetItem'
import { useColors } from '../theme/themeHooks'
import Text, { TextProps } from './Text'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'
import BlurBox from './BlurBox'
import { ReAnimatedBox } from './AnimatedBox'

type Props = BoxProps<Theme> & {
  data: Array<HeliumActionSheetItemType>
  selectedValue?: string | number
  onValueSelected?: (itemValue: string | number, itemIndex: number) => void
  title?: string
  prefix?: string
  minWidth?: number
  textProps?: TextProps
  prefixTextProps?: TextProps
  buttonProps?: BoxProps<Theme>
  iconColor?: Colors
  initialValue?: string
  iconVariant?: 'carot' | 'kabob' | 'none'
}
type ListItem = { item: HeliumActionSheetItemType; index: number }

const HeliumActionSheet = ({
  data,
  selectedValue,
  onValueSelected,
  title,
  prefix,
  iconVariant = 'carot',
  iconColor: carotColor = 'purpleMain',
  buttonProps,
  initialValue,
  textProps,
  prefixTextProps,
  ...boxProps
}: Props) => {
  const insets = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(false)
  const [sheetHeight, setSheetHeight] = useState(0)
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

  useEffect(() => {
    const nextSheetHeight =
      data.length * HeliumActionSheetItemHeight + 156 + (insets?.bottom || 0)
    setSheetHeight(nextSheetHeight)
    animate(nextSheetHeight)
  }, [animate, data.length, insets?.bottom])

  const handlePresentModalPress = useCallback(async () => {
    setModalVisible(true)
  }, [])

  const handleClose = useCallback(async () => {
    setModalVisible(false)
  }, [])

  useEffect(() => {
    if (modalVisible) {
      offset.value = 0
      animate(-sheetHeight)
    }
  }, [animate, modalVisible, offset, sheetHeight])

  const keyExtractor = useCallback((item) => item.value, [])

  const buttonTitle = useMemo(() => {
    if (initialValue && !selectedValue) {
      return initialValue
    }
    const item = data.find((d) => d.value === selectedValue)
    return item?.label || ''
  }, [data, initialValue, selectedValue])

  const selected = useCallback(
    (value: string | number) => value === selectedValue,
    [selectedValue],
  )

  const handleItemSelected = useCallback(
    (
      value: string | number,
      index: number,
      action?: () => void,
    ) => async () => {
      handleClose()

      if (action) {
        action()
      }
      if (onValueSelected) {
        onValueSelected?.(value, index)
      }
    },
    [handleClose, onValueSelected],
  )

  const renderItem = useCallback(
    ({ index, item: { label, value, Icon, action } }: ListItem) => {
      return (
        <HeliumActionSheetItem
          label={label}
          value={value}
          onPress={handleItemSelected(value, index, action)}
          selected={selected(value)}
          Icon={Icon}
        />
      )
    },
    [handleItemSelected, selected],
  )

  const footer = useMemo(() => {
    return (
      <Box marginBottom="xl">
        <TouchableOpacityBox
          onPress={handleClose}
          style={styles.cancelContainer}
          height={49}
          marginVertical="m"
          alignItems="center"
          justifyContent="center"
          borderRadius="ms"
        >
          <Text variant="medium" fontSize={18} style={styles.cancelText}>
            {t('generic.cancel')}
          </Text>
        </TouchableOpacityBox>
      </Box>
    )
  }, [handleClose, t])

  const icon = useMemo(() => {
    if (iconVariant === 'none') return

    if (iconVariant === 'kabob') return <Kabob color={colors[carotColor]} />

    return <CarotDown color={colors[carotColor]} />
  }, [carotColor, colors, iconVariant])

  const displayText = useMemo(() => {
    return (
      <TouchableOpacityBox
        onPress={handlePresentModalPress}
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        {...buttonProps}
      >
        <Box flexDirection="row">
          {!!prefix && (
            <Text
              color="black"
              maxFontSizeMultiplier={1}
              marginRight="xs"
              variant="bold"
              fontSize={20}
              {...prefixTextProps}
            >
              {prefix}
            </Text>
          )}
          {!!buttonTitle && (
            <Text
              maxFontSizeMultiplier={1}
              marginRight="s"
              variant="bold"
              fontSize={20}
              color="purpleMain"
              {...textProps}
            >
              {buttonTitle}
            </Text>
          )}
        </Box>
        {icon}
      </TouchableOpacityBox>
    )
  }, [
    handlePresentModalPress,
    buttonProps,
    prefix,
    prefixTextProps,
    buttonTitle,
    textProps,
    icon,
  ])

  return (
    <Box {...boxProps}>
      {displayText}

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
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListFooterComponent={footer}
            />
          </ReAnimatedBox>
        </Box>
      </Modal>
    </Box>
  )
}

const styles = StyleSheet.create({
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
  divider: { borderBottomColor: '#F0F0F5' },
})

export default memo(HeliumActionSheet)
