import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import WithRender from './shop-list.html?style=./shop-list.scss';
import { State } from 'vuex-class';
import { Loading } from '../loading/loading';
import { shopList } from '../../../service/getData';
import { RatingStar } from '../rating-star/rating-star';
import { ImgBaseUrl } from '../../../config/env';
import { showBack, animate } from '../../../config/mUtils';
import { loadMore } from '../../directives/load-more';

@WithRender
@Component({
  components: {
    Loading,
    RatingStar
  },
  directives: {
    loadMore
  }
})
export class ShopList extends Vue {
  @Prop() restaurantCategoryId: string;
  @Prop() restaurantCategoryIds: string;
  @Prop() sortByType: string;
  @Prop() deliveryMode: string;
  @Prop() supportIds: string[];
  @Prop() confirmSelect: string;
  @Prop() geohash: string;

  @State('latitude') latitudeState: string;
  @State('longitude') longitudeState: string;

  offset: number = 0; // 批次加载店铺列表，每次加载20个 limit = 20
  shopListArr: any = []; // 店铺列表数据
  preventRepeatReuqest: boolean = false; // 到达底部加载数据，防止重复加载
  showBackStatus: boolean = false; // 显示返回顶部按钮
  showLoading: boolean = true; // 显示加载动画
  touchend: boolean = false; // 没有更多数据
  imgBaseUrl: string = ImgBaseUrl;

  @Watch('restaurantCategoryIds') // 监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
  onRestaurantCategoryIdsChanged() {
    this.listenPropChange();
  }

  @Watch('sortByType') // 监听父级传来的排序方式
  onSortByTypeChanged() {
    this.listenPropChange();
  }

  @Watch('confirmSelect') // 监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
  onConfirmSelectChanged() {
    this.listenPropChange();
  }

  mounted() {
    this.initData();
  }

  get latitude() {
    return this.latitudeState;
  }

  get longitude() {
    return this.longitudeState;
  }

  async initData() {
    // 获取数据
    const res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
    this.shopListArr = [...res];
    if (res.length < 20) {
      this.touchend = true;
    }
    this.hideLoading();
    // 开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
    showBack(status => {
      this.showBackStatus = status;
    });
  }
  // 到达底部加载更多数据
  async loaderMore() {
    if (this.touchend) {
      return;
    }
    // 防止重复请求
    if (this.preventRepeatReuqest) {
      return;
    }
    this.showLoading = true;
    this.preventRepeatReuqest = true;

    // 数据的定位加20位
    this.offset += 20;
    const res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
    this.hideLoading();
    this.shopListArr = [...this.shopListArr, ...res];
    // 当获取数据小于20，说明没有更多数据，不需要再次请求数据
    if (res.length < 20) {
      this.touchend = true;
      return;
    }
    this.preventRepeatReuqest = false;
  }
  // 返回顶部
  backTop() {
    animate(document.body, { scrollTop: '0' }, 400, 'ease-out');
  }
  // 监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
  async listenPropChange() {
    this.showLoading = true;
    this.offset = 0;
    const res = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds);
    this.hideLoading();
    // 考虑到本地模拟数据是引用类型，所以返回一个新的数组
    this.shopListArr = [...res];
  }

  // 开发环境与编译环境loading隐藏方式不同
  hideLoading() {
    this.showLoading = false;
  }

  zhunshi(supports) {
    let zhunStatus;
    if ((supports instanceof Array) && supports.length) {
      supports.forEach(item => {
        if (item.icon_name === '准') {
          zhunStatus = true;
        }
      });
    } else {
      zhunStatus = false;
    }
    return zhunStatus;
  }

}
