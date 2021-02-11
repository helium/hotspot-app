import React, { memo } from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { ACTIVITY_ITEM_ROW_HEIGHT } from './ActivityItem'
import { useBorderRadii, useSpacing } from '../../../../theme/themeHooks'

type Props = {
  isFirst: boolean
  isLast: boolean
}

const ActivityItem = ({ isFirst = false, isLast = false }: Props) => {
  const { m: mSpacing } = useSpacing()
  const {
    m: mBorderRadius,
    ms: msBorderRadius,
    s: sBorderRadius,
  } = useBorderRadii()
  return (
    <SkeletonPlaceholder speed={1500}>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderColor="#E1E9EE"
        borderWidth={1}
        borderBottomWidth={isLast ? 1 : 0}
        borderTopLeftRadius={isFirst ? mBorderRadius : undefined}
        borderTopRightRadius={isFirst ? mBorderRadius : undefined}
        borderBottomLeftRadius={isLast ? mBorderRadius : undefined}
        borderBottomRightRadius={isLast ? mBorderRadius : undefined}
      >
        <SkeletonPlaceholder.Item
          width={ACTIVITY_ITEM_ROW_HEIGHT}
          height={ACTIVITY_ITEM_ROW_HEIGHT}
          borderTopLeftRadius={isFirst ? msBorderRadius : undefined}
          borderBottomLeftRadius={isLast ? msBorderRadius : undefined}
        />
        <SkeletonPlaceholder.Item marginHorizontal={mSpacing} flex={1}>
          <SkeletonPlaceholder.Item
            width="100%"
            height={20}
            borderRadius={sBorderRadius}
          />

          <SkeletonPlaceholder.Item
            marginTop={6}
            width="100%"
            height={20}
            borderRadius={sBorderRadius}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginHorizontal={mSpacing}
          width={50}
          height={20}
          borderRadius={sBorderRadius}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  )
}

export default memo(ActivityItem)
