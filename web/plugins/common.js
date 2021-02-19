import Vue from 'vue'

var common = {

    install(Vue, option){

        function getWin(type) {
            return document.documentElement[type] || document.body[type]
        }

        // 设置滚动条位置
        Vue.prototype.$setScroll = (dom, type, speed = 10) => {
            // DOM元素 计算位置
            const domTop = document.querySelector(dom).offsetTop
            let target

            if (type == 'top') {
                target = 0
            } else if (type == 'comment') {
                const h = document.querySelector('.comment-form').offsetHeight
                target = domTop - getWin('clientHeight') + h
            } else {
                const index = type === 'index' ? 280 : -700
                target = domTop + (getWin('clientHeight') / 2) + index
            }

            let beforeScroll = 0

			this.timerScroll = setInterval(() => {
                let scrollT = getWin('scrollTop')
                let length = (target - scrollT) / speed
                
				length = length > 0 ? Math.ceil(length) : Math.floor(length)
                scrollT = document.body.scrollTop = document.documentElement.scrollTop = scrollT + length

                let result = null
                if (type === 'comment') {
                    result = (beforeScroll && scrollT > beforeScroll) || scrollT <= target || scrollT === 0
                } else if (type == 'top') {
                    result = scrollT == target || (beforeScroll && scrollT > beforeScroll)
                } else {
                    result = scrollT <= beforeScroll || (scrollT + length) >= target
                }

                if (result) {
                    clearInterval(this.timerScroll)
                }
                
                beforeScroll = scrollT
			}, 25)
        }


        // 加载下一页数据
        let [page, loadType] = [1, 'more']
        Vue.prototype.$loadMore = (type, callback) => {       
            if (type == 'none') {
                page = 1
                loadType = 'more'
                return
            }     
            if (loadType == 'loading' || loadType == 'nomore') {
                return
            }
            const axios = Vue.prototype.$nuxt.$options.$axios

            page++
            setLoadType('loading')

            axios.get(type, { params: { page } }).then(res => {
                const data = res.data.body
                setTimeout(() => {
                    callback(res.data)
                    setLoadType(data.page == data.totalPage ? 'nomore' : 'more')
                }, 500)
            }).catch(err => {
                page--
                setLoadType('more')
                callback(err)
            })
        }
        function setLoadType(type) {
            const store = Vue.prototype.$nuxt.$store
            store.commit('setStatus', type)
            loadType = type
        }

        /**
         * 首页图片懒加载 start
         */
        let listenList = []
        Vue.directive('lazy', {
            inserted: (el, binding) => {
                const src = binding.value
                if (src) {
                    listenList.push({ el, src })
                    window.addEventListener('scroll', watch)
                    lazyLoad({ el, src })      // 首屏初始化
                }
            }
        })
        function watch(){
            Vue.prototype.$throttle(() => listenList.map(i => lazyLoad(i)) , 100)()
        }
        // 加载图片
        const lazyLoad = (item) => {
            const { el, src } = item
            const info = el.getBoundingClientRect()
            const show = info.bottom + 100 > 0 && info.top - getWin('clientHeight') < 0
            if (src && show) {
                let img = new Image()
                img.src = src
                img.onload = () =>{
                    el.src = src
                    const index = listenList.indexOf(item)
                    index > -1 && listenList.splice(index, 1)
                    if (listenList.length === 0) {
                        window.removeEventListener('scroll', watch)
                    }
                }
            }
        }
        /**
         * 首页图片懒加载 end
         */

        Vue.prototype.$throttle = (fn, interval) => {
            let flag = true;
            return function(...args) {
                if (flag){
                    flag = false;
                    setTimeout(() => {
                        fn.apply(this, args);
                        flag = true;
                    }, interval);
                }
            }
        }
        Vue.prototype.$debounce = (fn, interval) => {
            let timer = null;
            return function (...args) {
                if(timer) clearTimeout(timer);
                    timer = setTimeout(() => {
                    fn.apply(this, args);
                }, interval);
            }
        }
    }
}

Vue.use(common)