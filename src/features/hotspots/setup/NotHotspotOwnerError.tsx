import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { startCase } from 'lodash'
import Follow from '@assets/images/follow.svg'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { RootState } from '../../../store/rootReducer'
import { DebouncedTouchableOpacityBox } from '../../../components/TouchableOpacityBox'
import { useAppDispatch } from '../../../store/store'
import { useColors } from '../../../theme/themeHooks'
import {
  fetchHotspotsData,
  followHotspot,
  unfollowHotspot,
} from '../../../store/hotspots/hotspotsSlice'

const NotHotspotOwnerErrorScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const dispatch = useAppDispatch()
  const { name, address } = useSelector(
    (state: RootState) =>
      state.connectedHotspot.details || { name: '', address: '' },
  )
  const { followPurple } = useColors()
  const [following, setFollowing] = useState(false)
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspotsObj,
  )

  useEffect(() => {
    return navigation.addListener('focus', () => {
      dispatch(fetchHotspotsData())
    })
  }, [navigation, dispatch])

  useEffect(() => {
    setFollowing(!!followedHotspots[address])
  }, [followedHotspots, address])

  const color = useMemo(() => (following ? followPurple : '#40466F'), [
    following,
    followPurple,
  ])
  const toggleFollowing = useCallback(() => {
    if (following) {
      setFollowing(false)
      dispatch(unfollowHotspot(address))
    } else {
      setFollowing(true)
      dispatch(followHotspot(address))
    }
  }, [dispatch, address, following])

  const navExit = useCallback(async () => {
    navigation.navigate('MainTabs')
  }, [navigation])

  return (
    <BackScreen>
      <Box flex={1} justifyContent="center" paddingBottom="xxl">
        <Text
          variant="h1"
          marginBottom="l"
          numberOfLines={2}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
          fontSize={36}
        >
          {t('hotspot_setup.not_owner.title')}
        </Text>
        <Text
          variant="subtitleMedium"
          color="purpleMain"
          numberOfLines={2}
          fontSize={20}
          maxFontSizeMultiplier={1.1}
          adjustsFontSizeToFit
          marginBottom={{ phone: 'l', smallPhone: 'ms' }}
        >
          {t('hotspot_setup.not_owner.subtitle_1')}
        </Text>
        <Text
          variant="subtitleLight"
          marginBottom={{ phone: 'xl', smallPhone: 'ms' }}
          fontSize={15}
          maxFontSizeMultiplier={1.3}
        >
          {t('hotspot_setup.not_owner.subtitle_2')}
        </Text>
        <Box
          height={52.5}
          style={styles.ownedHotspotBox}
          borderRadius="l"
          alignItems="center"
          flexDirection="row"
        >
          <Text
            marginLeft="l"
            color="white"
            variant="medium"
            fontSize={16}
            flex={1}
          >
            {startCase(name)}
          </Text>
          <DebouncedTouchableOpacityBox padding="l" onPress={toggleFollowing}>
            <Follow color={color} />
          </DebouncedTouchableOpacityBox>
        </Box>
      </Box>
      <Box>
        <Text
          variant="subtitleLight"
          marginBottom={{ phone: 'xl', smallPhone: 'ms' }}
          fontSize={15}
          maxFontSizeMultiplier={1.3}
        >
          {t('hotspot_setup.not_owner.contact_manufacturer')}
        </Text>
        <Button
          title={t('hotspot_setup.onboarding_error.next')}
          mode="contained"
          variant="primary"
          onPress={navExit}
        />
      </Box>
    </BackScreen>
  )
}

export default NotHotspotOwnerErrorScreen

const styles = StyleSheet.create({
  ownedHotspotBox: { backgroundColor: '#262a4b' },
})
