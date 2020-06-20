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
        },

        // 微信分享
        Vue.prototype.$wxShare = (_this, type, dataAll) => {
            if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                const script = document.createElement('script');
                script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';

            　　new Promise((resolve, reject) => {
                　　let done = false;
                　　script.onload = script.onreadystatechange = () => {
                    　　if (!done && (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete')){
                            done = true;
                            script.onload = script.onreadystatechange = null;
                            resolve(script);
                        }
                    }
                    script.onerror = reject;
                    document.getElementsByTagName('head')[0].appendChild(script);
                })
                .then(res => {
                    _this.$axios.get('/getsign').then(res => {
                        wx.config({
                            debug: false,                   // 调试模式 wx弹窗 pc打印
                            appId: res.data.appId,          // 标识
                            timestamp: res.data.timestamp,  // 时间戳
                            nonceStr: res.data.noncestr,    // 随机串
                            signature: res.data.signature,  // 签名
                            jsApiList: [                    // 接口
                                'onMenuShareAppMessage',
                                'onMenuShareTimeline',
                            ] 
                        });
                        wx.ready(() => {
                            wx.checkJsApi({
                                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline',]
                            })
                            
                            /**
                             * 1-首页
                             * 2-文章内容
                             * 3-文章列表
                             * 4-信封
                             * 5-下雨
                             * 6-李白
                             */
                            var data = [
                                {
                                    title: '当白茶遇见了诗',
                                    describe: '愿所有的美好如约而至，愿所有的黑暗都能看到希望',
                                    image: 'https://image.yeyucm.cn/Myself-Resources/weixin/cover.png',
                                },
                                dataAll,
                                {
                                    title: '生活是书的本体',
                                    describe: '整个世界就是一个巨大的图书馆，我们读着别人，创作着自己，等待被读',
                                    image: 'https://image.yeyucm.cn/Myself-Resources/weixin/wen.png',
                                },
                                {
                                    title: '留给你的一封信，请签收',
                                    describe: '未开封的文字在纸上流淌，似乎是在期待着谁的到来',
                                    image: 'https://image.yeyucm.cn/Myself-Resources/weixin/xin.png',
                                },
                                {
                                    title: '下雨咯，赶紧回家啦',
                                    describe: '驻足檐下，看着那漫天滂沱，雷声滚滚，忍不住想起往事',
                                    image: 'https://image.yeyucm.cn/Myself-Resources/weixin/rain.png',
                                },
                                {
                                    title: '你好，我是李白',
                                    describe: '如果下雨了，记得告诉我一下，我想去淋雨。',
                                    image: 'https://image.yeyucm.cn/Myself-Resources/weixin/libai.png',
                                }
                            ];

                            if(type == 2){
                                var desc = data[type - 1].describe.slice(0, 25) + '...';
                            }else{
                                var desc = data[type - 1].describe;
                            }

                            wx.onMenuShareAppMessage({ 
                                title: data[type - 1].title,
                                desc: desc,
                                link: res.data.url,
                                imgUrl: data[type - 1].image,
                                type: 'link',
                                dataUrl: ''
                            })
                            wx.onMenuShareTimeline({
                                title: data[type - 1].title,
                                link: res.data.url,
                                imgUrl: data[type - 1].image
                            })
                        });
                    })
                })
            } 
        }


        // 滚动到底部 加载下一页数据
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
         * 判断元素可见
         */
        function isVisible(el){
            let windowHeight = window.innerHeight
            let position = el.getBoundingClientRect()
            // 当元素的top偏移量小于页面大小并且大于高度的负数
            if(position.top<windowHeight && position.top>-position.height){
                return true
            }
            return false
        }
        
        /**
         * 对图片进行懒加载
         */
        function lazyLoad(img, src){
            if(img && src && isVisible(img)){ // 元素存在，元素未被加载，元素可见
                setTimeout(function(){
                    img.setAttribute('src', src)
                }, 1000) // 模拟网络请求慢的情况
            }
        }

        Vue.directive('lazy', {
            bind: (el, binding, vnode) => {
                console.log(el, binding.value)
                el.setAttribute('src', require('../static/image/404.png'))
                window.addEventListener('scroll', () => {
                    console.log(3)
                    throttle(lazyLoad(el, binding.value), 50)
                })
            },
            // 首屏初始化
            inserted: (el, binding, vnode) => {
                lazyLoad(el, binding.value)
            },
            unbind: (el, binding) => {
                window.removeEventListener('scroll', () => {
                    throttle(lazyLoad(el, binding.value), 50)
                })
            }
        })
  
    }
}
Vue.use(comsys)