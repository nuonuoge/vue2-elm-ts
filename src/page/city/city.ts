import { Component, Vue } from 'vue-property-decorator';
import WithRender from './city.html?style=./city.scss';
import { currentcity, searchplace } from '../../service/getData';
import { getStore, setStore, removeStore } from '../..//config/mUtils';
import { HeadTop } from '../../shared';

@WithRender
@Component({
  components: {
    HeadTop
  }
})

export default class City extends Vue {
  inputVaule: string = ''; // 搜索地址
  cityid: string = ''; // 当前城市id
  cityname: string = ''; // 当前城市名字
  placelist: any[] = []; // 搜索城市列表
  placeHistory: any[] = []; // 历史搜索记录
  historytitle: boolean = true; // 默认显示搜索历史头部，点击搜索后隐藏
  placeNone: boolean = false; // 搜索无结果，显示提示信息

  // lifecycle hook
  mounted() {
    this.cityid = this.$route.params.cityid;
    // 获取当前城市名字
    currentcity(this.cityid).then(res => {
      this.cityname = res.name;
    });
    this.initData();
  }

  // method
  initData() {
    // 获取搜索历史记录
    if (getStore('placeHistory')) {
      this.placelist = JSON.parse(getStore('placeHistory'));
    } else {
      this.placelist = [];
    }
  }
  // 发送搜索信息inputVaule
  postpois() {
    // 输入值不为空时才发送信息
    if (this.inputVaule) {
      searchplace(this.cityid, this.inputVaule).then(res => {
        this.historytitle = false;
        this.placelist = res;
        this.placeNone = res.length ? false : true;
      });
    }
  }
  /**
   * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
   * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
   */
  nextpage(index: number, geohash: string) {
    const history = getStore('placeHistory');
    const choosePlace = this.placelist[index];
    if (history) {
      let checkrepeat = false;
      this.placeHistory = JSON.parse(history);
      this.placeHistory.forEach(item => {
        if (item.geohash === geohash) {
          checkrepeat = true;
        }
      });
      if (!checkrepeat) {
        this.placeHistory.push(choosePlace);
      }
    } else {
      this.placeHistory.push(choosePlace);
    }
    setStore('placeHistory', this.placeHistory);
    this.$router.push({ path: '/msite', query: { geohash } });
  }

  clearAll() {
    removeStore('placeHistory');
    this.initData();
  }
}
