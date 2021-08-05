import { Validator } from '@helium/http'

export const isValidator = (item: unknown): item is Validator =>
  (item as Validator).versionHeartbeat !== undefined

export const formatHeartbeatVersion = (versionHeartbeat: number) => {
  if (!versionHeartbeat) return

  const versionString = versionHeartbeat.toString().padStart(10, '0')
  const major = parseInt(versionString.slice(0, 3), 10)
  const minor = parseInt(versionString.slice(3, 6), 10)
  const patch = parseInt(versionString.slice(6, 10), 10)

  return `v${[major, minor, patch].join('.')}`
}

export const isUnstaked = (validator?: Validator) =>
  validator?.stakeStatus === 'unstaked'
