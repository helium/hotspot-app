import React, { memo, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FlatList, RefreshControl } from 'react-native'
import animalName from 'angry-purple-tiger'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../../components/Text'
import {
  fetchElectedValidators,
  fetchElections,
} from '../../store/validators/validatorsSlice'
import { useAppDispatch } from '../../store/store'
import { RootState } from '../../store/rootReducer'
import Box from '../../components/Box'
import PenaltyIcon from '../../assets/images/penalty.svg'
import CarotRight from '../../assets/images/carot-right.svg'
import { useColors } from '../../theme/themeHooks'

type Props = {
  visible: boolean
}

const ValidatorExplorer = ({ visible }: Props) => {
  const dispatch = useAppDispatch()
  const colors = useColors()
  const { top } = useSafeAreaInsets()
  const electedValidators = useSelector(
    (state: RootState) => state.validators.electedValidators,
  )
  const elections = useSelector(
    (state: RootState) => state.validators.elections,
  )

  const loadElectedValidators = useCallback(() => {
    dispatch(fetchElectedValidators())
    dispatch(fetchElections())
  }, [dispatch])

  useEffect(() => {
    loadElectedValidators()
  }, [loadElectedValidators])

  const ConsensusHistory = useCallback(
    ({ address }) => {
      return (
        <Box flexDirection="row" marginHorizontal="m">
          {elections?.data
            ?.map((election) => (
              <Box
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
              <PenaltyIcon />
              <Text
                color="grayText"
                variant="regular"
                fontSize={12}
                marginLeft="xs"
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
    [ConsensusHistory],
  )

  const renderElected = useCallback(
    (v) => {
      return <ElectedValidatorItem validator={v.item} />
    },
    [ElectedValidatorItem],
  )

  if (!visible) return null

  return (
    <Box flex={1} backgroundColor="white" style={{ paddingTop: top }}>
      <Text>Validators</Text>
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
        data={electedValidators.data}
        renderItem={renderElected}
        keyExtractor={(item) => item.address}
      />
    </Box>
  )
}

export default memo(ValidatorExplorer)
