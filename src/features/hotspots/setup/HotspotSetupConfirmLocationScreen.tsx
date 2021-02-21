import React from 'react'
import { ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import ImageBox from '../../../components/ImageBox'
import Button from '../../../components/Button'
import Map from '../../../components/Map'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupConfirmLocationScreen'
>

const HotspotSetupConfirmLocationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const { loadLocationFeeData } = useConnectedHotspotContext()
  const {
    account: { account },
  } = useSelector((state: RootState) => state)
  const { loading, result } = useAsync(loadLocationFeeData, [])

  const {
    params: { hotspotCoords, locationName },
  } = useRoute<Route>()

  const navNext = async () => {
    navigation.replace('HotspotTxnsProgressScreen', { hotspotCoords })
  }

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
      <Box flex={1} justifyContent="center" paddingBottom="xxl">
        <Text variant="h1" marginBottom="l">
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
            <Map mapCenter={hotspotCoords} zoomLevel={16} interactive={false} />
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
            <Text variant="body2Medium" numberOfLines={1} adjustsFontSizeToFit>
              {locationName}
            </Text>
          </Box>
        </Box>

        {!isFree && (
          <>
            <Box
              flexDirection="row"
              justifyContent="space-between"
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
                <Text variant="body2Medium" color="redMain" textAlign="center">
                  {t('hotspot_setup.location_fee.no_funds')}
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
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
