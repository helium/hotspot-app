import { useNavigation } from '@react-navigation/native'
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import HotspotIcon from '@assets/images/hotspotPillIcon.svg'
import ValidatorIcon from '@assets/images/validatorPillIcon.svg'
import SearchIcon from '@assets/images/search.svg'
import InfoIcon from '@assets/images/info-hollow.svg'
import ArrowIcon from '@assets/images/carot-down.svg'
import AddIcon from '@assets/images/add.svg'
import { Linking } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { RootState } from '../../../store/rootReducer'
import animateTransition from '../../../utils/animateTransition'
import Button from '../../../components/Button'
import { useColors } from '../../../theme/themeHooks'
import Articles from '../../../constants/articles'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type ViewType = 'collapsed' | 'hotspots' | 'validators'
const HotspotsEmpty = ({
  visible,
  onSearchPressed,
}: {
  visible: boolean
  onSearchPressed: () => void
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()

  const fetchHotspotsFailed = useSelector(
    (state: RootState) => state.hotspots.failure,
  )
  const [viewState, setViewState] = useState<ViewType>('collapsed')
  const { blueBright } = useColors()

  const goToSetup = useCallback(() => navigation.push('HotspotSetup'), [
    navigation,
  ])

  const handlePress = useCallback(
    (nextViewState: ViewType) => () => {
      animateTransition('HotspotsEmpty.ViewStateChanged')
      if (nextViewState === viewState) {
        setViewState('collapsed')
        return
      }
      setViewState(nextViewState)
    },
    [viewState],
  )

  const onHotspotInfoPress = useCallback(() => {
    if (Linking.canOpenURL(Articles.Mine)) {
      Linking.openURL(Articles.Mine)
    }
  }, [])

  const onValidatorInfoPress = useCallback(() => {
    if (Linking.canOpenURL(Articles.Stake)) {
      Linking.openURL(Articles.Stake)
    }
  }, [])

  if (!visible) return null

  if (fetchHotspotsFailed) {
    return (
      <Box
        padding="l"
        flex={1}
        justifyContent="center"
        backgroundColor="primaryBackground"
      >
        <Text variant="h1" paddingVertical="l" color="white">
          {t('generic.something_went_wrong')}
        </Text>
        <Text
          variant="regular"
          fontSize={19}
          lineHeight={22}
          paddingBottom="lx"
          color="grayLightText"
        >
          {t('hotspots.empty.failed')}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      padding="l"
      flex={1}
      justifyContent="center"
      backgroundColor="primaryBackground"
    >
      <Text variant="h1">{t('hotspots.empty.title')}</Text>
      <Text
        variant="regular"
        fontSize={18}
        color="purpleBrightMuted"
        marginTop="ms"
      >
        {t('hotspots.empty.body')}
      </Text>
      <TouchableOpacityBox
        onPress={handlePress('hotspots')}
        backgroundColor="blueBright"
        marginTop="xl"
        borderRadius="lm"
        paddingHorizontal="m"
      >
        <Box flexDirection="row" alignItems="center" minHeight={56}>
          <HotspotIcon color="white" />
          <Text
            flex={1}
            variant="regular"
            fontSize={18}
            color="white"
            marginLeft="xs"
          >
            {t('hotspots.empty.hotspots.title')}
          </Text>
          <ArrowIcon
            color="white"
            height={12}
            width={12}
            style={
              viewState === 'hotspots'
                ? { transform: [{ rotate: '180deg' }] }
                : undefined
            }
          />
        </Box>
        {viewState === 'hotspots' && (
          <Box paddingBottom="lm">
            <Text
              variant="regular"
              fontSize={15}
              lineHeight={18}
              color="offblack"
            >
              {t('hotspots.empty.hotspots.body')}
            </Text>
            <Box flexDirection="row" marginTop="l">
              <Button
                marginRight="s"
                onPress={onSearchPressed}
                height={48}
                backgroundColor="blueBrightDarkened"
                textVariant="body2"
                mode="contained"
                title={t('hotspots.empty.search')}
                icon={<SearchIcon color="white" height={12} />}
              />
              <Button
                marginRight="s"
                onPress={onHotspotInfoPress}
                height={48}
                backgroundColor="blueBrightDarkened"
                textVariant="body2"
                mode="contained"
                title={t('hotspots.empty.info')}
                icon={<InfoIcon color="white" height={12} />}
              />
              <Button
                onPress={goToSetup}
                height={48}
                backgroundColor="white"
                color="blueBright"
                textVariant="body2"
                mode="contained"
                title={t('hotspots.empty.hotspots.add')}
                icon={<AddIcon color={blueBright} height={10} />}
              />
            </Box>
          </Box>
        )}
      </TouchableOpacityBox>
      <TouchableOpacityBox
        onPress={handlePress('validators')}
        backgroundColor="purpleBright"
        marginTop="xs"
        borderRadius="lm"
        paddingHorizontal="m"
      >
        <Box flexDirection="row" alignItems="center" minHeight={56}>
          <ValidatorIcon color="white" />
          <Text
            flex={1}
            variant="regular"
            fontSize={18}
            color="white"
            marginLeft="xs"
          >
            {t('hotspots.empty.validators.title')}
          </Text>
          <ArrowIcon
            color="white"
            height={12}
            width={12}
            style={
              viewState === 'validators'
                ? { transform: [{ rotate: '180deg' }] }
                : undefined
            }
          />
        </Box>
        {viewState === 'validators' && (
          <Box paddingBottom="lm">
            <Text
              variant="regular"
              fontSize={15}
              lineHeight={18}
              color="offblack"
            >
              {t('hotspots.empty.validators.body')}
            </Text>
            <Box flexDirection="row" marginTop="l">
              <Button
                marginRight="s"
                onPress={onSearchPressed}
                height={48}
                backgroundColor="purpleBrightDarkened"
                textVariant="body2"
                mode="contained"
                title={t('hotspots.empty.search')}
                icon={<SearchIcon color="white" height={12} />}
              />
              <Button
                onPress={onValidatorInfoPress}
                height={48}
                backgroundColor="purpleBrightDarkened"
                textVariant="body2"
                mode="contained"
                title={t('hotspots.empty.info')}
                icon={<InfoIcon color="white" height={12} />}
              />
            </Box>
          </Box>
        )}
      </TouchableOpacityBox>
    </Box>
  )
}

export default HotspotsEmpty
