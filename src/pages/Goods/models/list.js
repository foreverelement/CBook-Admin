import { queryGoodsList } from '@/services/api'

export default {
  namespace: 'goodsList',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    formParams: {}
  },

  effects: {
    *fetch({ payload, formParams }, { call, put }) {
      const response = yield call(queryGoodsList, payload)
      if (response === undefined) return
      yield put({
        type: 'save',
        payload: {
          data: response,
          current: payload.offset,
          formParams
        }
      })
    }
  },

  reducers: {
    save(state, { payload: { data, current, formParams } }) {
      return {
        ...state,
        data: {
          list: data.Items,
          pagination: { total: data.Total, current }
        },
        formParams
      }
    }
  }
}
