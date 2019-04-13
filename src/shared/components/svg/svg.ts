import { Component, Vue } from 'vue-property-decorator';
import WithRender from './svg.html';

@WithRender
@Component
export class SvgIcon extends Vue {
}
