export function getDetails (e: Error) {
  if('errors' in e && Array.isArray(e.errors)) {
    return e.errors.map(error => error.message) as string[]
  }
  return [e.message]
}
