import React, { memo, useCallback, useMemo, useState } from 'react'
import { Modal, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import CloseModal from '@assets/images/closeModal.svg'
import MapHex from '@assets/images/map-hex.svg'
import Checkmark from '@assets/images/checkmark.svg'
import Lightbulb from '@assets/images/lightbulb.svg'
import RewardScaling from '@assets/images/reward-scaling.svg'
import EarningsScaling from '@assets/images/earnings-scale.svg'
import { useTranslation } from 'react-i18next'
import MapFiltersButton, { MapFilters } from './MapFiltersButton'
import { useAppDispatch } from '../../store/store'
import { RootState } from '../../store/rootReducer'
import hotspotDetailsSlice from '../../store/hotspotDetails/hotspotDetailsSlice'
import BlurBox from '../../components/BlurBox'
import SafeAreaBox from '../../components/SafeAreaBox'
import Box from '../../components/Box'
import Text from '../../components/Text'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import Button from '../../components/Button'
import animateTransition from '../../utils/animateTransition'
import { useColors } from '../../theme/themeHooks'
import { fetchNetworkHotspotEarnings } from '../../store/rewards/rewardsSlice'
import useMount from '../../utils/useMount'
import { locale } from '../../utils/i18n'

type Props = {
  mapFilter: MapFilters
  onChangeMapFilter: (filter: MapFilters) => void
}

const MapFilterModal = ({ mapFilter, onChangeMapFilter }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const colors = useColors()
  const { showMapFilter } = useSelector(
    (state: RootState) => state.hotspotDetails,
  )
  const networkHotspotEarnings = useSelector(
    (state: RootState) => state.rewards.networkHotspotEarnings.data,
  )
  const [selectedFilter, setSelectedFilter] = useState(mapFilter)

  useMount(() => {
    dispatch(fetchNetworkHotspotEarnings())
  })

  const avg7dEarnings = useMemo(() => {
    if (networkHotspotEarnings.length === 0) return
    const latest7dayEarnings = networkHotspotEarnings?.slice(-7) || []
    const sum = latest7dayEarnings.reduce((a, b) => a + (b.avg_rewards || 0), 0)
    return sum / latest7dayEarnings.length
  }, [networkHotspotEarnings])

  const handleClose = useCallback(() => {
    setSelectedFilter(mapFilter)
    dispatch(hotspotDetailsSlice.actions.toggleShowMapFilter())
  }, [dispatch, mapFilter])

  const onChooseFilter = () => {
    dispatch(hotspotDetailsSlice.actions.toggleShowMapFilter())
    onChangeMapFilter(selectedFilter)
  }

  const handlePress = useCallback(
    (filter: MapFilters) => () => {
      animateTransition('MapFilterModal.filterChange')
      setSelectedFilter(filter)
    },
    [],
  )

  const YourHotspots = useCallback(() => {
    const selected = selectedFilter === MapFilters.owned
    return (
      <TouchableOpacityBox
        disabled={selected}
        onPress={handlePress(MapFilters.owned)}
        backgroundColor={selected ? 'white' : 'whiteTransparent75'}
        borderRadius="m"
        padding="m"
      >
        <Box flexDirection="row" justifyContent="space-between">
          <Box flex={1}>
            <Text variant="h5" color="black" maxFontSizeMultiplier={1.3}>
              {t('map_filter.your_hotspots.title')}
            </Text>
            <Text color="grayText" maxFontSizeMultiplier={1.3}>
              {t('map_filter.your_hotspots.body')}
            </Text>
          </Box>
          <Box visible={selected}>
            <Checkmark color={colors.blueBright} />
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="center"
          marginTop="m"
          paddingVertical="m"
          borderRadius="m"
          backgroundColor="grayBox"
          visible={selected}
        >
          <Box
            justifyContent="center"
            alignItems="center"
            paddingHorizontal="m"
          >
            <MapHex color="#A667F6" />
            <Text paddingTop="xs" maxFontSizeMultiplier={1.3}>
              {t('map_filter.your_hotspots.followed')}
            </Text>
          </Box>
          <Box
            alignItems="center"
            justifyContent="center"
            paddingHorizontal="m"
          >
            <MapHex color="#1D91F8" />
            <Text paddingTop="xs" maxFontSizeMultiplier={1.3}>
              {t('map_filter.your_hotspots.owned')}
            </Text>
          </Box>
        </Box>
      </TouchableOpacityBox>
    )
  }, [colors.blueBright, handlePress, selectedFilter, t])

  const Witnesses = useCallback(() => {
    const selected = selectedFilter === MapFilters.witness
    return (
      <TouchableOpacityBox
        disabled={selected}
        onPress={handlePress(MapFilters.witness)}
        backgroundColor={selected ? 'white' : 'whiteTransparent75'}
        borderRadius="m"
        padding="m"
        marginVertical="s"
      >
        <Box flexDirection="row" justifyContent="space-between">
          <Box>
            <Text variant="h5" color="black" maxFontSizeMultiplier={1.3}>
              {t('map_filter.witness.title')}
            </Text>
            <Text color="grayText" maxFontSizeMultiplier={1.3}>
              {t('map_filter.witness.body')}
            </Text>
          </Box>
          <Box visible={selected}>
            <Checkmark color={colors.yellow} />
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="center"
          marginTop="m"
          paddingVertical="m"
          borderRadius="m"
          backgroundColor="grayBox"
          visible={selected}
        >
          <Box
            justifyContent="center"
            alignItems="center"
            paddingHorizontal="m"
          >
            <MapHex color="#FCC945" />
            <Text paddingTop="xs" maxFontSizeMultiplier={1.3}>
              {t('generic.witness')}
            </Text>
          </Box>
          <Box justifyContent="center" paddingHorizontal="m" width="60%">
            <Box flexDirection="row" alignItems="center">
              <Lightbulb color="black" />
              <Text
                variant="bold"
                color="black"
                fontSize={13}
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                adjustsFontSizeToFit
                paddingLeft="xs"
              >
                {t('map_filter.witness.desc_title')}
              </Text>
            </Box>
            <Text
              color="grayText"
              fontSize={12}
              maxFontSizeMultiplier={1.3}
              paddingTop="xs"
            >
              {t('map_filter.witness.desc_body')}
            </Text>
          </Box>
        </Box>
      </TouchableOpacityBox>
    )
  }, [colors.yellow, handlePress, selectedFilter, t])

  const Rewards = useCallback(() => {
    const selected = selectedFilter === MapFilters.reward
    return (
      <TouchableOpacityBox
        disabled={selected}
        onPress={handlePress(MapFilters.reward)}
        backgroundColor={selected ? 'white' : 'whiteTransparent75'}
        borderRadius="m"
        padding="m"
        marginBottom="s"
      >
        <Box flexDirection="row" justifyContent="space-between">
          <Box flex={1}>
            <Text variant="h5" color="black" maxFontSizeMultiplier={1.3}>
              {t('map_filter.reward.title')}
            </Text>
            <Text
              color="grayText"
              maxFontSizeMultiplier={1.3}
              numberOfLines={selected ? undefined : 1}
            >
              {t('map_filter.reward.body')}
            </Text>
          </Box>
          <Box visible={selected}>
            <Checkmark color={colors.greenOnline} />
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="center"
          marginTop="m"
          paddingVertical="m"
          borderRadius="m"
          backgroundColor="grayBox"
          visible={selected}
        >
          <RewardScaling width="90%" />
        </Box>
      </TouchableOpacityBox>
    )
  }, [colors.greenOnline, handlePress, selectedFilter, t])

  const Earnings = useCallback(() => {
    const selected = selectedFilter === MapFilters.earnings
    return (
      <TouchableOpacityBox
        disabled={selected}
        onPress={handlePress(MapFilters.earnings)}
        backgroundColor={selected ? 'white' : 'whiteTransparent75'}
        borderRadius="m"
        padding="m"
      >
        <Box flexDirection="row" justifyContent="space-between">
          <Box flex={1}>
            <Text variant="h5" color="black" maxFontSizeMultiplier={1.3}>
              {t('map_filter.earnings.title')}
            </Text>
            <Text
              color="grayText"
              maxFontSizeMultiplier={1.3}
              numberOfLines={selected ? undefined : 1}
            >
              {t('map_filter.earnings.body')}
            </Text>
          </Box>
          <Box visible={selected}>
            <Checkmark color={colors.blueBrightEarnings} />
          </Box>
        </Box>
        <Box
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginTop="m"
          paddingVertical="m"
          borderRadius="m"
          backgroundColor="grayBox"
          visible={selected}
        >
          <EarningsScaling width="90%" />
          <Box
            flexDirection="row"
            width="100%"
            justifyContent="space-between"
            paddingLeft="lx"
            paddingRight="m"
            paddingTop="s"
          >
            <Text variant="bold" color="grayDarkText">
              0
            </Text>
            <Text variant="bold" color="grayDarkText" paddingLeft="m">
              {`${avg7dEarnings?.toLocaleString(locale, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })} (Avg)`}
            </Text>
            <Text variant="bold" color="grayDarkText">
              {avg7dEarnings === undefined
                ? ''
                : `${(avg7dEarnings * 2).toLocaleString(locale, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}+`}
            </Text>
          </Box>
        </Box>
      </TouchableOpacityBox>
    )
  }, [avg7dEarnings, colors.blueBrightEarnings, handlePress, selectedFilter, t])

  const buttonColor = useMemo(() => {
    switch (selectedFilter) {
      default:
      case MapFilters.owned:
        return 'purpleMain'
      case MapFilters.witness:
        return 'yellow'
      case MapFilters.reward:
        return 'greenOnline'
      case MapFilters.earnings:
        return 'blueBrightEarnings'
    }
  }, [selectedFilter])

  const buttonTextStyle = useMemo(() => ({ color: '#FFFFFF' }), [])

  return (
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={showMapFilter}
      onRequestClose={handleClose}
      animationType="fade"
    >
      <BlurBox
        top={0}
        left={0}
        bottom={0}
        right={0}
        blurAmount={70}
        blurType="dark"
        position="absolute"
      />

      <SafeAreaBox flex={1} flexDirection="column" marginBottom="m">
        <Box
          flexDirection="row-reverse"
          justifyContent="space-between"
          alignItems="center"
        >
          <TouchableOpacityBox
            height={22}
            padding="l"
            alignItems="flex-end"
            justifyContent="center"
            onPress={handleClose}
          >
            <CloseModal color="white" />
          </TouchableOpacityBox>
        </Box>
        <Box justifyContent="center" alignItems="center">
          <MapFiltersButton
            mapFilter={selectedFilter}
            pressable={false}
            height={70}
            width={70}
            iconHeight={38}
            iconWidth={34}
          />
          <Text variant="h2" paddingVertical="m" maxFontSizeMultiplier={1.1}>
            {t('map_filter.title')}
          </Text>
        </Box>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <Box padding="m">
            <YourHotspots />
            <Witnesses />
            <Rewards />
            <Earnings />
          </Box>
        </ScrollView>
        <Button
          marginTop="m"
          marginHorizontal="m"
          onPress={onChooseFilter}
          mode="contained"
          height={67}
          title={t('map_filter.button')}
          backgroundColor={buttonColor}
          textStyle={buttonTextStyle}
        />
      </SafeAreaBox>
    </Modal>
  )
}

export default memo(MapFilterModal)
