import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './alert-tip.html?style=./alert-tip.scss';

@WithRender
@Component

export class AlertTip extends Vue {
  @Prop() alertText: string;
  positionY: number = 0;
  timer: any = null;

  closeTip() {
    this.$emit('closeTip');
  }
}
