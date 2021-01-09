<template>
    <div class="container">
        <Header 
            v-if="refresh" 
            :music="music" 
            title="嘿，你今天笑了么(≖ᴗ≖)✧"
        ></Header>
        <client-only>
            <mavon-editor codeStyle="monokai-sublime" v-html="data.contentHtml"/>
        </client-only>
    </div>
</template>

<script>
export default {
    name: 'about',
    data(){
        return{
            title: false,
            music: 'https://image.raindays.cn/Myself-Resources/music/qianbaidu.mp3',
            refresh: true
        }
    },
    head () {
        return {
            title: `Hello ${this.info.web_name}`
        }
    },
    mounted(){
        // 背景音乐
        if(this.info.bg.bg_about){
            this.music = this.info.bg.bg_about
            this.refresh = false
            this.$nextTick(() => this.refresh = true )
        }
    },
    computed: {
		info(){
			return this.$store.state.data
        }
    },
    async asyncData(context){
        const {data} = await context.$axios.get('myself')
        if(data.status === 1){
            return {data: data.body}
        }else{
            return {data: ''}
        }
    },
}
</script>

<style lang="scss" scoped>
.about * {
    font-size: initial;
}
.container{
    ::v-deep 
    .markdown-body{
    width: 100%;
    max-width: 800px;
    margin: auto;
    padding: 100px 20px 50px;
        box-shadow: none !important;
        min-height: auto;
        p{
            line-height: 30px;
            margin: 0 0 18px;
            font-size: 16px;
            *{
                font-size: 16px;
            }
            mark{
                padding: 0 4px;
                line-height: 22px;
                display: inline-block;
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
            margin: 0 0 18px;
            padding-left: 20px;
            li{
                font-size: 16px;
                margin: 0 0 8px;
                line-height: 28px;
                list-style: none;
                position: relative;
                &:last-child{
                    margin: 0;
                }
                &::before{
                    content: '☼';
                    font-size: 8px;
                    position: absolute;
                    top: 0px;
                    left: -16px;
                }
            }
            ul{
                margin: 8px 0;
                li{
                    margin: 0;
                    font-size: 14px;
                    color: #606060;
                }
            }
        }
        img{
            border-radius: 8px;
            transition: all .3s;
            &:hover{
                box-shadow: 0 2px 10px #a5a5a5;
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
    @media screen and (max-width: 600px) {
    ::v-deep 
        .markdown-body{
            iframe{
                height: 310px;
            }
            blockquote{
                padding-left: 16px;
            }
            ol li, ul li, p, p *{
                font-size: 14px;
                line-height: 26px;
            }
            h1{
                font-size: 24px;
            }
            ol, ul{
                padding-left: 16px;
                li, li{
                    line-height: 22px;
                    margin-bottom: 10px;
                    &:after{
                        transform: scale(0.9);
                    }
                }
            }
        }
    }
}
</style>