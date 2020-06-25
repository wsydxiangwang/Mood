<template>
    <div class="articleld">

        <!-- Article Progress -->
        <div class="scrollbar" :style="{width: postProgress}"></div>

        <Header 
            :music="data.music.url" 
            :title="data.title"
            :like="data._id"
            @liked="liked"
        ></Header>

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

            <!-- loading -->
            <!-- <Loading v-if="loading"></Loading> -->
        </section>

        <!-- Comment -->
        <Comment :id="data.id" :title="data.title" @total="totalComment"></Comment>
    </div>
</template>

<script>
import Comment from '@/components/comment'
export default {
	components: { Comment },
    data(){
        return{
            title: false,
            isLike: false,

            timer: null,
            postProgress: 0,

            scrollTop: 0,
            timerTop: null,
            scrollTopBtn: false,
            loading: true,

            commentTotal: 0,

            header: true
        }
    },
    head () {
        return {
            title: `${this.data.title} | ${this.info.web_name}`,
            meta: [
                { hid: 'description', name: 'description', content: this.data.describe }
            ]
        }
    },
    beforeRouteLeave(to,from,next){
        window.removeEventListener('scroll', this.handleScroll, true)
        next();
    },
    computed: {
		info(){
			return this.$store.state.data
        }
    },
    mounted(){
        window.addEventListener('scroll', this.handleScroll, true)
        // read +1
        this.$axios.put(`article_read/${this.data._id}`).then(res => this.data.read++)
    },
    methods: {
        liked(){
            this.data.like++
        },
        totalComment(val){
            this.commentTotal = val;
        },
        handleScroll(){
            /**
             * Article Progress
             */
            this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

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
            context.error({ statusCode: 404, message: '页面未找到或无数据' })
        }
    },
    // error page
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
    .scrollbar{
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: #50bcb6;
        transition: width .5s ease;
        z-index: 999999;
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
                ins{
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

@media screen and (max-width: 600px) {
.articleld{
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

.verify{
    filter: blur(5px);
}
</style>