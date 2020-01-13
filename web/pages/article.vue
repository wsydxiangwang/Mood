<template>
    <div class="container">
        <header>
            <div>222</div>
            <div class="title" :class="{active: title}">{{data.title}}</div>
            <div>3333</div>
        </header>
        <h1 class="title">{{data.title}}</h1>
        <div class="stuff">
            <!-- <span>{{data.category}}</span>
            <span>{{data.like || 0}}</span>
            <span>{{data.comment || 0}}</span>
            <span>{{data.time}}</span>
             -->
            <span>十一月 24, 2018</span>
            <span>阅读 2941</span>
            <span>字数 2941</span>
            <span>评论 154</span>
            <span>喜欢 639</span>
            <span v-if="data.stick">置顶</span>
        </div>
        <div class="content">
            <client-only>
                <mavon-editor codeStyle="monokai-sublime" v-html="data.contentHtml"/>
            </client-only>
        </div>
        <div class="comment">
            <h2>评论列表</h2>
            <div class="comment-form">
                <input type="text" placeholder="称呼" v-model="comment.name">
                <input type="text" placeholder="邮箱" v-model="comment.email">
                <input type="text" placeholder="站点" v-model="comment.address">
                <textarea placeholder="" v-model="comment.content"></textarea>
                <button type="button" @click="commentSubmit">发表评论</button>
            </div>
            <div class="comment-list">
                <div class="comment-item">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title: false,
            comment: {}
        }
    },
    mounted(){
        window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        handleScroll(){
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop >= 100){
                this.title = true;
            }else{
                this.title = false;
            }
        },
        commentSubmit(){
            console.log(this.comment)
        }
    },
    async asyncData(context){
        let id = context.route.query.id
		let {data} = await context.$axios.get(`article/${id}`)
		return {data: data}
	},
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
    background: #fff;
    z-index: 99999;
    .title{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        transition: all .8s;
        opacity: 0;
        &.active{
            opacity: 1;
        }
    }
}
h1.title{
    font-size: 30px;
    margin: 130px 0 22px;
    color: #333;
}
.stuff{
    color: #6a737d;
    position: relative;
    span{
        font-size: 13px;
        margin: 0 2px;
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
            img{
                // height: 20px;
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
</style>