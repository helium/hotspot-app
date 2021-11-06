import React, { memo, useCallback, useMemo } from 'react'
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
  errorCode: number
}
const DiscoveryModeSessionItem = ({
  item,
  isFirst,
  isLast,
  onRequestSelected,
  date,
  responseCount,
  errorCode,
}: Props) => {
  const { t } = useTranslation()
  const { result: formattedDate = '' } = useAsync(DateModule.formatDate, [
    date,
    'MMMM d h:mma',
  ])

  const hasError = useMemo(() => errorCode !== 0, [errorCode])

  const handleRequestSelected = useCallback(() => {
    if (!hasError) {
      onRequestSelected(item)
    } else {
      // TODO: Prompt user with meaningful error based on code (not yet defined)
    }
  }, [hasError, item, onRequestSelected])

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
          {!hasError
            ? t('discovery.begin.responses', {
                count: responseCount,
              })
            : t('discovery.begin.initiation_error')}
        </Text>
      </Box>
      {!hasError && <Chevron color="black" />}
    </TouchableOpacityBox>
  )
}

export default memo(DiscoveryModeSessionItem)
