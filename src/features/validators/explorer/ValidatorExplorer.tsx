import React, { memo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAsync } from 'react-async-hook'
import { Validator } from '@helium/http'
import { useTranslation } from 'react-i18next'
import {
  fetchElectedValidators,
  fetchElections,
  fetchValidatorRewards,
} from '../../../store/validators/validatorsSlice'
import { useAppDispatch } from '../../../store/store'
import { RootState } from '../../../store/rootReducer'
import Box from '../../../components/Box'
import { useColors } from '../../../theme/themeHooks'
import { wh } from '../../../utils/layout'
import ValidatorListItem from '../ValidatorListItem'
import Text from '../../../components/Text'
import { getChainVars } from '../../../utils/appDataClient'
import RewardIcon from '../../../assets/images/heliumReward.svg'
import PenaltyIcon from '../../../assets/images/penalty.svg'

type Props = {
  visible: boolean
  onSelectValidator: (validator: Validator) => void
}

const ValidatorExplorer = ({ visible, onSelectValidator }: Props) => {
  const dispatch = useAppDispatch()
  const colors = useColors()
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()
  const electedValidators = useSelector(
    (state: RootState) => state.validators.electedValidators,
  )
  const rewardsLoading = useSelector(
    (state: RootState) => state.validators.loadingRewards,
  )
  const [consensusMembers, setConsensusMembers] = useState<number>()

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

  useAsync(async () => {
    const chainVars = await getChainVars()
    setConsensusMembers(chainVars.numConsensusMembers)
  }, [])

  const renderElected = useCallback(
    (v) => {
      return (
        <ValidatorListItem
          validator={v.item}
          onSelectValidator={onSelectValidator}
          rewardsLoading={rewardsLoading}
        />
      )
    },
    [onSelectValidator, rewardsLoading],
  )

  const Header = useCallback(
    () => (
      <Box marginVertical="m" marginHorizontal="l">
        <Text variant="h1" color="purpleBright" marginTop="m">
          {t('validator_details.consensus_group_title')}
        </Text>
        <Text variant="medium" fontSize={15} color="grayBlack" marginTop="s">
          {t('validator_details.elected_count', { count: consensusMembers })}
        </Text>
        <Box flexDirection="row" alignItems="center" marginTop="s">
          <RewardIcon color={colors.purpleMain} />
          <Text
            color="black"
            marginLeft="xs"
            marginRight="s"
            variant="light"
            fontSize={13}
          >
            {t('validator_details.earnings_desc')}
          </Text>
          <PenaltyIcon />
          <Text color="black" marginLeft="xs" variant="light" fontSize={13}>
            {t('validator_details.penalty_desc')}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" marginTop="s">
          <Box
            marginLeft="xxxs"
            borderRadius="round"
            height={10}
            width={10}
            backgroundColor="purpleBright"
          />
          <Text marginLeft="xs" color="black" variant="light" fontSize={13}>
            {t('validator_details.consensus_desc')}
          </Text>
        </Box>
      </Box>
    ),
    [colors.purpleMain, consensusMembers, t],
  )

  return (
    <Box
      top={visible ? 65 + top : wh}
      left={0}
      right={0}
      bottom={visible ? 0 : wh}
      position="absolute"
      backgroundColor="white"
      borderTopLeftRadius="l"
      borderTopRightRadius="l"
      overflow="hidden"
    >
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
        ListHeaderComponent={<Header />}
      />
    </Box>
  )
}

export default memo(ValidatorExplorer)
