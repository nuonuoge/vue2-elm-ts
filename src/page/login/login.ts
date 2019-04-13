import { Component, Vue } from 'vue-property-decorator';
import WithRender from './login.html?style=./login.scss';
import { mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin } from '../../service/getData';
import { HeadTop, AlertTip } from '../../shared';
import { Mutation } from 'vuex-class';

@WithRender
@Component({
  components: {
    HeadTop,
    AlertTip
  }
})

export default class Login extends Vue {
  loginWay: boolean = false; // 登录方式，默认短信登录
  showPassword: boolean = false; // 是否显示密码
  phoneNumber: any = null; // 电话号码
  mobileCode: any = null; // 短信验证码
  validate_token: any = null; // 获取短信时返回的验证值，登录时需要
  computedTime: number = 0; // 倒数记时
  userInfo: any = null; // 获取到的用户信息
  userAccount: string = null; // 用户名
  passWord: string = null; // 密码
  captchaCodeImg: string = null; // 验证码地址
  codeNumber: string = null; // 验证码
  showAlert: boolean = false; // 显示提示组件
  alertText: string = null; // 提示的内容
  timer: any = null;

  @Mutation('RECORD_USERINFO') RECORD_USERINFO: Function;

  created() {
    this.getCaptchaCode();
  }

  // 判断手机号码
  get rightPhoneNumber() {
    return /^1\d{10}$/gi.test(this.phoneNumber);
  }

  // 改变登录方式
  changeLoginWay() {
    this.loginWay = !this.loginWay;
  }
  // 是否显示密码
  changePassWordType() {
    this.showPassword = !this.showPassword;
  }
  // 获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
  async getCaptchaCode() {
    const res: any = await getcaptchas();
    this.captchaCodeImg = res.code;
  }
  // 获取短信验证码
  async getVerifyCode() {
    if (this.rightPhoneNumber) {
      this.computedTime = 30;
      this.timer = setInterval(() => {
        this.computedTime--;
        if (this.computedTime === 0) {
          clearInterval(this.timer);
        }
      }, 1000);
      // 判读用户是否存在
      const exsis: any = await checkExsis(this.phoneNumber, 'mobile');
      if (exsis.message) {
        this.showAlert = true;
        this.alertText = exsis.message;
        return;
      } else if (!exsis.is_exists) {
        this.showAlert = true;
        this.alertText = '您输入的手机号尚未绑定';
        return;
      }
      // 发送短信验证码
      const res: any = await mobileCode(this.phoneNumber);
      if (res.message) {
        this.showAlert = true;
        this.alertText = res.message;
        return;
      }
      this.validate_token = res.validate_token;
    }
  }
  // 发送登录信息
  async mobileLogin() {
    if (this.loginWay) {
      if (!this.rightPhoneNumber) {
        this.showAlert = true;
        this.alertText = '手机号码不正确';
        return;
      } else if (!(/^\d{6}$/gi.test(this.mobileCode))) {
        this.showAlert = true;
        this.alertText = '短信验证码不正确';
        return;
      }
      // 手机号登录
      this.userInfo = await sendLogin(this.mobileCode, this.phoneNumber, this.validate_token);
    } else {
      if (!this.userAccount) {
        this.showAlert = true;
        this.alertText = '请输入手机号/邮箱/用户名';
        return;
      } else if (!this.passWord) {
        this.showAlert = true;
        this.alertText = '请输入密码';
        return;
      } else if (!this.codeNumber) {
        this.showAlert = true;
        this.alertText = '请输入验证码';
        return;
      }
      // 用户名登录
      this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
    }
    // 如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
    if (!this.userInfo.user_id) {
      this.showAlert = true;
      this.alertText = this.userInfo.message;
      if (!this.loginWay) {
        this.getCaptchaCode();
      }
    } else {
      this.RECORD_USERINFO(this.userInfo);
      this.$router.go(-1);

    }
  }
  closeTip() {
    this.showAlert = false;
  }
}
