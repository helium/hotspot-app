import React, { useCallback, useEffect } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import ImageBox from '../../../components/ImageBox'
import Button from '../../../components/Button'
import Map from '../../../components/Map'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import * as Logger from '../../../utils/logger'
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'
import { loadLocationFeeData } from '../../../utils/assertLocationUtils'

const HotspotSetupConfirmLocationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const account = useSelector((state: RootState) => state.account.account)
  const onboardingRecord = useSelector(
    (state: RootState) => state.connectedHotspot.onboardingRecord,
  )
  const connectedHotspotDetails = useSelector(
    (state: RootState) => state.connectedHotspot.details,
  )
  const { hotspotCoords, locationName, gain, elevation } = useSelector(
    (state: RootState) => state.hotspotOnboarding,
  )
  const { loading, result, error } = useAsync(
    () =>
      loadLocationFeeData(
        connectedHotspotDetails?.nonce || 0,
        account?.balance?.integerBalance || 0,
        onboardingRecord,
      ),
    [],
  )

  useEffect(() => {
    if (error) {
      Logger.error(error)
      navigation.navigate('OnboardingErrorScreen')
    }
  }, [error, navigation])

  const navNext = useCallback(async () => {
    navigation.replace('HotspotTxnsProgressScreen')
  }, [navigation])

  if (loading || !result) {
    return (
      <BackScreen>
        <Box flex={1} justifyContent="center" paddingBottom="xxl">
          <ActivityIndicator color="gray" />
        </Box>
      </BackScreen>
    )
  }

  const { isFree, hasSufficientBalance, totalStakingAmount } = result

  return (
    <BackScreen>
      <ScrollView>
        <Box flex={1} justifyContent="center" paddingBottom="xxl">
          <Text variant="h1" marginBottom="l" maxFontSizeMultiplier={1}>
            {t('hotspot_setup.location_fee.title')}
          </Text>
          {isFree ? (
            <Text
              variant="subtitleMedium"
              color="greenBright"
              marginBottom={{ phone: 'l', smallPhone: 'ms' }}
            >
              {t('hotspot_setup.location_fee.subtitle_free')}
            </Text>
          ) : (
            <Text
              variant="subtitleMedium"
              marginBottom={{ phone: 'l', smallPhone: 'ms' }}
            >
              {t('hotspot_setup.location_fee.subtitle_fee')}
            </Text>
          )}
          <Text
            variant="subtitleLight"
            marginBottom={{ phone: 'xl', smallPhone: 'ms' }}
            numberOfLines={2}
            adjustsFontSizeToFit
            maxFontSizeMultiplier={1.3}
          >
            {t('hotspot_setup.location_fee.confirm_location')}
          </Text>
          <Box
            height={{ smallPhone: 140, phone: 200 }}
            borderRadius="l"
            overflow="hidden"
            marginBottom={{ phone: 'm', smallPhone: 'ms' }}
          >
            <Box flex={1}>
              <Map
                mapCenter={hotspotCoords}
                zoomLevel={16}
                interactive={false}
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                style={{ marginTop: -29, marginLeft: -25 / 2 }}
                width={25}
                height={29}
                justifyContent="flex-end"
                alignItems="center"
              >
                <ImageBox
                  source={require('../../../assets/images/map-pin.png')}
                  width={25}
                  height={29}
                />
              </Box>
            </Box>
            <Box padding="m" backgroundColor="purple200">
              <Text
                variant="body2Medium"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {locationName}
              </Text>
            </Box>
          </Box>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            marginTop={{ phone: 'm', smallPhone: 'xxs' }}
          >
            <Text variant="body1Light" color="secondaryText">
              {t('hotspot_setup.location_fee.gain_label')}
            </Text>
            <Text variant="body1Light" color="white">
              {t('hotspot_setup.location_fee.gain', { gain })}
            </Text>
          </Box>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            marginTop={{ phone: 'm', smallPhone: 'xxs' }}
          >
            <Text variant="body1Light" color="secondaryText">
              {t('hotspot_setup.location_fee.elevation_label')}
            </Text>
            <Text variant="body1Light" color="white">
              {t('hotspot_setup.location_fee.elevation', { count: elevation })}
            </Text>
          </Box>

          {!isFree && (
            <>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                paddingTop="m"
                marginTop={{ phone: 'm', smallPhone: 'xxs' }}
              >
                <Text variant="body1Light" color="secondaryText">
                  {t('hotspot_setup.location_fee.balance')}
                </Text>
                <Text
                  variant="body1Light"
                  color={hasSufficientBalance ? 'greenBright' : 'redMain'}
                >
                  {account?.balance?.toString(2, {
                    groupSeparator,
                    decimalSeparator,
                  })}
                </Text>
              </Box>

              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginTop={{ phone: 'm', smallPhone: 'xxs' }}
              >
                <Text variant="body1Light" color="secondaryText">
                  {t('hotspot_setup.location_fee.fee')}
                </Text>
                <Text variant="body1Light" color="white">
                  {totalStakingAmount.toString(2)}
                </Text>
              </Box>

              {!hasSufficientBalance && (
                <Box marginTop={{ phone: 'l', smallPhone: 'xxs' }}>
                  <Text
                    variant="body2Medium"
                    color="redMain"
                    textAlign="center"
                  >
                    {t('hotspot_setup.location_fee.no_funds')}
                  </Text>
                </Box>
              )}
            </>
          )}
        </Box>
      </ScrollView>
      <Box>
        <Button
          title={
            isFree
              ? t('hotspot_setup.location_fee.next')
              : t('hotspot_setup.location_fee.fee_next')
          }
          mode="contained"
          variant="secondary"
          onPress={navNext}
          disabled={isFree ? false : !hasSufficientBalance}
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupConfirmLocationScreen
