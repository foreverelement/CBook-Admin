import { queryRecycleOrders } from '@/services/api'

export default {
  namespace: 'recycle',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    formParams: {}
  },

  effects: {
    *fetchOrders({ payload, formParams }, { call, put }) {
      const response = yield call(queryRecycleOrders, payload)
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
