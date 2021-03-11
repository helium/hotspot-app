import React, { memo, ReactText, useRef, useMemo, useCallback } from 'react'
import { BoxProps } from '@shopify/restyle'
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import Close from '@assets/images/close.svg'
import CarotDown from '@assets/images/carot-down-picker.svg'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Theme } from '../theme/theme'
import HeliumActionSheetItem, {
  HeliumActionSheetItemType,
  HeliumActionSheetItemHeight,
} from './HeliumActionSheetItem'
import { useColors, useSpacing } from '../theme/themeHooks'
import Text from './Text'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'

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
  const modalRef = useRef<BottomSheetModal>(null)
  const { t } = useTranslation()
  const { purpleGray } = useColors()
  const { lx } = useSpacing()
  const snapPoints = useMemo(
    () => [data.length * HeliumActionSheetItemHeight + 100],
    [data.length],
  )

  const handlePresentModalPress = useCallback(() => {
    modalRef.current?.present()
  }, [])

  const handleClose = useCallback(() => {
    modalRef.current?.close()
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
      onValueChanged(value, index)
    },
    [onValueChanged],
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
  const containerStyle = useMemo(
    () => ({
      paddingHorizontal: lx,
    }),
    [lx],
  )

  const handleComponent = useCallback(() => {
    return (
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
    )
  }, [handleClose, purpleGray, title])

  const footer = useMemo(() => {
    return (
      <TouchableOpacityBox
        onPress={handleClose}
        style={styles.cancelContainer}
        height={49}
        marginTop="m"
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
      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        handleComponent={handleComponent}
        backdropComponent={BottomSheetBackdrop}
        style={containerStyle}
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListFooterComponent={footer}
        />
      </BottomSheetModal>
    </Box>
  )
}

const styles = StyleSheet.create({
  cancelContainer: { backgroundColor: '#F0F0F5' },
  cancelText: { color: '#B3B4D6' },
})

export default memo(HeliumActionSheet)
