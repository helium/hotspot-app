import React from 'react';
import SafeAreaBox from '../../components/SafeAreaBox';
import Text from '../../components/Text';

const AccountDescriptionScreen = () => {
  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      justifyContent="center"
      padding="xl"
      flexDirection="column"
    >
      <Text variant="body">An account that is completely yours</Text>
    </SafeAreaBox>
  );
};

export default AccountDescriptionScreen;
