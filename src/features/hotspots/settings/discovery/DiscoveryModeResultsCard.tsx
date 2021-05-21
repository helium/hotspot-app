import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { addSeconds } from 'date-fns'
import { Hotspot } from '@helium/http'
import Carousel from 'react-native-snap-carousel'
import Box from '../../../../components/Box'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import Text from '../../../../components/Text'
import {
  DiscoveryRequest,
  DiscoveryResponse,
} from '../../../../store/discovery/discoveryTypes'
import animateTransition from '../../../../utils/animateTransition'
import DiscoveryModeSearching from './DiscoveryModeSearching'
import useShareDiscovery from './useShareDiscovery'
import DateModule from '../../../../utils/DateModule'
import { wp } from '../../../../utils/layout'
import DiscoveryModeResultsCardItem from './DiscoveryModeResultsCardItem'

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
  responses: DiscoveryResponse[]
  requestTime: number
  currentTime: number
  requestLength: number
}
const DiscoveryModeResultsCard = ({
  request,
  isPolling,
  selectedHotspots,
  responses,
  hideOverlay,
  requestTime,
  currentTime,
  requestLength,
}: Props) => {
  const { t } = useTranslation()
  const { shareResults } = useShareDiscovery(request)
  const [resultDateStr, setResultDateStr] = useState('')

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
        value: `${responses.length}`,
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
    request,
    requestLength,
    requestTime,
    responses.length,
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

  const carouselData = useMemo(() => {
    return selectedHotspots
  }, [selectedHotspots])

  type CarouselItem = { item: Hotspot }
  const renderItem = useCallback(
    ({ item }: CarouselItem) => {
      return (
        <DiscoveryModeResultsCardItem
          address={item.address}
          rewardScale={item.rewardScale}
          name={item.name}
          distance={6969}
          hideOverlay={hideOverlay}
        />
      )
    },
    [hideOverlay],
  )

  return (
    <Box position="absolute" bottom={0} left={0} right={0} minHeight={210}>
      <Carousel
        layout="default"
        vertical={false}
        data={carouselData}
        renderItem={renderItem}
        sliderWidth={wp(100)}
        itemWidth={wp(100)}
        inactiveSlideScale={1}
      />

      {isPolling && <DiscoveryModeSearching />}
      <Card
        marginHorizontal="ms"
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
      </Card>
    </Box>
  )
}

export default memo(DiscoveryModeResultsCard)
