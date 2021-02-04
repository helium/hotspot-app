import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CardHandle from '../../../../components/CardHandle'
import Box from '../../../../components/Box'
import { FilterKeys, FilterType } from '../walletTypes'
import ModalPicker from '../../../../components/ModalPicker'
import { RootState } from '../../../../store/rootReducer'
import { useAppDispatch } from '../../../../store/store'
import { changeFilter } from '../../../../store/activity/activitySlice'

const ActivityCardHeader = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    activity: { filter },
  } = useSelector((state: RootState) => state)

  const filters = t('transactions.filter', { returnObjects: true }) as Record<
    string,
    string
  >

  const onFilterChanged = (nextFilter: FilterType) => {
    dispatch(changeFilter(nextFilter))
  }

  return (
    <Box padding="m">
      <Box alignItems="center" padding="s">
        <CardHandle />
      </Box>
      <ModalPicker
        prefix={t('transactions.view')}
        data={FilterKeys.map((value) => ({ label: filters[value], value }))}
        selectedValue={filter}
        onValueChanged={(_itemValue, itemIndex) =>
          onFilterChanged(FilterKeys[itemIndex])
        }
      />
    </Box>
  )
}

export default memo(ActivityCardHeader)
