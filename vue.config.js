module.exports = {
  chainWebpack: config => {
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .end()
    config.module
      .rule('tsx')
      .test(/\.tsx?$/)
      .use('ts-loader')
      .loader('ts-loader')
      .end()
  },
  configureWebpack: {
    module: {
      rules: [{
        test: /\.html$/,
        loader: 'vue-template-loader',
        exclude: /index.html/,
        options: {
          transformAssetUrls: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          },
          scoped: false
        }
      }],
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.common.js'
      }
    }
  },
  devServer: {
    port: 5555,
    proxy: 'http://cangdu.org:8001',
  }
}