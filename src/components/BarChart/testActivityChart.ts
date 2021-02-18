// used to test the extreme cases of charts

import { random } from 'lodash'

const makeChartData = ({ up = 0, down = 0 }) => ({
  id: random(0, 100000).toString(),
  up,
  down,
  label: 'M',
})

// There's still one slight alignment issue where the most extreme
// example can be demonstrated with the difference between big ups 1 and 2
const bigUps = [
  [10000, 1031],
  [1, 1],
  [1, 1],
  [0, 1],
  [1, 0],
  [0, 0],
  [1, 1],
  [1, 1],
  [1, 100],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
].map(([up, down]) => makeChartData({ up, down }))

const bigUps2 = [
  [10000, 1032],
  [1, 1],
  [1, 1],
  [0, 1],
  [1, 0],
  [0, 0],
  [1, 1],
  [1, 1],
  [1, 100],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
].map(([up, down]) => makeChartData({ up, down }))

const bigDowns = [
  [1, 10000],
  [1, 1],
  [1, 1],
  [0, 1],
  [1, 0],
  [0, 0],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
].map(([up, down]) => makeChartData({ up, down }))

const testActivityChart = {
  daily: { data: bigUps, loading: 'idle' },
  weekly: { data: bigUps2, loading: 'idle' },
  monthly: { data: bigDowns, loading: 'idle' },
}

export default testActivityChart
