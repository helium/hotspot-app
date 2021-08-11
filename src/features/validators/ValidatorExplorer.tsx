import React, { memo, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import animalName from 'angry-purple-tiger'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAsync } from 'react-async-hook'
import { Validator } from '@helium/http'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Text from '../../components/Text'
import {
  fetchElectedValidators,
  fetchElections,
  fetchValidatorRewards,
} from '../../store/validators/validatorsSlice'
import { useAppDispatch } from '../../store/store'
import { RootState } from '../../store/rootReducer'
import Box from '../../components/Box'
import PenaltyIcon from '../../assets/images/penalty.svg'
import CarotRight from '../../assets/images/carot-right.svg'
import RewardIcon from '../../assets/images/heliumReward.svg'
import { useColors, useSpacing } from '../../theme/themeHooks'
import HeliumSelect from '../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../components/HeliumSelectItem'

type Props = {
  visible: boolean
}

const ValidatorExplorer = ({ visible }: Props) => {
  const dispatch = useAppDispatch()
  const colors = useColors()
  const spacing = useSpacing()
  const { top } = useSafeAreaInsets()
  const electedValidators = useSelector(
    (state: RootState) => state.validators.electedValidators,
  )
  const elections = useSelector(
    (state: RootState) => state.validators.elections,
  )
  const rewards = useSelector((state: RootState) => state.validators.rewards)
  const rewardsLoading = useSelector(
    (state: RootState) => state.validators.loadingRewards,
  )

  const loadElectedValidators = useCallback(async () => {
    const response = await dispatch(fetchElectedValidators())
    const fetchedValidators = response.payload as Validator[]
    await dispatch(
      fetchValidatorRewards(fetchedValidators.map((v) => v.address)),
    )
    await dispatch(fetchElections())
  }, [dispatch])

  useAsync(async () => {
    await loadElectedValidators()
  }, [loadElectedValidators])

  const ConsensusHistory = useCallback(
    ({ address }) => {
      return (
        <Box flexDirection="row" marginHorizontal="m">
          {elections?.data
            ?.map((election) => (
              <Box
                key={election.hash}
                borderRadius="round"
                backgroundColor={
                  election.members.includes(address)
                    ? 'purpleBright'
                    : 'grayLight'
                }
                height={10}
                width={10}
                marginHorizontal="xxs"
              />
            ))
            .reverse()}
        </Box>
      )
    },
    [elections?.data],
  )

  const ElectedValidatorItem = useCallback(
    ({ validator }) => {
      const earnings = rewards[validator.address]
      return (
        <Box
          padding="m"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="grayBox"
          marginBottom="xxs"
          borderLeftWidth={6}
          borderLeftColor="purpleBright"
        >
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
                    width={50}
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
                  marginRight="m"
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
            <ConsensusHistory address={validator.address} />
            <CarotRight color="#C4C8E5" />
          </Box>
        </Box>
      )
    },
    [
      ConsensusHistory,
      colors.purpleMain,
      rewards,
      rewardsLoading,
      spacing.m,
      spacing.xs,
    ],
  )

  const renderElected = useCallback(
    (v) => {
      return <ElectedValidatorItem validator={v.item} />
    },
    [ElectedValidatorItem],
  )

  const onMenuChanged = useCallback(() => {}, [])

  const menuData = useMemo(
    () =>
      [
        {
          label: 'Consensus Group',
          value: 'consensus',
          color: 'purpleBright',
        },
      ] as HeliumSelectItemType[],
    [],
  )

  if (!visible) return null

  return (
    <Box flex={1} backgroundColor="white" style={{ paddingTop: top }}>
      <Box height={65} marginBottom="s">
        <HeliumSelect
          data={menuData}
          selectedValue="consensus"
          variant="bubble"
          onValueChanged={onMenuChanged}
          showGradient={false}
          scrollEnabled={false}
          margin="m"
        />
      </Box>
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={electedValidators.loading}
            onRefresh={loadElectedValidators}
            tintColor={colors.grayLight}
          />
        }
        refreshing={electedValidators.loading}
        ListEmptyComponent={<ActivityIndicator color="gray" />}
        data={electedValidators.data}
        renderItem={renderElected}
        keyExtractor={(item) => item.address}
      />
    </Box>
  )
}

export default memo(ValidatorExplorer)
