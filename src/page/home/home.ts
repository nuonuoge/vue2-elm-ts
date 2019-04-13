import { Component, Vue } from 'vue-property-decorator';
import WithRender from './home.html?style=./home.scss';
import { cityGuess, hotcity, groupcity } from '../../service/getData';
import { HeadTop } from '../../shared';

@WithRender
@Component({
  components: {
    HeadTop
  }
})

export default class Home extends Vue {
  guessCity: string = '';   // 当前城市
  guessCityid: string = ''; // 当前城市id
  hotcity: any[] = [];     // 热门城市列表
  groupcity: any = {};  // 所有城市列表


  // lifecycle hook
  mounted() {
    cityGuess().then((res: any) => {
      if (res) {
        this.guessCity = res.name;
        this.guessCityid = res.id;
      }
    });

    // 获取热门城市
    hotcity().then(res => {
      this.hotcity = res;
    });

    // 获取所有城市
    groupcity().then(res => {
      this.groupcity = res;
    });
  }


  // computed
  // 将获取的数据按照A-Z字母开头排序
  get sortgroupcity() {
    const sortobj: any = {};
    for (let i = 65; i <= 90; i++) {
      if (this.groupcity[String.fromCharCode(i)]) {
        sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
      }
    }
    return sortobj;
  }


  // method
  // 点击图标刷新页面
  reload() {
    window.location.reload();
  }
}
