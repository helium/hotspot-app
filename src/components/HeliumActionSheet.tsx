/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { BoxProps } from '@shopify/restyle'
import CarotDown from '@assets/images/carot-down.svg'
import Kabob from '@assets/images/kabob.svg'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import HeliumBottomSheet from './HeliumBottomSheet'

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
  closeOnSelect?: boolean
  maxModalHeight?: number
}
type ListItem = { item: HeliumActionSheetItemType; index: number }

const HeliumActionSheet = ({
  data: propsData,
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
  closeOnSelect = true,
  maxModalHeight,
  ...boxProps
}: Props) => {
  const insets = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(false)
  const [sheetHeight, setSheetHeight] = useState(0)
  const [data, setData] = useState<Array<HeliumActionSheetItemType>>([])
  const { t } = useTranslation()
  const colors = useColors()

  useEffect(() => {
    setData(propsData)
  }, [propsData])

  useEffect(() => {
    let nextSheetHeight =
      data.length * HeliumActionSheetItemHeight + 156 + (insets?.bottom || 0)
    if (maxModalHeight && nextSheetHeight > maxModalHeight) {
      nextSheetHeight = maxModalHeight
    }
    setSheetHeight(nextSheetHeight)
  }, [data.length, insets?.bottom, maxModalHeight])

  const handlePresentModalPress = useCallback(async () => {
    setModalVisible(true)
  }, [])

  const handleClose = useCallback(async () => {
    setModalVisible(false)
  }, [])

  const keyExtractor = useCallback((item) => item.value, [])

  const buttonTitle = useMemo(() => {
    if (initialValue && !selectedValue) {
      return initialValue
    }
    const item = data.find((d) => d.value === selectedValue)
    return item?.labelShort || item?.label || ''
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
      if (closeOnSelect) {
        handleClose()
      }

      if (action) {
        action()
      }
      if (onValueSelected) {
        onValueSelected?.(value, index)
      }
    },
    [closeOnSelect, handleClose, onValueSelected],
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
      <HeliumBottomSheet
        isVisible={modalVisible}
        onClose={handleClose}
        sheetHeight={sheetHeight}
        title={title}
      >
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
        {footer}
      </HeliumBottomSheet>
    </Box>
  )
}

const styles = StyleSheet.create({
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
  divider: { borderBottomColor: '#F0F0F5' },
})

export default memo(HeliumActionSheet)
