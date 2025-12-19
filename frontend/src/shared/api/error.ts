import { isAxiosError } from 'axios'

export function extractApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as unknown

    if (typeof data === 'string') {
      return data
    }

    if (data && typeof data === 'object') {
      const message = (data as { message?: unknown }).message
      if (typeof message === 'string') {
        return message
      }
      if (message && typeof message === 'object' && 'message' in message) {
        const nested = (message as { message?: unknown }).message
        if (typeof nested === 'string') {
          return nested
        }
      }
      const errorText = (data as { error?: unknown }).error
      if (typeof errorText === 'string') {
        return errorText
      }
    }

    if (error.message) {
      return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Request failed'
}
