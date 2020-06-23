<template>
    <div class="container">
        <Header 
            v-if="refresh" 
            :music="music" 
            title="嘿，陌生人，你今天笑了么 (≖ᴗ≖)✧"
        ></Header>
        <div v-if="data" class="about" v-html="data.contentHtml"></div>
        <div v-else>此人还没有介绍, 明天再来吧!</div>
    </div>
</template>

<script>
export default {
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
        // if(this.info.bg.bg_about){
        //     this.music = this.info.bg.bg_about
        //     this.refresh = false
        //     this.$nextTick(() => this.refresh = true )
        // }
    },
    computed: {
		info(){
			return this.$store.state.data
        }
    },
    async asyncData(context){
        const {data} = await context.$axios.get('myself')
        console.log(data)
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