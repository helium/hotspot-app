export type CacheRecord<T> = T & {
  lastFetchedTimestamp: number
  loading: boolean
}

const getCacheRecord = <T>(item: T) => {
  if ('lastFetchedTimestamp' in item && 'loading' in item) {
    return (item as unknown) as CacheRecord<T>
  }
}

export const isStale = <T>(item: T, mins = 5) => {
  const cacheRecord = getCacheRecord(item)
  if (cacheRecord) {
    const timeInSeconds = 60000 * mins
    return Date.now() - cacheRecord.lastFetchedTimestamp < timeInSeconds
  }
  return false
}

export const handleRejected = <T>(item: T) =>
  ({ ...item, loading: false } as CacheRecord<T>)

export const handleFulfilled = <T>(item: T) =>
  ({
    ...item,
    loading: false,
    lastFetchedTimestamp: Date.now(),
  } as CacheRecord<T>)

export const handlePending = <T>(item: CacheRecord<T>) => {
  if (!item) {
    return { loading: true, lastFetchedTimestamp: 0 } as CacheRecord<T>
  }
  return { ...item, loading: true, lastFetchedTimestamp: 0 }
}
