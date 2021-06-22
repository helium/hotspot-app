import React, { memo, useMemo } from 'react'
import { SvgProps } from 'react-native-svg'
import { Colors } from '../theme/theme'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'

export type HeliumSelectVariant = 'bubble' | 'flat'
export type HeliumSelectItemType = {
  label: string
  value: string | number
  Icon?: React.FC<SvgProps>
  color: Colors
}

type Props = {
  selected: boolean
  item: HeliumSelectItemType
  onPress: () => void
  variant: HeliumSelectVariant
  backgroundColor?: Colors
}

const HeliumSelectItem = ({
  selected,
  item: { label, color, Icon },
  onPress,
  variant,
  backgroundColor = 'white',
}: Props) => {
  const textColor = useMemo(() => {
    if (variant === 'flat') {
      if (selected) return color
      return 'purpleText'
    }

    if (selected) return 'white'
    return 'purpleText'
  }, [color, selected, variant])

  const background = useMemo(() => {
    if (variant === 'flat') return undefined

    if (selected) return color
    return backgroundColor
  }, [backgroundColor, color, selected, variant])

  const text = useMemo(() => {
    if (variant === 'flat') return label.toUpperCase()
    return label
  }, [label, variant])

  return (
    <TouchableOpacityBox
      backgroundColor={background}
      minWidth={80}
      height="100%"
      flexDirection="row"
      alignItems="center"
      borderRadius="round"
      onPress={onPress}
      paddingHorizontal="ms"
    >
      {!!Icon && selected && <Icon height={16} width={16} color="white" />}
      <Text
        variant={variant === 'flat' ? 'bold' : 'regular'}
        fontSize={variant === 'flat' ? 13 : 16}
        color={textColor}
        marginLeft={Icon ? 'xs' : 'none'}
      >
        {text}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(HeliumSelectItem)
