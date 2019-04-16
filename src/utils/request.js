import fetch from 'dva/fetch'
import { notification } from 'antd'

const serverUrl = process.env.NODE_ENV !== 'production' ? '/api' : 'https://www.muyin.com/serverapi'
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

const getToken = () =>
  // eslint-disable-next-line
  window.g_app._store.getState().login.token || localStorage.getItem('__TOKEN')

const parseParams = (params = {}) => {
  const result = Object.keys(params).map(key => {
    if (params[key] === undefined) {
      return `${key}=`
    }
    return `${key}=${encodeURIComponent(params[key])}`
  })
  return result.join('&')
}

let isLogout = false

const logout = () => {
  if (isLogout) return
  /* eslint-disable no-underscore-dangle */
  window.g_app._store.dispatch({
    type: 'login/logout'
  })
  isLogout = true
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  const error = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const defaultOptions = {
    // credentials: 'include',
    headers: {
      token: getToken()
    }
  }
  const newOptions = { ...defaultOptions, ...options }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (newOptions.body instanceof FormData) {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers
      }
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers
      }
      newOptions.body = JSON.stringify(newOptions.body)
    }
  } else if (newOptions.method === 'GET' && newOptions.body) {
    const params = parseParams(newOptions.body)
    if (params) {
      if (url.indexOf('?') > -1) {
        /* eslint-disable-next-line */
        url += `&${params}`
      } else {
        /* eslint-disable-next-line */
        url += `?${params}`
      }
    }
    delete newOptions.body
  }

  const reqUrl = /^https?:\/\//.test(url) ? url : `${serverUrl}${url}`

  isLogout = false

  return fetch(reqUrl, newOptions)
    .then(checkStatus)
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text()
      }
      return response.json()
    })
    .then(response => {
      if (response.code === 0) {
        return response.datas
      }
      if (response.code === 98) {
        // token过期
        logout()
      } else {
        notification.error({
          message: '提示信息',
          description: response.msg
        })
      }
      return undefined
    })
    .catch(e => {
      const status = e.name
      if (status === 401) {
        logout()
      } else {
        notification.error({
          message: `请求错误 ${status}: ${url}`,
          description: e.message || e.stack
        })
      }
    })
}

request.get = (url, body) => request(url, { body, method: 'GET' })

request.post = (url, body) => request(url, { body, method: 'POST' })
