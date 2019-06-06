import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './compute-time.html?style=./compute-time.scss';
import { AlertTip } from '../alert-tip/alert-tip';


@WithRender
@Component({
  components: {
    AlertTip
  }
})

export class ComputeTime extends Vue {
  countNum: number = 900;
  showAlert: boolean = false;
  alertText: string = null;
  timer: any;

  @Prop() time;

  // 转换时间成分秒
  get remaining() {
    let minute: number | string = parseInt((this.countNum / 60).toString());
    let second: number | string = parseInt((this.countNum % 60).toString());
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (second < 10) {
      second = '0' + second;
    }
    return '去支付(还剩' + minute + '分' + second + '秒)';
  }
  // 订单返回时间秒分分别处理
  get numTime() {
    if (this.time.toString().indexOf('分钟') !== -1) {
      return parseInt(this.time) * 60;
    } else {
      return parseInt(this.time);
    }
  }

  mounted() {
    this.countNum -= this.numTime;
    this.remainingTime();
  }

  closeTip() {
    this.$emit('closeTip');
  }
  // 计算时间
  remainingTime() {
    this.clearTimer();
    this.timer = setInterval(() => {
      this.countNum--;
      if (this.countNum === 0) {
        this.clearTimer();
        this.showAlert = true;
        this.alertText = '支付超时';
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  gotoPay() {
    this.showAlert = true;
    this.alertText = '暂不开放支付接口';
  }


}
