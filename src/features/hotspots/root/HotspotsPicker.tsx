import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import NewestHotspot from '@assets/images/newestHotspot.svg'
import NearestHotspot from '@assets/images/nearestHotspot.svg'
import OfflineHotspot from '@assets/images/offlineHotspot.svg'
import FollowedHotspot from '@assets/images/follow.svg'
import TopHotspot from '@assets/images/topHotspot.svg'
import Box from '../../../components/Box'
import hotspotsSlice, {
  HotspotSort,
} from '../../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../../store/store'
import { RootState } from '../../../store/rootReducer'
import usePrevious from '../../../utils/usePrevious'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import useGetLocation from '../../../utils/useGetLocation'
import { useSpacing } from '../../../theme/themeHooks'
import useVisible from '../../../utils/useVisible'
import useMount from '../../../utils/useMount'

type Props = { visible: boolean }
const HotspotsPicker = ({ visible }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const spacing = useSpacing()
  const maybeGetLocation = useGetLocation()
  const fleetModeEnabled = useSelector(
    (state: RootState) => state.account.settings.isFleetModeEnabled,
  )
  const order = useSelector((state: RootState) => state.hotspots.order)

  const { currentLocation, locationBlocked } = useSelector(
    (state: RootState) => state.location,
  )
  const prevOrder = usePrevious(order)

  const locationDeniedHandler = useCallback(() => {
    dispatch(hotspotsSlice.actions.changeFilter(HotspotSort.New))
  }, [dispatch])

  useMount(() => {
    if (!fleetModeEnabled) {
      // On mount if fleet mode is off, default to New filter
      dispatch(hotspotsSlice.actions.changeFilter(HotspotSort.New))
    }
  })

  useVisible({
    onAppear: () => {
      // if fleet mode is on and they're on the new filter, bring them to followed when this view appears
      if (fleetModeEnabled && order === HotspotSort.New) {
        dispatch(hotspotsSlice.actions.changeFilter(HotspotSort.Followed))
      }
    },
  })

  useVisible({
    onAppear: () => {
      maybeGetLocation(false, locationDeniedHandler)
      dispatch(hotspotsSlice.actions.changeFilterData(currentLocation))
    },
  })

  useEffect(() => {
    if (!visible) return

    dispatch(hotspotsSlice.actions.changeFilterData(currentLocation))
  }, [currentLocation, dispatch, visible])

  useEffect(() => {
    if (
      currentLocation ||
      order !== HotspotSort.Near ||
      prevOrder === HotspotSort.Near
    )
      return

    // They've switched to Nearest filter and we don't have a location
    maybeGetLocation(true, locationDeniedHandler)
  }, [
    currentLocation,
    locationDeniedHandler,
    maybeGetLocation,
    order,
    prevOrder,
  ])

  useEffect(() => {
    dispatch(hotspotsSlice.actions.changeFilterData(currentLocation))
  }, [currentLocation, dispatch, order])

  const handleValueChanged = useCallback(
    async (newOrder) => {
      dispatch(hotspotsSlice.actions.changeFilter(newOrder))
    },
    [dispatch],
  )

  const data = useMemo(() => {
    const opts: HeliumSelectItemType[] = []
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.New}`),
      value: HotspotSort.New,
      Icon: NewestHotspot,
      color: 'purpleMain',
    })
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.Followed}`),
      value: HotspotSort.Followed,
      Icon: FollowedHotspot,
      color: 'purpleBright',
    })
    if (!locationBlocked) {
      opts.push({
        label: t(`hotspots.owned.filter.${HotspotSort.Near}`),
        value: HotspotSort.Near,
        Icon: NearestHotspot,
        color: 'purpleMain',
      })
    }
    if (!fleetModeEnabled) {
      opts.push({
        label: t(`hotspots.owned.filter.${HotspotSort.Earn}`),
        value: HotspotSort.Earn,
        Icon: TopHotspot,
        color: 'purpleMain',
      })
    }
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.Offline}`),
      value: HotspotSort.Offline,
      Icon: OfflineHotspot,
      color: 'purpleMain',
    })
    return opts
  }, [fleetModeEnabled, locationBlocked, t])

  const contentContainerStyle = useMemo(
    () => ({ paddingHorizontal: spacing.l }),
    [spacing.l],
  )

  return (
    <Box flexDirection="row" alignItems="center" width="100%">
      <HeliumSelect
        contentContainerStyle={contentContainerStyle}
        marginBottom="lm"
        data={data}
        selectedValue={order}
        onValueChanged={handleValueChanged}
        marginVertical="s"
      />
    </Box>
  )
}

export default memo(HotspotsPicker)
