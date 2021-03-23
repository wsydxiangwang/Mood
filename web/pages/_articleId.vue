<template>
    <div class="articleld">

        <!-- Article Progress -->
        <div class="scrollbar" :style="{ width: postProgress }"></div>

        <Header 
            :music="data.music.url" 
            :title="data.title"
            :like="data._id"
            :sticky="true"
            :playMusic="true"
            :articlePage="true"
            @liked="liked"
        />

        <section v-if="data">
            <h1 class="title">{{ data.title }}</h1>
            <div class="stuff">
                <span>{{ data.time.month.cn }}月 {{ data.time.day.on }}, {{ data.time.year }}</span>
                <span>阅读 {{ data.read }}</span>
                <span>字数 {{ data.words }}</span>
                <span>评论 {{ commentTotal }}</span>
                <span>喜欢 {{ data.like }}</span>
            </div>

            <div class="content" v-html="data.contentHtml"></div>
        </section>

        <!-- Comment -->
        <Comment :id="data.id" :title="data.title" @total="totalComment"></Comment>

        <footer>
            <div class="foot-box">
                <h2>{{ data.title }}</h2>
                <ul class="options">
                    <li 
                        v-for="(item, index) in options" 
                        :key="index"
                        @click="onOptions(item.type)"
                    >
                        <span class="iconfont" :class="'icon-' + item.icon"></span>
                        <span>{{ item.type == 'comment' ? commentTotal : data[item.type] }}</span>
                    </li>
                </ul>
            </div>
        </footer>
    </div>
</template>

<script>
import Comment from '@/components/Comment'
import scrollMixin from '~/mixin/scroll.js'
export default {
    mixins: [ scrollMixin ],
	components: { Comment },
    data(){
        return{
            title: false,
            isLike: false,
            commentTotal: 0,
            contentHeight: 0,
            clientHeight: 0,
            header: true,
            options: [
                {
                    type: 'read',
                    icon: 'eye2',
                }, {
                    type: 'comment',
                    icon: 'comment',
                }, {
                    type: 'like',
                    icon: 'xihuan',
                }, {
                    type: 'skin',
                    icon: 'yueliang'
                }, {
                    type: 'top',
                    icon: 'top',
                }
            ]
        }
    },
    head () {
        return {
            title: `${this.data.title} | ${this.info.base.name}`,
            meta: [
                { hid: 'keywords', name: 'keywords', content: this.info.base.seo },
                { hid: 'description', name: 'description', content: this.data.describe }
            ]
        }
    },
    computed: {
		info() {
			return this.$store.state.data
        },
        /**
         * Article Progress
         */
        postProgress() {
            if (this.contentHeight < this.clientHeight) {
                return '100%'
            }
            if (!this.curScroll) {
                return
            }
            const h = this.contentHeight - this.clientHeight + 100
            const n = (100 * (this.curScroll / h)).toFixed(4)
            return n < 100 ? n + '%' : '100%'
        }
    },
    mounted() {
        setTimeout(() => {
            this.clientHeight = this.getWin('clientHeight')
            this.contentHeight = this.getHeight()
        })
    },
    methods: {
        onOptions(type){
            if (type === 'read') {
                return
            }
            const o = {
                'comment': () => {
                    const oCommentTop = document.getElementById('href-comment')
                    if (oCommentTop) {
                        oCommentTop.click()
                        return
                    }
                    const a = document.createElement('a')
                    a.setAttribute('href', '#comment')
                    a.setAttribute('id', 'href-comment')
                    document.body.appendChild(a)
                    a.click()
                },
                'top': () => {
                    this.$setScroll('top', 500)
                },
                'skin': () => {
                    this.$skin()
                },
                'like': () => {
                    console.log(2)
                }
            }
            o[type]()
        },
        getHeight() {
            const domList = ['.content', '.stuff', '.title']
            const height = domList.reduce((t, i) => {
                t += document.querySelector(i).offsetHeight
                return t
            }, 0)
            return height
        },
        liked() {
            this.data.like++
        },
        totalComment(val) {
            this.commentTotal = val
        },
        myself(){
            this.$router.push('/Libai')
        },
        toIndex(){
            this.$router.push('/')
        },
    },
    async asyncData(context){
        const id = context.params.articleId
        const { data } = await context.$axios.get(`article/${id}`)        
        if (data.status == 1) {
            return { data: data.body }
        } else {
            context.error({ statusCode: 404, message: '页面未找到～' })
        }
    },
    // error page
    validate({params}){
        return /^\d+$/.test(params.articleId)
    }
}
</script>

