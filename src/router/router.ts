import Vue from 'vue';
import Router from 'vue-router';
import { RouterMode } from '../config/env';
import App from '../App';

const home = () => import('../page/home/home');
const city = () => import('../page/city/city');
const login = () => import('../page/login/login');
const forget = () => import('../page/forget/forget');
const msite = () => import('../page/msite/msite');
const food = () => import('../page/food/food');

// const home = (r: any) => require.ensure([], () => r(require('../page/home/home')), () => {}, 'Home');

Vue.use(Router);

const routes = [
  {
    path: '/',
    component: App,
    children: [
      // 地址为空时跳转home页面
      {
        path: '',
        redirect: '/home'
      },
      // 首页城市列表页
      {
        path: '/home',
        component: home
      },
      {
        path: '/city/:cityid',
        component: city
      },
      // 所有商铺列表页
      {
        path: '/msite',
        component: msite,
        meta: { keepAlive: true },
      },
      // 特色商铺列表页
      {
        path: '/food',
        component: food
      },
    //   // 搜索页
    //   {
    //     path: '/search/:geohash',
    //     component: search
    //   },
    //   // 商铺详情页
    //   {
    //     path: '/shop',
    //     component: shop,
    //     children: [{
    //       path: 'foodDetail', // 食品详情页
    //       component: foodDetail,
    //     }, {
    //       path: 'shopDetail', // 商铺详情页
    //       component: shopDetail,
    //       children: [{
    //         path: 'shopSafe', // 商铺安全认证页
    //         component: shopSafe,
    //       }]
    //     }]
    //   },
    //   // 确认订单页
    //   {
    //     path: '/confirmOrder',
    //     component: confirmOrder,
    //     children: [{
    //       path: 'remark', // 订单备注
    //       component: remark,
    //     }, {
    //       path: 'invoice', // 发票抬头
    //       component: invoice,
    //     }, {
    //       path: 'payment', // 付款页面
    //       component: payment,
    //     }, {
    //       path: 'userValidation', // 用户验证
    //       component: userValidation,
    //     }, {
    //       path: 'chooseAddress', // 选择地址
    //       component: chooseAddress,
    //       children: [{
    //         path: 'addAddress', // 添加地址
    //         component: addAddress,
    //         children: [{
    //           path: 'searchAddress', // 搜索地址
    //           component: searchAddress,
    //         }]
    //       }]
    //     }]
    //   },
      // 登录注册页
      {
        path: '/login',
        component: login
      },
    //   // 个人信息页
    //   {
    //     path: '/profile',
    //     component: profile,
    //     children: [{
    //       path: 'info', // 个人信息详情页
    //       component: info,
    //       children: [{
    //         path: 'setusername',
    //         component: setusername,
    //       }, {
    //         path: 'address',
    //         component: address,     // 编辑地址
    //         children: [{
    //           path: 'add',
    //           component: add,
    //           children: [{
    //             path: 'addDetail',
    //             component: addDetail
    //           }]
    //         }]
    //       }]
    //     },
    //     {
    //       path: 'service', // 服务中心
    //       component: service,
    //     }]
    //   },
    //   // 修改密码页
      {
        path: '/forget',
        component: forget
      },
    //   // 订单列表页
    //   {
    //     path: '/order',
    //     component: order,
    //     children: [{
    //       path: 'orderDetail', // 订单详情页
    //       component: orderDetail,
    //     }]
    //   },
    //   // vip卡页
    //   {
    //     path: '/vipcard',
    //     component: vipcard,
    //     children: [{
    //       path: 'invoiceRecord', // 开发票
    //       component: invoiceRecord,
    //     }, {
    //       path: 'useCart', // 购买会员卡
    //       component: useCart,
    //     }, {
    //       path: 'vipDescription', // 会员说明
    //       component: vipDescription,
    //     }]
    //   },
    //   // 发现页
    //   {
    //     path: '/find',
    //     component: find
    //   },
    //   // 下载页
    //   {
    //     path: '/download',
    //     component: download
    //   },
    //   // 服务中心
    //   {
    //     path: '/service',
    //     component: service,
    //     children: [{
    //       path: 'questionDetail', // 订单详情页
    //       component: questionDetail,
    //     }]
    //   },
    //   // 余额
    //   {
    //     path: 'balance',
    //     component: balance,
    //     children: [{
    //       path: 'detail', // 余额说明
    //       component: balanceDetail,
    //     }]
    //   },
    //   // 我的优惠页
    //   {
    //     path: 'benefit',
    //     component: benefit,
    //     children: [{
    //       path: 'coupon', // 代金券说明
    //       component: coupon,
    //     }, {
    //       path: 'hbDescription', // 红包说明
    //       component: hbDescription,
    //     }, {
    //       path: 'hbHistory', // 历史红包
    //       component: hbHistory,
    //     }, {
    //       path: 'exchange', // 兑换红包
    //       component: exchange,
    //     }, {
    //       path: 'commend', // 推荐有奖
    //       component: commend,
    //     }]
    //   },
    //   // 我的积分页
    //   {
    //     path: 'points',
    //     component: points,
    //     children: [{
    //       path: 'detail', // 积分说明
    //       component: pointsDetail,
    //     }]
    //   },
    ]
  }
];

// const lazyRoute = [];
export default new Router({
  mode: RouterMode,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 };
    }
  },
  routes: routes
});
