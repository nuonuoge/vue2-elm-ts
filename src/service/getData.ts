import { HttpClient } from '../config/http-client';

const http = new HttpClient();
import { getStore } from '../config/mUtils';

/**
 * 获取首页默认地址
 */

export const cityGuess = () => http.get('http://cangdu.org:8001/v1/cities', {
  type: 'guess'
});

/**
 * 获取首页热门城市
 */

export const hotcity = () => http.get('/v1/cities', {
  type: 'hot'
});


/**
 * 获取首页所有城市
 */

export const groupcity = () => http.get('/v1/cities', {
  type: 'group'
});

/**
 * 获取当前所在城市
 */

export const currentcity = (cityId: string | number) => http.get('/v1/cities/' + cityId);


/**
 * 获取搜索地址
 */

export const searchplace = (cityid: string, value: string) => http.get('/v1/pois', {
  type: 'search',
  city_id: cityid,
  keyword: value
});


/**
 * 获取msite页面地址信息
 */

export const msiteAddress = geohash => http.get('/v2/pois/' + geohash);


/**
 * 获取msite页面食品分类列表
 */

export const msiteFoodTypes = geohash => http.get('/v2/index_entry', {
  geohash,
  group_type: '1',
  'flags[]': 'F'
});


/**
 * 获取msite商铺列表
 */

export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
  let supportStr = '';
  support_ids.forEach(item => {
    if (item.status) {
      supportStr += '&support_ids[]=' + item.id;
    }
  });
  const data = {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id,
    'restaurant_category_ids[]': restaurant_category_ids,
    order_by,
    'delivery_mode[]': delivery_mode + supportStr
  };
  return http.get('/shopping/restaurants', data);
};


/**
 * 获取search页面搜索结果
 */

export const searchRestaurant = (geohash, keyword) => http.get('/v4/restaurants', {
  'extras[]': 'restaurant_activity',
  geohash,
  keyword,
  type: 'search'
});


/**
 * 获取food页面的 category 种类列表
 */

export const foodCategory = (latitude, longitude) => http.get('/shopping/v2/restaurant/category', {
  latitude,
  longitude
});


/**
 * 获取food页面的配送方式
 */

export const foodDelivery = (latitude, longitude) => http.get('/shopping/v1/restaurants/delivery_modes', {
  latitude,
  longitude,
  kw: ''
});


/**
 * 获取food页面的商家属性活动列表
 */

export const foodActivity = (latitude, longitude) => http.get('/shopping/v1/restaurants/activity_attributes', {
  latitude,
  longitude,
  kw: ''
});


/**
 * 获取shop页面商铺详情
 */

export const shopDetails = (shopid, latitude, longitude) => http.get('/shopping/restaurant/' + shopid, {
  latitude,
  longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
});



/**
 * 获取shop页面菜单列表
 */

export const foodMenu = restaurant_id => http.get('/shopping/v2/menu', {
  restaurant_id
});


/**
 * 获取商铺评价列表
 */

export const getRatingList = (shopid, offset, tag_name = '') => http.get('/ugc/v2/restaurants/' + shopid + '/ratings', {
  has_content: true,
  offset,
  limit: 10,
  tag_name
});


/**
 * 获取商铺评价分数
 */

export const ratingScores = shopid => http.get('/ugc/v2/restaurants/' + shopid + '/ratings/scores');


/**
 * 获取商铺评价分类
 */

export const ratingTags = shopid => http.get('/ugc/v2/restaurants/' + shopid + '/ratings/tags');


/**
 * 获取短信验证码
 */

export const mobileCode = phone => http.post('/v4/mobile/verify_code/send', {
  mobile: phone,
  scene: 'login',
  type: 'sms'
});


/**
 * 获取图片验证码
 */

export const getcaptchas = () => http.post('/v1/captchas', {});


/**
 * 检测帐号是否存在
 */

export const checkExsis = (checkNumber, type) => http.get('/v1/users/exists', {
  [type]: checkNumber,
  type
});


/**
 * 发送帐号
 */

export const sendMobile = (sendData, captcha_code, type, password) => http.post('/v1/mobile/verify_code/send', {
  action: 'send',
  captcha_code,
  [type]: sendData,
  type: 'sms',
  way: type,
  password,
});


/**
 * 确认订单
 */

