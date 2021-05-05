import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  random,
  shuffle,
  uniq,
  take,
  reject,
  sampleSize,
  upperFirst,
} from 'lodash'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import wordlist from '../../../constants/wordlists/english.json'
import PhraseChip from './PhraseChip'
import Button from '../../../components/Button'
import { OnboardingNavigationProp } from '../onboardingTypes'
import { getMnemonic } from '../../../utils/secureAccount'
import SafeAreaBox from '../../../components/SafeAreaBox'
import TextTransform from '../../../components/TextTransform'
import Card from '../../../components/Card'
import sleep from '../../../utils/sleep'
import { wp } from '../../../utils/layout'
import useHaptic from '../../../utils/useHaptic'
import animateTransition from '../../../utils/animateTransition'

const testIndices = __DEV__
  ? [0, 1, 2]
  : [random(0, 3), random(4, 7), random(8, 11)]

const generateChallengeWords = (targetWord: string) =>
  shuffle(
    uniq(
      take(reject(sampleSize(wordlist, 12), targetWord), 11).concat(targetWord),
    ),
  )

type CarouselItemData = number

const AccountEnterPassphraseScreen = () => {
  const [step, setStep] = useState(0)
  const [word, setWord] = useState<string | null>(null)
  const [correct, setCorrect] = useState(false)
  const [mnemonic, setMnemonic] = useState<Array<string>>([])
  const [challengeWords, setChallengeWords] = useState<Array<string>>([])
  const carouselRef = useRef<Carousel<CarouselItemData>>(null)
  const { t } = useTranslation()
  const { triggerNotification } = useHaptic()
  const navigation = useNavigation<OnboardingNavigationProp>()

  const findTargetWord = useCallback(
    (pos: number, nextMnemonic?: string[] | undefined) => {
      return (nextMnemonic || mnemonic)[testIndices[pos]]
    },
    [mnemonic],
  )

  const onPressWord = async (w: string) => {
    setWord(w)

    if (w === findTargetWord(step)) {
      setCorrect(true)
      triggerNotification()
      nextStep()
    } else {
      setCorrect(false)
      triggerNotification('error')
      await sleep(1000)
      setWord(null)
      setChallengeWords(generateChallengeWords(findTargetWord(step)))
      animateTransition('AccountEnterPassphraseScreen.OnPressWord')
    }
  }

  const nextStep = () => {
    setTimeout(() => {
      if (step === 2) {
        navigation.push('AccountCreatePinScreen')
      } else {
        carouselRef.current?.snapToItem(step + 1)
        setStep(step + 1)
        setWord(null)
        animateTransition('AccountEnterPassphraseScreen.NextStep')
        setChallengeWords(generateChallengeWords(findTargetWord(step + 1)))
      }
    }, 1000)
  }

  const resetState = useCallback(async () => {
    const wordStr = await getMnemonic()
    const nextMnemonic = wordStr?.words || []
    setMnemonic(nextMnemonic)
    setStep(0)
    setWord(null)
    setCorrect(false)
    setChallengeWords(
      generateChallengeWords(findTargetWord(step, nextMnemonic)),
    )
  }, [step, findTargetWord])

  useEffect(() => {
    resetState()
    const unsubscribe = navigation.addListener('blur', () => {
      resetState()
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const renderItem = ({ item: index }: { item: CarouselItemData }) => {
    return (
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
        <Text variant="h1" color="purpleLight" maxFontSizeMultiplier={1}>
          {`${index + 1}. `}
        </Text>
        <Text variant="h1" color="purpleDark" maxFontSizeMultiplier={1}>
          {step === index && word ? upperFirst(word) : '?????'}
        </Text>
      </Card>
    )
  }

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      paddingHorizontal="lx"
    >
      <Box flex={2} />
      <Text
        variant="h1"
        numberOfLines={2}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1}
      >
        {t('account_setup.confirm.title')}
      </Text>
      <Box flex={0.5} />
      <TextTransform
        numberOfLines={1}
        adjustsFontSizeToFit
        values={{
          ordinal: t(`ordinals.${testIndices[step]}`),
        }}
        variant="subtitle"
        i18nKey="account_setup.confirm.subtitle"
      />
      <Box flex={1} />

      <Box
        marginHorizontal="n_lx"
        height={{ smallPhone: 80, phone: 114 }}
        marginVertical="l"
      >
        <Carousel
          ref={carouselRef}
          layout="default"
          vertical={false}
          data={testIndices}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(90)}
          inactiveSlideScale={1}
          scrollEnabled={false}
        />
      </Box>
      <Box flex={1} />
      <Box flexDirection="row" flexWrap="wrap">
        {challengeWords.map((w) => (
          <PhraseChip
            marginRight="s"
            marginBottom="s"
            key={w}
            title={w}
            fail={word === w && !correct}
            success={word === w && correct}
            onPress={() => !word && onPressWord(w)}
          />
        ))}
      </Box>
      <Box flex={2} />
      <Button
        title={t('account_setup.confirm.forgot')}
        onPress={navigation.goBack}
      />
    </SafeAreaBox>
  )
}

export default AccountEnterPassphraseScreen
