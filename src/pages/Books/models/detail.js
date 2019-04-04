import { queryBookDetail, updateBook } from '@/services/api'

export default {
  namespace: 'bookDetail',

  state: {
    data: {}
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryBookDetail, payload)
      if (response === undefined) return
      yield put({
        type: 'save',
        payload: response
      })
      if (callback) callback()
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(updateBook, payload)
      const data = yield select(state => state.bookDetail.data)
      if (response === undefined) return
      yield put({
        type: 'save',
        payload: { ...data, ...payload }
      })
      if (callback) callback()
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      }
    }
  }
}