export const checkout = (geohash, entities, shopid) => http.post('/v1/carts/checkout', {
  come_from: 'web',
  geohash,
  entities,
  restaurant_id: shopid,
});


/**
 * 获取快速备注列表
 */

export const getRemark = (id, sig) => http.get('/v1/carts/' + id + '/remarks', {
  sig
});


/**
 * 获取地址列表
 */

export const getAddress = (id, sig) => http.get('/v1/carts/' + id + '/addresses', {
  sig
});


/**
 * 搜索地址
 */

export const searchNearby = keyword => http.get('/v1/pois', {
  type: 'nearby',
  keyword
});


/**
 * 添加地址
 */

export const postAddAddress = (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => http.post('/v1/users/' + userId + '/addresses', {
  address,
  address_detail,
  geohash,
  name,
  phone,
  phone_bk,
  poi_type,
  sex,
  tag,
  tag_type,
});


/**
 * 下订单
 */

export const placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => http.post('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
  address_id,
  come_from: 'mobile_web',
  deliver_time: '',
  description,
  entities,
  geohash,
  paymethod_id: 1,
  sig,
});


/**
 * 重新发送订单验证码
 */

export const rePostVerify = (cart_id, sig, type) => http.post('/v1/carts/' + cart_id + '/verify_code', {
  sig,
  type,
});



/**
 * 下订单
 */

export const validateOrders = ({
  user_id,
  cart_id,
  address_id,
  description,
  entities,
  geohash,
  sig,
  validation_code,
  validation_token
}) => http.post('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
  address_id,
  come_from: 'mobile_web',
  deliver_time: '',
  description,
  entities,
  geohash,
  paymethod_id: 1,
  sig,
  validation_code,
  validation_token,
});


/**
 * 重新发送订单验证码
 */

export const payRequest = (merchantOrderNo, userId) => http.get('/payapi/payment/queryOrder', {
  merchantId: 5,
  merchantOrderNo,
  source: 'MOBILE_WAP',
  userId,
  version: '1.0.0',
});



/**
 * 获取服务中心信息
 */

export const getService = () => http.get('/v3/profile/explain');



/**
*兑换会员卡
*/

export const vipCart = (id, number, password) => http.post('/member/v1/users/' + id + '/delivery_card/physical_card/bind', {
  number,
  password
});



/**
 * 获取红包
*/

export const getHongbaoNum = id => http.get('/promotion/v2/users/' + id + '/hongbaos?limit=20&offset=0');



/**
 * 获取过期红包
*/


export const getExpired = id => http.get('/promotion/v2/users/' + id + '/expired_hongbaos?limit=20&offset=0');


/**
 * 兑换红包
*/

export const exChangeHongbao = (id, exchange_code, captcha_code) => http.post('/v1/users/' + id + '/hongbao/exchange', {
  exchange_code,
  captcha_code,
});


/**
 * 获取用户信息
 */

export const getUser = () => http.get('/v1/user', { user_id: getStore('user_id') });


/**
 * 手机号登录
 */

export const sendLogin = (code, mobile, validate_token) => http.post('/v1/login/app_mobile', {
  code,
  mobile,
  validate_token
});


/**
 * 获取订单列表
 */

export const getOrderList = (user_id, offset) => http.get('/bos/v2/users/' + user_id + '/orders', {
  limit: 10,
  offset,
});


/**
 * 获取订单详情
 */

export const getOrderDetail = (user_id, orderid) => http.get('/bos/v1/users/' + user_id + '/orders/' + orderid + '/snapshot');


/**
*个人中心里编辑地址
*/

export const getAddressList = (user_id) => http.get('/v1/users/' + user_id + '/addresses');

/**
*个人中心里搜索地址
*/

export const getSearchAddress = (keyword) => http.get('v1/pois', {
  keyword: keyword,
  type: 'nearby'
});

/**
* 删除地址
*/

export const deleteAddress = (userid, addressid) => http.delete('/v1/users/' + userid + '/addresses/' + addressid, {});



/**
 * 账号密码登录
 */
export const accountLogin = (username, password, captcha_code) => http.post('/v2/login', { username, password, captcha_code });


/**
 * 退出登录
 */
export const signout = () => http.get('/v2/signout');


/**
 * 改密码
 */
export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => http.post('/v2/changepassword', { username, oldpassWord, newpassword, confirmpassword, captcha_code });
