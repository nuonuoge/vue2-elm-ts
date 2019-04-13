/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let BaseUrl = '';
const RouterMode = 'hash';
let ImgBaseUrl = '';


if (process.env.NODE_ENV === 'development') {
  ImgBaseUrl = '/img/';

} else if (process.env.NODE_ENV === 'production') {
  BaseUrl = '//elm.cangdu.org';
  ImgBaseUrl = '//elm.cangdu.org/img/';
}

export {
  BaseUrl,
  RouterMode,
  ImgBaseUrl,
};
