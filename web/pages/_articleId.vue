<template>
    <div class="container">
        <header>
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
        <section>
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
                        <input type="text" placeholder="称呼" v-model="comment.name">
                        <input type="text" placeholder="邮箱" v-model="comment.email">
                        <input type="text" placeholder="站点" v-model="comment.address">
                    </div>
                    <textarea placeholder="" v-model="comment.content"></textarea>
                    <button type="button" @click="commentSubmit">发表评论</button>
                </div>
                <template v-if="data.comment.length > 0">
                    <h2>评论列表</h2>
                    <div class="comment-list">
                        <div class="comment-item" v-for="(item, index) in data.comment" :key="index">
                            <div class="head">
                                <div class="img">
                                    <img src="https://secure.gravatar.com/avatar/c1870bcd4a5d168d679aecf6f0c68b59?s=40&d=monsterid&r=g" alt="">
                                </div>
                                <div class="name">
                                    <a href="javascript:;">{{item.name}}</a>
                                    <div class="r">
                                        <div class="reply">reply</div>
                                        <span class="time">{{item.time}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="comment-content">{{item.content}}</div>
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
        </section>
    </div>
</template>

<script>
export default {
    // transition: 'article',
    data(){
        return{
            comment: {},
            title: false,
            isLike: false,
            isStore: false,

            timer: null,
            postProgress: 0,
            changeProgress: 0,

            percent: 0,
            mobileMusic: false,
            dashArray: Math.PI * 100,

            scrollTop: 0,
            timerTop: null,
            scrollTopBtn: false,
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
    computed: {
        // mobile music progress
        dashOffset() {
            return (1 - this.percent) * this.dashArray;
        }
    },
	created(){
        this.loading = true;
	},
    mounted(){
        
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
        // request (url) {
        //     return new Promise (resolve => {
        //         let xhr = new XMLHttpRequest();
        //         xhr.open('GET', url);
        //         // 这里需要设置xhr response的格式为arraybuffer
        //         // 否则默认是二进制的文本格式
        //         xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
        //         xhr.setRequestHeader("content-type", 'application/json; charset=utf-8');
        //         xhr.responseType = 'arraybuffer';
        //         xhr.onreadystatechange = function () {
        //             // 请求完成，并且成功
        //             if (xhr.readyState === 4 && xhr.status === 200) {
        //                 resolve(xhr.response);
        //                 console.log(xhr)
        //             }
        //         };
        //         xhr.send();
        //     });
        // },
        // play(context, decodeBuffer){
        //      let source = context.createBufferSource();
        //         source.buffer = decodeBuffer;
        //         source.connect(context.destination);
        //         // 从0s开始播放
        //         source.start(0);
        // },
        // 音乐播放
        changeMusic(){
            
            // Safari是使用webkit前缀
            // let context = new (window.AudioContext || window.webkitAudioContext)();
            // 请求音频数据

            // this.$axios.get('/music', {
            //     header: {
            //         ' Accept-Encoding ' : ' gzip,deflate,sdch '
            //     }
            // }).then(res => {
            //     console.log(res.data)
            // }).catch(err => {
            //     console.log(err)
            // })



            // 进行decode和play
            // context.decodeAudioData(audioMedia, decode => this.play(context, decode));

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
        // 发表评论
        commentSubmit(){

            if(!this.comment.content){
                alert('请先输入您想说的话，再按发表评论按钮哦！！')
                return;
            }
            if(!this.comment.name){
                alert('请输入您的名字！')
                return;
            }
            if(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.comment.email)){
                alert('请输入正确的邮箱，方便发送回复通知！')
                return;
            }

            this.comment.time = this.dateFormat('YYYY/MM/DD HH:mm');
            this.comment.id = this.data.comment[0].id + 1;
            this.comment.comments = [];

            this.$axios.put(`article_comment/${this.data._id}`, this.comment)
                .then(res => {
                    this.data.comment.unshift(this.comment)
                    alert('评论成功')
                }).catch(err => {
                    alert('评论失败，请重新试！！')
                })
        },
        myself(){
            this.$router.push('/Libai')
        },
        toIndex(){
            this.$router.push('/')
        },
        // 时间
        dateFormat(fmt, mm){
            let date = new Date();
            let opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "M+": (date.getMonth() + 1).toString(),     // 月
                "D+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "m+": date.getMinutes().toString(),         // 分
                "s+": date.getSeconds().toString()          // 秒
            };
            for(let k in opt) {
                let ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        }
    },
    async asyncData(context){
        let id = context.params.articleId;
        let {data} = await context.$axios.get(`article/${id}`)
        data.comment.reverse(); // 评论排序
		return {data: data}
	}
}
</script>

<style lang="scss" scoped>
.container section{
    width: 800px;
    margin: auto;
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
    z-index: 99999;
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
        font-size:18px;
        font-weight:400;
        margin-bottom:20px;
        display:inline-block;
        border-bottom:1px solid #666;
        color:#333
    }
    .comment-form{
        border:1px solid #eee;
        margin-bottom:60px;
        border-radius:4px;
        padding:15px 12px;
        .input-box{
            display:flex;
            input{
                width:32.33%;
                height:38px;
                font-size:13px;
                padding-left:10px;
                margin-right:1.5%;
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
        textarea{
            width:100%;
            height:200px;
            margin:10px 0;
            border:1px dashed #eee;
            -webkit-transition:all .3s;
            transition:all .3s;
            border-radius:4px;
            font-size:13px;
            padding:15px;
            outline:none;
            resize:none;
            &:focus{
                border-color: #b9b9b9;
            }
        }
        button{
            height:34px;
            width:100px;
            font-size:13px;
            color:#5f5f5f;
            border-radius:6px;
            background:#eaeaea;
            cursor:pointer;
            outline:none;
            border:none;
            -webkit-transition:all .3s;
            transition:all .3s;
        }
    }
    .comment-list{
        padding:0 0 60px;
        .comment-item{
            padding:25px 0;
            border-bottom:1px solid #f6f7f8;
            
            &:hover .head .name .r .reply{
                opacity: 1;
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
                        &:hover{
                            color:#ef2f11;
                            text-decoration:underline;
                        }
                    }
                    .r{
                        display: flex;
                        .time{
                            color:#999;
                            font-size:12px;
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
                padding:0 0 0 58px
            }
        }
        .comments{
            padding-left:58px;
            margin-top:38px;
            .item{
                margin-top:32px;
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
                .comment-content{
                    color:#666;
                    padding:0;
                    margin:0 0 0 50px;
                    span{
                        color:#00b7ff;
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
    z-index: 99999;
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

@media screen and (max-width: 800px) {
    .container section{
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
                margin-right: 10px;
            }
            .name{
                flex-direction: column;
                align-items: baseline;
                justify-content: space-evenly;
                a{
                    font-size: 13px;
                }
                .r{
                    .time{
                        font-size: 11px;    
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
            margin-top: 10px;
        }
    }
}
@media screen and (max-width: 500px) {
    .content{
        /deep/ 
        .markdown-body{
            iframe{
                height: 260px;
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
</style>