import { queryRecycleDetail, updateRecycleDetail, updateRecycleDetailDeny } from '@/services/api'

export default {
  namespace: 'recycleDetail',

  state: {
    order: {}
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRecycleDetail, payload)
      if (response === undefined) return
      yield put({
        type: 'save',
        payload: response
      })
      if (callback) callback()
    },
    *update({ payload, isDeny, callback }, { call }) {
      const response = yield call(isDeny ? updateRecycleDetailDeny : updateRecycleDetail, payload)
      if (response === undefined) return
      if (callback) callback()
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        order: action.payload
      }
    }
  }
}
