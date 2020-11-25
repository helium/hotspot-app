import React from 'react'
import { Switch } from 'react-native'
import RNPickerSelect, { Item } from 'react-native-picker-select'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

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
  if (select?.items) console.log(value, select.items)
  return (
    <TouchableOpacityBox
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor="darkGray"
      padding="m"
      onPress={onPress}
      disabled={!onPress}
    >
      <Text variant="body" color={destructive ? 'red' : 'primaryText'}>
        {title}
      </Text>
      {onToggle && <Switch value={value as boolean} onValueChange={onToggle} />}
      {select && (
        <RNPickerSelect
          placeholder={{}}
          style={{
            inputIOS: {
              color: '#698CAD',
              fontSize: 14,
              letterSpacing: 0.9,
              fontFamily: 'soleil-regular',
              lineHeight: 19,
            },
            inputAndroid: {
              color: '#698CAD',
              fontSize: 14,
              letterSpacing: 0.9,
              fontFamily: 'soleil-regular',
              paddingHorizontal: 14,
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
