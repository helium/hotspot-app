import React, { memo, useMemo } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { Colors, Spacing } from '../theme/theme'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'

export type HeliumSelectVariant = 'bubble' | 'flat' | 'bubbleBold'
export type HeliumSelectItemType = {
  label: string
  value: string | number
  Icon?: React.FC<SvgProps>
  color: Colors
  textColor?: Colors
  selectedTextColor?: Colors
}

type Props = {
  selected: boolean
  item: HeliumSelectItemType
  onPress: () => void
  variant: HeliumSelectVariant
  backgroundColor?: Colors
  handleLayout: (event: LayoutChangeEvent) => void
  itemPadding?: Spacing
}

const HeliumSelectItem = ({
  selected,
  item: { label, color, Icon, textColor, selectedTextColor },
  onPress,
  variant,
  backgroundColor = 'white',
  handleLayout,
  itemPadding,
}: Props) => {
  const itemTextColor = useMemo(() => {
    if (textColor && !selected) return textColor
    if (selectedTextColor && selected) return selectedTextColor

    if (variant === 'flat') {
      if (selected) return color
      return 'purpleGray'
    }

    if (selected) return 'white'
    return 'purpleText'
  }, [color, selected, selectedTextColor, textColor, variant])

  const background = useMemo(() => {
    if (variant === 'flat') return undefined

    if (selected) return color
    return backgroundColor
  }, [backgroundColor, color, selected, variant])

  const text = useMemo(() => {
    if (variant === 'flat') return label.toUpperCase()
    return label
  }, [label, variant])

  const fontSize = useMemo(() => {
    switch (variant) {
      case 'flat':
        return 15
      case 'bubble':
        return 16
      case 'bubbleBold':
        return 17
    }
  }, [variant])

  const textVariant = useMemo(() => {
    switch (variant) {
      case 'bubbleBold':
      case 'flat':
        return 'bold'
      case 'bubble':
        return 'medium'
    }
  }, [variant])

  return (
    <TouchableOpacityBox
      backgroundColor={background}
      height="100%"
      flexDirection="row"
      onLayout={handleLayout}
      alignItems="center"
      borderRadius="round"
      onPress={onPress}
      paddingHorizontal={itemPadding || 'ms'}
    >
      {!!Icon && selected && <Icon height={16} width={16} color="white" />}
      <Text
        variant={textVariant}
        fontSize={fontSize}
        color={itemTextColor}
        marginLeft={Icon ? 'xs' : 'none'}
      >
        {text}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(HeliumSelectItem)
