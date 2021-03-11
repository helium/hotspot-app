import React, { memo, useMemo } from 'react'
import { Linking, Switch } from 'react-native'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useColors } from '../../../theme/themeHooks'
import CarotRight from '../../../assets/images/carot-right.svg'
import LinkImg from '../../../assets/images/link.svg'
import HeliumActionSheet from '../../../components/HeliumActionSheet'

export interface Item {
  label: string
  value: string
  key?: string | number
  color?: string
  title?: string
}

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

  const handlePress = () => {
    if (openUrl) {
      Linking.openURL(openUrl)
    }

    if (onPress) {
      onPress()
    }
  }

  const trackColor = useMemo(
    () => ({ false: colors.purple300, true: colors.purpleMain }),
    [colors],
  )

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
          trackColor={trackColor}
          thumbColor={colors.white}
        />
      )}
      {select && (
        <HeliumActionSheet
          data={select.items}
          selectedValue={value as string}
          onValueChanged={select.onValueSelect}
          listFormat
          title={title}
        />
      )}
    </TouchableOpacityBox>
  )
}

export default memo(MoreListItem)
