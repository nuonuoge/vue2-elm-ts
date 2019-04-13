import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import WithRender from './food.html?style=./food.scss';
import { msiteAddress, foodCategory, foodDelivery, foodActivity } from '../../service/getData';
import { HeadTop, ShopList, GetImgPath } from '../../shared';

@WithRender
@Component({
  components: {
    HeadTop,
    ShopList
  }
})

export default class Food extends Vue {
  geohash: string | string[] = ''; // city页面传递过来的地址geohash
  headTitle: string | string[] = ''; // msiet页面头部标题
  foodTitle: string | string[] = ''; // 排序左侧头部标题
  restaurant_category_id: any = ''; // 食品类型id值
  restaurant_category_ids: string = ''; // 筛选类型的id
  sortBy: string = ''; // 筛选的条件
  category: any = null; // category分类左侧数据
  categoryDetail: any = null; // category分类右侧的详细数据
  sortByType: any = null; // 根据何种方式排序
  Delivery: any = null; // 配送方式数据
  Activity: any = null; // 商家支持活动数据
  delivery_mode: any = null; // 选中的配送方式
  support_ids: any[] = []; // 选中的商铺活动列表
  filterNum: number = 0; // 所选中的所有样式的集合
  confirmStatus: boolean = false; // 确认选择
  getImgPath: Function = GetImgPath;

  @State('latitude') latitudeState: string;
  @State('longitude') longitudeState: string;

  @Mutation('RECORD_ADDRESS') RECORD_ADDRESS: Function;

  get latitude() {
    return this.latitudeState;
  }

  get longitude() {
    return this.longitudeState;
  }

  created() {
    this.initData();
  }

  async initData() {
    // 获取从msite页面传递过来的参数
    this.geohash = this.$route.query.geohash;
    this.headTitle = this.$route.query.title;
    this.foodTitle = this.headTitle;
    this.restaurant_category_id = this.$route.query.restaurant_category_id;
    // 防止刷新页面时，vuex状态丢失，经度纬度需要重新获取，并存入vuex
    if (!this.latitude) {
      // 获取位置信息
      const res: any = await msiteAddress(this.geohash);
      // 记录当前经度纬度进入vuex
      this.RECORD_ADDRESS(res);
    }
    // 获取category分类左侧数据
    this.category = await foodCategory(this.latitude, this.longitude);
    // 初始化时定位当前category分类左侧默认选择项，在右侧展示出其sub_categories列表
    this.category.forEach(item => {
      if (this.restaurant_category_id === item.id) {
        this.categoryDetail = item.sub_categories;
      }
    });
    // 获取筛选列表的配送方式
    this.Delivery = await foodDelivery(this.latitude, this.longitude);
    // 获取筛选列表的商铺活动
    this.Activity = await foodActivity(this.latitude, this.longitude);
    // 记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
    this.Activity.forEach((item: any, index: number) => {
      this.support_ids[index] = { status: false, id: item.id };
    });
  }
  // 点击顶部三个选项，展示不同的列表，选中当前选项进行展示，同时收回其他选项
  async chooseType(type: string) {
    if (this.sortBy !== type) {
      this.sortBy = type;
      // food选项中头部标题发生改变，需要特殊处理
      if (type === 'food') {
        this.foodTitle = '分类';
      } else {
        // 将foodTitle 和 headTitle 进行同步
        this.foodTitle = this.headTitle;
      }
    } else {
      // 再次点击相同选项时收回列表
      this.sortBy = '';
      if (type === 'food') {
        // 将foodTitle 和 headTitle 进行同步
        this.foodTitle = this.headTitle;
      }
    }
  }
  // 选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
  selectCategoryName(id: number, index: number) {
    // 第一个选项 -- 全部商家 因为没有自己的列表，所以点击则默认获取选所有数据
    if (index === 0) {
      this.restaurant_category_ids = null;
      this.sortBy = '';
      // 不是第一个选项时，右侧展示其子级sub_categories的列表
    } else {
      this.restaurant_category_id = id;
      this.categoryDetail = this.category[index].sub_categories;
    }
  }
  // 选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
  getCategoryIds(id, name) {
    this.restaurant_category_ids = id;
    this.sortBy = '';
    this.foodTitle = this.headTitle = name;
  }
  // 点击某个排序方式，获取事件对象的data值，并根据获取的值重新获取数据渲染
  sortList(event: any) {
    let node: Element;
    // 如果点击的是 span 中的文字，则需要获取到 span 的父标签 p
    if (event.target.nodeName.toUpperCase() !== 'P') {
      node = event.target.parentNode;
    } else {
      node = event.target;
    }
    this.sortByType = node.getAttribute('data');
    this.sortBy = '';
  }
  // 筛选选项中的配送方式选择
  selectDeliveryMode(id: number) {
    // delivery_mode为空时，选中当前项，并且filterNum加一
    if (this.delivery_mode == null) {
      this.filterNum++;
      this.delivery_mode = id;
      // delivery_mode为当前已有值时，清空所选项，并且filterNum减一
    } else if (this.delivery_mode === id) {
      this.filterNum--;
      this.delivery_mode = null;
      // delivery_mode已有值且不等于当前选择值，则赋值delivery_mode为当前所选id
    } else {
      this.delivery_mode = id;
    }
  }
  // 点击商家活动，状态取反
  selectSupportIds(index: number, id: number) {
    // 数组替换新的值
    this.support_ids.splice(index, 1, {
      status: !this.support_ids[index].status,
      id
    });
    // 重新计算filterNum的个数
    this.filterNum = this.delivery_mode == null ? 0 : 1;
    this.support_ids.forEach(item => {
      if (item.status) {
        this.filterNum++;
      }
    });
  }
  // 只有点击清空按钮才清空数据，否则一直保持原有状态
  clearSelect() {
    this.support_ids.map(item => (item.status = false));
    this.filterNum = 0;
    this.delivery_mode = null;
  }
  // 点击确认时，将需要筛选的id值传递给子组件，并且收回列表
  confirmSelectFun() {
    // 状态改变时，因为子组件进行了监听，会重新获取数据进行筛选
    this.confirmStatus = !this.confirmStatus;
    this.sortBy = '';
  }
}
