import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './buy-cart.html?style=./buy-cart.scss';
import { State, Mutation } from 'vuex-class';

@WithRender
@Component
export class BuyCart extends Vue {
  @Prop() foods;
  @Prop() shopId;
  @State('cartList') cartListState: any;
  @Mutation('ADD_CART') ADD_CART: Function;
  @Mutation('REDUCE_CART') REDUCE_CART: Function;

  showMoveDot: any[] = []; // 控制下落的小圆点显示隐藏
  gotoAddress(path) {
    this.$router.push(path);
  }

  get cartList() {
    return this.cartListState;
  }

  get shopCart() {
    return Object.assign({}, this.cartList[this.shopId]);
  }
  // shopCart变化的时候重新计算当前商品的数量
  get foodNum() {
    const category_id = this.foods.category_id;
    const item_id = this.foods.item_id;
    if (this.shopCart && this.shopCart[category_id] && this.shopCart[category_id][item_id]) {
      let num = 0;
      Object.values(this.shopCart[category_id][item_id]).forEach((item: any) => {
        num += item.num;
      });
      return num;
    } else {
      return 0;
    }
  }

  // 移出购物车
  removeOutCart(
    category_id: string,
    item_id: string,
    food_id: string,
    name: string,
    price: any,
    specs: any,
    packing_fee: any,
    sku_id: string,
    stock: any
  ) {
    if (this.foodNum > 0) {
      this.REDUCE_CART({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
    }
  }
  // 加入购物车，计算按钮位置
  addToCart(
    category_id: string,
    item_id: string,
    food_id: string,
    name: string,
    price: any,
    specs: any,
    packing_fee: any,
    sku_id: string,
    stock: any,
    event: any
  ) {
    this.ADD_CART({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
    const elLeft = event.target.getBoundingClientRect().left;
    const elBottom = event.target.getBoundingClientRect().bottom;
    this.showMoveDot.push(true);
    this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);

  }
  // 显示规格列表
  showChooseList(foodScroll) {
    this.$emit('showChooseList', foodScroll);
  }
  // 点击多规格商品的减按钮，弹出提示
  showReduceTip() {
    this.$emit('showReduceTip');
  }
}
