import React, { memo, useMemo } from 'react'
import FiltersDefault from '../../assets/images/filters-default.svg'
import FiltersRewards from '../../assets/images/filters-rewards.svg'
import FiltersWitness from '../../assets/images/filters-witness.svg'
import FiltersEarnings from '../../assets/images/filters-earnings.svg'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'

export enum MapFilters {
  owned,
  reward,
  witness,
  earnings,
}

const MapFiltersButton = ({
  mapFilter,
  onPressMapFilter = () => {},
  pressable = true,
  height = 46,
  width = 46,
  iconHeight = 24,
  iconWidth = 26,
}: {
  mapFilter: MapFilters
  onPressMapFilter?: () => void
  pressable?: boolean
  height?: number
  width?: number
  iconHeight?: number
  iconWidth?: number
}) => {
  const icon = useMemo(() => {
    switch (mapFilter) {
      default:
      case MapFilters.owned:
        return <FiltersDefault height={iconHeight} width={iconWidth} />
      case MapFilters.reward:
        return <FiltersRewards height={iconHeight} width={iconWidth} />
      case MapFilters.witness:
        return <FiltersWitness height={iconHeight} width={iconWidth} />
      case MapFilters.earnings:
        return <FiltersEarnings height={iconHeight} width={iconWidth} />
    }
  }, [iconHeight, iconWidth, mapFilter])
  return (
    <TouchableOpacityBox
      disabled={!pressable}
      backgroundColor="white"
      borderRadius="round"
      height={height}
      width={width}
      justifyContent="center"
      alignItems="center"
      onPress={onPressMapFilter}
    >
      {icon}
    </TouchableOpacityBox>
  )
}

export default memo(MapFiltersButton)
