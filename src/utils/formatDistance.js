const formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds',
  },

  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds',
  },

  halfAMinute: 'half a minute',

  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes',
  },

  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes',
  },

  aboutXHours: {
    one: '1h',
    other: '{{count}}h',
  },

  xHours: {
    one: '1h',
    other: '{{count}}h',
  },

  xDays: {
    one: '1d',
    other: '{{count}}d',
  },

  aboutXWeeks: {
    one: '1w',
    other: '{{count}}w',
  },

  xWeeks: {
    one: '1w',
    other: '{{count}}w',
  },

  aboutXMonths: {
    one: '1mo',
    other: '{{count}}mo',
  },

  xMonths: {
    one: '1mo',
    other: '{{count}}mo',
  },

  aboutXYears: {
    one: '1y',
    other: '{{count}}y',
  },

  xYears: {
    one: '1y',
    other: '{{count}}y',
  },

  overXYears: {
    one: '1y',
    other: '{{count}}y',
  },

  almostXYears: {
    one: '1y',
    other: '{{count}}y',
  },
}

function formatDistance(token, count, options = {}) {
  let result
  if (typeof formatDistanceLocale[token] === 'string') {
    result = formatDistanceLocale[token]
  } else if (count === 1) {
    result = formatDistanceLocale[token].one
  } else {
    result = formatDistanceLocale[token].other.replace('{{count}}', count)
  }

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return `in ${result}`
    }
    return `${result} ago`
  }

  return result
}

const locale = {
  code: 'en-US',
  formatDistance,
}

export default locale
