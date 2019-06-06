import { Component, Vue } from 'vue-property-decorator';
import WithRender from './search.html?style=./search.scss';
import { searchRestaurant } from '../../service/getData';
import { HeadTop, FootGuide } from '../../shared';
import { ImgBaseUrl } from '../../config/env';
import { getStore, setStore } from '../../config/mUtils';

@WithRender
@Component({
  components: {
    HeadTop,
    FootGuide
  }
})

export default class Search extends Vue {
  geohash: string = ''; // msite页面传递过来的地址信息
  searchValue: string = ''; // 搜索内容
  restaurantList: any[] = []; // 搜索返回的结果
  imgBaseUrl: string = ImgBaseUrl; // 图片域名地址
  searchHistory: any[] = []; // 搜索历史记录
  showHistory: boolean = true; // 是否显示历史记录，只有在返回搜索结果后隐藏
  emptyResult: boolean = false; // 搜索结果为空时显示

  mounted() {
    this.geohash = this.$route.params.geohash;
    // 获取搜索历史记录
    if (getStore('searchHistory')) {
      this.searchHistory = JSON.parse(getStore('searchHistory'));
    }
  }
  // 点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
  async searchTarget(historyValue) {
    if (historyValue) {
      this.searchValue = historyValue;
    } else if (!this.searchValue) {
      return;
    }
    // 隐藏历史记录
    this.showHistory = false;
    // 获取搜索结果
    this.restaurantList = await searchRestaurant(this.geohash, this.searchValue);
    this.emptyResult = !this.restaurantList.length;
    /**
     * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
     * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
     */
    const history = getStore('searchHistory');
    if (history) {
      let checkrepeat = false;
      this.searchHistory = JSON.parse(history);
      this.searchHistory.forEach(item => {
        if (item === this.searchValue) {
          checkrepeat = true;
        }
      });
      if (!checkrepeat) {
        this.searchHistory.push(this.searchValue);
      }
    } else {
      this.searchHistory.push(this.searchValue);
    }
    setStore('searchHistory', this.searchHistory);
  }
  // 搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
  checkInput() {
    if (this.searchValue === '') {
      this.showHistory = true; // 显示历史记录
      this.restaurantList = []; // 清空搜索结果
      this.emptyResult = false; // 隐藏搜索为空提示
    }
  }
  // 点击删除按钮，删除当前历史记录
  deleteHistory(index) {
    this.searchHistory.splice(index, 1);
    setStore('searchHistory', this.searchHistory);
  }
  // 清除所有历史记录
  clearAllHistory() {
    this.searchHistory = [];
    setStore('searchHistory', this.searchHistory);
  }
}
