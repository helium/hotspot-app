import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import ImageBox from '../../../components/ImageBox'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const HotspotTxnsProgressScreen = () => {
  const { t } = useTranslation()
  const rotateAnim = useRef(new Animated.Value(0))
  const navigation = useNavigation<RootNavigationProp>()
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim.current, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start()
  }, [])

  return (
    <BackScreen alignItems="center">
      <Box position="absolute" top={-20}>
        <Animated.Image
          source={require('../../../assets/images/progress-spinner.png')}
          style={{
            transform: [
              {
                rotate: rotateAnim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
      </Box>
      <ImageBox
        marginTop="xxl"
        height={200}
        width={300}
        source={require('../../../assets/images/progress-hotspot.png')}
      />
      <Text variant="subtitleMono" marginBottom="l">
        {t('hotspot_setup.progress.title')}
      </Text>
      <Text variant="body2Light" marginBottom="l">
        {t('hotspot_setup.progress.p_1')}
      </Text>
      <Text variant="body2Light" marginBottom="l">
        {t('hotspot_setup.progress.p_2')}
      </Text>
      <Text variant="body2Light">{t('hotspot_setup.progress.p_3')}</Text>
      <Box flex={1} />
      <Button
        onPress={() => navigation.navigate('MainTabs')}
        variant="primary"
        width="100%"
        mode="contained"
        title={t('hotspot_setup.progress.next')}
      />
    </BackScreen>
  )
}

export default HotspotTxnsProgressScreen
