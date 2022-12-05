import React, { memo, ReactNode, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import InfoError from '@assets/images/infoError.svg'
import { useTranslation } from 'react-i18next'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Text from './Text'
import Box from './Box'
import { useGetSolanaStatusQuery } from '../store/solana/solanaStatusApi'
import Button from './Button'

const SentinelScreen = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const { data: status } = useGetSolanaStatusQuery()
  const [showSentinel, setShowSentinel] = useState<boolean>()
  const animValue = useSharedValue(1)
  const [animationComplete, setAnimationComplete] = useState(false)

  const animationCompleted = useCallback(() => {
    setAnimationComplete(true)
  }, [])

  const style = useAnimatedStyle(() => {
    let animVal = animValue.value

    if (animValue.value === 0) {
      animVal = withTiming(
        animValue.value,
        { duration: 300 },
        runOnJS(animationCompleted),
      )
    }
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      opacity: animVal,
    }
  })

  useEffect(() => {
    if (!status || status.migrationStatus === 'not_started') return

    // if needed we can add this back to show only for a specific app version
    // const { minimumVersions } = status
    // const bundleId = DeviceInfo.getBundleId()
    // const minVersion = minimumVersions[bundleId]
    // const version = DeviceInfo.getVersion()
    // const valid = semver.gte(version, minVersion)
    setShowSentinel(true)
  }, [status])

  const handleClose = useCallback(() => {
    animValue.value = 0
  }, [animValue])

  return (
    <View style={{ flex: 1 }}>
      {children}
      {!!showSentinel && !animationComplete && (
        <Animated.View style={style}>
          <Box
            backgroundColor="primaryBackground"
            flex={1}
            justifyContent="center"
            paddingHorizontal="xl"
          >
            <Box justifyContent="center" alignItems="center" marginBottom="xl">
              <InfoError />
            </Box>
            <Text variant="h1" textAlign="center" fontSize={40} lineHeight={42}>
              {t(`sentinel.${status?.migrationStatus}.title`)}
            </Text>
            <Text
              variant="subtitle"
              color="secondaryText"
              textAlign="center"
              marginTop="m"
              marginHorizontal="l"
            >
              {t(`sentinel.${status?.migrationStatus}.body`)}
            </Text>

            <Button
              borderRadius="round"
              onPress={handleClose}
              backgroundColor="primaryText"
              title={t('sentinel.action')}
              color="black"
              marginTop="l"
            />
          </Box>
        </Animated.View>
      )}
    </View>
  )
}

export default memo(SentinelScreen)
