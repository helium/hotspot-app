import React, { memo, ReactText, useMemo } from 'react'
import { Linking, Switch } from 'react-native'
import Text, { TextProps } from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useColors } from '../../../theme/themeHooks'
import CarotRight from '../../../assets/images/carot-right.svg'
import LinkImg from '../../../assets/images/link.svg'
import HeliumActionSheet from '../../../components/HeliumActionSheet'
import { HeliumActionSheetItemType } from '../../../components/HeliumActionSheetItem'
import { Colors } from '../../../theme/theme'

export type SelectProps = {
  onDonePress?: () => void
  onValueSelect: (value: ReactText, index: number) => void
  items: HeliumActionSheetItemType[]
}

export type MoreListItemType = {
  title: string
  destructive?: boolean
  onPress?: () => void
  onToggle?: (value: boolean) => void
  renderModal?: () => void
  value?: boolean | string | number
  select?: SelectProps
  openUrl?: string
  disabled?: boolean
}

const MoreListItem = ({
  item: {
    title,
    value,
    destructive,
    onToggle,
    onPress,
    renderModal,
    select,
    openUrl,
    disabled,
  },
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

  const actionSheetTextProps = useMemo(
    () =>
      ({
        variant: 'regular',
        fontSize: 16,
        color: 'purpleBrightMuted',
      } as TextProps),
    [],
  )

  let textColor: Colors = 'primaryText'
  if (destructive && !disabled) textColor = 'redMain'
  if (destructive && disabled) textColor = 'redMedium'
  if (!destructive && disabled) textColor = 'disabled'

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
      disabled={disabled || !(onPress || openUrl)}
      borderTopLeftRadius={isTop ? 'm' : 'none'}
      borderTopRightRadius={isTop ? 'm' : 'none'}
      borderBottomLeftRadius={isBottom ? 'm' : 'none'}
      borderBottomRightRadius={isBottom ? 'm' : 'none'}
    >
      {renderModal && renderModal()}
      <Text variant="body2" color={textColor}>
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
          disabled={disabled}
        />
      )}
      {select && (
        <HeliumActionSheet
          data={select.items}
          selectedValue={value as string}
          onValueSelected={select.onValueSelect}
          title={title}
          textProps={actionSheetTextProps}
          iconVariant="none"
        />
      )}
    </TouchableOpacityBox>
  )
}

export default memo(MoreListItem)
