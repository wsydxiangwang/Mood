
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'author', content: 'Libai' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, shrink-to-fit=no, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { name: 'keywords', content: '白茶, 李白, Libai, 不如吃茶去, 李白茶, 纯音乐, 音乐, 故事, 美文, 习惯独处, 心情小镇, 心情驿站, 李白日记, 心灵驿站, 学习, 加油, 永远相信美好的事情即将发生' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
    // 开启代理 跨域
    '/api': {
      target: process.env.BASE_URL || 'http://localhost:3000/web/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      },
    },
  }, 
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  /*
  ** Global CSS
  */
  css: ["~assets/css/main.css", "~static/css/iconfont.css"],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/vue-mavon-editor', ssr: true },
    { src: '@/plugins/common.js', ssr: false },
    { src: '@/plugins/baidu.js', ssr: false },
    '@/plugins/loading.js'
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
