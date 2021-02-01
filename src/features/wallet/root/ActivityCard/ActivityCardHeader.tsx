import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CarotDown from '@assets/images/carot-down.svg'
import CardHandle from '../../../../components/CardHandle'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { FilterKeys, FilterType } from '../walletTypes'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { Font } from '../../../../theme/theme'
import ModalPicker from '../../../../components/ModalPicker'
import { RootState } from '../../../../store/rootReducer'
import { useAppDispatch } from '../../../../store/store'
import { changeFilter } from '../../../../store/activity/activitySlice'

const ActivityCardHeader = () => {
  const [showPicker, setShowPicker] = useState(false)
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
      <Box marginTop="n_s" flexDirection="row" alignItems="center">
        <Text color="grayDark" variant="h4" fontFamily={Font.main.medium}>
          {t('transactions.view')}
        </Text>
        <TouchableOpacityBox
          flexDirection="row"
          paddingHorizontal="xs"
          paddingVertical="s"
          onPress={() => {
            setShowPicker(true)
          }}
        >
          <Text color="purpleMain" variant="h4">
            {filters[filter]}
          </Text>
          <Box padding="xs" paddingTop="ms">
            <CarotDown />
          </Box>
        </TouchableOpacityBox>
      </Box>
      <ModalPicker
        data={FilterKeys.map((value) => ({ label: filters[value], value }))}
        selectedValue={filter}
        onValueChanged={(_itemValue, itemIndex) =>
          onFilterChanged(FilterKeys[itemIndex])
        }
        handleClose={() => setShowPicker(false)}
        visible={showPicker}
      />
    </Box>
  )
}

export default ActivityCardHeader
