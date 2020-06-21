import Vue from 'vue'

var comsys = {

    install(Vue, option){
        // 设置滚动条位置
        Vue.prototype.$setScroll = (dom, type) => {
            // 计算滚动距离
            const t = document.querySelector(dom).offsetTop;
            const h = document.documentElement.clientHeight || document.body.clientHeight;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            
            const index = type == 'index' ? 200 : 0
            const target = type == 'comment' ? t - 200 : scrollTop + h / 2 - 100 + index

			this.timerScroll = setInterval(() => {
                /**
                 * 滚动条顶部距离
                 * 浏览器视口高度
                 * 文档的总高度
                 */
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

				let speed = (target - scrollTop) / 10;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

				if(((scrollTop + speed) >= target && type !== 'comment') || (scrollTop + speed) <= target && type == 'comment'){
					clearInterval(this.timerScroll)
					document.body.scrollTop = document.documentElement.scrollTop = target;
				}else{
					document.body.scrollTop = document.documentElement.scrollTop = scrollTop + speed;
				}

				if(scrollTop + windowHeight == scrollHeight){
					clearInterval(this.timerScroll)
				}
			}, 25)
        }

        // 加载下一页数据
        let [page, loadingFrom, loadingType] = [1, '', 'more'];
        Vue.prototype.$load = (type, from) => {
            
            // 初始化
            if(type != loadingFrom){
                loadingFrom = type;
                loadingType = 'more';
                page = 1;
            }
                            
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

            if(scrollTop + windowHeight >= scrollHeight){

                if(loadingType == 'nomore' || loadingType == 'loading') return;

                page++;
                loadingType = 'loading';

                const axios = Vue.prototype.$nuxt.$options.$axios;
                
                const data = {
                    page: page,
                    from: from ? 'list' : ''
                }
                return new Promise((resolve, reject) => {
                    axios.get(type, { params: data }).then(res => {
                        setTimeout(() => {
                            loadingType = res.data.body.page == res.data.body.totalPage ? 'nomore' : 'more'                        
                            resolve(res.data)
                        }, 1000)
                    }).catch(err => {
                        loadingType = 'more';
                        reject()
                    })
                })
            }
        }

        const throttle = (fn, interval) => {
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

        /**
         * 首页图片懒加载
         */
        let listenList = []; // 需加载图片

        Vue.directive('lazy', {
            bind: (el, binding, vnode) => {
                // 默认图
                const imageDefult = require('../static/image/404.png')
                el.setAttribute('src', imageDefult)
                listenList.push({ el, src: binding.value || imageDefult})
                window.addEventListener('scroll', watch)
            },
            // 首屏初始化
            inserted: (el, binding, vnode) => {
                const imageDefult = require('../static/image/404.png')
                lazyLoad({ el, src: binding.value || imageDefult})
            },
            unbind: (el, binding) => {
                // 离开路由, 取消监听
                window.removeEventListener('scroll', watch)
            }
        })

        const watch = () => {
            throttle(() => {
                console.log(2)
                for (let i = 0; i < listenList.length; i++){
                    lazyLoad(listenList[i])
                }
            }, 50)()
        }

        // 加载图片
        const lazyLoad = (item) => {
            const {el, src} = item;
            const windowHeight = window.innerHeight
            const position = el.getBoundingClientRect()
            const show = position.top < windowHeight && position.top > -position.height

            // 元素存在，元素可见
            if(src && show){ 
                let img = new Image();
                img.src = src;

                // 加载成功后, 删除需加载的对象
                img.onload = () =>{
                    el.src = src;
                    const index = listenList.indexOf(item);
                    index > -1 && listenList.splice(index, 1)
                }
            }
        }
    }
}
Vue.use(comsys)