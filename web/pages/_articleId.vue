<template>
    <div class="articleld">
        <header :class="isVerification?'verify':''">
            <div class="l icon">
                <span class="iconfont icon-logo3 logo" @click="toIndex"></span>
                <span 
                    class="iconfont" 
                    :class="isStore ? 'icon-pause' : 'icon-play'" 
                    @click="changeMusic"
                ></span>
            </div>
            <div class="title" :class="{active: title}">{{data.title}}</div>
            <div class="r icon">
                <span 
                    class="iconfont icon-like" 
                    :class="{like: isLike}"
                    @click="like"
                ></span>
                <!-- <span class="iconfont iconwechat" @click="wechat"></span> -->
                <span class="myself" @click="myself">
                    <img src="../static/image/myself.png">
                </span>
            </div>
            <!-- 音乐进度条 -->
            <div class="musicBar" :style="{width: changeProgress}"></div>
            <!-- 文章进度条 -->
            <div class="scrollbar" :style="{width: postProgress}"></div>
        </header>
        <section :class="isVerification?'verify':''">
            <h1 class="title">{{data.title}}</h1>
            <div class="stuff">
                <span>{{data.time.monthTxt}}月 {{data.time.day}}, {{data.time.year}}</span>
                <span>阅读 {{data.read}}</span>
                <span>字数 {{data.words}}</span>
                <span>评论 {{data.comment.length}}</span>
                <span>喜欢 {{data.like}}</span>
                <span v-if="data.stick">置顶</span>
            </div>
            <div class="content">
                <client-only>
                    <mavon-editor codeStyle="monokai-sublime" v-html="data.contentHtml"/>
                </client-only>
            </div>
            <div class="comment">
                <div class="comment-form">
                    <div class="input-box">
                        <input type="text" placeholder="Name" v-model="comment.name">
                        <input type="text" placeholder="Email" v-model="comment.email">
                        <!-- <input type="text" placeholder="Address" v-model="comment.address"> -->
                    </div>
                    <div class="reply-name" v-if="isReply">
                        <span class="">@{{replyObjs.name || replyObj.name}}</span>
                        <span class="iconfont icon-close" @click="cancel"></span>
                    </div>
                    <textarea class="textarea" placeholder="What do you want to say..." v-model="comment.content"></textarea>

                    <!-- submit loading -->
                    <div class="bottom">
                        <button type="button" @click="commentSubmit" :class="submitStatus == 9?'active':''">SUBMIT</button>

                        <template v-if="submitStatus == 9">
                            <div class="hint loading">
                                <div class="sk-circle selected">
                                    <div class="sk-circle1 sk-child"></div>
                                    <div class="sk-circle2 sk-child"></div>
                                    <div class="sk-circle3 sk-child"></div>
                                    <div class="sk-circle4 sk-child"></div>
                                    <div class="sk-circle5 sk-child"></div>
                                    <div class="sk-circle6 sk-child"></div>
                                    <div class="sk-circle7 sk-child"></div>
                                    <div class="sk-circle8 sk-child"></div>
                                    <div class="sk-circle9 sk-child"></div>
                                    <div class="sk-circle10 sk-child"></div>
                                    <div class="sk-circle11 sk-child"></div>
                                    <div class="sk-circle12 sk-child"></div>
                                </div>
                                <span class="loading-text">Submitting...</span>
                            </div>
                        </template>

                        <template v-else-if="submitStatus == 1">
                            <div class="hint success">
                                <span class="iconfont icon-success"></span>
                                <span>评论成功, Nice.</span>
                            </div>
                        </template>

                        <template v-if="submitStatus!=0 && submitStatus!=1 && submitStatus != 9 ">
                            <div class="hint red">
                                <span class="iconfont icon-error"></span>
                                <span v-if="submitStatus == 3">您的名字是第一印象哦～</span>
                                <span v-else-if="submitStatus == 4">胆敢冒充站长，来人，拉出去砍了！！</span>
                                <span v-else-if="submitStatus == 5">请输入正确的邮箱，有惊喜的哦～</span>
                                <span v-else-if="submitStatus == 6">偷偷告诉我，你作文是不是0分～</span>
                                <span v-else-if="submitStatus == 7">哇哦！遇到错误，要不再试试</span>
                                <span v-else-if="submitStatus == 8">完成验证才可以提交哦～</span>
                            </div>
                        </template>

                    </div>
                </div>

                <template v-if="data.comment.length > 0">
                    <h2><span>Comment List</span><span>({{data.comment.length}})</span></h2>
                    <div class="comment-list">
                        <!-- 评论列表 -->
                        <div 
                            class="comment-item" 
                            v-for="(item, index) in data.comment" 
                            :key="index"
                            :data-id="item.id"
                        >
                            <div class="comment-item-box">
                                <div class="head">
                                    <div class="img">
                                        <img :src="require('../static/image/comment/'+item.image+'.jpg')">
                                    </div>
                                    <div class="name">
                                        <a>{{item.name}}<span v-if="item.author == 'admin'">我亦行人</span></a>
                                        <div class="r">
                                            <div class="reply" @click="reply(item, 1)">reply</div>
                                            <span class="time">{{item.time.time}} {{item.time.monthEn}} {{item.time.day}}, {{item.time.year}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-content">{{item.content}}</div>
                            </div>

                            <!-- 回复评论 -->
                            <div class="comments" v-if="item.comments.length > 0">
                                <div 
                                    class="item" 
                                    v-for="(items, indexs) in item.comments" 
                                    :key="indexs"
                                    :data-id="items.id"
                                >
                                    <div class="head">
                                        <div class="img">
                                            <img :src="require('../static/image/comment/'+items.image+'.jpg')">
                                        </div>
                                        <div class="name">
                                            <a>{{items.name}}<span v-if="items.author == 'admin'">我亦行人</span></a>
                                            <div class="r">
                                                <div class="reply" @click="reply(item, 2, items)">reply</div>
                                                <span class="time">{{items.time.time}} {{items.time.monthEn}} {{items.time.day}}, {{items.time.year}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="comments-content"><span v-if="items.type != 1" class="reply-name">{{items.reply}}</span> {{items.content}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- music -->
            <audio id="music" loop="loop" preload="auto" ref="audio"></audio>

            <!-- mobile music -->
            <div 
                class="music-btn" 
                @click="changeMusic"
                :class="mobileMusic ? 'show' : 'exit'"
            >
                <svg class="progress-circle" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
                    <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
                </svg>
                <span 
                    class="iconfont" 
                    :class="isStore ? 'icon-pause' : 'icon-play'" 
                ></span>
            </div>

            <!-- loading -->
            <Loading v-if="loading"></Loading>

        </section>

        <!-- <div :style="{visibility: isVerification?'visible':'hidden'}"> -->
        <div>
            <PuzzleVerification 
                blockType="puzzle" 
                :onSuccess="handleSuccess"
                :verificationShow="isVerification"
                @clone="isVerificationClone"
            />
        </div>
    </div>
</template>

<script>
import Loading from "../components/loading";
import PuzzleVerification from '../components/puzzleVerification'
export default {
	components: {
        Loading,
        PuzzleVerification
    },
    data(){
        return{
            comment: {},
            title: false,
            isLike: false,
            isStore: false,
            ss: false,

            timer: null,
            postProgress: 0,
            changeProgress: 0,

            percent: 0,
            mobileMusic: false,
            dashArray: Math.PI * 100,

            scrollTop: 0,
            timerTop: null,
            scrollTopBtn: false,

            isReply: '',        // 回复
            replyObj: {},       // 回复对象的信息
            replyObjs: {},      // 二级回复对象的信息

            loading: true,             // 页面loading
            submitStatus: 0,          // 提交状态
            isVerification: false,      // 验证状态
            verificationSuccess: false, // 验证成功
        }
    },
    head () {
        return {
            title: `${this.data.title} | 白茶`,
            meta: [
                { hid: 'description', name: 'description', content: this.data.describe }
            ]
        }
    },
    beforeRouteLeave(to,from,next){
        // 销毁滚动条事件
        window.removeEventListener('scroll', this.handleScroll, true)
        next();
    },
    destroyed(){
		document.body.style.overflowY = '';
    },
    computed: {
        // mobile music progress
        dashOffset() {
            return (1 - this.percent) * this.dashArray;
        }
    },
    mounted(){
        //loading
        document.body.style.overflowY = 'hidden';
        setTimeout(() => {
            this.loading = false;
            document.body.style.overflowY = '';
        }, 800)

        // music src
        this.$nextTick(() => {
            this.$refs.audio.src = this.data.music;
        })

        // weixin
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
                this.$axios.get('/getsign').then(res => {
                    wx.config({
                        debug: false,                    // 调试模式 wx弹窗 pc打印
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
                        let desc = this.data.describe.slice(0, 25) + '...';
                        wx.onMenuShareAppMessage({ 
                            title: this.data.title + ' | 白茶',
                            desc: desc,
                            link: res.data.url,
                            imgUrl: this.data.image,
                            type: 'link',
                            dataUrl: ''
                        })
                        wx.onMenuShareTimeline({
                            title: this.data.title + ' | 白茶',
                            link: res.data.url,
                            imgUrl: this.data.image
                        })
                    });
                })
            })
        }  

        // 监听滚动条事件
        window.addEventListener('scroll', this.handleScroll, true)

        // 是否点赞
        let like = localStorage.getItem(`like-${this.data._id}`);
        if(like) this.isLike = true;

        // 阅读量+1
        this.$axios.put(`article_read/${this.data._id}`).then(res => {
            this.data.read++;
        })
    },
    methods: {
        // 取消验证
        isVerificationClone(){
            this.submitStatus = 8;
            this.isVerification = false;
        },
        // 验证通过
        handleSuccess(){
            this.isVerification = false;
            this.verificationSuccess = true;
            setTimeout(() => {
                this.commentSubmit();
            }, 600)
        },
        // 音乐播放
        changeMusic(){
            let music = document.getElementById("music");
            this.isStore = !this.isStore;
            // 播放
            if(this.isStore){
                music.play();
                // 进度条
                this.timer = setInterval(() => {
                    var n = (100 * (music.currentTime / music.duration)).toFixed(2);
                    var ns = (1 * (music.currentTime / music.duration));
                    // 循环
                    if(n >= 100) clearInterval(this.timer);
                    this.changeProgress = n + '%';
                    this.percent = ns;
                }, 50)
            } else {
                music.pause();
                clearInterval(this.timer);
            }
        },
        // 点赞
        like(){
            if(this.isLike){
                alert("已点过赞了哦！")
            }else{
                this.$axios.put(`article_like/${this.data._id}`).then(res => {
                    this.data.like++;
                    this.isLike = true;
                    localStorage.setItem(`like-${this.data._id}`, true);
                })
            }
        },
        // 滚动条位置
        handleScroll(){
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(this.scrollTop >= 100){
                this.title = true;
                this.mobileMusic = true;
            }else{
                this.title = false;
                this.mobileMusic = false;
            }

            var h1 = document.getElementsByClassName('content')[0];
            var h2 = document.getElementsByClassName('stuff')[0];
            var h3 = document.getElementsByTagName('h1')[0];

            var h = h1.offsetHeight + h2.offsetHeight + h3.offsetHeight - document.documentElement.clientHeight - 100;
            var n = (100 * (this.scrollTop / h)).toFixed(4);

            if(n < 110) this.postProgress = n + '%';

        },
        // Back Top
        backTop(){
            this.timerTop = setInterval(() => {
                let osTop = document.documentElement.scrollTop || document.body.scrollTop;
                let ispeed = Math.floor(-osTop / 5);
                document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
                if (osTop === 0) {
                    clearInterval(this.timerTop)
                }
            }, 30)
        },
        //取消回复
        cancel(){
            this.isReply = '';
            this.replyObj = {};
            this.replyObjs = {};
        },
        setScroll(number = 0, time) {
            if (!time) {
                document.body.scrollTop = document.documentElement.scrollTop = number;
                return number;
            }
            const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
            let spacingInex = time / spacingTime; // 计算循环的次数
            let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
            let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
            let scrollTimer = setInterval(() => {
                if (spacingInex > 0) {
                    spacingInex--;
                    this.setScroll(nowTop += everTop);
                } else {
                    clearInterval(scrollTimer); // 清除计时器
                }
            }, spacingTime);
        },
        reply(item, type, items){
            // 跳到评论表单模块
            let t = document.querySelector(".comment").offsetTop;
            this.setScroll(t - 60, 200);

            // 一级回复
            if(type == 1){
                this.isReply = 1;
                this.replyObj = item;
                this.replyObjs = {};
            }
            // 二级回复
            else{
                this.isReply = 2;
                this.replyObj = item;
                this.replyObjs = items;
            }
        },
        // 发表评论
        commentSubmit(){

            if(this.submitStatus == 9) return;

            if(!this.comment.name){
                this.submitStatus = 3;
                return;
            }
            if(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.comment.email)){
                this.submitStatus = 5;
                return;
            }

            if(this.comment.name == '李白' && this.comment.email != '1915398623@qq.com'){
                this.submitStatus = 4;
                return;
            }
            if(!this.comment.content){
                this.submitStatus = 6;
                return;
            }

            if(!this.verificationSuccess){
                // 验证
                this.isVerification = true;
                return;
            }

            // loading
            this.submitStatus = 9   ;

            /**
             * 去掉前后空格
             * 添加当前时间
             */
            this.comment.name = this.comment.name.replace(/(^\s*)|(\s*$)/g, "");
            this.comment.email = this.comment.email.replace(/(^\s*)|(\s*$)/g, "");
            this.comment.content = this.comment.content.replace(/(^\s*)|(\s*$)/g, "");
            this.comment.time = this.dateFormat();
            this.comment.image = Math.floor(Math.random()* 11 + 1);

            if(this.comment.email == '1915398623@qq.com'){
                this.comment.author = 'admin';
                this.comment.image = 1;
            }

            var data = '';
            // 回复评论
            if(this.isReply){
                /**
                 * 根据当前评论id，和最新子评论的id，生成id
                 */
                let length = this.replyObj.comments.length;
                let count = 0;
                if(length == 0){
                    count = Number(this.replyObj.id + '001');
                }else{
                    count = this.replyObj.comments[length - 1].id;
                    count++;
                }
                /**
                 * id
                 * 回复对象名字
                 * 回复对象邮箱
                 */
                this.comment.id = count;
                // 一级回复
                if(this.isReply == 1){
                    this.comment.type = 1;
                    this.comment.reply = '@' + this.replyObj.name;
                    this.comment.replyEmail = this.replyObj.email;
                }else{
                    // 二级回复
                    this.comment.type = 2;
                    this.comment.reply = '@' + this.replyObjs.name;
                    this.comment.replyEmail = this.replyObjs.email;
                }

                /**
                 * 当前评论数组的索引
                 * 所有子评论集合
                 */
                let comment = this.data.comment;
                let index = comment.indexOf(this.replyObj);

                let replyIdx = comment.length - 1 - index;
                let newArr = this.data.comment[index].comments;

                newArr.push(this.comment)

                /**
                 * 评论数据
                 * 回复模式
                 * 评论索引
                 */
                data = {
                    body: newArr,
                    email: {
                        name: this.comment.reply.slice(1),
                        email: this.comment.replyEmail,
                        title: this.data.title,
                        url: window.location.href
                    },
                    type: 'isReply',
                    index: replyIdx
                }
            }
            // 发表评论
            else{
                this.comment.id = this.data.comment.length == 0 ? 1 : this.data.comment[0].id + 1;
                this.comment.comments = [];
                data = this.comment;
            }

            this.$axios.put(`article_comment/${this.data._id}`, data)
                .then(res => {
                    if(res.data.status == 1){
                        setTimeout(() => {
                            /**
                             * if 回复评论
                             * el 发表评论
                             */
                            if(res.data.type){
                                this.isReply = '';
                                this.comment = {};
                                this.replyObj = {};
                                this.replyObjs = {};
                            }else{
                                this.data.comment.unshift(data)
                                this.comment = {}
                            }
                            this.verificationSuccess = false;
                            this.submitStatus = 1;
                            setTimeout(() => {
                                this.submitStatus = 0;
                            }, 3000)
                        }, 1000)
                    }else{
                        this.verificationSuccess = false;
                        this.submitStatus = 7;
                    }                    
                })
                .catch(err => {
                    this.verificationSuccess = false;
                    this.submitStatus = 7;
                })
        },    
        myself(){
            this.$router.push('/Libai')
        },
        toIndex(){
            this.$router.push('/')
        },
        // 时间
        dateFormat(){
            let date = new Date();
            let opt = {
                "Y": date.getFullYear().toString(),        // 年
                "M": (date.getMonth() + 1).toString(),     // 月
                "D": date.getDate().toString(),            // 日
                "H": date.getHours().toString(),           // 时
                "m": date.getMinutes().toString(),         // 分
            };
            let cnArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
            let enArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let time = {};

            opt['H'] = opt['H'].padStart(2, "0");
            opt['m'] = opt['m'].padStart(2, "0");

            time = {
                date: `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`,
                monthNum: opt.M,
                monthCn: cnArr[Number(opt.M) - 1],
                monthEn: enArr[Number(opt.M) - 1],
                year: opt.Y,
                day: opt.D,
                time: `${opt.H}:${opt.m}`,
                hour: opt.H,
                min: opt.m,
            }
            return time
        }
    },
    async asyncData(context){
        let id = context.params.articleId;
        let {data} = await context.$axios.get(`article/${id}`)
        data.comment.reverse(); // 评论倒叙 按最新时间显示
        return {data: data}
	}
}
</script>

