import { stringify } from 'qs';
import request from '@/utils/request';

// 查询回收订单列表
export async function queryRecycleOrders(params) {
  return request.post('/tools/recover/order/list', params);
}

// 查询回收订单详情
export async function queryRecycleDetail(params) {
  return request.post('/tools/recover/order/detail', params);
}

// 更新回收订单详情
export async function updateRecycleDetail(params) {
  return request.post('/tools/recover/order/update', params);
}

// 拒收回收订单
export async function updateRecycleDetailDeny(params) {
  return request.post('/tools/recover/book/deny', params);
}

// 查询买书订单列表
export async function queryBuyOrders(params) {
  return request.post('/tools/buy/order/list', params);
}

// 搜索买书订单列表
export async function searchBuyOrders(params) {
  return request.post('/tools/buy/order/search', params);
}

// 查询买书订单详情
export async function queryBuyOrderDetail(params) {
  return request.post('/tools/buy/order/detail', params);
}

// 更新买书订单状态
export async function updateBuyOrderDetail(params) {
  return request.post('/tools/buy/order/update', params);
}

// 加载买书订单快递信息
export async function fetchBuyOrderExpress (params) {
  return request.post('/tools/buy/order/express/info', params);
}

// 加载图书列表
export async function queryBookList (params) {
  return request.post('/tools/book/list', params);
}

// 加载图书详情
export async function queryBookDetail (params) {
  return request.post('/tools/book/detail', params);
}

// 修改图书信息
export async function updateBook (params) {
  return request.post('/tools/book/update', params);
}

// 加载商品列表
export async function queryGoodsList (params) {
  return request.post('/tools/sales/list', params);
}

// 加载商品详情
export async function queryGoodDetail (params) {
  return request.post('/tools/sales/goods/detail', params);
}

// 修改商品信息
export async function updateGood (params) {
  return request.post('/tools/sales/goods/update', params);
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function accountLogin(params) {
  return request('/tools/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
