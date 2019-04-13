import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './head-top.html?style=./head-top.scss';
import { State, Action } from 'vuex-class';

@WithRender
@Component
export class HeadTop extends Vue {
  @Prop() signinUp: string;
  @Prop() headTitle: string;
  @Prop() goBack: string;

  @State('userInfo') stateUserInfo: any;
  @Action('getUserInfo') getUserInfo: Function;

  mounted() {
    // 获取用户信息
    this.getUserInfo();
  }

  get userInfo() {
    return this.stateUserInfo;
  }

}
