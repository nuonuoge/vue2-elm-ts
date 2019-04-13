import { Component, Vue } from 'vue-property-decorator';
import WithRender from './forget.html?style=./forget.scss';
import { mobileCode, checkExsis, getcaptchas, changePassword } from '../../service/getData';
import { HeadTop, AlertTip } from '../../shared';

@WithRender
@Component({
  components: {
    HeadTop,
    AlertTip
  }
})

export default class Forget extends Vue {
  phoneNumber: string = null; // 电话号码
  oldPassWord: string = null;
  newPassWord: string = null; // 新密码
  rightPhoneNumber: boolean = false; // 输入的手机号码是否符合要求
  confirmPassWord: string = null; // 确认密码
  captchaCodeImg: any = null; // 验证码地址
  mobileCode: string = null; // 短信验证码
  computedTime: number = 0; // 倒数记时
  showAlert: boolean = false; // 显示提示组件
  alertText: string = null; // 提示的内容
  accountType: string = 'mobile'; // 注册方式
  timer: any = null;
  validate_token: any = null;

  created() {
    this.getCaptchaCode();
  }

  // 判断输入的电话号码
  inputPhone() {
    if (/.+/gi.test(this.phoneNumber)) {
      this.rightPhoneNumber = true;
    } else {
      this.rightPhoneNumber = false;
    }
  }
  // 获取验证吗
  async getVerifyCode() {
    if (this.rightPhoneNumber) {
      this.computedTime = 30;
      // 倒计时
      this.timer = setInterval(() => {
        this.computedTime--;
        if (this.computedTime === 0) {
          clearInterval(this.timer);
        }
      }, 1000);
      // 判断用户是否存在
      const res = await checkExsis(this.phoneNumber, this.accountType);
      // 判断返回的信息是否正确，用户是否注册
      if (res.message) {
        this.showAlert = true;
        this.alertText = res.message;
        return;
      } else if (!res.is_exists) {
        this.showAlert = true;
        this.alertText = '您输入的手机号尚未绑定';
        return;
      }
      // 获取验证信息
      const getCode = await mobileCode(this.phoneNumber);
      if (getCode.message) {
        this.showAlert = true;
        this.alertText = getCode.message;
        return;
      }
      this.validate_token = getCode.validate_token;
    }
  }
  async getCaptchaCode() {
    const res = await getcaptchas();
    this.captchaCodeImg = res.code;
  }
  // 重置密码
  async resetButton() {
    if (!this.phoneNumber) {
      this.showAlert = true;
      this.alertText = '请输入正确的账号';
      return;
    } else if (!this.oldPassWord) {
      this.showAlert = true;
      this.alertText = '请输入旧密码';
      return;
    } else if (!this.newPassWord) {
      this.showAlert = true;
      this.alertText = '请输入新密码';
      return;
    } else if (!this.confirmPassWord) {
      this.showAlert = true;
      this.alertText = '请输确认密码';
      return;
    } else if (this.newPassWord !== this.confirmPassWord) {
      this.showAlert = true;
      this.alertText = '两次输入的密码不一致';
      return;
    } else if (!this.mobileCode) {
      this.showAlert = true;
      this.alertText = '请输验证码';
      return;
    }
    // 发送重置信息
    const res = await changePassword(this.phoneNumber, this.oldPassWord, this.newPassWord, this.confirmPassWord, this.mobileCode);
    if (res.message) {
      this.showAlert = true;
      this.alertText = res.message;
      this.getCaptchaCode();
      return;
    } else {
      this.showAlert = true;
      this.alertText = '密码修改成功';
    }
  }
  closeTip() {
    this.showAlert = false;
  }
}
