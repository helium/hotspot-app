import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { Validator } from '@helium/http'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Carousel from 'react-native-snap-carousel'
import Penalty from '@assets/images/penalty.svg'
import Heartbeat from '@assets/images/heartbeat.svg'
import Cooldown from '@assets/images/cooldown.svg'
import Data from '@assets/images/data.svg'
import VersionHeartbeat from '@assets/images/versionHeartbeat.svg'
import LocationMarker from '@assets/images/locationMarker.svg'
import Box from '../../components/Box'
import Text from '../../components/Text'
import HeliumSelect from '../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../components/HeliumSelectItem'
import { wh, wp } from '../../utils/layout'
import ConsensusBanner, { CONSENSUS_BANNER_HEIGHT } from './ConsensusBanner'
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar'
import ShareSheet from '../../components/ShareSheet'
import { useAppDispatch } from '../../store/store'
import {
  fetchElectedValidators,
  fetchWalletValidator,
} from '../../store/validators/validatorsSlice'
import { RootState } from '../../store/rootReducer'
import ValidatorDetailsOverview from './ValidatorDetailsOverview'
import { useSpacing } from '../../theme/themeHooks'
import { formatHeartbeatVersion, isUnstaked } from '../../utils/validatorUtils'
import FollowValidatorButton from '../../components/FollowValidatorButton'

export type HotspotSnapPoints = { collapsed: number; expanded: number }
type Props = {
  validator?: Validator
}
export const ViewOpts = ['overview', 'penalties', 'consensus_groups'] as const
export type ViewOpt = typeof ViewOpts[number]

