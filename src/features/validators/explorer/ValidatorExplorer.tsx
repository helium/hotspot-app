import React, { memo, useCallback, useMemo } from 'react'
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
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import { wh } from '../../../utils/layout'
import ElectedValidatorItem from './ElectedValidatorItem'

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

  const onMenuChanged = useCallback(() => {}, [])

  const menuData = useMemo(
    () =>
      [
        {
          label: t('validator_details.consensus_group'),
          value: 'consensus',
          color: 'purpleBright',
        },
      ] as HeliumSelectItemType[],
    [t],
  )

  const renderElected = useCallback(
    (v) => {
      return (
        <ElectedValidatorItem
          validator={v.item}
          onSelectValidator={onSelectValidator}
          rewardsLoading={rewardsLoading}
        />
      )
    },
    [onSelectValidator, rewardsLoading],
  )

  return (
    <Box
      top={visible ? 0 : wh}
      left={0}
      right={0}
      bottom={visible ? 0 : wh}
      position="absolute"
      backgroundColor="white"
      style={{ paddingTop: top }}
    >
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
