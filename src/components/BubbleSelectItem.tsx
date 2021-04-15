import React, { memo, useMemo } from 'react'
import { SvgProps } from 'react-native-svg'
import { Colors } from '../theme/theme'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'

export type BubbleSelectItemType = {
  label: string
  value: string | number
  Icon?: React.FC<SvgProps>
  color: Colors
}

type Props = {
  selected: boolean
  item: BubbleSelectItemType
  onPress: () => void
}

const BubbleSelectItem = ({
  selected,
  item: { label, color, Icon },
  onPress,
}: Props) => {
  const textColor = useMemo(() => {
    if (selected) return 'white'
    return 'purpleText'
  }, [selected])

  const backgroundColor = useMemo(() => {
    if (selected) return color
    return 'white'
  }, [color, selected])

  return (
    <TouchableOpacityBox
      backgroundColor={backgroundColor}
      minWidth={80}
      height="100%"
      flexDirection="row"
      alignItems="center"
      borderRadius="round"
      onPress={onPress}
      paddingHorizontal="ms"
    >
      {!!Icon && selected && <Icon height={16} width={16} color="white" />}
      <Text variant="body2" color={textColor} marginLeft="xs">
        {label}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(BubbleSelectItem)
