
import { Component, Vue } from 'vue-property-decorator';
import WithRender from './app.html?style=./app.scss';
import { SvgIcon } from './shared';

@WithRender
@Component({
  components: {
    SvgIcon
  }
})
export default class App extends Vue {
  route: any;
  constructor() {
    super();
    this.route = this.$root;
  }
}

