import { queryRecycleOrders } from '@/services/api';

export default {
  namespace: 'recycle',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchOrders({ payload }, { call, put }) {
      const response = yield call(queryRecycleOrders, payload);
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
