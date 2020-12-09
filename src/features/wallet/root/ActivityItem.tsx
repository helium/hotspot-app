import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { formatDistanceToNow } from 'date-fns'
import { round } from 'lodash'
import animalHash from 'angry-purple-tiger'
import Haptic from 'react-native-haptic-feedback'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import shortLocale from '../../../utils/formatDistance'
import Rewards from '../../../assets/images/rewards.svg'

type Props = {
  type: string
  time: number
  amount?: number
  isFirst: boolean
  isLast: boolean
}

const titles = {
  rewards: 'Mining Rewards',
  sent: 'Sent HNT',
  received: 'Received HNT',
  add: 'Hotspot Added to Blockchain',
}

const colors = {
  rewards: '#A667F6',
  sent: '#1D91F8',
  received: '#32C48D',
  add: '#383A6F',
}

const ActivityItem = ({ type, time, amount, isFirst, isLast }: Props) => {
  const handlePress = () => {
    Haptic.trigger('notificationWarning')
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        borderColor="grayLight"
        borderWidth={1}
        borderBottomWidth={isLast ? 1 : 0}
        borderTopLeftRadius={isFirst ? 'm' : undefined}
        borderTopRightRadius={isFirst ? 'm' : undefined}
        borderBottomLeftRadius={isLast ? 'm' : undefined}
        borderBottomRightRadius={isLast ? 'm' : undefined}
      >
        <Box
          width={50}
          height={50}
          style={{ backgroundColor: colors[type] }}
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={isFirst ? 'm' : undefined}
          borderBottomLeftRadius={isLast ? 'm' : undefined}
        >
          <Rewards width={26} height={26} />
        </Box>
        <Box flex={1} paddingHorizontal="m">
          <Text fontSize={14} lineHeight={20} fontWeight="500">
            {titles[type]}
          </Text>
          <Text color="grayExtraLight" fontSize={14} lineHeight={20}>
            {type === 'add' && animalHash(amount)}
            {type !== 'add' && <>{round(amount, 2)} HNT</>}
          </Text>
        </Box>
        <Box paddingHorizontal="m">
          <Text color="graySteel">
            {formatDistanceToNow(time, {
              locale: shortLocale,
              addSuffix: true,
            })}
          </Text>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default ActivityItem
