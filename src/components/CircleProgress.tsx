import Svg, { Circle, Path } from 'react-native-svg'
import React from 'react'
import Box from './Box'

const generateArc = (percentage: number, radius: number) => {
  // eslint-disable-next-line no-param-reassign
  if (percentage === 100) percentage = 99.999
  const a = (percentage * 2 * Math.PI) / 100 // angle (in radian) depends on percentage
  const r = radius // radius of the circle
  const rx = r
  const ry = r
  const xAxisRotation = 0
  let largeArcFlag = 1
  const sweepFlag = 1
  const x = r + r * Math.sin(a)
  const y = r - r * Math.cos(a)
  if (percentage <= 50) {
    largeArcFlag = 0
  } else {
    largeArcFlag = 1
  }

  return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`
}

const CircleProgress = ({
  percentage = 0,
  blankColor = '#E6E8FA',
  progressColor = '#29E49C',
  centerColor = 'white',
  progressWidth = 10,
  size = 32,
}) => {
  const half = size / 2
  return (
    <Box style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={half} cy={half} r={half} fill={blankColor} />
        <Path
          d={`M${half} ${half} L${half} 0 ${generateArc(percentage, half)} Z`}
          fill={progressColor}
        />
        <Circle cx={half} cy={half} r={progressWidth} fill={centerColor} />
      </Svg>
    </Box>
  )
}

export default CircleProgress
