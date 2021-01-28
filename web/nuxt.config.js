
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'Author', content: 'Libai' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, shrink-to-fit=no, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'image/logo/favicon.ico' }
    ]
  },
  server: {
    port: 8000
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://server:3000/web/api',
  },
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    proxy: true,
    prefix: '/api', // baseURL
    credentials: true,
  },
  proxy: {
    '/api': {
      target: process.env.BASE_URL || 'http://server:3000/web/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      },
    },
    '/uploads': {
      target: 'http://server:3000/',
      changeOrigin: true,
    },
  }, 
  loading: '~/components/loadingTab.vue',
  css: ["~assets/css/main.css", "~assets/css/iconfont.css"],
  plugins: [
    { src: '@/plugins/vue-mavon-editor', ssr: true },
    { src: '@/plugins/common.js', ssr: true },
    { src: '@/plugins/component.js', ssr: true },
    { src: '@/plugins/router.js', ssr: false },
    { src: '@/config/app-config.js', ssr: true },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      const ThemeColorReplacer = require('webpack-theme-color-replacer')
      console.log(ThemeColorReplacer)
      new ThemeColorReplacer({
        matchColors: ['#ed4040', '#4b0', '255,80,80', '27, 92.531%, 52.745%'], // colors array for extracting css file, support rgb and hsl.
        fileName: 'css/theme-colors-[contenthash:8].css', //optional. output css file name, suport [contenthash] and [hash].
        // resolveCss(resultCss) { // optional. Resolve result css code as you wish.
        //     return resultCss.replace(/#ccc/g, '#eee')
        // },
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        // changeSelector(selector, util) { // optional, Funciton. Changing css selectors, in order to raise css priority, to resolve lazy-loading problems.
        //     return util.changeEach(selector, '.el-button--default')
        // },
        injectCss: false, // optional. Inject css text into js file, no need to download `theme-colors-xxx.css` any more.
        isJsUgly: process.env.NODE_ENV !== 'development', // optional. Set to `true` if your js is uglified. Default is set by process.env.NODE_ENV.
    })
    }
  }
}
