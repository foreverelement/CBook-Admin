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
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.Items,
          pagination: { total: action.payload.Total },
        },
      };
    },
  },
};
