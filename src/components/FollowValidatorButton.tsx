/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Follow from '@assets/images/follow.svg'
import { BoxProps } from '@shopify/restyle'
import { DebouncedTouchableOpacityBox } from './TouchableOpacityBox'
import { useColors } from '../theme/themeHooks'
import { useAppDispatch } from '../store/store'
import { RootState } from '../store/rootReducer'
import {
  followValidator,
  unfollowValidator,
} from '../store/validators/validatorsSlice'
import { Theme } from '../theme/theme'

type Props = BoxProps<Theme> & {
  address: string
  colors?: { following: string; notFollowing: string }
  handleChange?: (following: boolean) => void
  duration?: number
}
const FollowButton = ({
  address,
  colors,
  duration = 1000,
  handleChange,
  ...props
}: Props) => {
  const { grayPurple, followPurple } = useColors()
  const dispatch = useAppDispatch()
  const [following, setFollowing] = useState(false)
  const followedValidators = useSelector(
    (state: RootState) => state.validators.followedValidatorsObj,
  )

  useEffect(() => {
    setFollowing(!!followedValidators[address])
  }, [followedValidators, address])

  const color = useMemo(() => {
    if (!colors) return following ? followPurple : grayPurple

    return following ? colors.following : colors.notFollowing
  }, [colors, following, followPurple, grayPurple])

  const toggleFollowing = useCallback(() => {
    setFollowing(!following)
    handleChange?.(!following)
    if (following) {
      dispatch(unfollowValidator(address))
    } else {
      dispatch(followValidator(address))
    }
  }, [following, handleChange, dispatch, address])

  return (
    <DebouncedTouchableOpacityBox
      duration={duration}
      onPress={toggleFollowing}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      {...props}
    >
      <Follow color={color} />
    </DebouncedTouchableOpacityBox>
  )
}

export default memo(FollowButton)
