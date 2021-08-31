import React, { memo } from 'react'
import { Election } from '@helium/http'
import Box from '../../../components/Box'

type Props = {
  elections: Election[]
  address: string
}
const ConsensusHistory = ({ elections, address }: Props) => {
  return (
    <Box flexDirection="row" marginHorizontal="m">
      {elections
        ?.map((election) => (
          <Box
            key={election.hash}
            borderRadius="round"
            backgroundColor={
              election.members.includes(address) ? 'purpleBright' : 'grayLight'
            }
            height={10}
            width={10}
            marginHorizontal="xxs"
          />
        ))
        .reverse()}
    </Box>
  )
}

export default memo(ConsensusHistory)
