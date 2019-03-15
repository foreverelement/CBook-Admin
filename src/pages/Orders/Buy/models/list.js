import { queryBuyOrders } from '@/services/api';

export default {
  namespace: 'buyOrder',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchOrders({ payload }, { call, put }) {
      const response = yield call(queryBuyOrders, payload);
      if (!response) return;
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.Items,
          pagination: { total: payload.Total },
        },
      };
    },
  },
};
