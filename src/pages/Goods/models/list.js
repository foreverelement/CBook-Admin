import { queryGoodsList } from '@/services/api';

export default {
  namespace: 'goodsList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGoodsList, payload);
      if (response === undefined) return;
      yield put({
        type: 'save',
        payload: {
          data: response,
          current: payload.offset
        },
      });
    },
  },

  reducers: {
    save(state, { payload: {data, current} }) {
      return {
        ...state,
        data: {
          list: data.Items,
          pagination: { total: data.Total, current },
        },
      };
    },
  },
};