const ValidatorDetails = ({ validator }: Props) => {
  const { t } = useTranslation()
  const { lm } = useSpacing()
  const { top } = useSafeAreaInsets()
  const dispatch = useAppDispatch()

  const electedValidators = useSelector(
    (state: RootState) => state.validators.electedValidators,
  )
  const walletValidator = useSelector(
    (state: RootState) =>
      state.validators.walletValidators[validator?.address || ''],
  )
  const carouselRef = useRef<Carousel<HeliumSelectItemType>>(null)

  const unstaked = useMemo(() => {
    if (!validator) return false
    return isUnstaked(validator)
  }, [validator])

  useEffect(() => {
    if (!validator) return
    dispatch(fetchElectedValidators())
    dispatch(fetchWalletValidator(validator.address))
  }, [dispatch, validator])

  const formattedHotspotName = useMemo(() => {
    if (!validator) return ''

    const name = animalName(validator.address)
    const pieces = name.split(' ')
    if (pieces.length < 3) return name

    return [`${pieces[0]} ${pieces[1]}`, pieces[2]]
  }, [validator])

  const selectData = useMemo(() => {
    return [
      {
        label: t('validator_details.overview'),
        value: 'overview' as ViewOpt,
        color: 'purpleBright',
      } as HeliumSelectItemType,
      {
        label: t('validator_details.penalties'),
        value: 'penalties' as ViewOpt,
        color: 'purpleBright',
      } as HeliumSelectItemType,
      {
        label: t('validator_details.consensus_groups'),
        value: 'consensus_groups' as ViewOpt,
        color: 'purpleBright',
      } as HeliumSelectItemType,
    ]
  }, [t])

  const [selectedOption, setSelectedOption] = useState(selectData[0].value)

  const handleSelectValueChanged = useCallback(
    (value: string | number, index: number) => {
      carouselRef.current?.snapToItem(index)
      setSelectedOption(value)
    },
    [],
  )

  const inConsensus = useMemo(() => {
    if (!validator) return false
    return !!electedValidators.data.find((v) => v.address === validator.address)
  }, [electedValidators.data, validator])

  const contentStyle = useMemo(() => {
    if (inConsensus) return {}

    return { marginTop: top + CONSENSUS_BANNER_HEIGHT }
  }, [inConsensus, top])

  type RenderItemProp = { item: HeliumSelectItemType }
  const renderItem = useCallback(
    ({ item }: RenderItemProp) => {
      switch (item.value as ViewOpt) {
        case 'overview':
          return (
            <ValidatorDetailsOverview
              validator={validator}
              visible={selectedOption === 'overview'}
            />
          )
        case 'penalties':
          return <Box height={330} margin="lm" backgroundColor="orange" />
        case 'consensus_groups':
          return <Box height={330} margin="lm" backgroundColor="yellow" />
      }
    },
    [selectedOption, validator],
  )

  const onSnapToItem = useCallback(
    (index: number) => {
      setSelectedOption(selectData[index].value)
    },
    [selectData],
  )

  const formattedVersionHeartbeat = useMemo(() => {
    if (!validator?.versionHeartbeat) return ''
    return formatHeartbeatVersion(validator.versionHeartbeat)
  }, [validator])

  const isOnline = useMemo(() => validator?.status?.online === 'online', [
    validator?.status?.online,
  ])

  const status = useMemo(
    () =>
      isOnline
        ? t('validator_details.status_online')
        : t('validator_details.status_offline'),
    [isOnline, t],
  )

  const location = useMemo(() => {
    if (!walletValidator?.geocode) {
      return ''
    }
    const {
      geocode: { city, countryCode, regionCode },
    } = walletValidator

    return [
      [city, regionCode, countryCode].filter((g) => !!g).join(', '),
      [regionCode, countryCode].filter((g) => !!g).join(', '),
    ]
  }, [walletValidator])

  return (
    <Box
      backgroundColor="white"
      top={validator ? 0 : wh}
      bottom={validator ? 0 : wh}
      left={0}
      right={0}
      position="absolute"
    >
      {validator && <FocusAwareStatusBar barStyle="dark-content" />}
      <ConsensusBanner visible={inConsensus} />
      <ScrollView>
        <Box style={contentStyle} backgroundColor="grayBoxLight">
          <Box padding="lm" backgroundColor="white">
            <Box flexDirection="row" alignItems="center" marginBottom="lm">
              <Box flexDirection="row" height={24} flex={1}>
                <Box
                  backgroundColor={isOnline ? 'greenOnline' : 'orangeDark'}
                  borderRadius="round"
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="center"
                  paddingHorizontal="s"
                >
                  <Text
                    variant="medium"
                    fontSize={13}
                    color="white"
                    maxFontSizeMultiplier={1.5}
                  >
                    {status}
                  </Text>
                </Box>
                <Box
                  backgroundColor="grayBoxLight"
                  borderRadius="round"
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="center"
                  paddingHorizontal="xs"
                  marginLeft="s"
                >
                  <VersionHeartbeat />
                  <Text
                    color="grayText"
                    marginLeft="xs"
                    maxFontSizeMultiplier={1.5}
                  >
                    {formattedVersionHeartbeat}
                  </Text>
                </Box>
                <Box
                  backgroundColor="grayBoxLight"
                  borderRadius="round"
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="center"
                  paddingHorizontal="xs"
                  marginLeft="s"
                >
                  <Heartbeat />
                  <Text
                    color="grayText"
                    marginLeft="xs"
                    maxFontSizeMultiplier={1.5}
                  >
                    {validator?.lastHeartbeat}
                  </Text>
                </Box>
                <Box
                  backgroundColor="grayBoxLight"
                  borderRadius="round"
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="center"
                  paddingHorizontal="xs"
                  marginLeft="s"
                >
                  <Penalty />
                  <Text
                    color="grayText"
                    marginLeft="xs"
                    maxFontSizeMultiplier={1.5}
                  >
                    {validator?.penalty?.toFixed(2)}
                  </Text>
                </Box>
                {unstaked && (
                  <Box
                    backgroundColor="purpleBox"
                    borderRadius="round"
                    alignItems="center"
                    flexDirection="row"
                    justifyContent="center"
                    paddingHorizontal="xs"
                    marginLeft="s"
                    height="100%"
                    aspectRatio={1}
                  >
                    <Cooldown height={12} width={12} />
                  </Box>
                )}
              </Box>
              <FollowValidatorButton address={validator?.address || ''} />
              <ShareSheet item={validator} />
            </Box>
            <Box marginBottom="lm">
              <Text
                variant="light"
                fontSize={29}
                lineHeight={31}
                color="black"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formattedHotspotName[0]}
              </Text>
              <Text
                variant="regular"
                fontSize={29}
                lineHeight={31}
                color="black"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formattedHotspotName[1]}
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center">
              <LocationMarker />
              <Text
                variant="regular"
                color="grayText"
                fontSize={13}
                marginLeft="xs"
                marginRight="m"
              >
                {location[0]}
              </Text>
              <Data />
              <Text
                variant="regular"
                color="grayText"
                fontSize={13}
                marginLeft="xs"
              >
                {location[1]}
              </Text>
            </Box>
          </Box>

          <Box
            justifyContent="flex-start"
            backgroundColor="grayBoxLight"
            paddingTop="m"
            minHeight={500}
          >
            <HeliumSelect
              flex={undefined}
              paddingHorizontal="lm"
              showGradient={false}
              backgroundColor="grayBoxLight"
              data={selectData}
              selectedValue={selectedOption}
              onValueChanged={handleSelectValueChanged}
              scrollEnabled={false}
            />

            <Carousel
              layout="default"
              ref={carouselRef}
              vertical={false}
              data={selectData}
              renderItem={renderItem}
              sliderWidth={wp(100)}
              itemWidth={wp(100) - lm * 2}
              onSnapToItem={onSnapToItem}
            />
          </Box>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default ValidatorDetails
