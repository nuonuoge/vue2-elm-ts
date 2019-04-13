import { Component, Vue } from 'vue-property-decorator';
import WithRender from './foot-guide.html?style=./foot-guide.scss';
import { State } from 'vuex-class';

@WithRender
@Component
export class FootGuide extends Vue {
  @State('userInfo') stateUserInfo: any;
  gotoAddress(path) {
    this.$router.push(path);
  }
  get userInfo() {
    return this.stateUserInfo;
  }
}
