import React, {
  memo,
  ReactText,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { BoxProps } from '@shopify/restyle'
import Close from '@assets/images/close.svg'
import CarotDown from '@assets/images/carot-down-picker.svg'
import { useTranslation } from 'react-i18next'
import { FlatList, Modal, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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

type Props = BoxProps<Theme> & {
  data: Array<HeliumActionSheetItemType>
  selectedValue: string
  onValueChanged: (itemValue: ReactText, itemIndex: number) => void
  title?: string
  prefix: string
  minWidth?: number
}
type ListItem = { item: HeliumActionSheetItemType; index: number }

const HeliumActionSheet = ({
  data,
  selectedValue,
  onValueChanged,
  title,
  prefix,
  ...boxProps
}: Props) => {
  const insets = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(false)
  const [sheetHeight, setSheetHeight] = useState(0)
  const { t } = useTranslation()
  const { purpleGray } = useColors()

  useEffect(() => {
    setSheetHeight(
      data.length * HeliumActionSheetItemHeight + 160 + (insets?.bottom || 0),
    )
  }, [data.length, insets?.bottom])

  const handlePresentModalPress = useCallback(() => {
    setModalVisible(true)
  }, [])

  const handleClose = useCallback(() => {
    setModalVisible(false)
  }, [])

  const keyExtractor = useCallback((item) => item.value, [])

  const buttonTitle = useMemo(() => {
    const item = data.find((d) => d.value === selectedValue)
    return ` ${item?.label || ''}`
  }, [data, selectedValue])

  const selected = useCallback((value: string) => value === selectedValue, [
    selectedValue,
  ])

  const handleItemSelected = useCallback(
    (value: string, index: number) => () => {
      handleClose()
      onValueChanged(value, index)
    },
    [onValueChanged, handleClose],
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

  return (
    <Box
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...boxProps}
    >
      <TouchableOpacityBox
        onPress={handlePresentModalPress}
        flexDirection="row"
        alignItems="center"
      >
        <Text
          variant="bold"
          fontSize={20}
          color="black"
          maxFontSizeMultiplier={1}
        >
          {prefix}
        </Text>
        <Text
          variant="bold"
          fontSize={20}
          maxFontSizeMultiplier={1}
          color="purpleMain"
          marginRight="s"
        >
          {buttonTitle}
        </Text>
        <CarotDown />
      </TouchableOpacityBox>
      <Modal
        presentationStyle="overFullScreen"
        transparent
        visible={modalVisible}
        onRequestClose={handleClose}
        animationType="fade"
      >
        <Box onTouchStart={handleClose} flex={1}>
          <BlurBox flex={1} />
        </Box>
        <Box
          borderRadius="l"
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
