import { queryBuyOrders, searchBuyOrders } from '@/services/api'

export default {
  namespace: 'buyOrder',

  state: {
    data: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *fetchOrders({ payload }, { call, put }) {
      const response = yield call(queryBuyOrders, payload)
      if (response === undefined) return
      yield put({
        type: 'save',
        payload: {
          data: response,
          current: payload.offset
        }
      })
    },
    *searchOrders({ payload }, { call, put }) {
      const response = yield call(searchBuyOrders, payload)
      if (response === undefined) return
      yield put({
        type: 'save',
        payload: {
          data: response,
          current: payload.offset
        }
      })
    }
  },

  reducers: {
    save(
      state,
      {
        payload: { data, current }
      }
    ) {
      return {
        ...state,
        data: {
          list: data.Items,
          pagination: { total: data.Total, current }
        }
      }
    }
  }
}
