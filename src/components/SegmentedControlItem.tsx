import React, { memo } from 'react'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'

type Props = {
  isFirst: boolean
  isLast: boolean
  selected: boolean
  onChange: () => void
  title: string
}
const SegmentedControlItem = ({
  onChange,
  isFirst,
  isLast,
  selected,
  title,
}: Props) => {
  return (
    <TouchableOpacityBox
      onPress={onChange}
      borderColor="purpleMain"
      borderWidth={1}
      borderRightWidth={isLast ? 1 : 0}
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={selected ? 'purpleMain' : 'white'}
    >
      <Text
        color={selected ? 'white' : 'purpleMain'}
        fontSize={14}
        variant="regular"
      >
        {title}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(SegmentedControlItem)
