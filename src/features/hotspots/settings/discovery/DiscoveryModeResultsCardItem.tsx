import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import animateTransition from '../../../../utils/animateTransition'
import BlurBox from '../../../../components/BlurBox'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import Close from '../../../../assets/images/closeModal.svg'
import DistancePinIco from '../../../../assets/images/distancePin.svg'
import RewardScaleIco from '../../../../assets/images/rewardsScale.svg'
import FollowButton from '../../../../components/FollowButton'

type Props = {
  address: string
  rewardScale: string
  name: string
  distance: number
  hideOverlay: () => void
}
const DiscoveryModeResultsCardItem = ({
  hideOverlay,
  address,
  rewardScale,
  distance,
  name,
}: Props) => {
  const { t } = useTranslation()
  const [newlyAdded, setNewlyAdded] = useState(false)

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
              address={address}
              padding="m"
              handleChange={handleFollowChange}
            />
            <Text variant="medium" fontSize={16} color="white">
              {name}
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
              {rewardScale}
            </Text>
            <DistancePinIco />
            <Text variant="regular" fontSize={11} color="white" marginLeft="xs">
              {distance}
            </Text>
          </Box>
        </Box>
        <TouchableOpacityBox padding="m" onPress={hideOverlay}>
          <Close height={22} width={22} color="white" opacity={0.6} />
        </TouchableOpacityBox>
      </Box>
    </Box>
  )
}

export default memo(DiscoveryModeResultsCardItem)
