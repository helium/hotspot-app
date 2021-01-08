import React from 'react'
import { useTranslation } from 'react-i18next'
import { useActionSheet } from '@expo/react-native-action-sheet'
import CardHandle from './CardHandle'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import CarotDown from '../../../assets/images/carot-down.svg'
import { FilterKeys, FilterType } from './walletTypes'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { Font } from '../../../theme/theme'

type Props = {
  filter: FilterType
  onFilterChanged: (filter: FilterType) => void
}

const ActivityCardHeader = ({ filter, onFilterChanged }: Props) => {
  const { showActionSheetWithOptions } = useActionSheet()
  const { t } = useTranslation()
  const filters = t('transactions.filter', { returnObjects: true }) as Record<
    string,
    string
  >

  const onOpenActionSheet = () => {
    const options = [...FilterKeys.map((k) => filters[k]), t('generic.cancel')]
    const cancelButtonIndex = FilterKeys.length

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        useModal: true,
      },
      (buttonIndex) => {
        const key = FilterKeys[buttonIndex]
        if (!key) return

        onFilterChanged(key)
      },
    )
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
          onPress={onOpenActionSheet}
        >
          <Text color="purpleMain" variant="h4">
            {filters[filter]}
          </Text>
          <Box padding="xs" paddingTop="ms">
            <CarotDown />
          </Box>
        </TouchableOpacityBox>
      </Box>
    </Box>
  )
}

export default ActivityCardHeader
