import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/Box'
import Text from '../../components/Text'
import HotspotsSvg from './icons/HotspotsSvg'
import AccountSvg from './icons/AccountSvg'
import NetworkSvg from './icons/NetworkSvg'
import MoreSvg from './icons/MoreSvg'
import { MainTabType, TabBarIconType } from './tabTypes'
import useTabColor from './useTabColor'

type Props = {
  name: MainTabType
} & TabBarIconType

const Icon = ({
  size,
  color,
  name,
}: {
  color: string
  size: number
  name: MainTabType
}) => {
  if (name === 'Hotspots') return <HotspotsSvg color={color} size={size} />
  if (name === 'Wallet') return <AccountSvg size={size} color={color} />
  if (name === 'Notifications') return <NetworkSvg size={size} color={color} />
  return <MoreSvg color={color} size={size} />
}

const TabBarIcon = ({ name, focused, size }: Props) => {
  const color = useTabColor(name, focused)
  const { t } = useTranslation()

  return (
    <Box alignItems="center" flex={1} justifyContent="flex-end" padding="xxxs">
      <Icon size={size} color={color} name={name} />
      <Text variant="body2Mono" lineHeight={16} fontSize={10} style={{ color }}>
        {t(`navigation.${name.toLowerCase()}`)}
      </Text>
    </Box>
  )
}

export default TabBarIcon
