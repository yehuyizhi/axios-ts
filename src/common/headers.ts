import { isPlainObject } from './util'

function normalizedHeaders(headers: any): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (name !== name.toLowerCase()) {
      headers[name.toLowerCase()] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any) {
  if (!headers) {
    headers = {}
  } else {
    normalizedHeaders(headers)
  }
  if (isPlainObject(data)) {
    if (!headers['content-type']) {
      headers['content-type'] = 'application/json;charset=utf-8'
    }
  } else if (data === null) {
    delete headers['content-type']
  }

  return headers
}

export function parseHeaders(headers: string): any {
  const parsed = Object.create(null)
  if (!headers) return parsed
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    parsed[key] = val.trim()
  })
  return parsed
}
