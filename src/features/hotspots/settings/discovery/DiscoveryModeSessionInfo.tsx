import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import Text from '../../../../components/Text'
import Box from '../../../../components/Box'
import { DiscoveryRequest } from '../../../../store/discovery/discoveryTypes'
import Button from '../../../../components/Button'
import DiscoveryModeSessionItem from './DiscoveryModeSessionItem'
import dedupeDiscoveryResponses from './dedupeDiscoveryResponses'

type Props = {
  requests: DiscoveryRequest[]
  requestsRemaining: number
  onBeginNew: () => void
  onRequestSelected: (request: DiscoveryRequest) => void
  enabled: boolean
}
type ItemType = { item: DiscoveryRequest; index: number }
const DiscoveryModeSessionInfo = ({
  requests,
  requestsRemaining,
  onBeginNew,
  onRequestSelected,
  enabled,
}: Props) => {
  const { t } = useTranslation()
  const [canRequest, setCanRequest] = useState<boolean>()
  const keyExtractor = useCallback((item) => item.insertedAt, [])

  const handleRequestSelected = useCallback(
    (item: DiscoveryRequest) => {
      onRequestSelected(item)
    },
    [onRequestSelected],
  )

  useEffect(() => {
    const nextCanRequest = requestsRemaining > 0
    setCanRequest(nextCanRequest)
  }, [canRequest, requestsRemaining])

  const renderItem = useCallback(
    (props: ItemType) => {
      const isFirst = props.index === 0
      const isLast = props.index === requests.length - 1
      return (
        <DiscoveryModeSessionItem
          isFirst={isFirst}
          isLast={isLast}
          item={props.item}
          date={props.item.insertedAt}
          errorCode={props.item.errorCode}
          responseCount={dedupeDiscoveryResponses(props.item.responses).length}
          onRequestSelected={handleRequestSelected}
        />
      )
    },
    [handleRequestSelected, requests.length],
  )

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <Box flexDirection="row" alignItems="flex-end" marginBottom="m">
            <Text
              variant="regular"
              fontSize={17}
              color="black"
              lineHeight={21}
              maxFontSizeMultiplier={1}
            >
              {t('discovery.begin.previous_sessions')}
            </Text>
            <Text
              variant="light"
              fontSize={14}
              color="purpleDark"
              marginLeft="xs"
              lineHeight={21}
            >
              {t('discovery.begin.last_30_days')}
            </Text>
          </Box>
        }
        data={requests}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      {canRequest === true && enabled && (
        <Button
          marginTop="m"
          variant="primary"
          mode="contained"
          onPress={onBeginNew}
          title={t('discovery.begin.start_session')}
        />
      )}
      {canRequest === false && enabled && (
        <Text variant="body2" textAlign="center" color="redMain" marginTop="m">
          {t('discovery.begin.no_sessions')}
        </Text>
      )}
    </>
  )
}

export default memo(DiscoveryModeSessionInfo)
