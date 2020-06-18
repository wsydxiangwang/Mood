<template>
    <div class="container">
        <Header 
            v-if="refresh" 
            :music="music" 
            title="好好学习, 天天向上!"
        ></Header>

        <section class="content">
            <div v-for="(item, index) in data" :key="index" class="item">
                <div class="text" v-html="item.contentHtml"></div>
                <div class="time">{{item.time}}</div>
            </div>
            <LoadMore></LoadMore>
        </section>
    </div>
</template>

<script>
import LoadMore from '@/components/loadMore.vue'
export default {
    components: {
        LoadMore
    },
    data(){
        return{
            music: 'https://image.raindays.cn/Myself-Resources/music/jingxin.mp3',
            refresh: true,
			loadingType: 'more',
            page: 1,
        }
    },
    head () {
        return {
            title: `一封信 | ${this.info.web_name}`
        }
    },
    mounted(){
        // 背景音乐
        if(this.info.bg.bg_about){
            this.music = this.info.bg.bg_about
            this.refresh = false
            this.$nextTick(() => this.refresh = true )
        }

        if(this.data.length === 10){
            
        }
        // window.addEventListener('scroll', this.load)
    },
    destroyed(){
        // window.removeEventListener('scroll', this.load)
    },
    methods: {
        load(){
            // const data = this.$load('envelope', this.page)

            // if(data){
            //     data.then(res => {
            //         if(res.status === 1){
            //             const result = res.body;
            //             this.data = this.data.concat(result.data)
            //         }else{
                        
            //         }
            //         console.log(res)
            //     })
            // }
            // p.then(res => {
            //     console.log(res)
            // }).catch(err => {
            //     console.log(err)
            // })
        }
    },
    computed: {
		info(){
			return this.$store.state.data
		}
    },
    async asyncData(context){
        let {data} = await context.$axios.get('envelope')
        if(data.status === 1){
            console.log(data)
            return {data: data.body.data}
        }else{
            return {data: ''}
        }
    },
}
</script>

<style lang="scss" scoped>
.container{
    min-height: 100vh;
    background: #eef5ff;
}
.content{
    width: 700px;
    margin: auto;
    padding: 90px 0 50px;
    .item{
        margin-bottom: 30px;
        background: #fff;
        padding: 30px 30px 20px;
        border-radius: 6px;
        .text{
            color: #333;
            /deep/ .hljs-right{
                text-align: right;
            }
        }
        .time{
            font-size: 13px;
            text-align: right;
            margin-top: 14px;
            color: #888;
        }
    }
}
@media screen and (max-width: 700px){
    .content{
        width: 100%;
        padding: 80px 20px 20px;
    }
}
@media screen and (max-width: 500px){
    .content{
        width: 100%;
        padding: 70px 20px 10px;
        .item{
            padding: 20px;
            margin-bottom: 18px;
        }
    }
}
</style>