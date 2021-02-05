import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CardHandle from '../../../../components/CardHandle'
import Box from '../../../../components/Box'
import { FilterKeys, FilterType } from '../walletTypes'
import ModalPicker from '../../../../components/ModalPicker'
import { useAppDispatch } from '../../../../store/store'
import activitySlice from '../../../../store/activity/activitySlice'

type Props = { filter: FilterType }
const ActivityCardHeader = ({ filter }: Props) => {
  const { t } = useTranslation()
  const filters = t('transactions.filter', { returnObjects: true }) as Record<
    string,
    string
  >
  const dispatch = useAppDispatch()
  const [data] = useState(
    FilterKeys.map((value) => ({ label: filters[value], value })),
  )

  const onFilterChanged = useCallback(
    (_itemValue, itemIndex) => {
      dispatch(activitySlice.actions.setFilter(FilterKeys[itemIndex]))
    },
    [dispatch],
  )

  return (
    <Box padding="m">
      <Box alignItems="center" padding="s">
        <CardHandle />
      </Box>
      <ModalPicker
        marginLeft="ms"
        prefix={t('transactions.view')}
        data={data}
        selectedValue={filter}
        onValueChanged={onFilterChanged}
      />
    </Box>
  )
}

export default memo(ActivityCardHeader)
