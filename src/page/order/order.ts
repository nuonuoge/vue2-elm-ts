import { Component, Vue, Watch } from 'vue-property-decorator';
import WithRender from './order.html?style=./order.scss';
import { HeadTop, FootGuide, Loading, loadMore, ComputeTime } from '../../shared';
import { ImgBaseUrl } from '../../config/env';
import { Mutation, State } from 'vuex-class';
import { getOrderList } from '../../service/getData';

@WithRender
@Component({
  components: {
    HeadTop,
    FootGuide,
    Loading,
    ComputeTime
  },
  directives: {
    loadMore
  }
})

export default class Order extends Vue {
  orderList: any = null; // 订单列表
  offset: number = 0;
  preventRepeat: boolean = false;  // 防止重复获取
  showLoading: boolean = true; // 显示加载动画
  imgBaseUrl: string = ImgBaseUrl;

  @Mutation('SAVE_ORDER') SAVE_ORDER: Function;
  @State('userInfo') userInfoState;
  @State('geohash') geohashState;

  @Watch('userInfo')
  onUserInfoChanged(value: any) {
    if (value && value.user_id && !this.orderList) {
      this.initData();
    }
  }

  get userInfo() {
    return this.userInfoState;
  }

  get geohash() {
    return this.geohashState;
  }

  mounted() {
    this.initData();
  }

  // 初始化获取信息
  async initData() {
    if (this.userInfo && this.userInfo.user_id) {
      const res = await getOrderList(this.userInfo.user_id, this.offset);
      this.orderList = [...res];
      this.hideLoading();
    } else {
      this.hideLoading();
    }
  }
  // 加载更多
  async loaderMore() {
    if (this.preventRepeat) {
      return;
    }
    this.preventRepeat = true;
    this.showLoading = true;
    this.offset += 10;
    // 获取信息
    const res = await getOrderList(this.userInfo.user_id, this.offset);
    this.orderList = [...this.orderList, ...res];
    this.hideLoading();
    if (res.length < 10) {
      return;
    }
    this.preventRepeat = false;
  }
  // 显示详情页
  showDetail(item) {
    this.SAVE_ORDER(item);
    this.preventRepeat = false;
    this.$router.push('/order/orderDetail');
  }
  // 生产环境与发布环境隐藏loading方式不同
  hideLoading() {
    this.showLoading = false;
  }


}
