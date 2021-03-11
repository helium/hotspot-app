import React, { memo, useMemo, useCallback, useState, useEffect } from 'react'
import { BoxProps } from '@shopify/restyle'
import Close from '@assets/images/close.svg'
import CarotDown from '@assets/images/carot-down-picker.svg'
import { useTranslation } from 'react-i18next'
import { FlatList, Modal, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Theme } from '../theme/theme'
import HeliumActionSheetItem, {
  HeliumActionSheetItemType,
  HeliumActionSheetItemHeight,
} from './HeliumActionSheetItem'
import { useColors } from '../theme/themeHooks'
import Text from './Text'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'
import BlurBox from './BlurBox'
import { ReAnimatedBox } from './AnimatedBox'
import sleep from '../utils/sleep'

type Props = BoxProps<Theme> & {
  data: Array<HeliumActionSheetItemType>
  selectedValue: string | number
  onValueChanged: (itemValue: string | number, itemIndex: number) => void
  title?: string
  prefix?: string
  minWidth?: number
  listFormat?: boolean
}
type ListItem = { item: HeliumActionSheetItemType; index: number }

const HeliumActionSheet = ({
  data,
  selectedValue,
  onValueChanged,
  title,
  prefix,
  listFormat,
  ...boxProps
}: Props) => {
  const insets = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(false)
  const [sheetHeight, setSheetHeight] = useState(0)
  const { t } = useTranslation()
  const { purpleGray } = useColors()
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
    const item = data.find((d) => d.value === selectedValue)
    return ` ${item?.label || ''}`
  }, [data, selectedValue])

  const selected = useCallback(
    (value: string | number) => value === selectedValue,
    [selectedValue],
  )

  const handleItemSelected = useCallback(
    (value: string | number, index: number) => async () => {
      handleClose()
      await sleep(100)
      onValueChanged(value, index)
    },
    [handleClose, onValueChanged],
  )

  const renderItem = useCallback(
    ({ index, item: { label, value, Icon } }: ListItem) => {
      return (
        <HeliumActionSheetItem
          label={label}
          value={value}
          onPress={handleItemSelected(value, index)}
          selected={selected(value)}
          Icon={Icon}
        />
      )
    },
    [handleItemSelected, selected],
  )

  const footer = useMemo(() => {
    return (
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
    )
  }, [handleClose, t])

  const displayText = useMemo(() => {
    return (
      <TouchableOpacityBox
        paddingVertical="xs"
        onPress={handlePresentModalPress}
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        minWidth={100}
      >
        {!!prefix && (
          <Text
            variant="bold"
            fontSize={20}
            color="black"
            maxFontSizeMultiplier={1}
          >
            {prefix}
          </Text>
        )}
        <Text
          variant={listFormat ? 'regular' : 'bold'}
          fontSize={listFormat ? 16 : 20}
          maxFontSizeMultiplier={1}
          color={listFormat ? 'purpleBrightMuted' : 'purpleMain'}
          marginRight="s"
        >
          {buttonTitle}
        </Text>
        {!listFormat && <CarotDown />}
      </TouchableOpacityBox>
    )
  }, [buttonTitle, handlePresentModalPress, listFormat, prefix])

  return (
    <Box
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...boxProps}
    >
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
              borderBottomColor="purpleGray"
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
                <Close color={purpleGray} height={14} width={14} />
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
})

export default memo(HeliumActionSheet)
