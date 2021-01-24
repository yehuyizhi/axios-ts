import { isDate, isObject } from './util'

const SPECAIL_CHAR_REG: Array<[string, RegExp]> = [
  ['@', /%40/g],
  [':', /3A/gi],
  ['$', /%24/g],
  [',', /%2C/gi],
  // ['+', /%20/g],
  ['[', /%5B/gi],
  [']', /%5D/gi]
]

function encode(val: string): string {
  return SPECAIL_CHAR_REG.reduce((res, [char, reg]) => {
    return res.replace(reg, char)
  }, encodeURIComponent(val))
}

export function buildURL(url: string, params?: any): string {
  if (!params) return url
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || val === undefined) return
    let valToArray
    if (Array.isArray(val)) {
      key += '[]'
      valToArray = val
    } else {
      valToArray = [val]
    }
    valToArray.forEach(val => {
      if (isDate(val)) {
        // 在url中
        // val = encodeURIComponent(val.toISOString())
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serializedParams = parts.join('&')
  if (serializedParams) {
    const hashIndex = url.indexOf('#')
    if (hashIndex > -1) {
      url = url.slice(0, hashIndex)
    }
    url += (url.indexOf('?') > -1 ? '&' : '?') + serializedParams
  }
  return url
}
