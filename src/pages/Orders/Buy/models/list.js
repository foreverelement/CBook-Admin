import { queryBuyOrders, searchBuyOrders } from '@/services/api'

export default {
  namespace: 'buyOrder',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    formParams: {}
  },

  effects: {
    *fetchOrders({ payload, formParams }, { call, put }) {
      const response = yield call(queryBuyOrders, payload)
      if (response === undefined) return
      yield put({
        type: 'save',
        payload: {
          data: response,
          current: payload.offset,
          formParams
        }
      })
    },
    *searchOrders({ payload, formParams }, { call, put }) {
      const response = yield call(searchBuyOrders, payload)
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
