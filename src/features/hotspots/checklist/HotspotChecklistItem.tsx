import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Check from '../../../assets/images/checkPlain.svg'
import BlockIcon from '../../../assets/images/checklist_block.svg'
import ChallengeWitnessIcon from '../../../assets/images/checklist_challenge_witness.svg'
import ChallengeeIcon from '../../../assets/images/checklist_challengee.svg'
import ChallengerIcon from '../../../assets/images/checklist_challenger.svg'
import DataIcon from '../../../assets/images/checklist_data.svg'
import StatusIcon from '../../../assets/images/checklist_status.svg'
import WitnessIcon from '../../../assets/images/checklist_witness.svg'
import { useColors } from '../../../theme/themeHooks'
import { Colors } from '../../../theme/theme'
import { wp } from '../../../utils/layout'
import CircleProgress from '../../../components/CircleProgress'

type CompleteProps = {
  visible?: boolean
  colorString: Colors
  colorHex: string
  text: string
}
const CompletePill = ({
  visible = true,
  colorString,
  colorHex,
  text,
}: CompleteProps) => (
  <Box
    backgroundColor="white"
    borderRadius="s"
    padding="xs"
    flexDirection="row"
    alignItems="center"
    justifyContent="center"
    visible={visible}
  >
    <Check color={colorHex} />
    <Text variant="bold" color={colorString} fontSize={10} paddingStart="xs">
      {text}
    </Text>
  </Box>
)

type AutoProps = {
  textColor: Colors
  visible?: boolean
  backgroundColor: Colors
  autoText?: string
  auto: string
}
const AutoPill = ({
  textColor,
  visible = true,
  backgroundColor,
  autoText,
  auto,
}: AutoProps) => (
  <Box flexDirection="row" alignItems="center" visible={visible}>
    <Box backgroundColor={textColor} borderRadius="s" padding="xs">
      <Text variant="bold" color={backgroundColor} fontSize={10}>
        {auto}
      </Text>
    </Box>
    <Text
      variant="body2"
      color={backgroundColor}
      paddingStart="s"
      fontSize={10}
    >
      {autoText}
    </Text>
  </Box>
)

type Props = {
  title: string
  description: string
  complete?: boolean
  showAuto?: boolean
  autoText?: string
  itemKey: string
  isAndroid: boolean
  percentComplete: number
  index: number
  totalCount: number
}
const HotspotChecklistItem = ({
  title,
  description,
  complete,
  showAuto,
  autoText,
  isAndroid,
  percentComplete,
  itemKey,
  index,
  totalCount,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()

  const icon = useMemo(() => {
    switch (itemKey) {
      default:
      case 'checklist.blocks':
        return <BlockIcon color={colors.purpleMain} />
      case 'checklist.status':
        return <StatusIcon color={colors.purpleMain} />
      case 'checklist.challenger':
        return <ChallengerIcon color={colors.purpleMain} />
      case 'checklist.challenge_witness':
        return <ChallengeWitnessIcon color={colors.purpleMain} />
      case 'checklist.witness':
        return <WitnessIcon color={colors.purpleMain} />
      case 'checklist.challengee':
        return <ChallengeeIcon color={colors.purpleMain} />
      case 'checklist.data_transfer':
        return <DataIcon color={colors.purpleMain} />
    }
  }, [colors.purpleMain, itemKey])

  return (
    <Box
      marginHorizontal={isAndroid ? undefined : 'xs'}
      width={isAndroid ? wp(100) : undefined}
      paddingHorizontal={isAndroid ? 'm' : undefined}
    >
      <Box
        paddingHorizontal="m"
        borderRadius="l"
        justifyContent="space-between"
        overflow="hidden"
      >
        <Box flexDirection="row">
          <CircleProgress
            size={110}
            progressColor="#474DFF"
            percentage={percentComplete}
            progressWidth={38}
          />
          <Box
            position="absolute"
            justifyContent="center"
            alignItems="center"
            height={110}
            width={110}
            top={0}
            left={0}
            bottom={0}
            right={0}
          >
            {icon}
          </Box>
          <Box paddingHorizontal="l" width={220}>
            <Box
              flexDirection="row"
              flexWrap="wrap"
              alignItems="center"
              marginBottom="xs"
            >
              <Text variant="body2" color="grayText" marginRight="s">
                {t('checklist.item_count', {
                  index: index + 1,
                  total: totalCount,
                })}
              </Text>
              <AutoPill
                textColor="grayBox"
                visible={!complete}
                backgroundColor="grayText"
                auto={t('checklist.pending')}
              />
              <CompletePill
                visible={complete}
                colorHex={colors.purpleMain}
                colorString="purpleMain"
                text={t('checklist.complete')}
              />
            </Box>
            <Text
              variant="h4"
              color="grayText"
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text variant="body2" marginVertical="s" color="grayText">
              {description}
            </Text>
            <AutoPill
              textColor="grayBox"
              visible={showAuto}
              backgroundColor="grayText"
              autoText={autoText}
              auto={t('checklist.auto')}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default memo(HotspotChecklistItem)
