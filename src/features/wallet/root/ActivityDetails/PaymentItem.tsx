import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import Address from '../../../../components/Address'

type Props = {
  text: string
  subText?: string | null
  title?: string | null
  isFirst?: boolean
  isLast?: boolean
  mode:
    | 'to'
    | 'from'
    | 'memo'
    | 'location'
    | 'seller'
    | 'owner'
    | 'buyer'
    | 'antenna'
    | 'elevation'
  isMyAccount?: boolean
  isMemo?: boolean
}
const PaymentItem = ({
  text,
  subText,
  isFirst = true,
  isLast = false,
  mode,
  title,
  isMyAccount,
  isMemo = false,
}: Props) => {
  const { t } = useTranslation()

  return (
    <Box
      height={63}
      backgroundColor="grayBox"
      alignItems="center"
      padding="ms"
      flexDirection="row"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
      justifyContent="space-between"
      marginBottom={isLast ? 'l' : 'xxxs'}
    >
      <Text
        variant="medium"
        fontSize={15}
        color="black"
        flex={1}
        alignSelf="center"
      >
        {title || t(`activity_details.${mode}`)}
      </Text>
      <Box
        alignItems="flex-end"
        justifyContent="space-between"
        flex={1}
        marginHorizontal="ms"
      >
        {isMemo ? <Text selectable>{text}</Text> : <Address address={text} />}
        {(isMyAccount || subText) && (
          <Text
            variant="light"
            fontSize={12}
            color="black"
            marginLeft="s"
            marginTop="xs"
          >
            {subText || t('activity_details.my_account')}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default PaymentItem
