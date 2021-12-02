import React from 'react'
import { upperCase } from 'lodash'
import { useTranslation } from 'react-i18next'
import Carousel from 'react-native-snap-carousel'
import { useAsync } from 'react-async-hook'
import { useNavigation } from '@react-navigation/native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { getMnemonic } from '../../../utils/secureAccount'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Card from '../../../components/Card'
import { wp } from '../../../utils/layout'
import TextTransform from '../../../components/TextTransform'
import Button from '../../../components/Button'

const RevealWordsScreen = () => {
  const { result: mnemonic } = useAsync(getMnemonic, [])
  const { t } = useTranslation()
  const navigation = useNavigation()

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const isFirst = index === 0
    const isLast = index + 1 === mnemonic?.words.length
    return (
      <Card
        marginHorizontal="s"
        marginLeft={isFirst ? 'l' : undefined}
        marginRight={isLast ? 'l' : undefined}
        variant="elevated"
        flex={1}
        overflow="hidden"
        backgroundColor="white"
        padding="l"
        alignItems="center"
        flexDirection="row"
      >
        <Text
          variant="bold"
          fontSize={39}
          color="purpleLight"
          maxFontSizeMultiplier={1}
        >{`${index + 1}. `}</Text>
        <Text
          variant="bold"
          fontSize={39}
          color="purpleDark"
          maxFontSizeMultiplier={1}
        >
          {upperCase(item)}
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
      <Box flex={1} />
      <Text variant="h1" maxFontSizeMultiplier={1}>
        {t('account_setup.passphrase.title')}
      </Text>
      <TextTransform
        maxFontSizeMultiplier={1}
        marginVertical="l"
        variant="subtitle"
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
          useExperimentalSnap
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore this is a new beta prop and enforces only scrolling one item at a time
          disableIntervalMomentum
        />
      </Box>
      <Box flex={1} />
      <Button
        mode="contained"
        variant="primary"
        onPress={() => navigation.goBack()}
        title={t('account_setup.passphrase.next')}
        marginBottom="m"
      />
    </SafeAreaBox>
  )
}

export default RevealWordsScreen
