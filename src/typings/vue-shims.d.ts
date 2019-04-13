declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.html' {
  import Vue, { ComponentOptions, FunctionalComponentOptions } from 'vue'
  interface WithRender {
    <V extends Vue, U extends ComponentOptions<V> | FunctionalComponentOptions>(options: U): U
    <V extends typeof Vue>(component: V): V
  }
  const withRender: WithRender
  export default withRender
}

declare module '*.scss' {
  import Vue, { ComponentOptions, FunctionalComponentOptions } from 'vue'
  interface WithRender {
    <V extends Vue, U extends ComponentOptions<V> | FunctionalComponentOptions>(options: U): U
    <V extends typeof Vue>(component: V): V
  }
  const withRender: WithRender
  export default withRender
}

declare module '*.css' {
  import Vue, { ComponentOptions, FunctionalComponentOptions } from 'vue'
  interface WithRender {
    <V extends Vue, U extends ComponentOptions<V> | FunctionalComponentOptions>(options: U): U
    <V extends typeof Vue>(component: V): V
  }
  const withRender: WithRender
  export default withRender
}