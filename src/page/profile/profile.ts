import { Component, Vue, Watch } from 'vue-property-decorator';
import WithRender from './profile.html?style=./profile.scss';
import { HeadTop, FootGuide, GetImgPath } from '../../shared';
import { ImgBaseUrl } from '../../config/env';
import { Mutation, State } from 'vuex-class';


@WithRender
@Component({
  components: {
    HeadTop,
    FootGuide
  }
})

export default class Profile extends Vue {
  profiletitle: string = '我的';
  username: string = '登录/注册'; // 用户名
  resetname: string = '';
  mobile: string = '暂无绑定手机号'; // 电话号码
  balance: number = 0;            // 我的余额
  count: number = 0;             // 优惠券个数
  pointNumber: number = 0;       // 积分数
  avatar: string = '';             // 头像地址
  imgBaseUrl: string = ImgBaseUrl;

  @Mutation('SAVE_AVANDER') SAVE_AVANDER: Function;
  @State('userInfo') userInfoState;

  @Watch('userInfo')
  onUserInfoChanged() {
    this.initData();
  }

  get userInfo() {
    return this.userInfoState;
  }

  get imgpath() {
    let path;
    if (this.avatar.indexOf('/') !== -1) {
      path = this.imgBaseUrl + this.avatar;
    } else {
      path = GetImgPath(this.avatar);
    }
    this.SAVE_AVANDER(path);
    return path;
  }

  mounted() {
    this.initData();
  }

  initData() {
    if (this.userInfo && this.userInfo.user_id) {
      this.avatar = this.userInfo.avatar;
      this.username = this.userInfo.username;
      this.mobile = this.userInfo.mobile || '暂无绑定手机号';
      this.balance = this.userInfo.balance;
      this.count = this.userInfo.gift_amount;
      this.pointNumber = this.userInfo.point;
    } else {
      this.username = '登录/注册';
      this.mobile = '暂无绑定手机号';
    }
  }


}
