import { Component, Vue, Watch } from 'vue-property-decorator';
import WithRender from './info.html?style=./info.scss';
import { HeadTop, AlertTip } from '../../../shared';
import { ImgBaseUrl } from '../../../config/env';
import { Mutation, State } from 'vuex-class';
import { signout } from '../../../service/getData';
import { removeStore } from '../../../config/mUtils';

@WithRender
@Component({
  components: {
    HeadTop,
    AlertTip
  }
})

export default class Profile extends Vue {
  username: string = '';    // 用户名
  resetname: string = '';  // 重置用户名
  infotel: string = '';  // 用户手机
  avatar: string = '';  // 用户头像
  show: boolean = false; // 显示提示框
  isEnter: boolean = true;  // 是否登录
  isLeave: boolean = false; // 是否退出
  showAlert: boolean = false;
  alertText: any = null;
  imgBaseUrl: string = ImgBaseUrl;
  timer: any;

  @Mutation('OUT_LOGIN') OUT_LOGIN: Function;
  @Mutation('SAVE_AVANDER') SAVE_AVANDER: Function;
  @State('userInfo') userInfoState;
  @State('imgPath') imgPathState;

  @Watch('userInfo')
  onUserInfoChanged(value: any) {
    if (value && value.user_id) {
      this.username = value.username;
      this.infotel = value.mobile;
      this.avatar = value.avatar;
    }
  }

  get userInfo() {
    return this.userInfoState;
  }

  get imgPath() {
    return this.imgPathState;
  }

  exitlogin() {
    this.show = true;
    this.isEnter = true;
    this.isLeave = false;
  }
  waitingThing() {
    // 取消推出
    clearTimeout(this.timer);
    this.isEnter = false;
    this.isLeave = true;
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.show = false;
    }, 200);
  }
  // 退出登录
  async outLogin() {
    this.OUT_LOGIN();
    this.waitingThing();
    this.$router.go(-1);
    removeStore('user_id');
    await signout();
  }
  changePhone() {
    this.showAlert = true;
    this.alertText = '请在手机APP中设置';
  }
  async uploadAvatar() {
    // 上传头像
    if (this.userInfo) {
      const input: any = document.querySelector('.profileinfopanel-upload');
      const data: any = new FormData();
      data.append('file', input.files[0]);
      try {
        const response = await fetch('/eus/v1/users/' + this.userInfo.user_id + '/avatar', {
          method: 'POST',
          credentials: 'include',
          body: data
        });
        const res = await response.json();
        if (res.status === 1) {
          this.userInfo.avatar = res.image_path;
        }
      } catch (error) {
        this.showAlert = true;
        this.alertText = '上传失败';
        throw new Error(error);
      }
    }
  }

  beforeDestroy() {
    clearTimeout(this.timer);
  }

}
