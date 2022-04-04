import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { upperCase } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-snap-carousel'
import { Account } from '@helium/react-native-sdk'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import PhraseChip from './PhraseChip'
import Button from '../../../components/Button'
import { getMnemonic } from '../../../utils/secureAccount'
import SafeAreaBox from '../../../components/SafeAreaBox'
import TextTransform from '../../../components/TextTransform'
import Card from '../../../components/Card'
import sleep from '../../../utils/sleep'
import { wp } from '../../../utils/layout'
import useHaptic from '../../../utils/useHaptic'
import animateTransition from '../../../utils/animateTransition'

type CarouselItemData = number
type Props = {
  title?: string
  onComplete: () => void
  onForgotWords?: () => void
}
const ConfirmWordsScreen = ({ title, onComplete, onForgotWords }: Props) => {
  const [step, setStep] = useState(0)
  const [word, setWord] = useState<string | null>(null)
  const [correct, setCorrect] = useState(false)
  const [mnemonic, setMnemonic] = useState<Array<string>>([])
  const [challengeWords, setChallengeWords] = useState<Array<string>>([])
  const carouselRef = useRef<Carousel<CarouselItemData>>(null)
  const { t } = useTranslation()
  const { triggerNotification } = useHaptic()
  const navigation = useNavigation()

  useEffect(() => {
    resetState()
    return navigation.addListener('blur', () => {
      resetState()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  const findTargetWord = useCallback(
    (pos: number, nextMnemonic?: string[] | undefined) => {
      return (nextMnemonic || mnemonic)[pos]
    },
    [mnemonic],
  )

  const nextStep = useCallback(() => {
    setTimeout(() => {
      if (step === mnemonic.length - 1) {
        onComplete()
      } else {
        carouselRef.current?.snapToItem(step + 1)
        setStep(step + 1)
        setWord(null)
        animateTransition('AccountEnterPassphraseScreen.NextStep')
        setChallengeWords(
          Account.generateChallengeWords(findTargetWord(step + 1)),
        )
      }
    }, 1000)
  }, [findTargetWord, mnemonic.length, onComplete, step])

  const onPressWord = useCallback(
    async (w: string) => {
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
        setChallengeWords(Account.generateChallengeWords(findTargetWord(step)))
        animateTransition('AccountEnterPassphraseScreen.OnPressWord')
      }
    },
    [findTargetWord, nextStep, step, triggerNotification],
  )

  const resetState = useCallback(async () => {
    const wordStr = await getMnemonic()
    const nextMnemonic = wordStr?.words || []
    setMnemonic(nextMnemonic)
    setStep(0)
    setWord(null)
    setCorrect(false)
    setChallengeWords(
      Account.generateChallengeWords(findTargetWord(step, nextMnemonic)),
    )
  }, [step, findTargetWord])

  const data = useMemo(() => mnemonic.map((_, index) => index), [mnemonic])

  const challengeWordChips = useMemo(
    () =>
      challengeWords.map((w) => (
        <PhraseChip
          marginRight="s"
          marginBottom="s"
          key={w}
          title={w}
          fail={word === w && !correct}
          success={word === w && correct}
          onPress={() => !word && onPressWord(w)}
        />
      )),
    [challengeWords, correct, onPressWord, word],
  )

  const renderItem = ({ item: index }: { item: CarouselItemData }) => {
    return (
      <Card
        marginHorizontal="s"
        variant="elevated"
        flex={1}
        overflow="hidden"
        backgroundColor="white"
        paddingHorizontal="l"
        alignItems="center"
        flexDirection="row"
      >
        <Text
          variant="bold"
          fontSize={39}
          color="purpleLight"
          maxFontSizeMultiplier={1}
        >
          {`${index + 1}. `}
        </Text>
        <Text
          variant="bold"
          fontSize={39}
          color="purpleDark"
          maxFontSizeMultiplier={1}
        >
          {step === index && word ? upperCase(word) : '?????'}
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
        {title || t('account_setup.confirm.title')}
      </Text>
      <Box flex={0.5} />
      <TextTransform
        numberOfLines={1}
        adjustsFontSizeToFit
        values={{
          ordinal: t(`ordinals.${step}`),
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
          data={data}
          renderItem={renderItem}
          sliderWidth={wp(100)}
          itemWidth={wp(90)}
          inactiveSlideScale={1}
          scrollEnabled={false}
        />
      </Box>
      <Box flex={1} />
      <Box flexDirection="row" flexWrap="wrap">
        {challengeWordChips}
      </Box>
      <Box flex={2} />
      <Button
        title={t('account_setup.confirm.forgot')}
        onPress={onForgotWords || navigation.goBack}
      />
    </SafeAreaBox>
  )
}

export default memo(ConfirmWordsScreen)
