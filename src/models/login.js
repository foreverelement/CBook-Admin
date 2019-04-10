import { routerRedux } from 'dva/router'
import { stringify } from 'qs'
import { accountLogin, getFakeCaptcha } from '@/services/api'
import { setAuthority } from '@/utils/authority'
import { getPageQuery } from '@/utils/utils'
import { reloadAuthorized } from '@/utils/Authorized'

export default {
  namespace: 'login',

  state: {
    currentAuthority: 'guest',
    token: ''
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload)
      if (response === undefined) return
      yield put({
        type: 'changeLoginStatus',
        payload: { ...response, currentAuthority: 'user' }
      })
      // Login successfully
      if (response.token) {
        reloadAuthorized()
        localStorage.setItem('__TOKEN', response.token)
        const urlParams = new URL(window.location.href)
        const params = getPageQuery()
        let { redirect } = params
        if (redirect) {
          const redirectUrlParams = new URL(redirect)
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length)
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1)
            }
          } else {
            window.location.href = redirect
            return
          }
        }
        yield put(routerRedux.replace(redirect || '/'))
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload)
    },

    *logout(_, { put, select }) {
      const currentAuthority = yield select(state => state.login.currentAuthority)
      if (currentAuthority === 'guest') return
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: 'guest'
        }
      })
      reloadAuthorized()
      localStorage.removeItem('__TOKEN')
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href
          })
        })
      )
    }
  },

  reducers: {
    changeLoginStatus(state, { payload: { currentAuthority, token } }) {
      setAuthority(currentAuthority)
      return {
        ...state,
        currentAuthority,
        token
      }
    }
  }
}
