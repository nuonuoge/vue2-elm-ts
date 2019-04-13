import { Component, Vue } from 'vue-property-decorator';
import { Mutation } from 'vuex-class';
import WithRender from './msite.html?style=./msite.scss';
import { msiteAddress, msiteFoodTypes, cityGuess } from '../../service/getData';
import { HeadTop, FootGuide, ShopList } from '../../shared';
import Swiper from 'swiper';
/* tslint:disable:no-unused-expression*/

@WithRender
@Component({
  components: {
    HeadTop,
    FootGuide,
    ShopList
  }
})

export default class Msite extends Vue {
  geohash: string | string[] = ''; // city页面传递过来的地址geohash
  msiteTitle: string = '请选择地址...'; // msite页面头部标题
  foodTypes: any = []; // 食品分类列表
  hasGetData: boolean = false; // 是否已经获取地理位置数据，成功之后再获取商铺列表信息
  imgBaseUrl: string = 'https://fuss10.elemecdn.com'; // 图片域名地址

  @Mutation('RECORD_ADDRESS') RECORD_ADDRESS;
  @Mutation('SAVE_GEOHASH') SAVE_GEOHASH;

  async beforeMount() {
    if (!this.$route.query.geohash) {
      const address: any = await cityGuess();
      this.geohash = address.latitude + ',' + address.longitude;
    } else {
      this.geohash = this.$route.query.geohash;
    }
    // 保存geohash 到vuex
    this.SAVE_GEOHASH(this.geohash);
    // 获取位置信息
    const res: any = await msiteAddress(this.geohash);
    this.msiteTitle = res.name;
    // 记录当前经度纬度
    this.RECORD_ADDRESS(res);

    this.hasGetData = true;
  }

  mounted() {
    // 获取导航食品类型列表
    msiteFoodTypes(this.geohash).then(res => {
      const resLength: number = res.length;
      const resArr: any[] = [...res]; // 返回一个新的数组
      const foodArr: any[] = [];
      for (let i = 0, j = 0; i < resLength; i += 8, j++) {
        foodArr[j] = resArr.splice(0, 8);
      }
      this.foodTypes = foodArr;
    }).then(() => {
      // 初始化swiper
      new Swiper('.swiper-container', {
        pagination: {
          el: '.swiper-pagination',
        },
        loop: true
      });
    });
  }

  getCategoryId(url: string) {
    const urlData: any = decodeURIComponent(url.split('=')[1].replace('&target_name', ''));
    if (/restaurant_category_id/gi.test(urlData)) {
      return JSON.parse(urlData).restaurant_category_id.id;
    } else {
      return '';
    }
  }
}
