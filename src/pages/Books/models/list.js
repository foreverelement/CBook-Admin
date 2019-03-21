import { queryBookList } from '@/services/api';

export default {
  namespace: 'bookList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchBooks({ payload }, { call, put }) {
      const response = yield call(queryBookList, payload);
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
