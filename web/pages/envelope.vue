<template>
    <div class="container">
        <Header :music="music" title="原本这个世界就有很多东西是没有什么意义的！"></Header>
        <section class="content">
            <div v-for="(item, index) in data" :key="index" class="item">
                <div class="text" v-html="item.contentHtml"></div>
                <div>{{item.newTime}}</div>
            </div>
        </section>
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
            music: 'https://image.raindays.cn/Myself-Resources/music/jingxin.mp3',
        }
    },
    head () {
        return {
            title: 'Envelope | 白茶'
        }
    },
    async asyncData(context){
        let {data} = await context.$axios.get('envelope')
        console.log(data)
		return {data: data}
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
        padding: 30px;
        border-radius: 6px;
        .text{
            color: #333;
            /deep/ .hljs-right{
                text-align: right;
            }
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