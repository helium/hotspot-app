export const toBs64 = (bytes: string) => Buffer.from(bytes).toString('base64')
export const fromBs64 = (encoded: string) =>
  Buffer.from(encoded, 'base64').toString()
