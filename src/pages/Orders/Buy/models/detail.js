import { queryBuyOrderDetail, updateBuyOrderDetail, fetchBuyOrderExpress } from '@/services/api';

export default {
  namespace: 'buyDetail',

  state: {
    order: {},
    express: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryBuyOrderDetail, payload);
      if (response === undefined) return;
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(updateBuyOrderDetail, payload);
      const order = yield select(state => state.buyDetail.order);
      if (response === undefined) return;
      yield put({
        type: 'save',
        payload: {...order, orderStatus: payload.status},
      });
      if (callback) callback();
    },
    *fetchPrintData({ payload, callback }, { call, put }) {
      const response = yield call(fetchBuyOrderExpress, payload)
      if (response === undefined) return;
      yield put({
        type: 'saveExpress',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        order: action.payload,
      };
    },
    saveExpress(state, action) {
      return {
        ...state,
        express: action.payload,
      };
    },
  },
};
