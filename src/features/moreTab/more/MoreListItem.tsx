import React from 'react'
import { Switch } from 'react-native'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useColors, useTextVariants } from '../../../theme/themeHooks'

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
}

const MoreListItem = ({
  item: { title, value, destructive, onToggle, onPress, select },
}: {
  item: MoreListItemType
}) => {
  const { secondaryText } = useColors()
  const { body } = useTextVariants()

  const style = {
    ...body,
    color: secondaryText,
    height: '100%',
  }

  return (
    <TouchableOpacityBox
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor="grayDark"
      alignItems="center"
      height={64}
      paddingHorizontal="m"
      marginBottom="s"
      onPress={onPress}
      disabled={!onPress}
    >
      <Text variant="body2" color={destructive ? 'red' : 'primaryText'}>
        {title}
      </Text>
      {onToggle && <Switch value={value as boolean} onValueChange={onToggle} />}
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
