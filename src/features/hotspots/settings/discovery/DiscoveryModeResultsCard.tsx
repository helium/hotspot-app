import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { addMinutes } from 'date-fns/esm'
import Box from '../../../../components/Box'
import Button from '../../../../components/Button'
import Card from '../../../../components/Card'
import { MapSelectDetail } from './DiscoveryMap'
import Text from '../../../../components/Text'
import {
  DiscoveryRequest,
  DISCOVERY_DURATION_MINUTES,
} from '../../../../store/discovery/discoveryTypes'
import animateTransition from '../../../../utils/animateTransition'
import DiscoveryModeSearching from './DiscoveryModeSearching'
import BlurBox from '../../../../components/BlurBox'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import Close from '../../../../assets/images/closeModal.svg'
import DistancePinIco from '../../../../assets/images/distancePin.svg'
import RewardScaleIco from '../../../../assets/images/rewardsScale.svg'
import useShareDiscovery from './useShareDiscovery'
import DateModule from '../../../../utils/DateModule'
import FollowButton from '../../../../components/FollowButton'

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
  overlayDetails?: {
    distance: string
    rewardScale: string
  } & MapSelectDetail
  hideOverlay: () => void
  numResponses: number
  requestTime: number
  currentTime: number
}
const DiscoveryModeResultsCard = ({
  request,
  isPolling,
  overlayDetails,
  numResponses,
  hideOverlay,
  requestTime,
  currentTime,
}: Props) => {
  const { t } = useTranslation()
  const { shareResults } = useShareDiscovery(request)
  const [resultDateStr, setResultDateStr] = useState('')
  const [newlyAdded, setNewlyAdded] = useState(false)

  useMemo(async () => {
    if (isPolling || !request) return

    const date = new Date(request.insertedAt)
    const resultDate = addMinutes(date, DISCOVERY_DURATION_MINUTES)
    const formatted = await DateModule.formatDate(
      resultDate.toISOString(),
      'MMMM d h:mma',
    )
    setResultDateStr(formatted)
  }, [isPolling, request])

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
      const minutes = Math.floor(seconds / 60)
      if (seconds >= 0) {
        if (minutes >= DISCOVERY_DURATION_MINUTES) {
          elapsed = `${DISCOVERY_DURATION_MINUTES}:00`
        } else {
          elapsed = `${minutes}:${String(
            Math.floor(seconds - minutes * 60),
          ).padStart(2, '0')}`
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

    animateTransition('DiscoveryModeResultsCard.Results')
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

  const handleFollowChange = useCallback((following) => {
    if (!following) return

    animateTransition('DiscoveryModeResultsCard.HandleFollowChange')
    setNewlyAdded(true)

    setTimeout(() => {
      animateTransition('DiscoveryModeResultsCard.HandleFollowChange.Timeout')
      setNewlyAdded(false)
    }, 3000)
  }, [])

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      minHeight={210}
      marginHorizontal="ms"
    >
      {overlayDetails && (
        <Box alignItems="center">
          {newlyAdded && (
            <Box
              justifyContent="center"
              backgroundColor="black"
              borderRadius="round"
              height={32}
              marginBottom="ms"
            >
              <Text
                variant="medium"
                paddingHorizontal="ms"
                fontSize={14}
                color="white"
                textAlign="center"
              >
                {t('discovery.results.added_to_followed')}
              </Text>
            </Box>
          )}
          <Box
            marginBottom="s"
            borderRadius="l"
            overflow="hidden"
            alignItems="center"
            flexDirection="row"
          >
            <BlurBox
              top={0}
              left={0}
              bottom={0}
              right={0}
              blurType={Platform.OS === 'android' ? 'dark' : 'light'}
              opacity={0.6}
              position="absolute"
            />
            <Box flex={1} marginBottom="m">
              <Box
                flex={1}
                flexDirection="row"
                alignItems="center"
                marginBottom="n_m"
              >
                <FollowButton
                  address={overlayDetails.address}
                  padding="m"
                  handleChange={handleFollowChange}
                />
                <Text variant="medium" fontSize={16} color="white">
                  {overlayDetails.name}
                </Text>
              </Box>
              <Box
                flex={1}
                flexDirection="row"
                alignItems="center"
                paddingTop="s"
                paddingLeft="m"
              >
                <RewardScaleIco />
                <Text
                  variant="regular"
                  fontSize={11}
                  width={48}
                  color="white"
                  marginLeft="xs"
                >
                  {overlayDetails.rewardScale}
                </Text>
                <DistancePinIco />
                <Text
                  variant="regular"
                  fontSize={11}
                  color="white"
                  marginLeft="xs"
                >
                  {overlayDetails.distance}
                </Text>
              </Box>
            </Box>
            <TouchableOpacityBox padding="m" onPress={hideOverlay}>
              <Close height={22} width={22} color="white" opacity={0.6} />
            </TouchableOpacityBox>
          </Box>
        </Box>
      )}
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
      </Card>
    </Box>
  )
}

export default memo(DiscoveryModeResultsCard)
