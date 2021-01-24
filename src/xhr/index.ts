import { transformResponse } from '../common/data'
import { createError } from '../common/error'
import { parseHeaders } from '../common/headers'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return // 4-请求完成

      if (request.status === 0) return // 请求出错

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData =
        responseType === 'text' ? request.responseText : transformResponse(request.response)

      const response: AxiosResponse = {
        data: responseData,
        headers: responseHeaders,
        status: request.status,
        statusText: request.statusText,
        config,
        request
      }
      handleResponse(response)
    }

    request.onerror = function handleError() {
      reject(createError('Network error', config, null, request))
    }

    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    Object.keys(headers).forEach(name => {
      request.setRequestHeader(name, headers[name])
    })

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
