import React from 'react'
import Button from '../../../components/Button'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { useAppDispatch } from '../../../store/store'
import userSlice from '../../../store/user/userSlice'

const AccountDescriptionScreen = () => {
  const dispatch = useAppDispatch()

  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      justifyContent="space-evenly"
      alignContent="center"
      padding="xl"
      flexDirection="column"
    >
      <Text variant="body">An account that is completely yours</Text>
      <Button
        title="Create User"
        onPress={() => dispatch(userSlice.actions.createUser())}
      />
    </SafeAreaBox>
  )
}

export default AccountDescriptionScreen
