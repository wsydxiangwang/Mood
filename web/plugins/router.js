export default ({ app: { router }, store }) => {
    // 顶部loading
	router.afterEach((to, from) => {
		setTimeout(() => {
			document.querySelector('.loader').style.display = 'none'
		}, 1000)
	})
	router.beforeEach((to, from, next) => {
		document.querySelector('.loader').style.display = 'block'
		next()
	})
}