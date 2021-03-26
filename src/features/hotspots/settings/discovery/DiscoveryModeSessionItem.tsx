import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Chevron from '@assets/images/chevron-right.svg'
import { useAsync } from 'react-async-hook'
import Text from '../../../../components/Text'
import Box from '../../../../components/Box'
import { DiscoveryRequest } from '../../../../store/discovery/discoveryTypes'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import DateModule from '../../../../utils/DateModule'

type Props = {
  responseCount: number
  item: DiscoveryRequest
  onRequestSelected: (item: DiscoveryRequest) => void
  isFirst: boolean
  isLast: boolean
  date: string
}
const DiscoveryModeSessionItem = ({
  item,
  isFirst,
  isLast,
  onRequestSelected,
  date,
  responseCount,
}: Props) => {
  const { t } = useTranslation()
  const { result: formattedDate = '' } = useAsync(DateModule.formatDate, [
    date,
    'MMMM d h:mma',
  ])

  const handleRequestSelected = useCallback(() => {
    onRequestSelected(item)
  }, [item, onRequestSelected])

  return (
    <TouchableOpacityBox
      height={61}
      borderColor="grayLight"
      borderWidth={1}
      paddingHorizontal="m"
      alignItems="center"
      borderBottomWidth={isLast ? 1 : 0}
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
      flexDirection="row"
      onPress={handleRequestSelected}
    >
      <Box flex={1}>
        <Text variant="body1" color="black">
          {formattedDate}
        </Text>
        <Text variant="body2" color="grayText">
          {t('discovery.begin.responses', {
            count: responseCount,
          })}
        </Text>
      </Box>
      <Chevron color="black" />
    </TouchableOpacityBox>
  )
}

export default memo(DiscoveryModeSessionItem)
