import React from 'react'
import { Linking, Switch } from 'react-native'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useColors, useTextVariants } from '../../../theme/themeHooks'
import CarotRight from '../../../assets/images/carot-right.svg'
import LinkImg from '../../../assets/images/link.svg'

export type SelectProps = {
  onDonePress?: () => void
  onValueSelect: (value: string, index: number) => void
  items: Item[]
}

export type MoreListItemType = {
  title: string
  destructive?: boolean
  onPress?: () => void
  onToggle?: (value: boolean) => void
  value?: boolean | string | number
  select?: SelectProps
  openUrl?: string
}

const MoreListItem = ({
  item: { title, value, destructive, onToggle, onPress, select, openUrl },
  isTop = false,
  isBottom = false,
}: {
  item: MoreListItemType
  isTop?: boolean
  isBottom?: boolean
}) => {
  const colors = useColors()
  const { body2 } = useTextVariants()

  const style = {
    ...body2,
    color: colors.purpleMuted,
    height: '100%',
  }

  const handlePress = () => {
    if (openUrl) {
      Linking.openURL(openUrl)
    }

    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacityBox
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor="purple400"
      alignItems="center"
      height={48}
      paddingHorizontal="ms"
      marginBottom="xxxs"
      onPress={handlePress}
      disabled={!(onPress || openUrl)}
      borderTopLeftRadius={isTop ? 'm' : 'none'}
      borderTopRightRadius={isTop ? 'm' : 'none'}
      borderBottomLeftRadius={isBottom ? 'm' : 'none'}
      borderBottomRightRadius={isBottom ? 'm' : 'none'}
    >
      <Text variant="body2" color={destructive ? 'redMain' : 'primaryText'}>
        {title}
      </Text>
      {!onToggle && !select && onPress && (
        <CarotRight color={colors.purpleMuted} />
      )}
      {openUrl && <LinkImg />}
      {onToggle && (
        <Switch
          value={value as boolean}
          onValueChange={onToggle}
          trackColor={{ false: colors.purpleMain, true: colors.purpleMain }}
        />
      )}
      {select && (
        <RNPickerSelect
          placeholder={{}}
          style={{
            inputIOS: {
              ...style,
              lineHeight: 19,
            },
            inputAndroid: {
              ...style,
            },
          }}
          items={select.items}
          value={value}
          onValueChange={select.onValueSelect}
          onDonePress={select.onDonePress}
          useNativeAndroidPickerStyle={false}
        />
      )}
    </TouchableOpacityBox>
  )
}

export default MoreListItem
