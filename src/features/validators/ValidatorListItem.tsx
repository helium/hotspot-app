import React, { memo, useCallback, useMemo } from 'react'
import animalName from 'angry-purple-tiger'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { useSelector } from 'react-redux'
import { Validator } from '@helium/http'
import tinycolor from 'tinycolor2'
import RewardIcon from '@assets/images/heliumReward.svg'
import PenaltyIcon from '@assets/images/penalty.svg'
import CarotRight from '@assets/images/carot-right.svg'
import { DebouncedTouchableHighlightBox } from '../../components/TouchableHighlightBox'
import Box from '../../components/Box'
import Text from '../../components/Text'
import ConsensusHistory from './explorer/ConsensusHistory'
import { RootState } from '../../store/rootReducer'
import { useColors, useSpacing } from '../../theme/themeHooks'

type Props = {
  validator: Validator
  onSelectValidator: (validator: Validator) => void
  rewardsLoading: boolean
}
const ValidatorListItem = ({
  validator,
  onSelectValidator,
  rewardsLoading,
}: Props) => {
  const colors = useColors()
  const spacing = useSpacing()
  const { rewards, followedValidatorsObj, validatorsObj } = useSelector(
    (state: RootState) => state.validators,
  )
  const elections = useSelector(
    (state: RootState) => state.validators.elections,
  )
  const earnings = rewards[validator.address]

  const onPress = useCallback(() => onSelectValidator(validator), [
    onSelectValidator,
    validator,
  ])

  const style = useMemo(() => {
    let borderLeftColor = colors.purpleBright
    if (
      !validatorsObj[validator.address] &&
      !followedValidatorsObj[validator.address]
    ) {
      borderLeftColor = tinycolor(borderLeftColor).setAlpha(0).toRgbString()
    } else if (followedValidatorsObj[validator.address]) {
      borderLeftColor = tinycolor(borderLeftColor).setAlpha(0.5).toRgbString()
    }
    return { borderLeftColor }
  }, [
    colors.purpleBright,
    followedValidatorsObj,
    validator.address,
    validatorsObj,
  ])

  return (
    <DebouncedTouchableHighlightBox
      underlayColor={colors.grayHighlight}
      onPress={onPress}
      padding="m"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="grayBox"
      marginBottom="xxs"
      borderLeftWidth={6}
      style={style}
    >
      <>
        <Box>
          <Text
            variant="body2Medium"
            color="offblack"
            ellipsizeMode="tail"
            numberOfLines={1}
            maxWidth={210}
          >
            {animalName(validator.address)}
          </Text>
          <Box flexDirection="row" alignItems="center" paddingTop="s">
            <RewardIcon color={colors.purpleMain} />
            {rewardsLoading || !earnings ? (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  height={12}
                  width={90 - spacing.m}
                  borderRadius={spacing.m}
                  marginRight={spacing.m}
                  marginLeft={spacing.xs}
                />
              </SkeletonPlaceholder>
            ) : (
              <Text
                color="grayText"
                variant="regular"
                fontSize={12}
                marginLeft="xs"
                minWidth={90}
              >
                {`+${earnings?.toString(2)}`}
              </Text>
            )}
            <PenaltyIcon />
            <Text
              color="grayText"
              variant="regular"
              fontSize={12}
              marginLeft="xs"
              marginRight="m"
            >
              {validator.penalty?.toFixed(2)}
            </Text>
          </Box>
        </Box>
        <Box flexDirection="row" alignItems="center">
          <ConsensusHistory
            address={validator.address}
            elections={elections.data}
          />
          <CarotRight color="#C4C8E5" />
        </Box>
      </>
    </DebouncedTouchableHighlightBox>
  )
}

export default memo(ValidatorListItem)
