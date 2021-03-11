import React, { memo } from 'react'
import { SvgProps } from 'react-native-svg'
import { useColors } from '../theme/themeHooks'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'

export type HeliumActionSheetItemType = {
  label: string
  value: string | number
  Icon?: React.FC<SvgProps>
}
type Props = HeliumActionSheetItemType & {
  onPress: () => void
  selected: boolean
}

export const HeliumActionSheetItemHeight = 54

const HeliumActionSheetItem = ({ label, onPress, selected, Icon }: Props) => {
  const { purpleMain, black } = useColors()
  return (
    <TouchableOpacityBox
      height={HeliumActionSheetItemHeight}
      onPress={onPress}
      alignItems="center"
      flexDirection="row"
    >
      {!!Icon && (
        <Icon color={selected ? purpleMain : black} height={15} width={15} />
      )}
      <Text
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
