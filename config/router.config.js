export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/workplace' },
      { path: '/dashboard', redirect: '/dashboard/workplace' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // orders
      {
        path: '/orders',
        name: 'orders',
        icon: 'table',
        routes: [
          {
            path: '/orders',
            redirect: '/orders/recycle/list',
          },
          {
            path: '/orders/recycle/list',
            name: 'recycle-list',
            component: './Orders/Recycle/List',
          },
          {
            path: '/orders/recycle/detail/:orderCode',
            name: 'recycle-detail',
            hideInMenu: true,
            component: './Orders/Recycle/Detail',
          },
          {
            path: '/orders/buy/list',
            name: 'buy-list',
            component: './Orders/Buy/List',
          },
          {
            path: '/orders/buy/detail/:orderCode',
            name: 'buy-detail',
            hideInMenu: true,
            component: './Orders/Buy/Detail',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
