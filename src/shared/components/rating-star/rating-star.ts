import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './rating-star.html?style=./rating-star.scss';

@WithRender
@Component
export class RatingStar extends Vue {
  @Prop() rating: number;
}
