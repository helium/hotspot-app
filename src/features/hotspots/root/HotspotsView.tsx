import React, { useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { Hotspot } from '@helium/http'
import BottomSheet from 'react-native-holy-sheet/src/index'
import Carousel from 'react-native-snap-carousel'
import animalName from 'angry-purple-tiger'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Search from '../../../assets/images/search.svg'
import Add from '../../../assets/images/add.svg'
import CheckCircle from '../../../assets/images/check-circle.svg'
import { hp, wp } from '../../../utils/layout'
import CircleProgress from '../../../components/CircleProgress'
import { getHotspotRewards } from '../../../utils/appDataClient'

type Props = {
  ownedHotspots: Hotspot[]
}

const getTimeOfDay = (date: Date) => {
  const hours = date.getHours()
  if (hours >= 4 && hours < 12) {
    return 'Morning'
  }
  if (hours >= 17 || hours < 4) {
    return 'Evening'
  }
  return 'Afternoon'
}

type HotspotsCarouselProps = {
  hotspots: Hotspot[]
  rewards: any
}

type HotspotsItemProps = {
  hotspot: Hotspot
  rewards: any
}

const HotspotItem = ({
  hotspot,
  rewards = { total: 0 },
}: HotspotsItemProps) => {
  return (
    <Box
      backgroundColor="grayBox"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="m"
      borderRadius="m"
      marginStart="l"
      height={75}
    >
      <Box flexDirection="column">
        <Box flexDirection="row">
          <CheckCircle width={17} height={17} />
          <Text variant="body2" color="black" fontWeight="500" paddingStart="s">
            {animalName(hotspot.address)}
          </Text>
        </Box>
        <Text variant="body2" color="purpleMain" paddingTop="s">
          {`+${rewards.total.toFixed(2)} HNT`}
        </Text>
      </Box>
      <CircleProgress percentage={50} centerColor="#F6F7FE" />
    </Box>
  )
}

const HotspotsCarousel = ({ hotspots, rewards }: HotspotsCarouselProps) => {
  const renderItem = ({ item }: { item: Hotspot }) => (
    <HotspotItem hotspot={item} rewards={rewards[item.address]} />
  )

  return (
    <Box>
      <Text
        variant="body1"
        color="black"
        fontWeight="600"
        paddingBottom="m"
        paddingStart="l"
      >
        Your Hotspots
      </Text>
      <Carousel
        layout="default"
        activeSlideAlignment="start"
        vertical={false}
        data={hotspots}
        renderItem={renderItem}
        sliderWidth={wp(100)}
        itemWidth={wp(75)}
        inactiveSlideScale={1}
        onSnapToItem={(i) => console.log(i)}
      />
    </Box>
  )
}

const HotspotsView = ({ ownedHotspots }: Props) => {
  const [date, setDate] = useState(new Date())
  useEffect(() => {
    const dateTimer = setInterval(() => setDate(new Date()), 300000) // update every 5 min
    return () => clearInterval(dateTimer)
  })

  const [hotspotRewards, setHotspotRewards] = useState({})
  const [totalRewards, setTotalRewards] = useState(0)
  useEffect(() => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    ownedHotspots.forEach(async (hotspot) => {
      hotspotRewards[hotspot.address] = await getHotspotRewards(
        hotspot.address,
        yesterday,
        today,
      )
      setHotspotRewards(hotspotRewards)
      setTotalRewards(totalRewards)
    })
  }, [ownedHotspots])

  return (
    <Box flex={1} flexDirection="column" justifyContent="space-between">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="primaryBackground"
        paddingHorizontal="m"
      >
        <Text variant="header" fontSize={22}>
          My Hotspots
        </Text>

        <Box flexDirection="row" justifyContent="space-between">
          <TouchableOpacityBox onPress={() => {}} padding="s">
            <Search width={22} height={22} />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={() => {}} padding="s">
            <Add width={22} height={22} />
          </TouchableOpacityBox>
        </Box>
      </Box>

      <Box padding="l" style={{ marginBottom: hp(40) }}>
        <Text variant="header">{`Good\n${getTimeOfDay(date)}.`}</Text>
        <Text variant="body1" paddingTop="m">
          {`Your ${ownedHotspots.length} Hotspots mined ${totalRewards.toFixed(
            2,
          )} HNT in the past 24 hours.`}
        </Text>
      </Box>

      <BottomSheet
        containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
        snapPoints={[40, hp(40), hp(75)]}
        initialSnapIndex={1}
        flatListProps={{
          data: [ownedHotspots],
          keyExtractor: (item: Hotspot[]) => item[0].address,
          renderItem: ({ item }: { item: Hotspot[] }) => (
            <HotspotsCarousel hotspots={item} rewards={hotspotRewards} />
          ),
        }}
      />
    </Box>
  )
}

export default HotspotsView