<style lang="scss" scoped>
@keyframes width1 {
    0%{ width: 60%; }
    60%{ width: 80%; }
    100%{ width: 60%; }
}
@keyframes width2 {
    0%{ width: 40%; }
    60%{ width: 80%; }
    100%{ width: 40%; }
}
@keyframes width3 {
    0%{ width: 50%; }
    60%{ width: 70%; }
    100%{ width: 50%; }
}
.skeleton{
    width: 800px;
    margin: 130px auto 100px;
    h2{
        background: #e4e4e4;
        height: 40px;
        width: 208px;
        border-radius: 0px;
    }
    h3{
        margin-top: 14px;
        display: flex;
        p{
            width: 50px;
            height: 15px;
            margin-right: 12px;
            background: #e4e4e4;
        }
    }
    div{
        margin-top: 40px;
        p{
            height: 20px;
            background: #e7e7e7;
            margin-top: 20px;
        }
        &:first-of-type{
            p:nth-of-type(1){
                animation: width1 1.3s linear infinite;
            }
            p:nth-of-type(2){
                animation: width2 1.4s linear infinite;
            }
            p:nth-of-type(3){
                animation: width3 1.2s linear infinite;
            }
        }
        &:last-of-type{
            p:nth-of-type(1){
                animation: width1 1.3s linear infinite;
            }
            p:nth-of-type(2){
                animation: width2 1.4s linear infinite;
            }
            p:nth-of-type(3){
                animation: width3 1.2s linear infinite;
            }
        }
    }
}
.articleld {
    position: absolute;
    width: 100%;
    section{
        width: 800px;
        margin: auto;
        transition: none;
    }
    .scrollbar{
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--color-bar);
        transition: width .5s ease;
        z-index: 999999;
    }
    h1.title{
        font-size: 30px;
        padding: 130px 0 22px;
        color: var(--color-text-1);
    }
    .stuff{
        color: var(--color-text-2);
        position: relative;
        line-height: 22px;
        span{
            font-size: 13px;
            margin-right: 10px;
            display: inline-block;
        }
        &:after{
            content: '';
            width: 100px;
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            border-bottom: 1px solid var(--color-border-1);
        }
    }
    .content{
        padding: 100px 0;
        font-size: 14px;
        ::v-deep {
            // box-shadow: none !important;
            // min-height: auto;
            // background: var(--color-bg-primary);
            // color: var(--color-text-primary);
        color: var(--color-text-primary);
            p{
                line-height: 36px;
                margin: 0 0 22px;
                font-size: 16px;
                mark{
                    padding: 4px 4px 0;
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
                background: var(--color-bg-primary);
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
        color: var(--color-bg-primary);
    }
    footer{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: 0 0 45px 0 rgb(16 16 16 / 10%);
        .foot-box{
            width: 800px;
            height: 70px;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        h2{
            font-size: 16px;
            color: var(--color-text-2);
        }
        .options{
            display: flex;
            li{
                position: relative;
                list-style: none;
                margin-left: 6px;
                min-width: 32px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
                & *{
                    transition: none;
                }
                span:last-child{
                    font-size: 12px;
                    color: #333;
                    transform: translate(-4px, -14px);
                    display: inline-block;
                }
                .iconfont{
                    color: #333;
                    font-size: 20px;
                    &.icon-top{
                        font-size: 28px;
                        color: #666;
                    }
                }
                &:hover span{
                    font-weight: 600;
                    color: var(--color-active)
                }
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
            ::v-deep {
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
        ::v-deep header{
            // &.isUp{
            //     position: fixed;
            //     box-shadow: 0 1px 8px #f0f9ff;
            //     background: rgba(255, 255, 255, 0.9);
            //     animation: headShow 0.6s both;
            // }
            .myself{
                display: none;
            }
        }
        .content{
            ::v-deep {
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
            ::v-deep {
                iframe{
                    height: 260px;
                }
            }
        }
    }
}
@media screen and (max-width: 414px) {
    .content{
        ::v-deep {
            iframe{
                height: 220px;
            }
        }
    }
}


</style>