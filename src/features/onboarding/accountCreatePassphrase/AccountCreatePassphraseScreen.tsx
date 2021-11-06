import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-async-hook'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { upperFirst } from 'lodash'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import TextTransform from '../../../components/TextTransform'
import Button from '../../../components/Button'
import { getMnemonic } from '../../../utils/secureAccount'
import BackScreen from '../../../components/BackScreen'
import { wp } from '../../../utils/layout'
import { useColors } from '../../../theme/themeHooks'
import Card from '../../../components/Card'

const AccountCreatePassphraseScreen = () => {
  const { t } = useTranslation()
  const { result: mnemonic } = useAsync(getMnemonic, [])
  const navigation = useNavigation<OnboardingNavigationProp>()
  const [wordIndex, setWordIndex] = useState(0)
  const [disabled, setDisabled] = useState(true)
  const [viewedWords, setViewedWords] = useState(new Array(12).fill(false))
  const colors = useColors()

  const onSnapToItem = (index: number) => {
    setWordIndex(index)
    setViewedWords(
      Object.assign(new Array(12).fill(false), viewedWords, {
        0: true,
        [index]: true,
      }),
    )
  }

  useEffect(() => {
    const viewedAll = viewedWords.every((w) => w)
    if (!viewedAll && !__DEV__) return

    setDisabled(false)
  }, [viewedWords])

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Card
      marginHorizontal="s"
      variant="elevated"
      flex={1}
      overflow="hidden"
      backgroundColor="white"
      padding="l"
      alignItems="center"
      flexDirection="row"
    >
      <Text variant="h1" color="purpleLight" maxFontSizeMultiplier={1}>{`${
        index + 1
      }. `}</Text>
      <Text variant="h1" color="purpleDark" maxFontSizeMultiplier={1}>
        {upperFirst(item)}
      </Text>
    </Card>
  )

  return (
    <BackScreen flex={1} backgroundColor="primaryBackground" paddingTop="none">
      <Box flex={1} />
      <Text variant="h1" maxFontSizeMultiplier={1}>
        {t('account_setup.passphrase.title')}
      </Text>
      <TextTransform
        marginVertical="l"
        variant="subtitle"
        maxFontSizeMultiplier={1}
        i18nKey="account_setup.passphrase.subtitle"
      />
      <Box
        marginHorizontal="n_lx"
        height={{ smallPhone: 94, phone: 114 }}
        marginVertical="l"
      >
        <Carousel
          layout="default"
          vertical={false}
          data={mnemonic?.words || []}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(90)}
          inactiveSlideScale={1}
          onSnapToItem={(i) => onSnapToItem(i)}
        />
      </Box>
      <Pagination
        dotsLength={mnemonic?.words.length || 0}
        activeDotIndex={wordIndex}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.white,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
      />
      <Box flex={1} />
      <Button
        marginBottom="m"
        mode="contained"
        disabled={disabled}
        variant="primary"
        onPress={() => navigation.push('AccountEnterPassphraseScreen')}
        title={t('account_setup.passphrase.next')}
      />
    </BackScreen>
  )
}

export default AccountCreatePassphraseScreen
