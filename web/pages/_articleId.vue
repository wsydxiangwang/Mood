<template>
    <div class="articleld">
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
                    <!-- <img src="../static/image/myself.png"> -->
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
                <span>{{data.time.month.cn}}月 {{data.time.day.on}}, {{data.time.year}}</span>
                <span>阅读 {{data.read}}</span>
                <span>字数 {{data.words}}</span>
                <span>评论 {{commentTotal}}</span>
                <span>喜欢 {{data.like}}</span>
            </div>

            <div class="content">
                <client-only>
                    <mavon-editor codeStyle="monokai-sublime" v-html="data.contentHtml"/>
                </client-only>
            </div>

            <!-- music -->
            <audio id="music" loop="loop" preload="auto" ref="audio"></audio>

            <!-- mobile music -->
            <div 
                class="music-btn" 
                @click="changeMusic"
                :class="[mobileMusic]"
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
            <!-- <Loading v-if="loading"></Loading> -->

        </section>

        <!-- comment -->
        <Comment :id="data.id" :title="data.title" @total="total"></Comment>
    </div>
</template>

<script>
import Comment from '@/components/comment'
export default {
    transition: 'test',
	components: { Comment },
    data(){
        return{
            title: false,
            isLike: false,
            isStore: false,
            ss: false,

            timer: null,
            postProgress: 0,
            changeProgress: 0,

            percent: 0,
            mobileMusic: '',
            dashArray: Math.PI * 100,

            scrollTop: 0,
            timerTop: null,
            scrollTopBtn: false,
            loading: true,

            commentTotal: 0,            // 评论数量
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
        this.isPuzzle = false;
        window.removeEventListener('scroll', this.handleScroll, true)
        next();
    },
    destroyed(){
        this.isPuzzle = false;
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

        this.$nextTick(() => {
            // music src
            this.$refs.audio.src = this.data.music;

        })

        // 监听滚动条事件
        window.addEventListener('scroll', this.handleScroll, true)

        // 是否点赞
        const like = localStorage.getItem(`like-${this.data._id}`);
        if(like) this.isLike = true;

        // 阅读量+1
        this.$axios.put(`article_read/${this.data._id}`).then(res => {
            this.data.read++;
        })
    },
    methods: {
        total(val){
            this.commentTotal = val;
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
        handleScroll(){
            /**
             * 顶部进度条
             * title显示 (PC)
             * 音乐播放控制 (Mobile)
             */
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            if(this.scrollTop >= 100){
                this.title = true;
                this.mobileMusic = 'show';
            }else{
                this.title = false;
                this.mobileMusic = this.mobileMusic ? 'exit' : '';
            }

            const h1 = document.getElementsByClassName('content')[0];
            const h2 = document.getElementsByClassName('stuff')[0];
            const h3 = document.getElementsByTagName('h1')[0];

            const h = h1.offsetHeight + h2.offsetHeight + h3.offsetHeight - document.documentElement.clientHeight - 100;
            const n = (100 * (this.scrollTop / h)).toFixed(4);

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
        myself(){
            this.$router.push('/Libai')
        },
        toIndex(){
            this.$router.push('/')
        },
    },
    async asyncData(context){
        try{
            const id = context.params.articleId;
            const {data} = await context.$axios.get(`article/${id}`)
            return {
                data: data
            }
        }catch(err){
            //修改成这样就可以跳到错误提示页面
            context.error({ statusCode: 404, message: '页面未找到或无数据' })
        }
    },
    // 回到error错误页面
    validate({params}){
        return /^\d+$/.test(params.articleId)
    }
}
</script>

<style lang="scss" scoped>
.articleld {
    position: absolute;
    width: 100%;
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
            min-height: auto;
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
        display: none;
        &.show{
            display: block;
            visibility: visible;
            animation: fadeInTop 0.6s both;
        }
        &.exit{
            display: block;
            opacity: 0;
            animation: fadeInDown 0.6s both;
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
    
}
.verify{
    filter: blur(5px);
}
</style>