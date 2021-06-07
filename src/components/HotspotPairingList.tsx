import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { FlatList } from 'react-native'
import { Device } from 'react-native-ble-plx'
import Fuse from 'fuse.js'
import Hotspot from '@assets/images/hotspot.svg'
import Box from './Box'
import Text from './Text'
import { DebouncedTouchableHighlightBox } from './TouchableHighlightBox'
import { useColors, useSpacing } from '../theme/themeHooks'
import CarotRight from '../assets/images/carot-right.svg'
import { HotspotMakerModels, HotspotModelKeys } from '../makers/hotspots'

const HotspotPairingList = ({
  hotspots,
  onPress,
  disabled = false,
}: {
  hotspots: Device[]
  onPress: (hotspot: Device) => void
  disabled?: boolean
}) => {
  const spacing = useSpacing()
  return (
    <FlatList
      contentContainerStyle={{ paddingTop: spacing.lx }}
      data={hotspots}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <HotspotPairingItem
          hotspot={item}
          onPress={onPress}
          isTop={index === 0}
          isBottom={index === hotspots.length - 1}
          disabled={disabled}
        />
      )}
    />
  )
}

const HotspotPairingItem = ({
  hotspot,
  isTop = false,
  isBottom = false,
  onPress,
  disabled,
}: {
  hotspot: Device
  isTop?: boolean
  isBottom?: boolean
  onPress: (hotspot: Device) => void
  disabled: boolean
}) => {
  const colors = useColors()
  const [mac, setMac] = useState('')
  const [name, setName] = useState('')
  const [pressing, setPressing] = useState<boolean>()
  const svgColor = pressing ? colors.white : colors.blueGray

  const handlePressing = useCallback(
    (value: boolean) => () => setPressing(value),
    [],
  )

  const handlePress = useCallback(() => onPress(hotspot), [hotspot, onPress])

  useEffect(() => {
    const { localName } = hotspot
    let nextName = hotspot.localName || 'Unknown Hotspot'
    let nextMac = ''
    if (localName) {
      const macSplit = localName.match(/\s[0-9A-F]{4,6}$/)
      if (macSplit) {
        nextName = localName.slice(0, macSplit.index)
        nextMac = localName
          .slice((macSplit.index || 0) + 1)
          .replace(/..\B/g, '$&:')
      }
    }
    setMac(nextMac)
    setName(nextName)
  }, [hotspot])

  const HotspotImage = useMemo(() => {
    const hotspotArr = HotspotModelKeys.map((k) => HotspotMakerModels[k])
    const results = new Fuse(hotspotArr, {
      keys: ['name'],
      threshold: 0.3,
    }).search(name)

    let Icon = Hotspot
    if (results.length) {
      Icon = results[0].item.icon
    }

    return <Icon color={svgColor} height="100%" width="100%" />
  }, [name, svgColor])

  return (
    <DebouncedTouchableHighlightBox
      disabled={disabled}
      onPressIn={handlePressing(true)}
      onPressOut={handlePressing(false)}
      onPress={handlePress}
      backgroundColor="white"
      underlayColor={colors.purpleMain}
      flexDirection="row"
      alignItems="center"
      paddingVertical="s"
      paddingHorizontal="m"
      marginBottom="xxxs"
      borderTopLeftRadius={isTop ? 'm' : 'none'}
      borderTopRightRadius={isTop ? 'm' : 'none'}
      borderBottomLeftRadius={isBottom ? 'm' : 'none'}
      borderBottomRightRadius={isBottom ? 'm' : 'none'}
    >
      <>
        <Box height={34} width={34} marginRight="m">
          {HotspotImage}
        </Box>
        <Box flex={1}>
          <Text variant="body1" color={pressing ? 'white' : 'blueGray'}>
            {name}
          </Text>
          <Text variant="body2Light" color={pressing ? 'white' : 'blueGray'}>
            {mac}
          </Text>
        </Box>
        <CarotRight color={colors.grayLight} />
      </>
    </DebouncedTouchableHighlightBox>
  )
}

export default HotspotPairingList
