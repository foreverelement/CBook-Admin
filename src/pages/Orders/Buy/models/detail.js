import { queryBuyOrderDetail, updateBuyOrderDetail, fetchBuyOrderExpress } from '@/services/api';

export default {
  namespace: 'buyDetail',

  state: {
    order: {},
    express: {
      "markDestination": "300- 03-03 26 ",
      "logisticCode": "73110463138319",
      "shipperCode": "ZTO",
      "packageName": "沪西 ",
      "orderCode": "Tue Mar 12 19:28:06 CST 2019",
      "goodsName": "星月童书书本回收",
      "payType": "寄付现结",
      "quantity": "1",
      "weight": "2kg",
      "receiverData": {
        "name": "唐国华",
        "mobile": "13671887113",
        "province": "上海",
        "city": "上海市",
        "region": "长宁区",
        "address": "甘溪路100弄33号201室"
      },
      "senderData": {
        "name": "feng",
        "mobile": "18502120206",
        "province": "上海市",
        "city": "上海市",
        "region": "长宁区",
        "address": "甘溪路100弄33号201室"
      }
    },
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
