<template>
    <div class="container">
        <Header :music="music" :github="true" title="嘿，陌生人，你今天笑了么 (≖ᴗ≖)✧"></Header>

        <div class="about" v-html="data"></div>
        <!-- loading -->
		<!-- <Loading v-if="loading"></Loading> -->
    </div>
</template>

<script>
import Header from "../components/header";
export default {
	components: {
		Header
    },
    data(){
        return{
            title: false,
            music: 'https://image.raindays.cn/Myself-Resources/music/qianbaidu.mp3',
            loading: true
        }
    },
    head () {
        return {
            title: 'Libai | 白茶'
        }
    },
    mounted() {
        //loading
        // document.body.style.overflowY = 'hidden';
        // setTimeout(() => {
        //     this.loading = false;
        //     document.body.style.overflowY = '';
        // }, 800)

        this.$nextTick(() => {
			// 微信分享
            this.$wxShare(this, 6);
		})
    },
    async asyncData(context){
        if (!process.server) { // 防止重复加载
			return;
		}
        const {data} = await context.$axios.get('/myself')
        if(data.status === 1){
            return {data: data.body.contentHtml}
        }
    },
}
</script>

<style lang="scss" scoped>
.about * {
    font-size: initial;
}
.container{
    padding: 100px 20px;
    width: 100%;
    max-width: 800px;
    margin: auto;
    /deep/ .about{
        h1{
            font-size: 30px;
            margin-bottom: 25px;
        }
        h2{
            font-size: 30px;
            margin-bottom: 25px;
        }
        h3{
            font-size: 16px;
            margin: 20px 0;
            color: #333;
            font-weight: 400;
            letter-spacing: 0;
        }
        p{
            font-size: 14px;
            line-height: 30px;
            margin-top: 30px;
            color: #111;
        }
        ul{
            padding-left: 15px;
            li{
                color: #333;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 14px;
            }
        }
    }
	@media screen and (max-width: 480px){
        h2{
            font-size: 24px;
        }
        ul{
            padding: 0;
            li{
                list-style-type: none;
            }
        }
    }
}
</style>