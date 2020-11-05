import React from 'react'
import '@testing-library/jest-native/extend-expect'
import StatsView from '../StatsView'
import * as stats from '../__fixtures__/stats.json'
import { StatsState } from '../../../store/stats/statsSlice'
import { Stats } from '../../../store/stats/statsTypes'
import { renderWithProviders } from '../../../utils/testUtils'

test('Stats view shows loading indicator', async () => {
  const statsState: StatsState = { loading: 'idle', data: null, error: '' }
  const { queryByA11yLabel } = renderWithProviders(
    <StatsView statsState={statsState} />,
  )
  expect(queryByA11yLabel('Loading')).toBeTruthy()
})

test('Stats view shows stats data', async () => {
  const data = stats.data as Stats
  const statsState: StatsState = { loading: 'succeeded', data, error: '' }
  const { queryByA11yLabel, queryByText } = renderWithProviders(
    <StatsView statsState={statsState} />,
  )
  expect(queryByA11yLabel('Loading')).toBeFalsy()

  expect(queryByText(JSON.stringify(data, null, 2))).toBeTruthy()
})
