import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import CardHandle from '../../../../components/CardHandle'
import Box from '../../../../components/Box'
import { FilterKeys, FilterType } from '../walletTypes'
import ModalPicker from '../../../../components/ModalPicker'
import { useAppDispatch } from '../../../../store/store'
import activitySlice from '../../../../store/activity/activitySlice'
import accountSlice from '../../../../store/account/accountSlice'

type Props = { filter: FilterType }
const ActivityCardHeader = ({ filter }: Props) => {
  const { t } = useTranslation()
  const filters = useMemo(
    () =>
      t('transactions.filter', { returnObjects: true }) as Record<
        string,
        string
      >,
    [t],
  )
  const dispatch = useAppDispatch()
  const data = useMemo(
    () => FilterKeys.map((value) => ({ label: filters[value], value })),
    [filters],
  )

  const onFilterChanged = useCallback(
    (_itemValue, itemIndex) => {
      const nextFilter = FilterKeys[itemIndex]
      if (nextFilter !== filter) {
        dispatch(accountSlice.actions.resetActivityChart())
        dispatch(activitySlice.actions.setFilter(nextFilter))
      }
    },
    [filter, dispatch],
  )

  return (
    <Box padding="m">
      <Box alignItems="center" padding="s">
        <CardHandle />
      </Box>
      <Box flexDirection="row" paddingRight="m">
        <ModalPicker
          minWidth={120}
          flex={1}
          marginLeft="ms"
          prefix={t('transactions.view')}
          data={data}
          selectedValue={filter}
          onValueChanged={onFilterChanged}
        />
      </Box>
    </Box>
  )
}

export default memo(ActivityCardHeader)
