import Vue from 'vue'

var comsys = {

    install(Vue, option){
        // 设置滚动条位置
        Vue.prototype.$setScroll = (domObj, number, type) => {
            let t = document.querySelector(domObj).offsetTop;
            let d = document.documentElement.clientHeight;
            let target;

            if(type){
                target = t + number;
            }else{
                target = t + d + number;
            }

			this.timerScroll = setInterval(() => {
				var cur = document.body.scrollTop + document.documentElement.scrollTop;  // 当前位置
				var speed = (target - cur) / 10;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

				if(((cur + speed) >= target && !type) || (cur + speed) <= target && type){
					clearInterval(this.timerScroll)
					document.body.scrollTop = document.documentElement.scrollTop = target;
				}else{
					document.body.scrollTop = document.documentElement.scrollTop = cur + speed;
				}

				if(Vue.prototype.$getScrollTop() + Vue.prototype.$getWindowHeight() == Vue.prototype.$getScrollHeight()){
					clearInterval(this.timerScroll)
				}
			}, 25)
        },
        //滚动条在Y轴上的滚动距离
        Vue.prototype.$getScrollTop = () => {
            var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
            if(document.body){
                bodyScrollTop = document.body.scrollTop;
            }
            if(document.documentElement){
                documentScrollTop = document.documentElement.scrollTop;
            }
            scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
            return scrollTop;
        },
        //文档的总高度
        Vue.prototype.$getScrollHeight = () => {
            var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
            if(document.body){
                bodyScrollHeight = document.body.scrollHeight;
            }
            if(document.documentElement){
                documentScrollHeight = document.documentElement.scrollHeight;
            }
            scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
            return scrollHeight;
        },
        //浏览器视口的高度
        Vue.prototype.$getWindowHeight = () => {
            var windowHeight = 0;
        　　if(document.compatMode == "CSS1Compat"){
        　　　　windowHeight = document.documentElement.clientHeight;
        　　}else{
        　　　　windowHeight = document.body.clientHeight;
        　　}
        　　return windowHeight;
        }  
        
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
    }

}
Vue.use(comsys)