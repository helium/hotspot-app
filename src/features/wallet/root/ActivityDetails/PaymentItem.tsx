import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import MyAccount from '../../../../assets/images/myAccount.svg'
import TheirAccount from '../../../../assets/images/theirAccount.svg'

type Props = {
  address: string
  isFirst?: boolean
  isLast?: boolean
  isPayer: boolean
}
const PaymentItem = ({
  address,
  isFirst = true,
  isLast = false,
  isPayer,
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
        alignSelf="flex-start"
      >
        {t(`activity_details.${isPayer ? 'from' : 'to'}`)}
      </Text>
      <Box
        alignItems="flex-end"
        justifyContent="space-between"
        flex={1}
        marginHorizontal="ms"
      >
        <Text
          variant="medium"
          fontSize={14}
          color="black"
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {address}
        </Text>
        {isPayer && (
          <Text variant="light" fontSize={12} color="black" marginLeft="s">
            {t('activity_details.my_account')}
          </Text>
        )}
      </Box>
      {isPayer && <MyAccount />}
      {!isPayer && <TheirAccount />}
    </Box>
  )
}

export default PaymentItem
