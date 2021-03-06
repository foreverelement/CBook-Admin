export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' }
    ]
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // workplace
      { path: '/', redirect: '/workplace' },
      {
        path: '/workplace',
        name: 'workplace',
        icon: 'dashboard',
        component: './Workplace/index'
      },
      // orders
      {
        path: '/orders',
        name: 'orders',
        icon: 'table',
        routes: [
          {
            path: '/orders',
            redirect: '/orders/recycle/list'
          },
          {
            path: '/orders/recycle/list',
            name: 'recycle-list',
            component: './Orders/Recycle/List'
          },
          {
            path: '/orders/recycle/detail/:orderCode',
            name: 'recycle-detail',
            hideInMenu: true,
            component: './Orders/Recycle/Detail'
          },
          {
            path: '/orders/buy/list',
            name: 'buy-list',
            component: './Orders/Buy/List'
          },
          {
            path: '/orders/buy/detail/:orderCode',
            name: 'buy-detail',
            hideInMenu: true,
            component: './Orders/Buy/Detail'
          }
        ]
      },
      // books
      {
        path: '/books',
        name: 'books',
        icon: 'book',
        routes: [
          {
            path: '/books/list',
            name: 'books-list',
            component: './Books/List'
          },
          {
            path: '/books/detail/:bookCode',
            name: 'books-detail',
            hideInMenu: true,
            component: './Books/Detail'
          }
        ]
      },
      // goods
      {
        path: '/goods',
        name: 'goods',
        icon: 'shopping',
        routes: [
          {
            path: '/goods/list',
            name: 'goods-list',
            component: './Goods/List'
          },
          {
            path: '/goods/detail/:goodsId',
            name: 'goods-detail',
            hideInMenu: true,
            component: './Goods/Detail'
          }
        ]
      },
      {
        path: '/bookstack',
        name: 'bookstack',
        icon: 'inbox',
        component: './BookStack/List'
      },
      {
        component: '404'
      }
    ]
  }
]
