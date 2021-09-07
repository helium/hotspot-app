import React, { memo, useCallback } from 'react'
import animalName from 'angry-purple-tiger'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { useSelector } from 'react-redux'
import { Validator } from '@helium/http'
import { DebouncedTouchableHighlightBox } from '../../../components/TouchableHighlightBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import RewardIcon from '../../../assets/images/heliumReward.svg'
import PenaltyIcon from '../../../assets/images/penalty.svg'
import ConsensusHistory from './ConsensusHistory'
import CarotRight from '../../../assets/images/carot-right.svg'
import { RootState } from '../../../store/rootReducer'
import { useColors, useSpacing } from '../../../theme/themeHooks'

type Props = {
  validator: Validator
  onSelectValidator: (validator: Validator) => void
  rewardsLoading: boolean
}
const ElectedValidatorItem = ({
  validator,
  onSelectValidator,
  rewardsLoading,
}: Props) => {
  const colors = useColors()
  const spacing = useSpacing()
  const rewards = useSelector((state: RootState) => state.validators.rewards)
  const elections = useSelector(
    (state: RootState) => state.validators.elections,
  )
  const earnings = rewards[validator.address]

  const onPress = useCallback(() => onSelectValidator(validator), [
    onSelectValidator,
    validator,
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
      borderLeftColor="purpleBright"
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

export default memo(ElectedValidatorItem)
