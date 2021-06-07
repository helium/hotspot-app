import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { addSeconds } from 'date-fns'
import { Hotspot } from '@helium/http'
import HexPill from '@assets/images/hexPill.svg'
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
import ContentPill, {
  ContentPillItem,
} from '../../../../components/ContentPill'
import usePrevious from '../../../../utils/usePrevious'

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
  selectedHotspots?: Hotspot[]
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
  const prevSelectedHotspots = usePrevious(selectedHotspots)
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState(0)
  useEffect(() => {
    if (prevSelectedHotspots === selectedHotspots) return
    setSelectedHotspotIndex(0)
  }, [prevSelectedHotspots, selectedHotspots])

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

  const pillData = useMemo(() => {
    if (!selectedHotspots?.length) return [] as ContentPillItem[]

    return selectedHotspots.map((h) => {
      const isResponder = responses.find((r) => r.hotspotAddress === h.address)
      return {
        selectedBackgroundColor: isResponder ? 'yellow' : 'blueGrayLight',
        selectedIconColor: 'white',
        iconColor: isResponder ? 'yellow' : 'blueGrayLight',
        icon: HexPill,
        id: h.address,
      } as ContentPillItem
    })
  }, [responses, selectedHotspots])

  const currentHotspot = useMemo(() => {
    if (
      !selectedHotspots ||
      selectedHotspots.length === 0 ||
      selectedHotspotIndex >= selectedHotspots.length
    )
      return

    return selectedHotspots[selectedHotspotIndex]
  }, [selectedHotspotIndex, selectedHotspots])

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      minHeight={410}
      justifyContent="flex-end"
    >
      {!!selectedHotspots?.length && (
        <ContentPill
          selectedIndex={selectedHotspotIndex}
          data={pillData}
          marginStart={selectedHotspots.length > 1 ? undefined : 'n_xxl'}
          onPressItem={setSelectedHotspotIndex}
          marginBottom="lx"
          maxWidth={wp(90)}
        />
      )}

      <DiscoveryModeResultsCardItem
        address={currentHotspot?.address}
        rewardScale={currentHotspot?.rewardScale}
        name={currentHotspot?.name}
        hideOverlay={hideOverlay}
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