<style lang="scss" scoped>
.articleld {
    section{
        width: 800px;
        margin: auto;
        transition: all .3s;
    }
    header{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        border-bottom: 1px solid #f6f7f8;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #666;
        padding: 0 15px;
        background: #fff;
        z-index:9999;
        transition: all .3s;
        .musicBar{
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            height: 50px;
            z-index: -1;
            background: #eee;
        }
        .scrollbar{
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #50bcb6;
            transition: width .5s ease;
        }
        .title{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            transition: all .8s;
            text-align: center;
            opacity: 0;
            &.active{
                opacity: 1;
            }
        }
        .iconfont{
            color: #888;
            font-size: 20px;
            cursor: pointer;
            margin: 4px 5px 0;
            transition: all .3s;
            vertical-align: middle;
            display: inline-block;
            &.logo{
                color: #444;
                font-size: 30px;
            }
            &:hover{
                color: #555;
            }
            &.like, &.like:hover{
                color: #EF6D57;
            }
        }
        .myself{
            width: 26px;
            height: 26px;
            display: inline-block;
            border-radius: 50%;
            overflow: hidden;
            vertical-align: bottom;
            margin-left: 8px;
            cursor: pointer;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .r{
            display: flex;
            align-items: center;
            margin-top: 4px;
            .iconfont{
                margin: 0 8px 0;
            }
        }
    }
    h1.title{
        font-size: 30px;
        padding: 130px 0 22px;
        color: #333;
    }
    .stuff{
        color: #6a737d;
        position: relative;
        line-height: 22px;
        span{
            font-size: 13px;
            margin-right: 10px;
        }
        &:after{
            content: '';
            width: 100px;
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            border-bottom: 1px solid #eaeaea;
        }
    }
    .content{
        padding: 100px 0;
        font-size: 14px;
        /deep/ 
        .markdown-body{
            box-shadow: none !important;
            p{
                line-height: 36px;
                margin: 0 0 22px;
                font-size: 16px;
                mark{
                    padding: 0 4px;
                    line-height: 22px;
                    display: inline-block;
                    font-size: 16px;
                }
                strong{
                    font-weight: bold;
                    font-size: 16px;
                }
            }
            h1, h2, h3, h4, h5{
                border: 0;
                padding: 0;
                margin: 0 0 18px;
                line-height: 28px;
            }
            blockquote{
                background: white;
                border-radius: 10px;
                padding-left: 22px;
                margin-bottom: 20px;
                p{
                    margin: 10px 0;
                }
            }
            ul, ol{
                margin: 0 0 20px;
                li{
                    margin: 10px 0;
                    line-height: 28px;
                }
            }
            ul li{
                list-style: none;
                position: relative;
                &:after{
                    content: '☼';
                    font-size: 8px;
                    position: absolute;
                    top: 0px;
                    left: -16px;
                }
            }
            iframe{
                width: 100%;
                height: 450px;
                margin-bottom: 20px;
            }
            pre{
                padding: 0;
                font-size: 16px;
                max-height: 500px;
                overflow: hidden;
                border-radius: 4px;
                .hljs{
                    padding: 10px 0 10px 12px;
                    line-height: 20px;
                    overflow: hidden;
                    max-height: 500px;
                    box-sizing: border-box;
                    & > code{
                        overflow-y: auto;
                        max-height: 480px;
                        display: block;
                        &::-webkit-scrollbar{
                            width: 4px;
                        }
                        &::-webkit-scrollbar-thumb{
                            background: #949494;
                        }
                        &::-webkit-scrollbar-track{
                            background: #23241f;
                        }
                    }
                }
            }
        }
    }

    .comment{
        h2{
            color:#333;
            font-weight:400;
            margin-bottom:20px;
            font-style: oblique;
            display:inline-block;
            span{
                &:first-child{
                    font-size:18px;
                    margin-right: 8px;
                    border-bottom:1px solid #666;
                }
            }
        }
        .comment-form{
            border:1px solid #eee;
            margin-bottom:60px;
            border-radius:6px;
            padding:15px 12px;
            .input-box{
                display:flex;
                input{
                    width:50%;
                    height:38px;
                    font-size:14px;
                    padding-left:10px;
                    margin-right:12px;
                    -webkit-transition:all .3s;
                    transition:all .3s;
                    border:none;
                    border-bottom:1px dashed #f0f0f0;
                    outline:none;
                    &:focus{
                        border-color:#b9b9b9;
                    }
                    &:last-child{
                        margin: 0;
                    }
                }
            }
            .reply-name{
                color: #fff;
                display: inline-block;
                background: #0084ff;
                border-radius: 21px;
                padding: 0 10px;
                height: 24px;
                line-height: 23px;
                margin-top: 10px;
                span{
                    font-size: 13px;
                    &.iconfont{
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
            }
            textarea{
                width:100%;
                height:200px;
                margin:10px 0;
                color: #333;
                border:1px dashed #eee;
                -webkit-transition:all .3s;
                transition:all .3s;
                border-radius:4px;
                font-size:14px;
                padding:15px;
                outline:none;
                resize:none;
                background: url('~static/image/plbj.png') no-repeat bottom right;
                &:focus{
                    border-color: #b9b9b9;
                }
            }
        }
        .comment-list{
            padding:0 0 60px;
            .comment-item{
                padding:25px 0;
                border-bottom:1px solid #f6f7f8;
                .comment-item-box:hover{
                    .head .name .r .reply{
                        opacity: 1;
                    }
                }
                .head{
                    display:-webkit-box;
                    display:flex;
                    position:relative;
                    .img{
                        width:45px;
                        height:45px;
                        border-radius:50%;
                        margin-right:12px;
                        overflow:hidden;
                        border: 1px solid #f1f1f1;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .name{
                        flex:1;
                        display:-webkit-box;
                        display:flex;
                        -webkit-box-align:center;
                        align-items:center;
                        -webkit-box-pack:justify;
                        justify-content:space-between;
                        a{
                            font-weight:400;
                            color:#ef6d57;
                            font-size:16px;
                            height:20px;
                            -webkit-transition:all .3s;
                            transition:all .3s;
                            text-decoration:none;
                            position: relative;
                            &:hover{
                                color:#ef2f11;
                                text-decoration:underline;
                            }
                            span{
                                color: #fff;
                                position: absolute;
                                top: 50%;
                                font-size: 10px;
                                padding: 1px 7px;
                                margin-top: 2px;
                                white-space: nowrap;
                                background: #a9cff3;
                                border-radius: 0 20px 0;
                                transform: translateY(-50%) scale(0.9);
                            }
                        }
                        .r{
                            display: flex;
                            .time{
                                color:#999;
                                font-size:13px;
                                letter-spacing:0;
                            }
                            .reply{
                                opacity: 0;
                                font-size: 12px;
                                color: #ef6d57;
                                margin-right: 12px;
                                cursor: pointer;
                                transition: all .2s;
                                text-decoration: underline;
                                text-transform: capitalize;
                                &:hover{
                                    font-weight: bold;
                                }
                            }
                        }
                    }
                }
                
                .comment-content{
                    color:#303030;
                    line-height:22px;
                    padding:0 0 0 58px;
                    white-space: pre-wrap;
                }
            }
            .comments{
                padding-left:45px;
                margin-top:38px;
                .item{
                    margin-top:32px;
                    &:hover{
                        .head .name .r .reply{
                            opacity: 1;
                        }
                    }
                    .head{
                        display:-webkit-box;
                        display:flex;
                        -webkit-box-align:center;
                        align-items:center;
                        position:relative;
                        .img{
                            width:40px;
                            height:40px;
                        }
                        .name{
                            position:relative;
                            &:after{
                                content:"";
                                width:100%;
                                border-top:1px solid #f6f7f8;
                                position:absolute;
                                top:-22px;
                                left:0
                            }
                        }
                    }
                    .comments-content{
                        color:#666;
                        padding:0;
                        margin:0 0 0 50px;
                        white-space: pre-wrap;
                        span{
                            color: #fff;
                            background: #a9cff3;
                            display: inline-block;
                            height: 18px;
                            padding: 0 4px;
                            line-height: 20px;
                            border-radius: 10px;
                            margin-right: 2px;
                            font-size: 13px;
                        }
                    }
                }
            }
        }
    }
    .back-top{
        position: fixed;
        bottom: 20px;
        right: 20px;
        height: 20px;
        line-height: 20px;
        background: #50bcb6;
        font-size: 13px;
        z-index: 9999;
        padding: 0 5px;
        color: #fff;
    }
    .music-btn{
        position: fixed;
        right: 30px;
        bottom: 30px;
        width: 36px;
        padding: 3px;
        height: 36px;
        color: #fff;
        opacity: 0.8;
        cursor: pointer;
        z-index: 9999999;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        display: none;
        .progress-circle{
            height: 30px;
            width: 30px;
            circle{
                stroke-width: 10px;
                transform-origin: center;
                &.progress-background{
                    transform: scale(0.9);
                    stroke: #fff;
                }
                &.progress-bar{
                    transform: scale(0.9) rotate(-90deg);
                    stroke: #50bcb6;
                }
            }
        }
        .iconfont{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: inline-block;
            padding: 1px 0 0 3px;
            font-size: 14px;
            &.icon-pause{
                padding-left: 1px;
            }
        }
    }
}

@media screen and (max-width: 800px) {
    .articleld{
        section{
            width: 90%;
        }
        h1.title{
            font-size: 20px;
            padding: 90px 0 15px;
        }
        .content{
            padding: 60px 0;
            /deep/ 
            .markdown-body{
                p{
                    line-height: 28px;
                }
                iframe{
                    height: 390px;
                }
            }
        }
    }
}

@keyframes fadeInTop{
    from {
        opacity: 0;
        -webkit-transform: translate(0, 30px); 
        transform: translate(0, 30px);
    }
    to {
        opacity:1;
        -webkit-transform: translate(0,0);
        transform: translate(0,0);
    }
}
@keyframes fadeInDown{
    from {
        opacity: 1;
        -webkit-transform: translate(0,0px);
        transform: translate(0,0px);
    } 
    to {    
        opacity: 0;
        visibility: hidden;
        -webkit-transform: translate(0,30px); 
        transform: translate(0,30px);
    }
}

@media screen and (max-width: 600px) {
.articleld{
    header{
        position: absolute;
        .scrollbar{
            position: fixed;
            height: 1px;
        }
        .iconfont.logo{
            font-size: 28px;
            margin: 4px 0 0;
        }
    }
    .content{
        /deep/ 
        .markdown-body{
            iframe{
                height: 310px;
            }
            blockquote{
                padding-left: 16px;
            }
            p{
                font-size: 14px;
                strong, mark{
                    font-size: 14px;
                }
            }
        }
    }
    .music-btn{
        opacity: 0;
        display: block;
        &.show{
            visibility: visible;
            animation: fadeInTop 0.6s both;
        }
        &.exit{
            animation: fadeInDown 0.6s both;
        }
    }
    .comment .comment-list .comment-item{
        .head{
            .img{
                width: 40px;
                height: 40px;
                margin-right: 12px;
            }
            .name{
                flex-direction: column;
                align-items: baseline;
                justify-content: space-evenly;
                margin-top: 2px;
                a{
                    font-size: 13px;
                    span{
                        margin-top: -2px;
                    }
                }
                .r{
                    margin-top: 2px;
                    .time{
                        font-size: 12px;    
                    }
                    .reply{
                        opacity: 1;
                        font-size: 12px;
                        color: #ef6d57;
                        position: absolute;
                        right: 0;
                        top: 13px;
                        cursor: pointer;
                        text-decoration: underline;
                        text-transform: capitalize;
                    }
                }
            }
        }
        .comment-content{
            padding: 0;
            margin-top: 12px;
        }
        .comments{
            margin-top: 32px;
            padding-left: 24px;
            .comments-content{
                margin-top: 12px;
                line-height: 22px;
                margin-left: 0px;
            }
        }
    }
}
}
@media screen and (max-width: 500px) {
    .articleld{
        .content{
            /deep/ 
            .markdown-body{
                iframe{
                    height: 260px;
                }
            }
        }
        .comment .comment-form{
            padding: 10px;
            textarea, .input-box input{
                font-size: 13px;
            }
            textarea{
                padding: 12px;
            }
        }
    }
}
@media screen and (max-width: 414px) {
    .content{
        /deep/ 
        .markdown-body{
            iframe{
                height: 220px;
            }
        }
    }
}

.articleld{
    // loading
    .bottom{
        display: flex;
        align-items: center;
        button{
            height:34px;
            line-height:36px;
            width:100px;
            font-size:14px;
            color:#5f5f5f;
            border-radius:6px;
            background:#eaeaea;
            cursor:pointer;
            outline:none;
            border:none;
            margin-right: 12px;
            transition:all .3s;
            &:hover, &.active{
                color: #fff;
                background: #0084ff;
            }
        }
        .hint{
            &.loading{
                display: flex;
                align-items: center;
                .loading-text{
                    color: #0084ff;
                    padding-top: 3px;
                }
            }
            &.red span{
                color: red;
                font-size: 13px;
                margin-right: -2px;
                display: inline-block;
            }
            &.success span{
                color: #2fc700;
                font-size: 13px;
                margin-right: 2px;
            }
        }
    }

    .sk-circle{
        height:20px;
        width:20px;
        z-index:10;
        margin-right:8px;
        display:inline-block;
        position:relative;
        -webkit-transition:all 0.3s ease-in-out 0;
        transition:all 0.3s ease-in-out 0
    }
    .sk-circle .sk-child {
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        top:0
    }
    .sk-circle .sk-child:before {
        content:'';
        display:block;
        margin:0 auto;
        width:15%;
        height:15%;
        background-color:#0084ff;
        border-radius:100%;
        -webkit-animation:sk-circleBounceDelay 1.2s infinite ease-in-out both;
        animation:sk-circleBounceDelay 1.2s infinite ease-in-out both
    }
    .sk-circle .sk-circle2 {
        -webkit-transform:rotate(30deg);
        -ms-transform:rotate(30deg);
        transform:rotate(30deg)
    }
    .sk-circle .sk-circle3 {
        -webkit-transform:rotate(60deg);
        -ms-transform:rotate(60deg);
        transform:rotate(60deg)
    }
    .sk-circle .sk-circle4 {
        -webkit-transform:rotate(90deg);
        -ms-transform:rotate(90deg);
        transform:rotate(90deg)
    }
    .sk-circle .sk-circle5 {
        -webkit-transform:rotate(120deg);
        -ms-transform:rotate(120deg);
        transform:rotate(120deg)
    }
    .sk-circle .sk-circle6 {
        -webkit-transform:rotate(150deg);
        -ms-transform:rotate(150deg);
        transform:rotate(150deg)
    }
    .sk-circle .sk-circle7 {
        -webkit-transform:rotate(180deg);
        -ms-transform:rotate(180deg);
        transform:rotate(180deg)
    }
    .sk-circle .sk-circle8 {
        -webkit-transform:rotate(210deg);
        -ms-transform:rotate(210deg);
        transform:rotate(210deg)
    }
    .sk-circle .sk-circle9 {
        -webkit-transform:rotate(240deg);
        -ms-transform:rotate(240deg);
        transform:rotate(240deg)
    }
    .sk-circle .sk-circle10 {
        -webkit-transform:rotate(270deg);
        -ms-transform:rotate(270deg);
        transform:rotate(270deg)
    }
    .sk-circle .sk-circle11 {
        -webkit-transform:rotate(300deg);
        -ms-transform:rotate(300deg);
        transform:rotate(300deg)
    }
    .sk-circle .sk-circle12 {
        -webkit-transform:rotate(330deg);
        -ms-transform:rotate(330deg);
        transform:rotate(330deg)
    }
    .sk-circle .sk-circle2:before {
        -webkit-animation-delay:-1.1s;
        animation-delay:-1.1s
    }
    .sk-circle .sk-circle3:before {
        -webkit-animation-delay:-1s;
        animation-delay:-1s
    }
    .sk-circle .sk-circle4:before {
        -webkit-animation-delay:-0.9s;
        animation-delay:-0.9s
    }
    .sk-circle .sk-circle5:before {
        -webkit-animation-delay:-0.8s;
        animation-delay:-0.8s
    }
    .sk-circle .sk-circle6:before {
        -webkit-animation-delay:-0.7s;
        animation-delay:-0.7s
    }
    .sk-circle .sk-circle7:before {
        -webkit-animation-delay:-0.6s;
        animation-delay:-0.6s
    }
    .sk-circle .sk-circle8:before {
        -webkit-animation-delay:-0.5s;
        animation-delay:-0.5s
    }
    .sk-circle .sk-circle9:before {
        -webkit-animation-delay:-0.4s;
        animation-delay:-0.4s
    }
    .sk-circle .sk-circle10:before {
        -webkit-animation-delay:-0.3s;
        animation-delay:-0.3s
    }
    .sk-circle .sk-circle11:before {
        -webkit-animation-delay:-0.2s;
        animation-delay:-0.2s
    }
    .sk-circle .sk-circle12:before {
        -webkit-animation-delay:-0.1s;
        animation-delay:-0.1s
    }
    @-webkit-keyframes sk-circleBounceDelay {
        0%, 80%, 100% {
            -webkit-transform:scale(0);
            transform:scale(0)
        }
        40% {
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }
    @keyframes sk-circleBounceDelay {
        0%, 80%, 100% {
            -webkit-transform:scale(0);
            transform:scale(0)
        }
        40% {
            -webkit-transform:scale(1);
            transform:scale(1)
        }
    }
}
.verify{
    filter: blur(5px);
}
</style>