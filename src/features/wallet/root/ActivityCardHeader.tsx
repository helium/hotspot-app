import React from 'react'
import { useTranslation } from 'react-i18next'
import RNPickerSelect from 'react-native-picker-select'
import { Platform } from 'react-native'
import CardHandle from './CardHandle'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import CarotDown from '../../../assets/images/carot-down.svg'
import { useColors, useTextVariants } from '../../../theme/themeHooks'
import { FilterKeys, FilterType } from './walletTypes'

type Props = {
  filter: FilterType
  onFilterChanged: (filter: FilterType) => void
}

const ActivityCardHeader = ({ filter, onFilterChanged }: Props) => {
  const { t } = useTranslation()
  const { h4 } = useTextVariants()
  const { purpleMain } = useColors()
  const filters = t('transactions.filter', { returnObjects: true }) as Record<
    string,
    string
  >

  const inputStyle = { ...h4, color: purpleMain, paddingRight: 12 }

  return (
    <Box padding="m">
      <Box alignItems="center" padding="s">
        <CardHandle />
      </Box>
      <Box flexDirection="row" alignItems="center">
        <Text color="grayDark" fontSize={20} fontWeight="600">
          {t('transactions.view')}
        </Text>
        <RNPickerSelect
          placeholder={{}}
          onValueChange={onFilterChanged}
          useNativeAndroidPickerStyle={false}
          items={FilterKeys.map((option) => ({
            label: filters[option],
            value: option,
            displayValue: true,
          }))}
          style={{
            inputIOS: inputStyle,
            inputAndroid: inputStyle,
            iconContainer: {
              top: Platform.OS === 'ios' ? 12 : 26,
            },
          }}
          value={filter}
          Icon={() => <CarotDown />}
        />
      </Box>
    </Box>
  )
}

export default ActivityCardHeader
