
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
      { name: 'keywords', content: '白茶,李白,Libai,web,前端,设计,不如吃茶去,纯音乐,故事,心情小镇,学习,永远相信美好的事情即将发生'},
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
    baseUrl: process.env.BASE_URL || 'http://localhost:3000/web/api',
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
    prefix: '/api', // baseURL
    credentials: true,
  },
  proxy: {
    '/api': {
      target: process.env.BASE_URL || 'http://localhost:3000/web/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      },
    },
    '/uploads': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
  }, 
  /*
  ** Customize the progress-bar color
  */
  // loading: '~/components/loading.vue',
  loading: false,
  /*
  ** Global CSS
  */
  css: ["~assets/css/main.css", "~assets/css/iconfont.css"],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/vue-mavon-editor', ssr: true },
    { src: '@/plugins/common.js', ssr: true },
    { src: '@/plugins/component.js', ssr: true },
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
    }
  }
}
