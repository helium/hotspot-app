import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { startCase } from 'lodash'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import animateTransition from '../../../../utils/animateTransition'
import BlurBox from '../../../../components/BlurBox'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import Close from '../../../../assets/images/closeModal.svg'
import RewardScaleIco from '../../../../assets/images/rewardsScale.svg'
import FollowButton from '../../../../components/FollowButton'

type Props = {
  address?: string
  rewardScale?: number
  name?: string
  hideOverlay: () => void
}
const FOLLOW_CHANGE_DURATION = 2000
const DiscoveryModeResultsCardItem = ({
  hideOverlay,
  address,
  rewardScale,
  name,
}: Props) => {
  const { t } = useTranslation()
  const [followChanged, setFollowChanged] = useState<'follow' | 'unfollow'>()

  const handleFollowChange = useCallback((following) => {
    animateTransition('DiscoveryModeResultsCard.HandleFollowChange')
    setFollowChanged(following ? 'follow' : 'unfollow')

    setTimeout(() => {
      animateTransition('DiscoveryModeResultsCard.HandleFollowChange.Timeout')
      setFollowChanged(undefined)
    }, FOLLOW_CHANGE_DURATION)
  }, [])

  if (!address) return null
  return (
    <Box alignItems="center" paddingHorizontal="ms">
      {followChanged && (
        <Box
          justifyContent="center"
          backgroundColor="black"
          borderRadius="round"
          height={32}
          position="absolute"
          top={-40}
          marginBottom="ms"
        >
          <Text
            variant="medium"
            paddingHorizontal="ms"
            fontSize={14}
            color="white"
            textAlign="center"
          >
            {t(
              followChanged === 'follow'
                ? 'discovery.results.added_to_followed'
                : 'discovery.results.removed_from_followed',
            )}
          </Text>
        </Box>
      )}
      <Box
        marginBottom="s"
        borderRadius="l"
        overflow="hidden"
        alignItems="center"
        marginHorizontal="ms"
        flexDirection="row"
        width="100%"
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
        <FollowButton
          address={address}
          padding="m"
          duration={FOLLOW_CHANGE_DURATION}
          handleChange={handleFollowChange}
        />
        <RewardScaleIco />
        <Text
          variant="regular"
          fontSize={11}
          color="white"
          marginLeft="xs"
          paddingRight="m"
        >
          {rewardScale?.toFixed(2)}
        </Text>
        <Text
          variant="medium"
          fontSize={16}
          color="white"
          numberOfLines={1}
          adjustsFontSizeToFit
          flex={1}
        >
          {startCase(name)}
        </Text>
        <TouchableOpacityBox padding="m" onPress={hideOverlay}>
          <Close height={22} width={22} color="white" opacity={0.6} />
        </TouchableOpacityBox>
      </Box>
    </Box>
  )
}

export default memo(DiscoveryModeResultsCardItem)
