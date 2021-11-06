import React, { memo } from 'react'
import { SvgProps } from 'react-native-svg'
import { useColors } from '../theme/themeHooks'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'

export type HeliumActionSheetItemType = {
  label: string
  labelShort?: string
  value: string | number
  Icon?: React.FC<SvgProps>
  action?: () => void
}
type Props = HeliumActionSheetItemType & {
  onPress: () => void
  selected: boolean
}

export const HeliumActionSheetItemHeight = 50

const HeliumActionSheetItem = ({ label, onPress, selected, Icon }: Props) => {
  const { purpleMain, grayLight } = useColors()
  return (
    <TouchableOpacityBox
      height={HeliumActionSheetItemHeight}
      onPress={onPress}
      alignItems="center"
      flexDirection="row"
    >
      {!!Icon && (
        <Icon
          color={selected ? purpleMain : grayLight}
          height={16}
          width={16}
        />
      )}
      <Text
        marginLeft={Icon ? 'ms' : 'none'}
        color={selected ? 'purpleMain' : 'black'}
        variant={selected ? 'medium' : 'regular'}
        fontSize={18}
      >
        {label}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(HeliumActionSheetItem)
