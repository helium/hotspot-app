export type CacheRecord<T> = T & {
  lastFetchedTimestamp: number
  loading: boolean
}

const asCacheRecord = <T>(item: T) => {
  if (item && 'lastFetchedTimestamp' in item && 'loading' in item) {
    return (item as unknown) as CacheRecord<T>
  }
}

export const hasValidCache = <T>(item: T, mins = 5) => {
  const cacheRecord = asCacheRecord(item)
  if (cacheRecord) {
    const timeInSeconds = 60000 * mins
    return Date.now() - cacheRecord.lastFetchedTimestamp < timeInSeconds
  }
  return false
}

export const handleCacheRejected = <T>(item?: T) => {
  if (!item) {
    return { loading: false } as CacheRecord<T>
  }

  return { ...item, loading: false } as CacheRecord<T>
}

export const handleCacheFulfilled = <T>(item: T) =>
  ({
    ...item,
    loading: false,
    lastFetchedTimestamp: Date.now(),
  } as CacheRecord<T>)

export const handleCachePending = <T>(item?: CacheRecord<T>) => {
  if (!item) {
    return { loading: true } as CacheRecord<T>
  }
  return { ...item, loading: true }
}
