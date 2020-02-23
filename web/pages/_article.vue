<template>
    <div class="container">
        <header>
            <div class="l icon">
                <span class="logo" @click="toIndex">
                    <img src="../static/image/logo.png">
                </span>
                <span 
                    class="iconfont" 
                    :class="isStore ? 'iconpause' : 'iconplay'" 
                    @click="changeMusic"
                ></span>
            </div>
            <div class="title" :class="{active: title}">{{data.title}}</div>
            <div class="r icon">
                <span 
                    class="iconfont iconheart1" 
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
        <audio id="music" loop="loop" preload="auto">
            <source type="audio/mpeg" :src="data.music">
        </audio>

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
                :class="isStore ? 'iconpause' : 'iconplay'" 
            ></span>
        </div>

        <!-- back top -->
        <!-- <div class="back-top" @click="backTop" v-if="scrollTopBtn">
            top
        </div> -->
    </div>
</template>

<script>
export default {
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
            title: this.data.title,
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
        // 圆环进度
        dashOffset() {
            return (1 - this.percent) * this.dashArray;
        }
    },
    mounted(){
        // 微信分享
        // this.$axios.get('/getsign').then(res => {
        //     wx.config({
        //         debug: true,                   // 调试模式 wx弹窗 pc打印
        //         appId: 'wxc21bbf3b44300995',    // 标识
        //         timestamp: res.data.timestamp,  // 时间戳
        //         nonceStr: res.data.noncestr,    // 随机串
        //         signature: res.data.signature,  // 签名
        //         jsApiList: [                    // 接口
        //             'onMenuShareAppMessage',    // 朋友
        //             'updateAppMessageShareData'
        //         ] 
        //     });
            
        //     wx.ready(() => {
        //         wx.checkJsApi({
        //             jsApiList: ['onMenuShareAppMessage', 'updateAppMessageShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        //             success: function(res) {
        //                 alert(JSON.stringify(res))
        //             }
        //         }),
        //         wx.updateAppMessageShareData({ 
        //             title: '2222', // 分享标题
        //             desc: '33333', // 分享描述
        //             link: res.data.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //             imgUrl: this.data.image, // 分享图标
        //             success: function () {
        //                 // 设置成功
        //                 alert('send success')
        //             },
        //             fail: function(){
        //                 alert('oh')
        //             }
        //         })
        //         // wx.onMenuShareTimeline({
        //         //     title: this.data.title, // 分享标题
        //         //     link: res.data.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //         //     imgUrl: this.data.image, // 分享图标
        //         //     success: function () {
        //         //     // 用户点击了分享后执行的回调函数
        //         //         alert('朋友圈')
        //         //     }
        //         // }),
        //         // wx.onMenuShareAppMessage({ 
        //         //     title: this.data.title,     // 标题
        //         //     desc: this.data.describe,   // 描述
        //         //     link: res.data.url,         // 链接
        //         //     imgUrl: this.data.image,    // 图标
        //         //     type: 'link',
        //         //     dataUrl: '',
        //         //     success: function(){
        //         //         alert('send success')
        //         //     }
        //         // })
        //     });
        //     wx.error(function(res){
        //         alert(res)
        //     });
        // })

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
            }
            // 暂停
            else{
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

            // back top btn
            // if(this.scrollTop >= 2000){
            //     this.scrollTopBtn = true;
            // }else{
            //     this.scrollTopBtn = false;
            // }

            var h1 = document.getElementsByClassName('content')[0];
            var h2 = document.getElementsByClassName('stuff')[0];
            var h3 = document.getElementsByTagName('h1')[0];

            var h = h1.offsetHeight + h2.offsetHeight + h3.offsetHeight - document.documentElement.clientHeight - 100;
            var n = (100 * (this.scrollTop / h)).toFixed(4);

            if(n < 110) this.postProgress = n + '%';

        },
        // 返回顶部
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
                    alert('评论失败，请刷新再试！！')
                })
        },
        myself(){
            this.$router.push('/myself')
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
        let id = context.params.article;
        let {data} = await context.$axios.get(`article/${id}`)
        data.comment.reverse()
		return {data: data}
	}
}
</script>

<style lang="scss" scoped>
.container{
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
        margin: 0 5px;
        transition: all .3s;
        &:hover{
            color: #555;
        }
        &.like, &.like:hover{
            color: #EF6D57;
        }
    }
    .logo{
        display: inline-block;
        height: 20px;
        width: 20px;
        vertical-align: top;
        margin-right: 15px;
        margin-left: 4px;
        cursor: pointer;
        img{
            width: 100%;
            height: 100%;
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
            margin: 0 0 18px;
            mark{
                padding: 0 4px;
                line-height: 22px;
                display: inline-block;
            }
            strong{
                font-weight: bold;
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
            p{
                margin: 10px 0;
            }
        }
        ul, ol{
            margin: 0 0 18px;
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
        &.iconpause{
            padding-left: 1px;
        }
    }
}

@media screen and (max-width: 800px) {
    .container{
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
    }
    .content{
        /deep/ 
        .markdown-body{
            iframe{
                height: 310px;
            }
        }
    }
    .music-btn{
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