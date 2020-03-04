export default ({ app: { router }, store }) => {
    router.afterEach((to, from) => {
      /* 告诉增加一个PV */
      try {
        window._hmt = window._hmt || []
        window._hmt.push(['_trackPageview', to.fullPath])
      } catch (e) {}
    })
  }