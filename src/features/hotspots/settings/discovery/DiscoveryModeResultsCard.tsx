import React, { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { addSeconds } from 'date-fns'
import { Hotspot } from '@helium/http'
import Box from '../../../../components/Box'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Text from '../../../../components/Text'
import { DiscoveryRequest } from '../../../../store/discovery/discoveryTypes'
import animateTransition from '../../../../utils/animateTransition'
import DiscoveryModeSearching from './DiscoveryModeSearching'
import useShareDiscovery from './useShareDiscovery'
import DateModule from '../../../../utils/DateModule'
import useMount from '../../../../utils/useMount'
import { prettyPrintToConsole } from '../../../../utils/logger'

type LineItemType = { label: string; value: string }
const LineItem = ({ label, value }: LineItemType) => (
  <Box flexDirection="row" alignItems="center" height={24}>
    <Text variant="regular" fontSize={18} color="black" flex={1}>
      {label}
    </Text>
    <Text variant="regular" fontSize={18} color="purpleMain">
      {value}
    </Text>
  </Box>
)

type Props = {
  request?: DiscoveryRequest | null
  isPolling: boolean
  selectedHotspots: Hotspot[]
  hideOverlay: () => void
  numResponses: number
  requestTime: number
  currentTime: number
  requestLength: number
}
const DiscoveryModeResultsCard = ({
  request,
  isPolling,
  selectedHotspots,
  numResponses,
  hideOverlay,
  requestTime,
  currentTime,
  requestLength,
}: Props) => {
  const { t } = useTranslation()
  const { shareResults } = useShareDiscovery(request)
  const [resultDateStr, setResultDateStr] = useState('')

  useMount(() => {
    // TODO: Remove
    prettyPrintToConsole(selectedHotspots)
    console.log(!!hideOverlay)

    // TODO: Create hotspots carousel and use DiscoveryModeResultsCardItem
  })

  useMemo(async () => {
    if (isPolling || !request) return

    const date = new Date(request.insertedAt)
    const resultDate = addSeconds(date, requestLength)
    const formatted = await DateModule.formatDate(
      resultDate.toISOString(),
      'MMMM d h:mma',
    )
    setResultDateStr(formatted)
  }, [isPolling, request, requestLength])

  const results = useMemo(() => {
    let elapsed = ''
    const items: LineItemType[] = [
      {
        label: t('discovery.results.responded'),
        value: `${numResponses}`,
      },
    ]
    if (request) {
      const seconds = currentTime - requestTime
      if (seconds >= 0) {
        if (seconds >= requestLength) {
          elapsed = new Date(requestLength * 1000).toISOString().substr(14, 5)
        } else {
          elapsed = new Date(seconds * 1000).toISOString().substr(14, 5)
        }
        items.push({
          label: t('discovery.results.elapsed_time'),
          value: elapsed,
        })
      }
      if (!isPolling) {
        items.push({
          label: t('discovery.results.result_time'),
          value: resultDateStr,
        })
      }
    }

    animateTransition('DiscoveryModeResultsCard.Results', false)
    return (
      <Box justifyContent="space-between">
        {items.map((i) => (
          <LineItem
            label={i.label}
            value={i.value}
            key={`${i.label}.${i.value}`}
          />
        ))}
      </Box>
    )
  }, [
    currentTime,
    isPolling,
    numResponses,
    request,
    requestLength,
    requestTime,
    resultDateStr,
    t,
  ])

  const searchHeight = 38
  const styles = useMemo(() => {
    return {
      card: { marginTop: isPolling ? -(searchHeight / 2) : 0 },
      title: { marginTop: isPolling ? searchHeight / 2 : 0 },
    }
  }, [isPolling])

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      minHeight={210}
      marginHorizontal="ms"
    >
      {isPolling && <DiscoveryModeSearching />}
      <Card
        style={styles.card}
        variant="modal"
        backgroundColor="white"
        overflow="hidden"
        padding="l"
      >
        <Text
          variant="regular"
          fontSize={22}
          color="black"
          marginBottom="l"
          style={styles.title}
        >
          {t('discovery.results.title')}
        </Text>

        {results}

        {!isPolling && (
          <Button
            marginTop="l"
            variant="primary"
            mode="contained"
            title={t('discovery.results.share')}
            onPress={shareResults}
          />
        )}
        <Box flexDirection="row">
          {(selectedHotspots || []).map((h) => (
            <Text variant="body1" color="black" key={h.address}>
              {h.name}
            </Text>
          ))}
        </Box>
      </Card>
    </Box>
  )
}

export default memo(DiscoveryModeResultsCard)
