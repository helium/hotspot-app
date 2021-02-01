import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CarotDown from '@assets/images/carot-down.svg'
import CardHandle from '../../../../components/CardHandle'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { FilterKeys, FilterType } from '../walletTypes'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { Font } from '../../../../theme/theme'
import ModalPicker from '../../../../components/ModalPicker'

type Props = {
  filter: FilterType
  onFilterChanged: (filter: FilterType) => void
}

const ActivityCardHeader = ({ filter, onFilterChanged }: Props) => {
  const [showPicker, setShowPicker] = useState(false)
  const { t } = useTranslation()
  const filters = t('transactions.filter', { returnObjects: true }) as Record<
    string,
    string
  >

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
