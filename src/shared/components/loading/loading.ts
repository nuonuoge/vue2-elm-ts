import { Component, Vue } from 'vue-property-decorator';
import WithRender from './loading.html?style=./loading.scss';

@WithRender
@Component
export class Loading extends Vue {
  positionY: number = 0;
  timer: any = null;

  mounted() {
    this.timer = setInterval(() => {
      this.positionY++;
    }, 600);
  }

  beforeDestroy() {
    clearInterval(this.timer);
  }
}
