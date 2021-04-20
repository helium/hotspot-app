import React from 'react'
import { FlatList, Image } from 'react-native'
import { Device } from 'react-native-ble-plx'
import Box from './Box'
import Text from './Text'
import { DebouncedTouchableOpacityBox } from './TouchableOpacityBox'
import { useColors, useSpacing } from '../theme/themeHooks'
import CarotRight from '../assets/images/carot-right.svg'
import HeliumHotspot from '../assets/images/helium-hotspot.svg'

const imagesByHotspotName: Record<string, any> = {
  'Helium Hotspot': <HeliumHotspot />,
  'Rak Hotspot Miner': (
    <Image source={require('../assets/images/rak-miner.png')} />
  ),
  'Nebra Indoor Hotspot': (
    <Image source={require('../assets/images/nebra-indoor-hotspot.png')} />
  ),
  'Nebra Outdoor Hotspot': (
    <Image source={require('../assets/images/nebra-outdoor-hotspot.png')} />
  ),
  'Bobcat Miner 300': (
    <Image source={require('../assets/images/bobcat300.png')} />
  ),
  'SyncroB.it Hotspot': (
    <Image source={require('../assets/images/syncrobit-hotspot.png')} />
  ),
  'Finestra Miner': (
    <Image source={require('../assets/images/finestra-miner.png')} />
  ),
  'LongAP One': (
    <Image source={require('../assets/images/longap-one-hotspot.png')} />
  ),
}

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
  const { localName } = hotspot
  let name = hotspot.localName || 'Unknown Hotspot'
  let mac = ''
  if (localName) {
    const macSplit = localName.match(/\s[0-9A-F]{4,6}$/)
    if (macSplit) {
      name = localName.slice(0, macSplit.index)
      mac = localName.slice((macSplit.index || 0) + 1).replace(/..\B/g, '$&:')
    }
  }
  return (
    <DebouncedTouchableOpacityBox
      disabled={disabled}
      onPress={() => onPress(hotspot)}
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingVertical="s"
      paddingHorizontal="m"
      marginBottom="xxxs"
      borderTopLeftRadius={isTop ? 'm' : 'none'}
      borderTopRightRadius={isTop ? 'm' : 'none'}
      borderBottomLeftRadius={isBottom ? 'm' : 'none'}
      borderBottomRightRadius={isBottom ? 'm' : 'none'}
    >
      <Box marginLeft="n_s">
        {imagesByHotspotName[name] || <HeliumHotspot />}
      </Box>
      <Box flex={1}>
        <Text variant="body1" color="grayBlack">
          {name}
        </Text>
        <Text variant="body2Light" color="grayBlack">
          {mac}
        </Text>
      </Box>
      <CarotRight color={colors.grayLight} />
    </DebouncedTouchableOpacityBox>
  )
}

export default HotspotPairingList
